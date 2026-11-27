# Research context file

Fill this in (rough notes are fine) and give it to Claude together with any existing files.
Claude turns it into a write-up under /research/ with the `add-research-doc` skill.
Leave a field empty instead of guessing. Do not paste secrets or client data.

## 1. Identity
- Working title:
- Kind: Guide | POC | Benchmark | Research
- Suggested slug (lowercase, hyphens), for example `pgroonga-vs-opensearch`:
- One-sentence summary (shown on the card):
- Who is it for?

## 2. The question
- What decision or doubt triggered this work?
- Why does it matter (cost, latency, accuracy, risk)?
- The short answer, if you already know it:

## 3. Setup (needed to reproduce)
- Versions (databases, libraries, models, OS):
- Hardware or instance types (CPU, RAM, disk, network):
- Dataset: size, shape, how it was generated or anonymised:
- Configuration that affects results (indexes, analyzers, chunk size, embedding model, thresholds):

## 4. Method
- What was measured and with which tool:
- Workload: queries or documents, concurrency, warm-up, number of runs:
- What was held constant:

## 5. Results (raw numbers, with units)
Paste tables, CSV or screenshots. For performance work include p50, p95, p99, throughput and
resource use. For detection or accuracy work include precision, recall, false positive rate and
the size and mix of the test set.

| Scenario | Metric | Value | Notes |
|---|---|---|---|
| | | | |

## 6. Findings and trade-offs
- What worked, what did not, what surprised you:
- Cost, operational effort, maintenance:

## 7. Limits and caveats
- What this test does not prove (single node, synthetic data, small sample):

## 8. Recommendation and next steps

## 9. Confidentiality (important, the site is public)
- Names, systems, hosts, URLs, data that must NOT appear:
- Safe alternative wording (for example "a large retail platform"):
- Numbers that must be softened or omitted:
- Is it OK to publish the code? If yes, link:

## 10. Files and links
- Existing HTML / Markdown / notebooks / CSV / images (absolute paths):
- External references worth linking:
