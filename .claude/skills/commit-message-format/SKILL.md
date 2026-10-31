---
name: commit-message-format
description: The required git commit message format for this repo (kavirajkh.github.io) - a Title/Motivation/Modifications structure. Use whenever drafting or writing a commit message for this repo, whether the user explicitly asks for one or a commit is being made proactively as part of another task. Do not use a generic one-line commit summary for this repo without going through this skill first.
---

# Commit message format (kavirajkh.github.io)

Every commit to this repo uses exactly three parts, in this order:

```
<Title line>

Motivation:
<why this change is needed and what problem it solves>

Modifications:
- <concise bullet>
- <concise bullet>
```

## Title line

A single-line summary, imperative mood ("Rewrite hero copy", not "Rewrote" or "Rewriting"), aim for ~50 characters and treat 72 as a hard ceiling, no trailing period. This is what shows up in `git log --oneline` and PR/commit list views, so it has to stand on its own without the body:
- Name the overall theme of the change, not just the first bullet from Modifications
- Skip filler like "Update files" or "Fix stuff" - be as specific as the length allows
- If the change touches multiple unrelated areas, name the throughline (e.g. what problem they all solve), not a comma-separated file list
- Bias toward shorter and punchier over a longer, fully-descriptive title - the body covers detail, the title just needs to be recognizable at a glance. Example: for a pass that rewrote hero copy, added an About-page story, and restructured a couple of experience bullets, prefer `Humanize hero, About, and experience copy` over a longer `Make hero and About copy as specific and human as the project pages`.

## Motivation section

Write it so a reviewer can understand the change entirely from the commit message itself - they should never need to open an issue tracker, a prior conversation, or any other link to follow along. Cover:
- What was wrong, missing, or out of date before this change (be specific - "the hero copy read generically" not "improved copy")
- Why it mattered (what a reader/reviewer/hiring manager would have experienced as a result)
- Any constraint that shaped the fix (e.g. "using only facts already published elsewhere on the site - no new claims were added"), when relevant

Keep it to a tight paragraph (3-5 sentences). This is prose, not bullets - bullets belong in Modifications.

## Modifications section

A flat bulleted list of what actually changed, one bullet per logical change (not one bullet per file). Each bullet should be concrete enough that someone skimming just this list knows what happened without reading the diff:
- Name the file/area affected when it's not obvious from context
- State the actual change ("split X bullet into two", "replaced Y with Z"), not a vague verb ("improved", "updated")
- Group tightly-related edits into one bullet rather than listing every touched line separately

## When to use this

- **Whenever the user asks for a commit message** for this repo, in any phrasing ("give me a commit message", "write the commit summary", "draft a commit").
- **Whenever you (Claude) are about to run `git commit` yourself** in this repo as part of a task - use this format for the commit, don't fall back to a generic one-liner. (Per standing repo/session rules, still only commit when the user has actually asked for a commit or explicitly authorized committing as part of the task - this skill governs the *format*, not whether a commit should happen.)
- This format applies to every commit in this repo going forward, not just content/copy changes - code, config, and dependency changes use the same two-section structure.

## Style notes specific to this repo

- No em dashes (—) anywhere in the commit message, matching the site's own content convention - use commas, colons, or parentheses instead.
- Keep line length reasonable for `git log` readability (wrap prose around ~90 chars; bullets can run a little longer if needed).
