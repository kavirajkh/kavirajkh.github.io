#!/usr/bin/env bash

# ==========================================
# Astro Dev Server Manager
# Usage (run from a real terminal, NOT through Claude Code):
#   ./scripts/astro-manager.sh            -> interactive menu
#   ./scripts/astro-manager.sh start      -> start server (auto-stops existing instance first)
#   ./scripts/astro-manager.sh stop       -> stop server
#   ./scripts/astro-manager.sh clean      -> kill stray processes, wipe node_modules/.astro/dist,
#                                             clear npm cache, reinstall, then start fresh
#   ./scripts/astro-manager.sh install    -> clean reinstall pinned to a stable Node/Astro version
#   ./scripts/astro-manager.sh version    -> print version info
# ==========================================

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PORT=4321
PID_FILE="$PROJECT_DIR/.astro-dev.pid"
LOG_FILE="$PROJECT_DIR/.astro-dev.log"

STABLE_NODE_VERSION="22.12.0"   # matches astro's engines requirement >=22.12.0, Node's Active LTS line
NVM_INSTALL_VERSION="0.40.1"    # pinned nvm release used to bootstrap Node version management
TLS_VERSION="1.2"               # forces this exact TLS version for node/npm network calls
ASTRO_VERSION="6.4.8"           # hardcoded stable Astro version, update manually when needed
NODE_VERSION_STAMP="$PROJECT_DIR/node_modules/.astro-manager-node-version"

cd "$PROJECT_DIR" || { echo "Project directory not found: $PROJECT_DIR"; exit 1; }

# Force a specific TLS version for all node/npm operations run through this script
export NODE_OPTIONS="--tls-min-v${TLS_VERSION} --tls-max-v${TLS_VERSION}"

# Installs nvm (pinned release) if it isn't present yet, then loads it into
# this shell. Requires network access and a confirm, since it writes to $HOME.
install_nvm() {
  echo "nvm not found. This project pins an exact Node version (v${STABLE_NODE_VERSION})"
  echo "to avoid ABI drift between Node and native deps (esbuild, sharp)."
  read -p "Install nvm v${NVM_INSTALL_VERSION} to $HOME/.nvm now? (y/n): " CONFIRM
  if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
    return 1
  fi

  curl -o- "https://raw.githubusercontent.com/nvm-sh/nvm/v${NVM_INSTALL_VERSION}/install.sh" | bash
  if [ ! -s "$HOME/.nvm/nvm.sh" ]; then
    echo "ERROR: nvm install did not produce $HOME/.nvm/nvm.sh."
    return 1
  fi
  return 0
}

# Makes sure the exact pinned Node version is active for the rest of this
# script's run. Every subcommand calls this — not just 'install' — so `start`
# can never silently run on whatever Node happens to be the system default.
# A version mismatch is exactly what caused native deps (esbuild/sharp) to be
# built for one Node ABI and then loaded by another, hanging `astro dev`
# with no error output.
ensure_pinned_node() {
  if [ ! -s "$HOME/.nvm/nvm.sh" ]; then
    install_nvm || {
      echo "ERROR: nvm is required to pin Node v${STABLE_NODE_VERSION}. Aborting."
      return 1
    }
  fi

  export NVM_DIR="$HOME/.nvm"
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh"

  if [ ! -d "$NVM_DIR/versions/node/v${STABLE_NODE_VERSION}" ]; then
    echo "Installing pinned Node v${STABLE_NODE_VERSION} via nvm..."
    nvm install "$STABLE_NODE_VERSION" || { echo "ERROR: failed to install Node v${STABLE_NODE_VERSION}."; return 1; }
  fi
  nvm use "$STABLE_NODE_VERSION" >/dev/null

  local active_version
  active_version="$(node -v)"
  if [ "$active_version" != "v${STABLE_NODE_VERSION}" ]; then
    echo "ERROR: expected Node v${STABLE_NODE_VERSION}, got $active_version."
    return 1
  fi
}

# If node_modules was installed under a different Node version than the one
# now active, native modules (esbuild, sharp) are ABI-mismatched and must be
# rebuilt — otherwise astro dev can hang or crash with no useful error.
rebuild_native_deps_if_needed() {
  local current_version
  current_version="$(node -v)"

  if [ -f "$NODE_VERSION_STAMP" ] && [ "$(cat "$NODE_VERSION_STAMP")" = "$current_version" ]; then
    return 0
  fi

  if [ -d node_modules ]; then
    echo "Node version changed (or unknown) since last install. Rebuilding native deps..."
    npm rebuild || { echo "ERROR: npm rebuild failed."; return 1; }
  fi
  echo "$current_version" > "$NODE_VERSION_STAMP"
}

# Claude Code's sandbox blocks any process it launches from binding a listening
# TCP port, so `astro dev` will start, stay alive, and never actually serve
# anything — the browser just shows a blank page. Refuse to start under it.
check_not_sandboxed() {
  if [ -n "${CLAUDECODE:-}" ]; then
    echo "ERROR: Detected a Claude Code shell (CLAUDECODE is set)."
    echo "Claude Code's sandbox cannot bind listening TCP ports, so the dev"
    echo "server would start but never actually serve http://localhost:$PORT."
    echo "Open Terminal.app directly and run this script from there instead."
    return 1
  fi
  return 0
}

