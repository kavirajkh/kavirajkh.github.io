/**
 * Registry of research write-ups shown at /research/. Each entry needs a matching HTML body at
 * src/data/research/<slug>.html (see .claude/skills/add-research-doc/SKILL.md).
 */
export type ResearchKind = 'Guide' | 'POC' | 'Benchmark' | 'Research';

export type ResearchDoc = {
  /** URL segment and body file name: /research/<slug>/ and src/data/research/<slug>.html. */
  slug: string;
  title: string;
  /** One or two sentences for the card and the meta description. */
  summary: string;
  /** One longer sentence shown under the title on the page. */
  lead: string;
  kind: ResearchKind;
  /** Short chips: stack, outcome, effort. */
  tags: string[];
  /** ISO date of the last meaningful update. */
  updated: string;
  /** Optional: where the runnable code lives, if it is public. */
  repo?: { label: string; href: string };
};

/** Newest first. */
export const researchDocs: ResearchDoc[] = [
  {
    slug: 'splunk-mcp-guide',
    title: 'Build a Splunk MCP Server and Connect It to Claude Code',
    summary:
      'A step-by-step guide to building a Splunk MCP server in Python with FastMCP, so Claude Code can run log searches from plain-English questions.',
    lead: 'Ask questions about your logs in plain English and let Claude run the Splunk searches. A step-by-step guide from an empty folder to a working integration.',
    kind: 'Guide',
    tags: ['Python 3.10+', 'FastMCP', 'Splunk REST API', 'Claude Code', '~30 minutes'],
    updated: '2026-11-27',
  },
];
