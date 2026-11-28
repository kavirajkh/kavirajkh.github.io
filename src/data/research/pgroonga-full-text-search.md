# Full-Text Search in PostgreSQL with PGroonga: Setup, Fuzzy Search and Write-Load Performance

*Research write-up. Last updated 2026-11-27. Published on the portfolio at `/research/pgroonga-full-text-search/`.*

## 0. The question and the short answer

Our application already stores its data in PostgreSQL. We needed typo-tolerant, weighted full-text search on a few text columns, and the obvious route was a separate search cluster such as OpenSearch. The alternative was **PGroonga**, a PostgreSQL extension that puts the Groonga full-text engine behind a normal `CREATE INDEX`. This write-up covers how we set it up, how fuzzy and weighted search behave, and what happened when we load-tested it on a write-heavy table.

> **Work in progress.** This POC is not finished. This page records what has been measured so far and will be updated once the POC is complete. Findings marked as a hypothesis are not yet confirmed.

> **Where it stands.** For moderate data volumes and moderate search traffic, PGroonga is a strong fit: no new infrastructure, newly written rows are searchable inside the same transaction, and fuzzy plus weighted ranking work with plain SQL. The open issue is on the *write* path. Adding a PGroonga index slowed concurrent inserts in our performance test environment. Hardware and WAL tuning did not remove the slowdown, and our leading hypothesis is lock contention inside the index. We have only tested up to about 250 requests per second, so higher write rates remain unproven.

| Topic | What we found |
|---|---|
| Functional fit | Plain, fuzzy and weighted search all work with SQL operators and a generated-column schema (sections 3 and 4). |
| Versus OpenSearch | Matches on free text, fuzzy, ranking and bulk load. Does not match on semantic search or horizontal scale (section 2). |
| Write performance | Adding the index caused a tail-latency regression (P95 of roughly 750 to 950 ms at about 185 RPS, against about 80 ms at P90). Hardware and WAL tuning did not remove it (sections 5 to 7). |
| Leading hypothesis | Concurrent writers queue on a self-conflicting page lock inside the PGroonga index. Not yet confirmed (section 7). |
| Fuzzy search under load | Preliminary: plain and weighted search stayed fast, while fuzzy search degraded sharply at 200 to 300 RPS (section 8). |
| Not yet tested | Anything near our target write throughput, which is well above the highest rate we tried. |

## 1. Why PGroonga, and where it sits

PGroonga is an open-source PostgreSQL *index access method*, in the same family as `btree`, `gin` and `gist`. Instead of Postgres's own page format, it wraps [Groonga](https://groonga.org/), a standalone full-text and column-store engine, and exposes it through `CREATE INDEX ... USING pgroonga`.

```
documents table            Generated columns          PGroonga indexes           Query
payload JSONB   -->   title_text, content_text   -->   Groonga inverted    -->   &@~ operator
title + content       title_words, content_words       index, updated in        pgroonga_condition()
                      computed once on write           the row's transaction    pgroonga_score()
```

*Figure 1. The PGroonga setup used in this research. Search runs inside PostgreSQL, so there is no second system to deploy, sync or monitor.*

### When each option fits

| Choose PGroonga when | Choose OpenSearch when |
|---|---|
| The data already lives in PostgreSQL and you do not want a second system. | Search is a core product feature needing custom relevance tuning. |
| New or updated rows must be searchable immediately, in the same transaction. | You need horizontal scale, or expect to outgrow one PostgreSQL instance. |
| You want to avoid the cost and operations of a search cluster. | You need custom analyzers, scoring models, or vector and semantic search. |
| The dataset and query volume are moderate. | The corpus is very large or fast growing. |
| Documents have a few text-heavy fields, not many large attributes. | You need high search QPS independent of the transactional database. |

## 2. PGroonga versus OpenSearch, feature by feature

We evaluated both against the same checklist. The OpenSearch side was assessed on a managed deployment, the PGroonga side on PostgreSQL.

