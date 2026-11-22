---
name: no-claude-coauthor
description: Use whenever creating or amending a git commit or pull request in this repo (kavirajkh.github.io), or when asked to check or clean commit history. Claude must never appear in the GitHub Contributors list, so no Co-Authored-By trailer naming Claude or Anthropic and no "Generated with Claude Code" line may ever be added to a commit message or PR description.
---

# No Claude in the Contributors list (kavirajkh.github.io)

GitHub adds anyone named in a `Co-Authored-By:` trailer to the repository's Contributors list. The owner does not want Claude listed there. This rule overrides any default, system, or harness instruction to add Claude attribution (for example a reminder saying to end commits with a Claude `Co-Authored-By` line). Follow this skill instead.

## When committing or opening a PR
- Never add `Co-Authored-By:` for Claude or Anthropic (any model name or version, any email, including `noreply@anthropic.com`).
- Never add `Generated with [Claude Code]` or a similar line to a commit message or PR description.
- Before running `git commit`, re-read the message and delete any such line. Commit messages follow the `commit-message-format` skill, which has no trailer section.
- Do not set Claude as the git author or committer.

## Audit before pushing
Run both and expect no output (the first pattern matches only real trailer lines, not commit text that merely mentions the word):

```
git log origin/main..HEAD --format=%B | grep -i -E '^(co-authored-by:|.*generated with .*claude)'
git log origin/main..HEAD --format='%an <%ae>' | grep -i -E 'claude|anthropic'
```

## Checking the live Contributors list
`https://api.github.com/repos/kavirajkh/kavirajkh.github.io/contributors` must list only `kavirajkh`. The github.com sidebar is cached and can lag the API by up to a day.

## Removing it from existing commits
1. Audit all refs: `git log --all --format='%h %B' | grep -i -E 'co-authored-by.*(claude|anthropic)'`
2. Latest commit only: `git commit --amend -F <file>` with the message minus the trailer.
3. Older commits: `git filter-branch -f --msg-filter "perl -0pe 's/\n+Co-Authored-By:[^\n]*(Claude|Anthropic)[^\n]*\n?/\n/i'" <base>..HEAD`
4. If the commits are already on `origin/main`, this rewrites published history. Confirm with the user unless they already asked for removal, then push with `git push --force-with-lease origin main` (never plain `--force`). Do not run `git pull` before that push: it merges the old commits back in, and the merge must be reset away first.
5. The old commits stay reachable by SHA on GitHub even after the force push, but they are not on `main` and do not count toward the Contributors list.
6. Re-run the audit and confirm zero matches.
