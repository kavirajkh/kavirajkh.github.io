export type Project = {
  slug: string;
  title: string;
  client: string;
  timeframe: string;
  category:
    'Distributed Systems' | 'Performance Engineering' | 'Data Platform' | 'Developer Tooling';
  summary: string;
  problem: string;
  architecture: string;
  tradeoffs: string;
  impact: string[];
  stack: string[];
  featured: boolean;
  applications?: { name: string; url: string; description: string }[];
};

export const projects: Project[] = [
  {
    slug: 'retail-performance-coaching-platform',
    title: 'Retail Performance & Coaching Platform',
    client: 'Apple Inc.',
    timeframe: '2025 – Present',
    category: 'Distributed Systems',
    summary:
      'Core lifecycle APIs, test infrastructure, and a search-technology evaluation for a retail employee-engagement platform used for coaching, peer recognition, and goal tracking.',
    problem:
      'Store employees lacked real-time visibility into their own performance, limiting self-directed improvement. Managers lacked a structured way to run coaching conversations and cascade priorities across a large, distributed retail workforce. The platform needed lifecycle-managed, auditable backend services and a search strategy that would scale with content volume without adding unnecessary operational overhead.',
    architecture:
      'Designed and built the core lifecycle APIs for three platform features — coaching-conversation workflows, peer-to-peer recognition, and development-goal tracking — each with full CRUD, status-transition rules, filtering, pagination, and audit trails. Built component-test infrastructure using containerized database instances and stub servers so integration bugs surface in CI, not shared environments. Coordinated scheduled background jobs (expiration, badge issuance, archival) across multiple service instances via distributed locking. Separately evaluated a PostgreSQL-native full-text search extension against a dedicated distributed search engine, building working proofs of concept — including write-time text normalization via database-computed columns — for both.',
    tradeoffs:
      'The search decision traded operational simplicity against scale headroom: a PostgreSQL-native extension avoids running a separate search cluster and gives immediate read-after-write consistency, while a dedicated engine scales further and supports semantic search. Given current data volume was comfortably within the simpler option’s range, the lower-overhead approach was recommended, with both proofs of concept documented for revisiting later. Precomputing normalized text at write time added minor write-path cost for consistently fast reads — the right trade for a read-heavy workload.',
    impact: [
      'Delivered production APIs for three core platform features with full lifecycle, filtering, and audit support.',
      'Component-test infrastructure eliminated a class of flaky integration tests before they reached shared environments.',
      'Led performance and endurance testing across all major releases, validating latency targets under load and surfacing gradual degradation patterns — including connection-pool exhaustion and scheduled-job drift — that short load tests missed.',
      'Delivered a documented technical evaluation — with working proofs of concept — comparing two search approaches, replacing a default technology choice with an evidence-backed recommendation.',
    ],
    stack: [
      'Java 21',
      'Spring Boot 3.5.3',
      'Gradle',
      'PostgreSQL 15 / H2',
      'Apache Kafka',
      'Protobuf',
      'JUnit 5 / Mockito / MockServer',
      'JaCoCo / Checkstyle / Spotless',
      'Swagger / OpenAPI',
      'KMS-based Encryption',
      'Gatling (Scala)',
      'PGroonga',
      'Distributed Locking',
    ],
    featured: false,
  },
  {
    slug: 'certificate-attestation-service',
    title: 'Certificate Attestation Service',
    client: 'Apple Inc.',
    timeframe: '2017 – 2019',
    category: 'Performance Engineering',
    summary:
      'A high-throughput x509 certificate-issuance service for hardware-bound device keys, modernized and tuned to run at 30M+ requests/day.',
    problem:
      'The service issues x509 certificates for hardware-bound keys so that on-device applications can sign messages through a secure hardware API. It ran on an aging Java stack, and at an average of 30 million requests a day, both correctness under concurrency and tail latency were business-critical: any regression translates directly into failed device operations at global scale.',
    architecture:
      'Migrated the service to a current Java and Spring Boot stack while preserving its integration with hardware security modules (HSMs) for key operations. Redesigned how the service fetched data from dependent systems — moving from synchronous, per-request lookups toward a model that reduced redundant round-trips — and implemented certificate-based authentication for service-to-service calls. Re-architected the concurrency model after profiling under 5x production load surfaced a race condition that only appeared under sustained high concurrency.',
    tradeoffs:
      'Modernizing a live, high-volume service meant every change had to ship without a maintenance window. Rather than a rewrite, the migration was staged incrementally behind the existing service contract, validated with load tests at multiples of production traffic before each cutover — trading a longer migration timeline for zero customer-facing downtime.',
    impact: [
      '45.3% reduction in response time from the dependent-systems redesign (first modernization pass).',
      'A further 30% (27ms) latency reduction under 5x load in a later profiling and tuning pass.',
      'Resolved a critical concurrency bug identified during load testing before it reached production.',
    ],
    stack: ['Java', 'Spring Boot', 'HSM Integration', 'x509 / PKI', 'Concurrency Tuning'],
    featured: true,
  },
  {
    slug: 'b2b-partner-data-graph-platform',
    title: 'B2B Partner Data Graph Platform',
    client: 'Apple Inc.',
    timeframe: '2024 – 2025',
    category: 'Data Platform',
    summary:
      'A graph-database proof of concept that re-modeled a B2B partner-integration platform’s transactional data — purchase orders, shipment notices, and invoices — as a connected graph, cutting multi-hop traceability queries from seconds to milliseconds.',
    problem:
      'A B2B partner-integration platform exchanges high volumes of structured business documents — purchase orders, shipment notices, warehouse confirmations, and invoices — with external manufacturing and logistics partners. Modeled relationally, answering a simple traceability question, such as whether an order had been acknowledged, shipped, and received, required joining across six or more tables over tens of millions of rows, and location-based partner lookups meant scanning every record’s address field instead of using an index. The result was slow dashboards, manual log correlation for support engineers, and blind spots for duplicate or missing transactions that could cause double-invoicing or delayed exception handling.',
    architecture:
      'Designed a graph data model in TigerGraph representing each business-document type — purchase order, acknowledgement, shipment notice, warehouse confirmation, goods receipt, and invoice — as a vertex type, connected by edges that mirror the real transaction lifecycle, with manufacturers, carriers, and warehouses linked through a geographic hierarchy (city → country → region) modeled as vertices rather than flat attributes. Built parameterized graph queries for common support and audit questions — order-lifecycle status, geo-filtered partner search, duplicate-transaction detection, missing-acknowledgement alerts, and invoice-to-shipment reconciliation — each exposed automatically as a REST endpoint. Loaded historical data in bulk and layered a REST ingestion path for near-real-time updates, resolving vertex references at write time to avoid a separate lookup step in the pipeline. The same platform also exposed case-insensitive, Solr-backed search across partner and transactional records, and moved application secrets out of source and config files into automated, pipeline-driven retrieval from Apple’s secret-management systems.',
    tradeoffs:
      'Modeling geography as first-class vertices instead of plain attributes added schema complexity up front, but a straight attribute scan over the existing 20M+ record dataset took several seconds per geo-filtered query — unusable for an interactive dashboard — while the vertex-traversal approach touched only the relevant few thousand nodes and returned in milliseconds. The proof of concept prioritized validating traversal-based query patterns against production-scale data before committing to a full rollout, trading a broader upfront schema-design phase for confidence that the approach would hold up beyond the demo.',
    impact: [
      'Reduced full order-lifecycle status lookups from multi-second relational joins to sub-50ms graph traversals.',
      'Cut geo-filtered partner search from a full scan of 20M+ records to a traversal of roughly 2,000 vertices — several orders of magnitude faster.',
      'Surfaced duplicate shipment-notice transactions and past-SLA unacknowledged orders that were previously invisible without manual review.',
      'Presented as a featured case study to engineering and business stakeholders as a scalable pattern for partner-transaction visibility.',
    ],
    stack: ['TigerGraph', 'Graph Data Modeling', 'Apache Solr', 'REST APIs', 'Java'],
    featured: false,
  },
  {
    slug: 'grant-delivery-system-modernization',
    title: 'Statewide Financial-Aid Platform Modernization',
    client: 'California Student Aid Commission',
    timeframe: '2019 – 2023',
    category: 'Data Platform',
    summary:
      'Led the cloud modernization of a legacy financial-aid platform managing $3B in annual awards for 4 million students, delivering five applications within a two-year modernization program.',
    problem:
      'The Grant Delivery System is the system of record California uses to administer state-funded financial aid — processing over seven million applications and awarding up to $3B annually. The legacy platform was difficult to scale, maintain, and secure, driving high call-center volume and slow turnaround on routine processes like student school changes, all while handling sensitive PII and FTI data for millions of students.',
    architecture:
      'Modernized the legacy system as a cloud-native solution on AWS, replacing the monolith with a set of purpose-built applications while maintaining continuous integration with every high school and college/university in the state. Designed secure, PII/FTI-compliant data-sharing APIs to enable real-time integration with an external college-planning platform, and built a metadata-import engine to standardize ingestion from heterogeneous RDBMS sources across partner institutions.',
    tradeoffs:
      "With a live $3B/year benefits program and 4 million active users, a big-bang cutover was not an option. The team shipped five applications iteratively across a two-year modernization program instead of one monolithic release, which meant running legacy and modernized components side by side for extended periods — added integration complexity in exchange for the ability to validate each piece against real student and institution traffic before full cutover. That incremental approach also surfaced a production memory leak that only manifested under sustained load from one of the newly migrated applications; heap-dump analysis traced it to a caching layer that hadn't been sized for the new traffic pattern, and the fix shipped without affecting the wider rollout schedule.",
    impact: [
      'Reduced the student school-change process from three weeks to a matter of seconds via a new real-time integration API.',
      '45% application performance improvement through code optimization, SQL/AWR-based query tuning, and resolution of a production memory leak diagnosed via heap-dump analysis.',
      'All five applications delivered within the two-year modernization program, supporting ~$3B in annual student aid.',
      'Faster, more secure data sharing enabled for 22+ partner campuses.',
    ],
    stack: ['Java', 'Spring Boot', 'AWS', 'Oracle', 'Neo4j', 'REST APIs', 'Kibana'],
    featured: true,
    applications: [
      {
        name: 'WebGrants 4 Students',
        url: 'https://mygrantinfo.csac.ca.gov/',
        description:
          'Gives students the resources, information, and tools needed to navigate the college financial aid process.',
      },
      {
        name: 'California Dream Act Application',
        url: 'https://dream.csac.ca.gov/',
        description:
          'Lets undocumented students interested in attending eligible California colleges, universities, and career education programs apply for state financial aid.',
      },
      {
        name: 'California Chafee Grant for Foster Youth Application',
        url: 'https://mygrantinfo.csac.ca.gov/fosteryouthapplication',
        description: 'Grant application for current and former foster youth in California.',
      },
      {
        name: 'CMD GI Bill Award Program',
        url: 'https://nationalguard.csac.ca.gov/',
        description:
          'Issues educational awards to qualifying members of the California Army or Air National Guard, California State Guard, and the California Naval Militia.',
      },
      {
        name: 'WebGrants for Institutions',
        url: 'https://webgrants.csac.ca.gov/',
        description:
          "CSAC's web-based grant management platform, letting authorized school officials submit GPAs, run reports, and manage institutional grant data.",
      },
    ],
  },
  {
    slug: 'enterprise-hr-data-integration-platform',
    title: 'Enterprise HR Data Integration Platform',
    client: 'Apple Inc.',
    timeframe: '2013 – 2016',
    category: 'Distributed Systems',
    summary:
      'Replaced a legacy PL/SQL-based HR interface layer with a reusable, event-driven ETL platform connecting payroll, identity, timekeeping, and benefits systems.',
    problem:
      'The internal HR system needed to reliably synchronize employee data — payroll, benefits, contracts, and leave — with numerous internal and third-party systems. The legacy approach used bespoke PL/SQL scripts per integration, so every new interface meant duplicated logic, and changes to one interface risked breaking unrelated processes.',
    architecture:
      'Designed a common Extract-Transform-Load platform that models every integration as a configuration over shared services, rather than a bespoke script. Built internal and external interfaces using SOA and microservice patterns to connect the HR system with identity, travel, timekeeping, and other downstream systems. For the payroll extract pipeline specifically, built a loader/extractor/transformer engine on an event-driven architecture backed by a distributed cache, so payroll files could be generated from HR change events with strict accuracy guarantees. Layered in email notification services for cross-team alerts on the same platform.',
    tradeoffs:
      'Building a generic platform took longer up front than writing another one-off script for the immediate integration request. The bet was that amortizing that cost across dozens of future interfaces — each needing only configuration, not new code — would pay for itself; it did, becoming the standard onboarding path for new HR interfaces going forward.',
    impact: [
      'Consolidated dozens of one-off PL/SQL interfaces onto a single reusable ETL platform.',
      '100% data-accuracy requirement met for the payroll extract pipeline feeding the compensation process.',
      'New downstream integrations reduced to configuration changes rather than new development.',
    ],
    stack: [
      'Java',
      'SOA',
      'Microservices',
      'Apache Kafka',
      'Oracle',
      'MongoDB',
      'Distributed Caching',
    ],
    featured: true,
  },
  {
    slug: 'global-leave-management-engine',
    title: 'Global Leave Management Engine',
    client: 'Apple Inc.',
    timeframe: '2016 – 2017',
    category: 'Distributed Systems',
    summary:
      'An event-driven leave-accrual engine processing roughly 4,000 distinct leave-type configurations for a global workforce on an hourly batch cycle.',
    problem:
      "Apple's global workforce leave process spans accruals, adjustments, carry-forward, and banking rules, with approximately 4,000 leave-type configurations worldwide, each carrying its own accrual rules. Balances needed to be recalculated reliably for the entire global workforce on a tight, repeating schedule without drifting out of sync with source HR data.",
    architecture:
      'Built a Kronos-interface timekeeper module and designed an eventing model on Apache Kafka so that leave-relevant changes propagate as events rather than through direct batch coupling to the HR system of record. Modularized the engine around Accrual, Adjustment, Carry-Forward, and Banking concerns, each independently configurable per leave-type rule set, with a batch scheduler recalculating balances for the global workforce every hour.',
    tradeoffs:
      'An hourly global recalculation cycle is expensive at scale; the alternative — recalculating only on-demand per employee query — would have been cheaper computationally but risked serving stale balances during high-traffic HR events (open enrollment, policy changes). The batch-plus-eventing hybrid traded some compute cost for consistently fresh, globally correct balances.',
    impact: [
      'Reliable hourly balance recalculation across ~4,000 leave-type configurations globally.',
      'Kafka-based eventing decoupled the leave engine from direct dependency on the HR system internals, simplifying future changes.',
    ],
    stack: ['Java', 'Spring Boot', 'Apache Kafka', 'Batch Processing'],
    featured: false,
  },
  {
    slug: 'applecare-warranty-platform',
    title: 'AppleCare Warranty & Protection Plan Sales Platform',
    client: 'Apple Inc.',
    timeframe: '2010 – 2012',
    category: 'Performance Engineering',
    summary:
      'A highly available, active-active platform supporting AppleCare warranty and protection-plan sales for resellers worldwide, tuned to support 10M queries per second.',
    problem:
      'Resellers worldwide need to sell AppleCare Protection Plan and AppleCare+ at point of sale, which meant the platform had to stay available across regions with no single point of failure, while handling complex validation rules and generating sales documentation in real time.',
    architecture:
      'Built as an active-active application so traffic could be served from multiple regions simultaneously with no failover delay. Developed the core validation engine and a PDF-generation module for plan documentation, and integrated hierarchical, low-latency search for product and reseller lookups. Every release — including production cutovers — was planned to ship without milestone slippage, given the direct revenue impact of downtime.',
    tradeoffs:
      'Active-active availability adds real complexity — data consistency across regions is harder to reason about than a single active node with failover. That complexity was accepted because for a global point-of-sale system, even brief unavailability directly blocks reseller transactions worldwide.',
    impact: [
      'Supported up to 10M queries per second worldwide with an active-active architecture.',
      '30% (~200ms average) latency improvement through load testing and CPU/memory profiling with JMeter and YourKit.',
      'All releases and production moves delivered on schedule with no milestone slippage.',
    ],
    stack: ['Java', 'Active-Active Architecture', 'Apache Solr', 'JMeter', 'YourKit Profiler'],
    featured: false,
  },
  {
    slug: 'payroll-extract-processing-engine',
    title: 'Payroll Extract Processing Engine',
    client: 'Apple Inc.',
    timeframe: '2012 – 2013',
    category: 'Distributed Systems',
    summary:
      'A configuration-driven payroll extract pipeline that replaced a manual HR-to-payroll handoff with event-driven file generation, feeding a third-party payroll processor’s pay-slip runs.',
    problem:
      'Generating the extract file a third-party payroll processor needs to run pay slips depended on manually tracking changes across the HR system of record and a separate configuration store, then hand-assembling the file for delivery. As the volume and frequency of underlying changes grew, this manual handoff became both a bottleneck and an accuracy risk — any missed update meant an incorrect or delayed pay-slip run.',
    architecture:
      'Designed a new processor architecture for the payroll outbound pipeline that generates extract files directly from HR-system and configuration-store change events rather than a manual export step. Built the core processing engine on an event-driven model connecting loader, extractor, and transformer components on an enterprise Java application server, with an actor-based concurrency layer coordinating pipeline stages and a message queue handling asynchronous handoff between them. Backed the engine with a distributed, TTL-based in-process cache for configuration lookups to avoid repeated round-trips to source systems, exposed REST APIs to trigger on-demand extract generation and to run the job on a schedule, and delivered the finished file to the payroll processor over SFTP.',
    tradeoffs:
      'Building a dedicated event-driven engine, instead of scheduling a periodic export script, front-loaded design and testing effort — pipeline staging, caching, and queuing all needed to be correct for a process that gates pay-slip generation. That investment paid off in accuracy and timeliness: extract generation could run on-demand or on a schedule directly from source-of-truth change events, removing the manual assembly step and the drift it introduced. This project also established the loader/extractor/transformer pattern that a later, more general integration platform would adopt across additional HR interfaces.',
    impact: [
      'Automated the payroll extract pipeline, replacing a manual export process with event-driven generation triggered directly by HR and configuration changes.',
      'Delivered on-demand and scheduled extract-generation APIs, giving payroll operations direct control over extract timing without engineering involvement.',
      'Established the loader/extractor/transformer architecture pattern later generalized into a reusable enterprise integration platform.',
    ],
    stack: ['Java', 'JBoss', 'Akka', 'Apache Kafka', 'MongoDB', 'SFTP / JSch', 'REST APIs'],
    featured: false,
  },
  {
    slug: 'audit-documentation-annotation-processor',
    title: 'Build-Time Audit Documentation Generator',
    client: 'Apple Inc.',
    timeframe: '2024',
    category: 'Developer Tooling',
    summary:
      'A custom Java annotation processor and IntelliJ plugin that auto-generates audit-parameter documentation for an internal identity platform, removing a manual documentation step from every release.',
    problem:
      'An internal identity platform team needed consistent, validated documentation of every audit parameter emitted by its services, for compliance and observability review. Written manually, this documentation drifted from the actual code — parameters got added or renamed without the docs catching up.',
    architecture:
      'Designed custom Java annotations to mark audit parameters and their classification metadata directly in source code, then wrote a compile-time annotation processor that validates the annotations and generates Markdown documentation automatically as part of the build — so out-of-date docs become a build-time problem, not a silent gap. Complemented this with an IntelliJ plugin that offers annotation auto-completion with sensible pre-filled defaults, lowering the friction for engineers to annotate correctly in the first place.',
    tradeoffs:
      'Generating documentation at compile time (versus a separate doc-generation script run manually or in CI as an afterthought) meant tighter coupling between the build and the documentation pipeline — but that coupling is exactly what guarantees the docs can never silently fall out of sync with the code, which was the actual problem being solved.',
    impact: [
      'Eliminated manual documentation effort for audit parameters across the identity platform.',
      'Documentation generated and validated automatically on every build, closing the drift gap between code and docs.',
      'IntelliJ plugin reduced friction for correct annotation usage across the team.',
    ],
    stack: ['Java', 'Annotation Processing', 'IntelliJ Plugin SDK', 'Markdown Generation'],
    featured: false,
  },
];

const getEndYear = (timeframe: string) => {
  if (timeframe.includes('Present')) return Infinity;
  const years = timeframe.match(/\d{4}/g) ?? [];
  return Number(years[years.length - 1] ?? 0);
};

projects.sort((a, b) => getEndYear(b.timeframe) - getEndYear(a.timeframe));

export const getFeaturedProjects = () => projects.filter((p) => p.featured);