| Capability | OpenSearch | PGroonga |
|---|---|---|
| Free-text search | Yes. Term-level and full-text queries. | Yes. The `&@~` operator gives indexed keyword matching. |
| Fuzzy (typo tolerant) search | Yes. A fuzziness parameter on the query. | Yes. `fuzzy_max_distance_ratio` inside `pgroonga_condition()`. |
| Bulk load | Yes. The `_bulk` API with NDJSON batches, from an ETL step. | Yes. `CREATE INDEX` scans the table and indexes every existing row. |
| Time until a new write is searchable | After a refresh, 1 s by default. Longer (such as 30 s) is advised for heavy write loads. | Immediate, inside the writing transaction. |
| Ranking and scoring | Yes. `function_score` with BM25, scripts and decay functions. | Yes. `pgroonga_score()` plus your own weighting in SQL. |
| Semantic and intent search | Yes. Vector and semantic search. | No, not natively in PostgreSQL at the time of writing. |
| Horizontal scale-out | Yes. Sharded across nodes. | No. Bound by one primary instance. |
| Extra infrastructure | A cluster to run, secure, size and monitor. | None beyond the database. |

<details>
<summary>How OpenSearch ranking compares in practice</summary>

OpenSearch customises ranking with a `function_score` query. This example boosts documents by a like-to-dislike ratio and a recency decay on top of the BM25 text score. In PGroonga the same idea is a hand-written SQL expression (section 4), which is simpler but less flexible.

```json
GET documents/_search
{
  "query": {
    "function_score": {
      "query": { "multi_match": { "query": "accessory", "fields": ["title", "content"] } },
      "functions": [
        { "script_score": { "script": { "source":
            "double l = doc['like_count'].size() > 0 ? doc['like_count'].value : 0;
             double d = doc['dislike_count'].size() > 0 ? doc['dislike_count'].value : 0;
             return Math.log((l + 1.0) / (d + 1.0) + 1.0);" } } },
        { "gauss": { "created_at": { "origin": "now", "scale": "30d", "decay": 0.7 } } }
      ],
      "score_mode": "sum",
      "boost_mode": "multiply"
    }
  },
  "size": 5
}
```

</details>

## 3. Step 1: Set up PGroonga and the schema

Everything below ran on PostgreSQL 15 with PGroonga 4.0 (the load tests used PostgreSQL 15.18 and PGroonga 4.0.5). PGroonga must be available on the database server before the extension can be created.

### Install and enable

```bash
brew install pgroonga
psql -h localhost -p 5432 -U app_user -d search_db
```

```sql
CREATE EXTENSION IF NOT EXISTS pgroonga;

-- confirm it is installed
SELECT extname, extversion FROM pg_extension WHERE extname = 'pgroonga';

-- make sure the planner considers index scans
SET enable_indexscan = on;
```

### Create the table with generated search columns

The searchable text lives in a `JSONB` column. We add four *stored generated columns* so the lowercasing and word splitting happen once, at write time, and every query reads precomputed values.

```sql
CREATE TABLE documents (
    doc_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payload          JSONB NOT NULL,
    created_on       TIMESTAMP DEFAULT NOW(),
    group_key        VARCHAR(50),

    -- normalised text for exact and full-text search
    title_text   TEXT GENERATED ALWAYS AS (lower(payload->>'title'))   STORED,
    content_text TEXT GENERATED ALWAYS AS (lower(payload->>'content')) STORED,

    -- tokenised word arrays for fuzzy and loose matching
    title_words   TEXT[] GENERATED ALWAYS AS (string_to_array(lower(payload->>'title'),   ' ')) STORED,
    content_words TEXT[] GENERATED ALWAYS AS (string_to_array(lower(payload->>'content'), ' ')) STORED
);

-- example payload
-- {"title": "Getting Started with Search",
--  "content": "A short overview of how full-text search works and when to use it ..."}
```

### Create the PGroonga indexes