print_versions() {
  echo ""
  echo "===== Version Info ====="
  local active_node
  active_node="$(node -v 2>/dev/null || echo 'not found')"
  echo "Node:      $active_node (pinned target: v${STABLE_NODE_VERSION})"
  if [ "$active_node" != "v${STABLE_NODE_VERSION}" ]; then
    echo "           WARNING: active Node does not match pinned version."
  fi
  echo "npm:       $(npm -v 2>/dev/null || echo 'not found')"
  echo "TLS pinned: v${TLS_VERSION} (via NODE_OPTIONS)"
  echo "Astro (pinned target): v${ASTRO_VERSION}"

  if [ -d node_modules ]; then
    ASTRO_VER=$(npx astro --version 2>/dev/null)
    echo "Astro (installed):     ${ASTRO_VER:-not installed}"

    DEP_TREE=$(npm ls astro vite esbuild 2>/dev/null | grep -E "astro@|vite@|esbuild@")
    if [ -n "$DEP_TREE" ]; then
      echo "Dependency tree:"
      echo "$DEP_TREE" | sed 's/^/  /'
    fi
  else
    echo "Astro (installed):     node_modules not found, run 'install' first"
  fi
  echo "========================="
  echo ""
}

# Waits up to $2 seconds for PID $1 to die. Returns 0 if dead, 1 if still alive.
wait_for_death() {
  local pid=$1
  local timeout=$2
  local waited=0
  while kill -0 "$pid" 2>/dev/null; do
    sleep 0.5
    waited=$((waited + 1))
    if [ "$waited" -ge "$((timeout * 2))" ]; then
      return 1
    fi
  done
  return 0
}

# Terminates any known/orphaned instance gracefully, then forcefully if needed.
# Catches three cases: (1) the PID we tracked in .astro-dev.pid, (2) anything
# actually listening on $PORT, and (3) any "astro dev" process by command line
# even if it never bound the port (e.g. started inside a sandboxed shell).
# Returns 0 if nothing was running, 1 if something was running and got stopped.
terminate_existing() {
  local FOUND=0

  if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if [ -n "$PID" ] && kill -0 "$PID" 2>/dev/null; then
      FOUND=1
      echo "Found tracked instance (PID $PID). Sending SIGTERM..."
      kill "$PID" 2>/dev/null
      if wait_for_death "$PID" 5; then
        echo "Process $PID terminated gracefully."
      else
        echo "Process $PID did not exit in time. Sending SIGKILL..."
        kill -9 "$PID" 2>/dev/null
        wait_for_death "$PID" 3
        echo "Process $PID force-killed."
      fi
    fi
    rm -f "$PID_FILE"
  fi

  PORT_PIDS=$(lsof -ti tcp:$PORT 2>/dev/null)
  if [ -n "$PORT_PIDS" ]; then
    FOUND=1
    for P in $PORT_PIDS; do
      echo "Found orphaned process on port $PORT (PID $P). Sending SIGTERM..."
      kill "$P" 2>/dev/null
      if wait_for_death "$P" 5; then
        echo "Process $P terminated gracefully."
      else
        echo "Process $P did not exit in time. Sending SIGKILL..."
        kill -9 "$P" 2>/dev/null
        wait_for_death "$P" 3
        echo "Process $P force-killed."
      fi
    done
  fi

  # Catch-all: any "astro dev" process that survived the checks above (e.g. it
  # never managed to bind the port at all, so lsof never saw it).
  STRAY_PIDS=$(pgrep -f "astro dev" 2>/dev/null)
  if [ -n "$STRAY_PIDS" ]; then
    FOUND=1
    for P in $STRAY_PIDS; do
      echo "Found stray 'astro dev' process (PID $P). Sending SIGTERM..."
      kill "$P" 2>/dev/null
      if wait_for_death "$P" 5; then
        echo "Process $P terminated gracefully."
      else
        echo "Process $P did not exit in time. Sending SIGKILL..."
        kill -9 "$P" 2>/dev/null
        wait_for_death "$P" 3
        echo "Process $P force-killed."
      fi
    done
  fi

  sleep 0.5
  if [ -n "$(lsof -ti tcp:$PORT 2>/dev/null)" ]; then
    echo "WARNING: Port $PORT still appears occupied after termination attempts."
    return 2
  fi

  return $FOUND
}

# Polls the port/HTTP endpoint for up to $1 seconds. Returns 0 once the server
# actually answers requests, 1 on timeout. A live PID is not enough: under a
# sandboxed shell the process stays alive but never binds the port.
wait_for_server_ready() {
  local timeout=$1
  local waited=0
  while [ "$waited" -lt "$timeout" ]; do
    if curl -s -o /dev/null --max-time 1 "http://localhost:$PORT"; then
      return 0
    fi
    sleep 1
    waited=$((waited + 1))
  done
  return 1
}

