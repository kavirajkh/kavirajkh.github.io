---
name: add-research-doc
description: Publish a research write-up (POC, benchmark, comparison, how-to guide) on the kavirajkh.github.io portfolio under /research/. Use whenever the user wants to add, update or restructure a research document, for example the PGroonga vs OpenSearch performance test, the RAG document-tampering pipeline, or the Splunk MCP guide, or hands over an HTML/Markdown doc, notes or results to publish. Also use when the user asks how to prepare a context file for a new research doc.
---

# Add a research doc (kavirajkh.github.io)

Research write-ups live at `/research/` (hub) and `/research/<slug>/` (one page each). They use the site chrome (header, theme toggle, footer, design tokens), so they match every other page and follow the light/dark toggle. The user keeps adding documents over time, so everything is data driven: one HTML body file plus one registry entry per doc. Never hand-write a new Astro page for a doc.

## How it is wired

| Piece | Path | Purpose |
|---|---|---|
| Registry | `src/data/research.ts` | One `ResearchDoc` entry per doc: slug, title, summary, lead, kind, tags, updated date, optional repo link. Newest first. |
| Body | `src/data/research/<slug>.html` | The article as an HTML fragment of `<section class="step">` blocks. No `<html>`, `<head>`, `<h1>`, hero, nav, footer or scripts. |
| Hub page | `src/pages/research/index.astro` | Cards from the registry. Do not edit per doc. |
| Doc page | `src/pages/research/[slug].astro` | Hero, generated contents sidebar, copy buttons, all body styles (`.rdoc ...`), scroll highlighting. Edit only to change the shared design. |
| Header nav | `src/components/SiteHeader.astro` | Already has the "Research" link. |

The contents sidebar is generated from the sections, so adding a section updates it. `slug` must equal the body file name.

## Workflow

1. **Get the context.** If the user has not supplied enough, give them `context-template.md` (in this skill folder) to fill in, or ask the questions in it. Never invent numbers, versions, hardware or conclusions. If a result is missing, write "not measured" or leave the section out, and tell the user.
2. **Confidentiality gate (mandatory).** The site is public and indexed, and the author is a contractor for Apple and other clients. Before writing, scan the source for: client or employer names beyond what `src/data/experience.ts` already publishes, internal project, module, service and host names, real URLs, IPs, tokens, ticket ids, customer data, real log lines or document samples, internal scale numbers. Replace with neutral wording or placeholders (`splunk.example.com`, `<token>`). Describe the technique, not the client system. Report what you changed or removed. Then run the `pre-publish-review` skill on the diff before committing.
3. **Write the body** at `src/data/research/<slug>.html` using the building blocks below. Reuse the structure of `splunk-mcp-guide.html` as the reference for tone and layout.
4. **Register it** in `src/data/research.ts` (add the entry at the top). Fill `kind` with Guide, POC, Benchmark or Research. Keep `summary` to one or two sentences and plain words. Set `updated` to today's date.
5. **Verify.** Run `npm run build` (takes about 2 to 3 minutes; run it in the background). Confirm `dist/research/<slug>/index.html` exists. Check the layout: no text overflowing, tables readable, diagrams legible in both themes. Do not run the dev server from Claude Code (see CLAUDE.md).
6. **Commit** with the `commit-message-format` skill, and never add a Claude co-author trailer (`no-claude-coauthor`). Commit the skill together with the work if the skill was edited.

## Body building blocks

Every doc is a sequence of numbered sections:

```html
<section class="step" id="setup" data-toc="Setup">
  <span class="badge"><span class="num">1</span> Step 1</span>
  <h2>Set up the test environment</h2>
  <p>Text with <code>inline code</code> and <strong>emphasis</strong>.</p>
</section>
```