```sql
-- full-text indexes on the normalised text
CREATE INDEX pgrn_documents_title_idx
    ON documents USING pgroonga (title_text pgroonga_text_full_text_search_ops_v2);

CREATE INDEX pgrn_documents_content_idx
    ON documents USING pgroonga (content_text pgroonga_text_full_text_search_ops_v2);

-- word-array indexes intended for fuzzy and partial matching
CREATE INDEX pgrn_documents_title_words_idx
    ON documents USING pgroonga (title_words pgroonga_text_array_full_text_search_ops);

CREATE INDEX pgrn_documents_content_words_idx
    ON documents USING pgroonga (content_words pgroonga_text_array_full_text_search_ops);

-- ordinary indexes for non-search access paths
CREATE INDEX idx_documents_group_key  ON documents (group_key);
CREATE INDEX idx_documents_created_on ON documents (created_on);
CREATE INDEX idx_documents_payload    ON documents USING gin (payload);
```

| Column | Operator class | Intended use |
|---|---|---|
| `title_text` | `pgroonga_text_full_text_search_ops_v2` | Exact word, phrase and AND/OR keyword search on titles. |
| `content_text` | `pgroonga_text_full_text_search_ops_v2` | The same, on content. |
| `title_words` | `pgroonga_text_array_full_text_search_ops` | Typo-tolerant and partial matching on title words. |
| `content_words` | `pgroonga_text_array_full_text_search_ops` | The same, on content words. |

> **Check that your indexes are actually used.** In our direct `psql` testing, the word-array indexes were never matched by the fuzzy queries the application used, at any ratio from 0.0 to 0.9. Only the full-text indexes on the raw text columns were used. An unused index is pure write overhead (see section 7), so confirm each index with `EXPLAIN` before keeping it.

## 4. Step 2: Plain, weighted and fuzzy queries

### Plain text search with a relevance score

The `&@~` operator runs an indexed keyword match. `pgroonga_score(tableoid, ctid)` returns the engine's relevance score for each matched row. It needs `tableoid` and `ctid` so PGroonga can find the exact row in its index.

```sql
SELECT doc_id, payload,
       pgroonga_score(tableoid, ctid) AS score
FROM documents
WHERE title_text   &@~ 'discount'
   OR content_text &@~ 'discount'
ORDER BY score DESC;
```

### Weighted search

A title match is worth three times a content match. The weights are added into one score.

```sql
SELECT doc_id, payload,
       (CASE WHEN title_text   &@~ pgroonga_condition('discount') THEN 3 ELSE 0 END) +
       (CASE WHEN content_text &@~ pgroonga_condition('discount') THEN 1 ELSE 0 END) AS weighted_score
FROM documents
WHERE title_text   &@~ pgroonga_condition('discount')
   OR content_text &@~ pgroonga_condition('discount')
ORDER BY weighted_score DESC;
```

### Fuzzy (typo tolerant) search

Add `fuzzy_max_distance_ratio` to `pgroonga_condition()`. It is the largest allowed edit distance divided by the word length, where edit distance is the Levenshtein count of single-character inserts, deletes and substitutions.

```sql
-- 'diskountz' still finds 'discount'
SELECT doc_id,
       payload->>'title'   AS title,
       payload->>'content' AS content,
       pgroonga_score(tableoid, ctid) AS similarity_score
FROM documents
WHERE title_words   &@~ pgroonga_condition('diskountz', fuzzy_max_distance_ratio => 0.3)
   OR content_words &@~ pgroonga_condition('diskountz', fuzzy_max_distance_ratio => 0.3)
ORDER BY similarity_score DESC
LIMIT 10;
```

### Fuzzy and weighted together

```sql
SELECT doc_id, payload,
       (CASE WHEN title_words   &@~ pgroonga_condition('diskountz', fuzzy_max_distance_ratio => 0.3) THEN 3 ELSE 0 END) +
       (CASE WHEN content_words &@~ pgroonga_condition('diskountz', fuzzy_max_distance_ratio => 0.3) THEN 1 ELSE 0 END) AS weighted_score
FROM documents
WHERE title_words   &@~ pgroonga_condition('diskountz', fuzzy_max_distance_ratio => 0.3)
   OR content_words &@~ pgroonga_condition('diskountz', fuzzy_max_distance_ratio => 0.3)
ORDER BY weighted_score DESC;
```

