export type SkillGroup = {
  category: string;
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    category: 'Languages & Core',
    skills: ['Java', 'PL/SQL', 'Scala', 'GraphQL', 'Cypher Query Language'],
  },
  {
    category: 'Backend & APIs',
    skills: [
      'Spring Boot',
      'REST APIs',
      'OpenAPI Specification',
      'Microservices',
      'Event-Driven Architecture',
      'SOA',
      'Batch Processing',
    ],
  },
  {
    category: 'Data & Messaging',
    skills: ['Apache Kafka', 'PostgreSQL', 'Oracle', 'MySQL', 'MongoDB', 'Neo4j', 'Apache Solr'],
  },
  {
    category: 'Cloud & Platform',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Argo CD'],
  },
  {
    category: 'Performance & Quality',
    skills: [
      'JMeter',
      'YourKit Profiler',
      'Concurrency Tuning',
      'ELK / Kibana / Splunk',
      'Code Climate',
      'Snyk',
    ],
  },
];

export const certifications: string[] = [
  'AWS Certified Solutions Architect',
  'AWS Certified Cloud Practitioner',
  'Neo4j Certified Professional',
  'MongoDB for Java Developers (M101J)',
  'Sun Certified Java Programmer (SCJP 6.0)',
  'Sun Certified Web Component Developer (SCWCD 5.0)',
  'Oracle Certified Database 10g SQL Expert',
];

export const education = {
  degree: 'B.Tech, Computer Science & Engineering',
  honors: 'Graduated with merit',
  school: 'Mahatma Gandhi University',
  location: 'Kerala, India',
  years: '2003 – 2007',
};