- `id` is unique, lowercase, hyphenated. `data-toc` is the short label in the sidebar (optional, defaults to the h2). The badge text can be "Start here", "Step N", "Results", "Conclusion" or similar.
- Code: `<div class="code"><div class="label">terminal</div><button class="copy">Copy</button><pre><code>...</code></pre></div>`. Use `class="code nolabel"` and drop the label div for no header. Escape `<` as `&lt;`, `>` as `&gt;`, `&` as `&amp;`. Never include a literal closing script tag.
- Callouts: `<div class="callout tip|warn|note"><span class="i">i</span><div>...</div></div>` (tip = green, warn = amber, note = blue).
- Tables: plain `<table><tr><th>..</th></tr>...</table>`. Put units in the header and keep numbers right-aligned by writing them consistently.
- Cards: `<div class="grid2"><div class="card"><h4>Title</h4><p>Text</p></div>...</div>`.
- Collapsible detail: `<details><summary>Question</summary>...</details>`.
- Checklist: `<ul class="checklist"><li>...</li></ul>`.
- Conversation example: `<div class="chat"><div class="u"><small>You</small>..</div><div class="a"><small>Claude</small>..</div></div>`.
- Figures and diagrams: `<figure><svg viewBox="0 0 900 230" role="img" aria-label="what it shows">...</svg><figcaption>Figure N. ...</figcaption></figure>`. Inside the SVG use only theme classes so dark mode works: shapes `box` (neutral), `hi` (blue), `ok` (green), `wn` (amber); lines `ln`, `ln dash`, `ac` (accent arrow), `life` (sequence lifeline); text default, `sub` (small muted), `b` (bold). Define arrow markers in `<defs>` with `fill="var(--accent)"` and a unique marker id per figure. Give every figure a number and a caption, and keep labels short enough not to overlap (check the viewBox width, about 6 px per character at 11.5 px).
- Charts of measured results: prefer a table plus a simple SVG bar chart using the same classes. Label axes and units, and show the raw numbers next to the bars.

## Structure that works for a POC or benchmark

1. **Question and context** ("Start here"): what was being decided, why it mattered, and the one-paragraph answer up front.
2. **Setup**: versions, hardware or instance types, dataset size and shape, configuration that affects results. A reader should be able to reproduce it.
3. **Method**: what was measured, how (tool, warm-up, repetitions, concurrency), and what was held constant.
4. **Results**: tables and charts with units. Report percentiles (p50, p95, p99), not only averages, and say how many runs.
5. **Analysis**: why the numbers look this way, trade-offs, surprises, what did not work.
6. **Limits and caveats**: what the test does not prove (single node, synthetic data, one dataset).
7. **Recommendation and next steps**.
8. **References and reproduction**: links, commands, and a repo link if the code is public (set `repo` in the registry).

For a how-to guide follow the Splunk MCP guide: big picture, prerequisites, numbered steps, test it, security, troubleshooting.

## Writing rules

- Plain, specific language. State the finding before the detail. Prefer numbers with units and conditions over adjectives.
- No em dashes anywhere (site convention). Use commas, colons or parentheses.
- Only claims the user supplied or the source shows. Mark estimates as estimates. If you could not verify something (a version number, a benchmark number), say so to the user and in the doc.
- Third-party names (Splunk, OpenSearch, PGroonga, Claude) are trademarks of their owners. Add a short independence note at the end of guides that discuss a product, as the Splunk guide does.
- Dates are ISO in the registry. Do not add a changelog unless the user asks.

## Updating an existing doc

Edit the body file in place, set `updated` in the registry, rebuild, and commit with a message that says what changed. Renaming a slug changes the public URL, so avoid it, or tell the user.

## Creating a context file for a new doc

When the user wants to start a new write-up, copy `context-template.md` from this folder into a working file outside the repo (or paste it in chat), fill it in, and hand it over. It collects exactly what step 1 needs: the question, setup, method, raw results, findings, caveats, what must not be published, and any existing files (HTML, Markdown, notebooks, CSV, screenshots). If the user already has a finished HTML or README (as with the Splunk guide), skip the template: read it fully, run the confidentiality gate, and convert it into a body file by keeping only the `<section class="step">` blocks and adding `id` and `data-toc` attributes.