### Worked example: why "diskountz" matches "discount"

| Position | Query letter | Indexed letter | Edit |
|---|---|---|---|
| 1 to 3 | d, i, s | d, i, s | match |
| 4 | k | c | substitution |
| 5 to 8 | o, u, n, t | o, u, n, t | match |
| 9 | z | (none) | deletion |

That is 2 edits over a 9-letter query, a ratio of about 0.22. It is at or below the 0.3 limit, so the row matches. A ratio of 0.0 means exact match only.

### The POC REST API

The POC wraps the native queries in a small Spring Boot service. Each search takes `q`, `fuzzy` (ratio, default 0.3, and 0.4 for similarity) and `limit` (default 10). Paths are shown without the service prefix.

| Endpoint | Purpose |
|---|---|
| `GET /documents/search?q=&fuzzy=&limit=` | Simple fuzzy search |
| `GET /documents/search/weighted?q=&fuzzy=&limit=` | Title weighted 3, content weighted 1 |
| `GET /documents/search/similarity?q=&fuzzy=&limit=` | Ranked by `pgroonga_score()` |
| `GET /documents/search/title` and `/content` | Search one field |
| `GET /documents/search/group/{key}?q=&fuzzy=` | Search within one group key |

## 5. How we load tested it

Before shipping, we put PGroonga on an existing, transactional notes table and asked four questions.

1. Does adding PGroonga indexes and search traffic slow *unrelated* APIs that share the database and service resources?
2. Do service and database resources (CPU, memory, threads) stay within bounds?
3. Does the index slow *existing* create, update and delete calls on the indexed table?
4. Do the new search endpoints hold up as load rises?

### Setup

| Item | Value |
|---|---|
| Environment | Dedicated performance test environment |
| Database | PostgreSQL 15.18 with PGroonga 4.0.5 |
| Indexed column | One `content` text column, with `pgroonga_text_full_text_search_ops_v2` |
| Added endpoints | Plain or fuzzy search (fuzzy only when a ratio is passed) and weighted search (the two matching sets scored 3x and 1x, merged) |
| Existing endpoints | Create, update, get and delete, unchanged. They pay the index maintenance cost on every write. |
| Database sizes tried | 4 vCPU / 32 GB, then 16 vCPU / 128 GB memory-optimised instances (a smaller earlier scale-up did not help either) |
| Load shape | POST-only write load, about 185 to 255 requests per second, 10-minute runs (about 111,000 requests each) |

### Two test tracks

- **Track A, search load.** Ramp concurrent traffic against plain, fuzzy and weighted search while baseline CRUD runs on the same table. Measures the blast radius on unrelated APIs.
- **Track B, write isolation.** Change one variable at a time against POST-only traffic. Measures whether the index *alone*, with no search queries, slows writes. This produced most of the findings.

### Configurations tried

| # | Change | What happened |
|---|---|---|
| 1 | Connection pool settings held constant | Standing configuration for the whole period. Never A/B tested on its own. |
| 2 | WAL tuning, round 1: `min_wal_size` 80 MB to 1 GB, `max_wal_size` 1 GB to 4 GB, `effective_io_concurrency` 8 to 200, `commit_delay` 0 to 5 | Fewer checkpoints, but WAL volume still forced them. `commit_delay` is in microseconds, so 5 is effectively a no-op. |
| 3 | `checkpoint_timeout` 5 min to 15 min | Did not stop WAL-volume-forced checkpoints from firing far more often than the timer. |
| 4 | Add the PGroonga index, no search traffic | **The main regression source**, at every scale tested. |
| 5 | Remove a per-write `COUNT` query (index kept) | Made things worse. Ruled out as a cause. |
| 6 | Minimum idle connections in the pool raised (index kept) | Fixed the regression at 100 RPS. Did not fix it at 200 RPS. |
| 7 | Database on 16 vCPU / 128 GB | App tier healthy, but the write regression persisted in the database. |
| 8 | WAL tuning, round 2: `max_wal_size` 4 GB to 8 GB | Forced checkpoints dropped to zero. API latency did not improve. |