start_server() {
  check_not_sandboxed || return 1
  ensure_pinned_node || return 1
  rebuild_native_deps_if_needed || return 1

  print_versions

  echo "Checking for existing instances before starting..."
  terminate_existing
  TERM_STATUS=$?

  if [ "$TERM_STATUS" -eq 2 ]; then
    echo "Aborting start: unable to free port $PORT."
    return 1
  elif [ "$TERM_STATUS" -eq 1 ]; then
    echo "Previous instance terminated successfully. Proceeding with fresh start."
  else
    echo "No existing instance found."
  fi

  echo "Starting Astro dev server (TLS v${TLS_VERSION})..."
  nohup npm run dev > "$LOG_FILE" 2>&1 &
  echo $! > "$PID_FILE"

  local pid
  pid=$(cat "$PID_FILE")

  if ! kill -0 "$pid" 2>/dev/null; then
    echo "Server process exited immediately. Check logs: $LOG_FILE"
    rm -f "$PID_FILE"
    return 1
  fi

  echo "Waiting for http://localhost:$PORT to respond..."
  if wait_for_server_ready 20; then
    echo "Started. PID: $pid"
    echo "Serving: http://localhost:$PORT"
    echo "Logs: $LOG_FILE"
    echo "Tail logs with: tail -f $LOG_FILE"
  elif kill -0 "$pid" 2>/dev/null; then
    echo "Process $pid is running but http://localhost:$PORT never responded."
    echo "Check logs: $LOG_FILE"
    return 1
  else
    echo "Server process died before it started responding. Check logs: $LOG_FILE"
    rm -f "$PID_FILE"
    return 1
  fi
}

stop_server() {
  terminate_existing
  STATUS=$?
  if [ "$STATUS" -eq 1 ]; then
    echo "Astro dev server stopped."
  elif [ "$STATUS" -eq 0 ]; then
    echo "No running Astro dev server found."
  fi
}

# Mirrors the manual recovery sequence: kill stray processes, wipe generated
# artifacts and the npm cache, reinstall, then start fresh.
clean_start() {
  check_not_sandboxed || return 1
  ensure_pinned_node || return 1

  echo "==> This will stop the dev server, remove node_modules, .astro, dist,"
  echo "==> clear the npm cache, reinstall dependencies, then start fresh."
  read -p "Continue? (y/n): " CONFIRM
  if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
    echo "Aborted."
    return
  fi

  terminate_existing

  echo "Removing node_modules, .astro, dist..."
  rm -rf node_modules .astro dist

  echo "Clearing npm cache..."
  npm cache clean --force

  echo "Reinstalling dependencies..."
  if ! npm install; then
    echo "npm install failed. Aborting."
    return 1
  fi
  node -v > "$NODE_VERSION_STAMP"

  start_server
}

install_stable() {
  echo "==> This will remove node_modules, .astro, dist, package-lock.json"
  echo "==> Then switch to Node v${STABLE_NODE_VERSION}, pin Astro to v${ASTRO_VERSION}, and reinstall (TLS pinned to v${TLS_VERSION})"
  read -p "Continue? (y/n): " CONFIRM
  if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
    echo "Aborted."
    return
  fi

  terminate_existing

  echo "Before:"
  print_versions

  echo "Removing old dependencies and build artifacts..."
  rm -rf node_modules .astro dist package-lock.json

  ensure_pinned_node || return 1
  nvm alias default "$STABLE_NODE_VERSION"

  echo "Clearing npm cache..."
  npm cache clean --force

  echo "Installing dependencies (TLS v${TLS_VERSION})..."
  npm install || { echo "npm install failed. Aborting."; return 1; }

  echo "Pinning astro to exact version v${ASTRO_VERSION}..."
  npm install --save-exact astro@${ASTRO_VERSION} || { echo "Pinning astro failed. Aborting."; return 1; }

  node -v > "$NODE_VERSION_STAMP"

  echo ""
  echo "After:"
  print_versions
  echo "Install complete."
}

handle_choice() {
  case "$1" in
    start|1) start_server ;;
    stop|2) stop_server ;;
    clean|3) clean_start ;;
    install|4) install_stable ;;
    version|5) print_versions ;;
    exit|6|quit|q) echo "Bye."; exit 0 ;;
    *) echo "Unknown option: $1" ;;
  esac
}

show_menu() {
  echo ""
  echo "===== Astro Dev Server Manager ====="
  echo "1) start   - Stop any existing instance, then start fresh"
  echo "2) stop    - Stop the dev server"
  echo "3) clean   - Kill strays, wipe node_modules/.astro/dist, reinstall, start"
  echo "4) install - Clean reinstall (Node v${STABLE_NODE_VERSION}, Astro v${ASTRO_VERSION}, TLS v${TLS_VERSION})"
  echo "5) version - Print version info"
  echo "6) exit"
  echo "====================================="
  read -p "Choose an option [start/stop/clean/install/version/exit]: " CHOICE
  handle_choice "$CHOICE"
}

if [ -n "${1:-}" ]; then
  handle_choice "$1"
else
  show_menu
fi
