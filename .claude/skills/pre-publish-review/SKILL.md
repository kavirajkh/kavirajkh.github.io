---
name: pre-publish-review
description: Read-only compliance and code-quality audit of uncommitted changes in this repo (kavirajkh.github.io) before they go live on the public GitHub Pages site. Checks the diff against Apple/client confidentiality obligations (codenames, internal scale, architecture specificity) and general code quality, cross-referenced against the saved confidentiality naming map in memory. Use before committing/pushing any change to this repo, or whenever asked to "review before pushing" / "audit before publishing."
---

# Pre-publish review (kavirajkh.github.io)

This repo publishes to a public, indexed GitHub Pages site built from a real Apple contractor's resume/portfolio content. Every diff carries two risks that don't exist in a normal repo: leaking Apple/client-confidential material, and publishing sloppy content to something recruiters will read. This skill runs that check before anything gets committed.

## Non-negotiable: read-only until approved

This is an audit pass, not an editing pass. Do not create, edit, delete, move, or rename any file, and do not run any repo-state-changing command (`git add`/`commit`/`push`, no "helpful" auto-fixes) during the review itself — only read diffs and report findings. Even an obvious one-line fix goes into the findings table as a *proposed* fix, not applied. Apply nothing until the user gives explicit, per-item (or "all") approval, exactly as `code-review`/`security-review` skills operate.

## Scope: the diff, not the codebase

Don't re-scan the whole repo. Focus on staged + unstaged changes and untracked new files:

```
git status --porcelain -uall
git diff                    # unstaged
git diff --staged           # staged
```

Read each changed/new file in full where the diff alone lacks context (e.g. to see what a new component actually renders, or what surrounding text an edited line sits in) — but the *targets* of review are the changed lines, not the whole file tree.

## Pull the confidentiality naming map from memory first

Before reading the diff, read the project memory file(s) covering this repo (`portfolio_project.md` and `private-notes-location.md` in the auto-memory store) for:
- The current codename → public-safe-name mapping (Apple internal project names that must never appear verbatim).
- Previously-resolved conventions this project has already settled on (quantitative-rounding rules, vendor-naming rules, tense/punctuation style, anything logged as "How to apply" in a prior round).

Treat memory as ground truth for what's already been decided — don't re-litigate a settled convention, but do check it's still being applied *consistently* in the new diff.

## What to check, line by line

**Compliance & IP categories** (check these first — they carry more consequence than style):
- **A — Verbatim risk**: phrasing/code/SQL/config/logs/error messages recognizable as copied from an internal source.
- **B — Identifiability risk**: any codename, or tool/system/API/team name not yet in the approved map. Treat an unverified, internal-sounding framework or API name exactly like a new codename — flag it even if it "sounds public," don't assume it's safe. A name being technically accurate is not the same as it being confirmed safe to publish.
- **C — Quantitative risk**: numbers that could reveal internal scale (QPS, latency, revenue, users, dataset size). A specific number is fine if it describes a **test/POC scenario** ("tested at 5M/10M/50M documents"); it becomes a disclosure when phrased as **current/production state** ("current data volume is under 5M"). Check which framing is used, not just whether a number appears.
- **D — Architecture specificity risk**: detail precise enough to reconstruct a proprietary system design, security control, or process — including detail that's *more specific* than the same project's own already-published wording elsewhere on the site (a new addition should never regress an already-sanitized project entry back toward specificity).
- **E — Visual/asset risk**: links, image names, or assets containing internal UI, logos, or internal tool chrome.
- **F — Narrative risk**: implies knowledge of unreleased products, roadmap, org structure, or personnel.
- **G — Stale/leftover risk**: dead code, commented-out blocks, TODOs, draft notes, or unfinished/placeholder content not meant to be public.

**Code quality categories:**
- **H — Formatting & style**: indentation, naming conventions, and — for this repo specifically — consistency with established site conventions already logged in memory (e.g. bullet tense, punctuation style such as em dashes vs. commas). A new bullet/line that breaks an otherwise-uniform pattern across the *rest of the same list/file* is a real finding, not nitpicking.
- **I — Coding standards**: SOLID/DRY violations, missing error handling, weak type safety.
- **J — Performance & security**: inefficient loops, unoptimized queries, injection risks, hardcoded credentials.

## Protected files: Google Search Console verification

The site is verified in Google Search Console by two methods that must survive every change. Google re-checks them periodically, and removing either one can undo verification. On every review, confirm both are still present and unmodified, and flag any diff that touches them as **High** risk:

- `<meta name="google-site-verification" content="hoCjqoLoxfTlX4JnqPZxUjAoxs7CcWb3g_se7G_ITVI" />` inside the `<head>` of `src/layouts/BaseLayout.astro` (check with `grep -n google-site-verification src/layouts/BaseLayout.astro`)
- `public/google894b602c448ceca7.html`, whose entire content must be `google-site-verification: google894b602c448ceca7.html` (so it is served at the site root)

Never propose or apply a fix that deletes, renames, reformats, or moves these. If a layout refactor changes where the `<head>` lives, the meta tag must move with it, and the built `dist/index.html` must still contain it before the verdict can be Yes.

## Extra checks for styling and theme diffs

- **Contrast (category I):** for any change to color tokens, check text-on-background pairs, especially `--color-accent-contrast` against `--color-accent` in every theme (light, dark, dark no-JS fallback, matrix). Body text needs 4.5:1 (AA).
- **Token hygiene (category G):** flag newly added CSS variables that nothing references.
- **Theme parity (category H):** a token added to light must also exist in the explicit dark block, the `prefers-color-scheme` fallback block, and the matrix theme where relevant.
- **Browser prefixes (category J):** `backdrop-filter` needs `-webkit-backdrop-filter` for older Safari.

## Output format

1. **Diff inventory** — files reviewed.
2. **Overall assessment** — Risk Level (Low/Medium/High), Code Quality Level (Poor/Acceptable/Excellent).
3. **Findings table** grouped by file: `File | Line | Category (A-J) | Excerpt | Why it's an issue | Suggested fix`.
4. **Confidentiality map gaps** — any term used that isn't yet in the saved naming map, listed for approval (don't silently add it to the map yourself).
5. **Verdict** — Safe to Commit? Yes / No / Yes-with-edits (exact ordered list of edits needed to reach Yes).

Prioritize compliance findings over code-quality findings. If something is High risk or genuinely unclear whether a name/detail is public, say so plainly and recommend routing it through Apple's actual confidentiality/open-source-review process rather than guessing.

When in doubt, flag rather than assume it is fine.

End the review by explicitly asking: "Which of these should I fix? Confirm per item or say 'all' so I can apply the approved changes."

## After approval: apply only what was approved

Apply fixes exactly as approved — use the user's own wording when they supply it verbatim (don't rephrase a fix they've already dictated). If a fix requires judgment (e.g. "remove the em dashes" across several lines), make the edits consistent with the surrounding style rather than mechanically.

## Update memory when a new naming/convention decision gets made

If the review surfaces a **new** term that needed a public-safe replacement, a **new** instance of the "tested-at vs. current-scale" distinction, or any other decision that will recur in future diffs, save it to the `portfolio_project.md` project memory (with a `Why:`/`How to apply:` line) — not just fixed in code. The naming map and conventions logged there are what let a future review reuse this decision instead of re-flagging the same thing as an open question.