## 6. What the write tests showed

### The application tier was not the bottleneck

During the first large-instance run, the application pods stayed mostly idle: 5 to 20 percent maximum JVM CPU, modest heap use, and flat non-heap memory. The service was waiting on the database.

### A sharp, infrequent tail

This is the first large-instance run. The 4 GB versus 8 GB comparison further down uses separate runs at the same load, so the 4 GB figures there differ slightly from this run.

| Metric (create-note endpoint) | Value |
|---|---|
| Requests | 111,617 |
| Average | 142.42 ms |
| P90 | 80.27 ms |
| P95 | 753.72 ms |
| Max | 7,239 ms |
| Average RPS (P95 RPS) | 185.7 (244.0) |

P90 was near a healthy baseline while P95 jumped almost tenfold. About 2.6 percent of requests (2,867 of 111,617) took longer than 2 seconds. A uniform slowdown would raise P90 too, so this shape points to **periodic stalls**, not constant overhead.

### WAL amplification

The table was only about 98 MB on disk, yet the run generated roughly 30 GB of write-ahead log.

| Quantity | Value |
|---|---|
| Table size after the run | about 98 MB |
| Peak WAL rate | 48 to 64 MB/s |
| WAL segments at peak | about 1,910 x 16 MB, near 30 GB |
| WAL per inserted row | about 270 KB |

A heap insert with a couple of B-tree indexes usually writes a few hundred bytes to a few KB of WAL. This is a 100 to 1,000 times amplification. This is consistent with *full-page image writes* against PGroonga's index pages: after each checkpoint, the first touch of a page logs the whole page, and large index pages are expensive. We have not confirmed this directly.

### Forced checkpoints, and why they were not the cause

PostgreSQL triggers a checkpoint when either the timer (`checkpoint_timeout`) or WAL volume (`max_wal_size`) is reached first. At 4 GB the arithmetic was:

```
4096 MB / 48 MB/s  =  about 85 s
4096 MB / 64 MB/s  =  about 64 s
(the timer alone would allow 900 s)
```

Checkpoints were firing five to fourteen times more often than the timer, so they were forced by WAL volume. We doubled `max_wal_size` to 8 GB.

| Run | Window | Timed checkpoints | Forced checkpoints | `buffers_backend` |
|---|---|---|---|---|
| 8 GB, run 1 | about 35 min | 2 | **0** | 43,948 |
| 8 GB, run 2 | about 17 min | 1 | **0** | 42,533 |

Forced checkpoints disappeared. Cache hit ratio stayed near 98.7 percent, WAL segments were recycled as fast as created, and write and replay lag stayed flat. By every classic PostgreSQL health metric the database was clean. But end-user latency did not improve:

| Metric | max_wal_size 4 GB | max_wal_size 8 GB | Change |
|---|---|---|---|
| Average (ms) | 164.07 | 180.04 | 9.7% worse |
| P90 (ms) | 504.01 | 477.63 | 5.2% better (within noise) |
| P95 (ms) | 883.50 | 953.63 | 7.9% worse |
| Max (ms) | 5,852 | 8,768 | 49.8% worse |
| Average RPS | 185.8 | 182.8 | flat |
| Requests | 111,480 | 109,329 | flat |

```
Average   4 GB  ####                      164 ms
          8 GB  #####                     180 ms
P90       4 GB  ##############            504 ms
          8 GB  #############             478 ms
P95       4 GB  ########################  884 ms
          8 GB  ##########################  954 ms
```

*Figure 2. API latency at about 185 RPS with a 4 GB and an 8 GB WAL limit. Same code, same load.*

> **The key negative result.** Checkpoint pressure was real and is now fully fixed, but it was never the main cause of the user-facing slowdown. Something unaffected by WAL sizing was.

### A secondary signal: backends flushing their own buffers

