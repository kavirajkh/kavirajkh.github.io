export type SkillGroup = {
  category: string;
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    category: 'Languages & Query Languages',
    skills: ['Java', 'Scala', 'PL/SQL', 'GraphQL', 'Cypher Query Language'],
  },
  {
    category: 'Databases & Data Stores',
    skills: [
      'TigerGraph',
      'PostgreSQL',
      'MySQL',
      'Oracle',
      'MongoDB',
      'Neo4j',
      'Cassandra',
      'NoSQL',
    ],
  },
  {
    category: 'Search, Messaging & Stream Processing',
    skills: [
      'Apache Kafka',
      'Apache Solr',
      'OpenSearch / Elasticsearch',
      'Apache Spark',
      'PGroonga',
      'Protocol Buffers (Protobuf)',
    ],
  },
  {
    category: 'Backend Frameworks & APIs',
    skills: [
      'Spring Framework / Spring Boot',
      'RESTful APIs',
      'OpenAPI Specification',
      'MuleSoft',
      'Spring WebFlux',
      'RxJava',
    ],
  },
  {
    category: 'Architecture & Concurrency',
    skills: [
      'Microservices',
      'SOA',
      'Event-Driven Architecture',
      'Batch Processing',
      'Multi-Threading & Concurrency',
      'Asynchronous Programming & Non-Blocking I/O',
    ],
  },
  {
    category: 'Cloud, Containers & DevOps',
    skills: [
      'AWS (S3, Lambda, EC2)',
      'Docker',
      'Kubernetes',
      'Argo CD',
      'Jenkins',
      'GitHub Actions',
      'JFrog',
    ],
  },
  {
    category: 'Observability & Performance Testing',
    skills: [
      'Grafana',
      'ELK / Kibana / Splunk',
      'Gatling',
      'JMeter',
      'YourKit Java Profiler',
      'Performance, Endurance & Regression Testing',
      'Spring Boot Actuator & Prometheus',
      'MockServer',
    ],
  },
  {
    category: 'Security & Code Quality',
    skills: [
      'mTLS',
      'Authentication & Authorization',
      'JWT (Auth0 java-jwt)',
      'Spring Security',
      'OWASP Dependency-Check',
      'Snyk',
      'SonarQube',
      'Unit Testing (TDD)',
      'Code Review & Mentoring',
    ],
  },
];

export type Certification = {
  name: string;
  issuer: string;
};

export const certifications: Certification[] = [
  { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services' },
  { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services' },
  { name: 'Neo4j Certified Professional', issuer: 'Neo4j' },
  { name: 'MongoDB for Java Developers (M101J)', issuer: 'MongoDB University' },
  { name: 'Sun Certified Java Programmer (SCJP 6.0)', issuer: 'Sun Microsystems' },
  { name: 'Sun Certified Web Component Developer (SCWCD 5.0)', issuer: 'Sun Microsystems' },
  { name: 'Oracle Certified Database 10g SQL Expert', issuer: 'Oracle' },
];

export const education = {
  degree: 'B.Tech, Computer Science & Engineering',
  honors: 'Graduated with merit',
  school: 'Mahatma Gandhi University',
  location: 'Kerala, India',
  years: '2003 – 2007',
};
