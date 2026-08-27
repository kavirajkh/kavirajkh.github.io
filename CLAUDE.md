# CLAUDE.md

## Running the dev server

**Always run `npm run dev` from a real Terminal.app window — never through Claude Code's Bash tool or its `!` passthrough.**

Claude Code's sandbox blocks any process it launches from binding a listening TCP port (`EPERM: operation not permitted` on `listen`), and its localhost proxy returns `502` for any port that isn't actually listening. This affects even a zero-dependency Node `http.createServer()`, so it's an environment restriction, not a project bug — no code change or dependency downgrade fixes it.

Steps:
1. Open Terminal.app directly (Cmd+Space → "Terminal").
2. `cd` to this project directory.
3. Run `npm run dev`.
4. Open the printed URL (typically `http://localhost:4321/`).

Ask Claude to review/edit code as usual — just start/stop the dev server yourself in your own terminal.

## Commands

- `npm run dev` — start local dev server
- `npm run build` — production build
- `npm run preview` — preview the production build locally
- `npm run format` — format with Prettier

## Dev server manager script

`scripts/astro-manager.sh` wraps the dev server with process cleanup and a pinned toolchain (see `.nvmrc` / `STABLE_NODE_VERSION` in the script). It installs `nvm` if missing and always switches to the exact pinned Node version before running any command, rebuilding native deps (esbuild, sharp) automatically if the active Node version changed since the last install — this avoids the ABI-mismatch hangs that occur when `astro dev` runs under a newer/different Node than it was installed with.

- `./scripts/astro-manager.sh start` — stop any existing/stray instance, ensure pinned Node, start fresh, wait for an actual HTTP response before reporting success
- `./scripts/astro-manager.sh stop` — stop the dev server
- `./scripts/astro-manager.sh clean` — kill strays, wipe `node_modules`/`.astro`/`dist`, clear npm cache, reinstall, start
- `./scripts/astro-manager.sh install` — full clean reinstall pinned to `STABLE_NODE_VERSION` and `ASTRO_VERSION`
- `./scripts/astro-manager.sh version` — print active vs. pinned versions

Like `npm run dev`, this must be run from a real Terminal.app window, not through Claude Code.