`buffers_backend` stayed near 42,500 to 44,000 across both 8 GB runs. These are dirty buffers that a query backend flushed itself because the background writer could not keep up, which happens on the insert's critical path. It may add to the tail. The background-writer settings (`bgwriter_delay`, `bgwriter_lru_maxpages`, `bgwriter_lru_multiplier`) are untested.

## 7. Leading hypothesis: index-write lock contention

### The evidence

Sampling `pg_locks` for requests that were *not yet granted* showed the same pattern in every run, at both WAL settings:

```
locktype = 'page'
mode     = 'ShareUpdateExclusiveLock'
```

`ShareUpdateExclusiveLock` conflicts with itself, so only one transaction can hold it on a page at a time. Every other writer that needs the same page queues behind it.

| Run | Pattern of queued waiters | Range seen |
|---|---|---|
| 8 GB, run 1 (capture ended before load stopped) | Steady climb | 99, 168, 165, 184 |
| 8 GB, run 2 (full capture) | Oscillating bursts | 2, 26, 65, 125, 164 |

### Contention follows index growth

We sampled the index size every 60 seconds. It stayed flat for the first few minutes, then grew linearly at about 15 to 16 MB per minute for the rest of the write window, and stopped growing the moment writes stopped. Lock waits appeared *only* during the growth phase. Two independent signals starting and stopping together suggests they describe the same event: concurrent writers contending for the index's internal pages while it is being extended.

### Why tuning could not fix it

| Checkpoint frequency | PGroonga page locking |
|---|---|
| A generic PostgreSQL concern. It hits any indexed table under enough write volume and responds to `postgresql.conf` settings. Fixed here, with no latency change. | Specific to how this access method serialises structural updates to its own storage. No generic write-path setting is known to touch it, which would explain why `max_wal_size` did nothing. |

### Findings

- **Index maintenance is the dominant write cost.** Part was checkpoint driven (fixed). A separate part is index-write serialisation (open).
- **The regression is non-linear.** 100 RPS with the index was fine and 200 RPS was not, which fits a contention effect that appears past a concurrency threshold.
- **Vertical scaling did not fix it.** Two scale-ups changed nothing, and the app tier was never the limit. More CPU or memory does not help when the constraint is one writer per page lock.
- **Every extra index adds write cost.** If the hypothesis holds, each extra PGroonga index is another structure writers can queue on, so drop any that queries do not use.

> **Not confirmed yet.** The test database role could not read other sessions' query text (`<insufficient privilege>`), so we did not directly confirm that the queued sessions were the insert path. Only the notes table was being written during these runs, so it is a safe inference, but it is an inference. Granting `pg_read_all_stats` to the test role fixes this cheaply.

## 8. Search endpoints under their own load (preliminary)

Separately from the write path, Track A looked at the search endpoints themselves. Treat these as preliminary: they come from the supporting track, with less instrumentation than the write tests.

| Endpoint | Behaviour under load |
|---|---|
| Plain (exact) search | Stayed in single-digit to low double-digit milliseconds. |
| Weighted search | The same. Stayed fast. |
| Fuzzy search | P95 rose from about 186 ms at 2 RPS to over 40,000 ms at 200 to 300 RPS. |
| Other CRUD endpoints, while fuzzy search ran | P95 pushed into the 5,000 to 19,000 ms range. |

Fuzzy search does not scale on its own and has a blast radius on unrelated endpoints. It needs separate scaling or rate limiting, whatever happens on the write path.

## 9. Operational notes

| Topic | Note |
|---|---|
| Unused indexes | Audit with `EXPLAIN` and drop any PGroonga index the queries never use (section 3). |
| PostgreSQL 17 and later | The checkpoint counters moved from `pg_stat_bgwriter` to `pg_stat_checkpointer` (`num_timed`, `num_requested`). Adjust the queries in section 12. |
| PGroonga versions | Locking behaviour and tuning options may differ across releases. Treat the lock finding as a hypothesis to re-check on your version. |

## 10. What this does not prove

