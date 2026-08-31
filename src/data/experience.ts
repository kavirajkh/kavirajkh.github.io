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
    title: 'Architecture Consultant',
    company: 'Infosys Limited',
    client: 'Apple Inc.',
    start: 'Oct 2023',
    end: 'Present',
    current: true,
    summary:
      'Backend engineering for Apple retail, identity, and B2B integration platforms — API design, performance tuning, and developer-productivity tooling.',
    highlights: [
      'Designed and implemented scalable API services for a retail employee-engagement platform, including peer recognition, coaching, and goal-tracking features.',
      'Built Postgres and mock-server sidecars for a component test pipeline, and wrote Scala-based performance scripts to benchmark and validate API scalability.',
      'Led end-to-end performance testing across multiple application releases, ensuring stability and response-time targets under load.',
      'Built a custom Java annotation processor and companion IntelliJ plugin that auto-generates audit-parameter documentation at build time, eliminating manual documentation work for the identity platform team.',
      'Designed graph data models and case-insensitive Solr search APIs for a B2B partner-integration platform, and automated secure secret retrieval in CI/CD pipelines.',
      'Improved search relevance and latency for an internal Bug Tracking System used broadly across engineering, QA, and support teams.',
    ],
  },
  {
    title: 'Software Developer II',
    company: 'SynergyQuad Inc.',
    client: 'California Student Aid Commission',
    start: 'Jul 2019',
    end: 'Aug 2023',
    summary:
      'Architected the modernization of a $3B statewide financial-aid platform serving 4 million students, from legacy systems to a cloud-native AWS architecture.',
    highlights: [
      'Modernized the top five applications for the Grant Delivery System (GDS), the platform California uses to administer state-funded financial aid to over 4 million students across every high school and college in the state.',
      'Delivered the modernized GDS suite — five interconnected applications — within a two-year window, on a program covering roughly $3B in annual student aid.',
      'Built secure, PII/FTI-compliant data-sharing APIs for CaliforniaColleges.edu, cutting the student school-change process from three weeks to seconds.',
      'Designed a metadata import engine for ingesting data from diverse RDBMS sources, standardizing integration across the platform.',
      'Improved application performance by 45% through code optimization, SQL/AWR-based query tuning, and resolution of a production memory leak found via heap-dump analysis.',
      'Implemented graph-based data visualization using Neo4j and operational dashboards in Kibana.',
    ],
  },
  {
    title: 'Systems Analyst II',
    company: 'QuEST Global Engineering Services',
    client: 'Apple Inc.',
    start: 'Jul 2010',
    end: 'Jul 2019',
    summary:
      'Nine years building high-throughput backend services across Apple HR systems, certificate infrastructure, retail support tooling, and enterprise integration platforms.',
    highlights: [
      'Modernized a certificate-issuance service handling tens of millions of requests/day, migrating it to current Java and Spring Boot while integrating with hardware security modules (HSMs).',
      'Reduced attestation-service response time by 30% (27ms) under 5x load through profiling, concurrency tuning, and modernizing legacy services onto current Java and Spring Boot.',
      'Cut service response time by 45.3% through a redesign of how the application retrieved data from dependent systems, and implemented certificate-based authentication.',
      'Identified and fixed a critical concurrency bug found during performance testing, ahead of production impact.',
      'Designed and built an enterprise HR data-integration platform (SOA/microservices) connecting identity, travel, timekeeping, and HR systems, replacing legacy PL/SQL extract-transform-load processes with reusable services.',
      'Built the eventing model for a global leave-management engine handling ~4,000 leave-type configurations, using Apache Kafka for accrual and balance processing across an hourly batch cycle.',
      'Designed Solr-based hierarchical search APIs for an enterprise workforce directory serving call-center staff across multiple business units.',
      'Delivered 15+ services for a contact-center email management platform, including schema-based request validation and multi-queue case-handling views.',
      'Built the Device Enrollment Program platform enabling businesses and schools to deploy and manage fleets of iPad, iPhone, and Mac devices.',
      'Developed a highly available, active-active warranty and protection-plan sales platform supporting millions of queries per second worldwide, including validation and PDF-generation modules, and tuned average response time by 30% (~200ms) through load testing and CPU/memory profiling.',
      'Designed an event-driven payroll-integration engine (loader/extractor/transformer pipeline) that generates payroll extract files from HR system changes with 100% data-accuracy requirements.',
    ],
  },
];
