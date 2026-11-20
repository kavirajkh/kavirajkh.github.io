export type Role = {
  title: string;
  company: string;
  client?: string;
  start: string;
  end: string;
  current?: boolean;
  summary: string;
  highlights: string[];
};

export const experience: Role[] = [
  {
    title: 'Senior Software Engineer / Architecture Consultant',
    company: 'Infosys Limited',
    client: 'Apple Inc.',
    start: 'Oct 2023',
    end: 'Present',
    current: true,
    summary:
      'Backend engineering for Apple retail, identity, and B2B integration platforms, from catching a P95 latency regression before it reached production to API design, performance tuning, and developer-productivity tooling.',
    highlights: [
      'Led a cross-functional engineering pod of 10+ engineers, including an offshore team, mentoring developers through hands-on code and design review (7 mentees to date, 2 promoted into senior roles) and grew the backend team from 5 to 12 engineers through direct hiring involvement.',
      'Built fork-and-join aggregation across upstream services that degrades gracefully on partial failure, and added optimistic locking to prevent lost updates across concurrent clients without pessimistic locks.',
      'Applied repository-level context engineering (CLAUDE.md standards, project skills for PR descriptions, OpenAPI samples and specs) so AI-generated changes follow team conventions, and drove team-wide adoption of Claude and Gemini Pro.',
      'Authored a Claude Code skill that automates production log monitoring and root-cause analysis for gateway and API errors, exposing the log platform through an MCP server so triage follows one repeatable procedure.',
      'Evaluated full-text search options for server-side search.',
      'Implemented field-level encryption of sensitive PII before it reaches the persistence tier.',
      'Built an IntelliJ plugin and Java annotation processor that generate and validate audit-parameter documentation at build time and auto-complete the audit annotations with pre-filled defaults in the IDE, replacing manual documentation; adopted org-wide across many teams and became part of the standard developer workflow.',
      'Established the performance baseline and regression process for the platform, so each release is compared against known numbers instead of intuition, and led end-to-end performance testing across multiple releases to hold stability and response-time targets under load.',
      'Designed graph data models and APIs to manage and visualize partner and transactional data, built case-insensitive Solr search APIs for a B2B partner-integration platform, and automated secure secret retrieval in CI/CD pipelines.',
      'Improved search relevance and latency for an internal Bug Tracking System used broadly across engineering, QA, and support teams.',
      "Provided NPI (New Product Introduction) launch-readiness support, helping ensure platform stability and performance at thousands of requests per second during Apple's highest-traffic product launch events.",
    ],
  },
  {
    title: 'Software Architect / Software Developer II',
    company: 'xFusion Technologies (SynergyQuad Inc.)',
    client: 'California Student Aid Commission',
    start: 'Jul 2019',
    end: 'Aug 2023',
    summary:
      'Architected the modernization of a $3B statewide financial-aid platform serving 4 million students, from legacy systems to a cloud-native AWS architecture.',
    highlights: [
      'Led architecture and delivery of the modernization of the top five Grant Delivery System (GDS) applications, the platform California uses to administer state-funded financial aid to over 4 million students across every high school and college in the state, delivering the five interconnected applications within a two-year window on a program covering roughly $3B in annual student aid.',
      'Built secure, PII/FTI-compliant data-sharing APIs for CaliforniaColleges.edu handling sensitive identifiers, protected with AES-256/RSA field-level encryption, cutting the student school-change process from three weeks to seconds.',
      'Improved application performance by 45% through code optimization, profiling, SQL/AWR-based query tuning, and resolution of a production memory leak found via heap-dump analysis.',
      'Built natural-language-to-SQL translation grounded on a shared semantic layer for a unified data platform, with generated-query validation, SQL dialect handling, and guardrails that block unsafe or unbounded queries before they run.',
      'Worked on the retrieval layer behind grounded AI-agent answers, covering chunking strategy, embedding model selection, vector index lifecycle, hybrid keyword and semantic retrieval, and reranking.',
      'Contributed to an LLM evaluation harness that measures groundedness, factual accuracy, and regressions across prompt and model changes, gating releases on evaluation thresholds.',
      'Implemented intent classification and agent routing for a conversational data assistant, sending plain-English requests to the right data agent with clarification prompts and fallback handling when intent is ambiguous.',
      'Designed a metadata import engine for ingesting data from diverse RDBMS sources, standardizing integration across the platform.',
      'Integrated the Angular front end with Spring Boot REST APIs and added authentication and role-based access control through an enterprise identity and access management product.',
      'Implemented graph-based data visualization using Neo4j and operational dashboards in Kibana.',
    ],
  },
  {
    title: 'Senior Software Engineer / Systems Analyst II',
    company: 'QuEST Global Engineering Services',
    client: 'Apple Inc.',
    start: 'Jul 2010',
    end: 'Jul 2019',
    summary:
      'Nine years building high-throughput backend services across Apple HR systems, certificate infrastructure, retail support tooling, and enterprise integration platforms.',
    highlights: [
      'Modernized a certificate-issuance service handling tens of millions of requests/day, migrating it to current Java and Spring Boot while integrating with hardware security modules (HSMs) and implementing certificate-based authentication for service-to-service calls.',
      'Reduced attestation-service response time by 30% (27ms) under 5x load through profiling, concurrency tuning, and modernizing legacy services onto current Java and Spring Boot, and resolved concurrency defects found during performance testing ahead of production impact.',
      'Transformed legacy HR systems into an event-driven architecture, publishing change events over Apache Kafka, and replacing legacy PL/SQL extract-transform-load processes with reusable SOA/microservices connecting identity, travel, timekeeping, and HR systems.',
      'Designed an event-driven payroll-integration engine (loader/extractor/transformer pipeline) with a batch architecture that generates payroll extract files from HR system changes, meeting 100% data-accuracy requirements.',
      'Built a highly available, active-active warranty and protection-plan sales platform for resellers worldwide, tuned to support millions of queries per second, including validation and PDF-generation modules.',
      'Tuned average response time by 30% (~200ms) through load testing and CPU/memory profiling with JMeter and YourKit, and cut service response time by 45.3% by redesigning how the application retrieved data from dependent systems.',
      'Built the eventing model and a timekeeping-system interface service for a global leave-management engine handling ~4,000 leave-type configurations, using Apache Kafka for accrual and balance processing across an hourly batch cycle.',
      'Partnered with business experts to turn requirements into solutions by analyzing processes end to end, and provided technical solutions, API agreements, and data architecture.',
      'Improved and optimized Solr-based search for an internal bug-tracking system used by a very large engineering population, including key-value search for its problem-lookup API.',
      'Designed Solr-based hierarchical search APIs for an enterprise workforce directory serving call-center staff across multiple business units, and for low-latency data retrieval in the warranty sales platform.',
      'Delivered notification email services and a distributed caching layer for the HR application suite.',
      'Delivered 15+ services for a contact-center email management platform, including schema-based request validation and multi-queue case-handling views.',
      'Built the Device Enrollment Program platform enabling businesses and schools to deploy and manage fleets of iPad, iPhone, and Mac devices.',
    ],
  },
];