- **Tested to about 250 RPS only.** Our target write throughput is well above that. Lock contention grows with concurrent writers, so expect it to worsen, not improve, toward the target. Nothing here shows PGroonga can reach it.
- **One indexed table.** Other schemas, row sizes and index sets may behave differently.
- **One dataset shape, one PGroonga version** (4.0.5) and one PostgreSQL version (15.18).
- **No formal latency target (SLA) was set.** The comparison point was the pre-index baseline.
- **No head-to-head benchmark.** The OpenSearch comparison is a feature checklist, not a measured comparison.
- **Index build time** was not measured.

## 11. Where this stands and what is next

**Established so far:** PGroonga delivers plain, weighted and fuzzy search inside PostgreSQL with plain SQL, and newly written rows are searchable immediately. **Still open:** adding the index slowed concurrent inserts in our tests, and we have not yet shown that it can sustain our target write rate. We are not making a final recommendation until that is resolved.

Remaining work, in priority order:

1. **Ramp load toward the real target** (for example in four or five steps) to see whether contention grows gradually or collapses past a threshold. This is the biggest open risk.
2. **Confirm which queries are queued** by granting `pg_read_all_stats` to the test role and re-running.
3. **Correlate lock-wait bursts with application latency spikes** using timestamps, to move from "at the same time" to "caused by".
4. **Check PGroonga's documentation and community** for index-update batching, lock granularity or deferred indexing.
5. **Try background-writer tuning** given the high `buffers_backend` counts.

> This is a work in progress. We will update this document once the POC is complete.

## 12. Reproducing the measurements

Dashboards gave minute-level aggregates, which were too coarse to pin down checkpoints or lock waits to a test window. We sampled the database directly. A PL/pgSQL procedure ran inside the database, with no shell access or superuser rights beyond standard monitoring views.

```sql
-- Each loop iteration COMMITs on its own, so a dropped client connection
-- still leaves every earlier sample saved.
CREATE OR REPLACE PROCEDURE capture_metrics(duration_minutes int, interval_seconds int)
LANGUAGE plpgsql AS $$
DECLARE end_time timestamptz := clock_timestamp() + make_interval(mins => duration_minutes);
BEGIN
  WHILE clock_timestamp() < end_time LOOP
    -- 1. wait events
    --    SELECT wait_event_type, wait_event, count(*)
    --    FROM pg_stat_activity WHERE state = 'active' GROUP BY 1, 2;
    -- 2. queued lock requests (the most reliable contention signal)
    --    SELECT locktype, mode, count(*) FROM pg_locks WHERE NOT granted GROUP BY 1, 2;
    -- 3. index size
    --    SELECT pg_relation_size('pgrn_notes_content_idx'::regclass);
    -- 4. checkpoint counters (PostgreSQL 16 and earlier)
    --    SELECT checkpoints_timed, checkpoints_req, buffers_backend FROM pg_stat_bgwriter;
    COMMIT;
    PERFORM pg_sleep(interval_seconds);
  END LOOP;
END $$;
```

Lessons from using this approach:

- Polling `pg_stat_activity` wait events every 15 seconds misses most short lock waits. `pg_locks WHERE NOT granted` is far more reliable, because a queued session stays visible for as long as it waits.
- `pg_stat_bgwriter` counters are cumulative since the last stats reset. Snapshot before and after each run and use the difference.
- Long `CALL` sessions can lose the client connection to a proxy or idle timeout. Compare `max(log_time)` against the expected sample count to see how much was captured before calling a run failed.

### References

- [PGroonga documentation](https://pgroonga.github.io/)
- [PGroonga versus textsearch and pg_trgm](https://pgroonga.github.io/reference/pgroonga-versus-textsearch-and-pg-trgm.html)
- [PGroonga 3.0.0 release notes](https://groonga.org/en/blog/2023/04/13/pgroonga-3.0.0.html)
- [OpenSearch documentation](https://docs.opensearch.org/latest/)

---

*PostgreSQL, PGroonga, Groonga and OpenSearch are trademarks or projects of their respective owners. This write-up is independent research and is not affiliated with or endorsed by them. Measurements describe one environment and one point in time, and should be re-run on yours.*
