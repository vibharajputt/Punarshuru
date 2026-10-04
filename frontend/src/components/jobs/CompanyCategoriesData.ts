export interface RoleData {
  id: string
  title: string
  startingCtcLpa: number
  level: string
  requiredSkills: string[]
  resilienceScore: number
  hiringDemand: string
  courses: { title: string; provider: string; weeks: number }[]
}

export interface CompanyCategory {
  id: string
  name: string
  category: 'IT Services' | 'GCCs' | 'Product SaaS' | 'FinTech' | 'AI & Cloud'
  badgeText: string
  badgeBg: string
  tagline: string
  hiringHubs: string[]
  coreStack: string[]
  roles: RoleData[]
}

export const companyCategoriesList: CompanyCategory[] = [
  {
    id: 'tier1-it',
    name: 'Tier-1 IT Services & Integrators',
    category: 'IT Services',
    badgeText: 'IT',
    badgeBg: 'bg-sky-700',
    tagline: 'Enterprise Cloud Migration & App Modernization',
    hiringHubs: ['Pune', 'Chennai', 'Noida', 'Hyderabad'],
    coreStack: ['Java', 'Spring Boot', 'MySQL', 'AWS', 'Docker'],
    roles: [
      {
        id: 'it-cloud-mod',
        title: 'Enterprise Cloud & Java Modernization SDE',
        startingCtcLpa: 12.5,
        level: 'Mid-Level',
        requiredSkills: ['Java', 'Spring Boot', 'MySQL', 'Docker', 'AWS'],
        resilienceScore: 80,
        hiringDemand: 'High Volume (+28% YoY)',
        courses: [{ title: 'Java Cloud Modernization', provider: 'Skill India', weeks: 8 }],
      },
      {
        id: 'it-automation-sde',
        title: 'Enterprise AI & Automation Developer',
        startingCtcLpa: 15.0,
        level: 'Senior',
        requiredSkills: ['Python', 'LangChain', 'FastAPI', 'SQL'],
        resilienceScore: 89,
        hiringDemand: 'Rapid Growth (+65% YoY)',
        courses: [{ title: 'Applied AI for Enterprise', provider: 'NPTEL', weeks: 12 }],
      },
    ],
  },
  {
    id: 'gcc-centers',
    name: 'Global Capability Centers (GCCs)',
    category: 'GCCs',
    badgeText: 'GCC',
    badgeBg: 'bg-indigo-700',
    tagline: 'Fortune 500 In-House Engineering & R&D Hubs in India',
    hiringHubs: ['Bengaluru', 'Hyderabad', 'Gurugram', 'Pune'],
    coreStack: ['Python', 'Java', 'Kubernetes', 'PostgreSQL', 'AWS'],
    roles: [
      {
        id: 'gcc-platform-sde',
        title: 'Cloud Platform & Distributed Systems SDE',
        startingCtcLpa: 22.0,
        level: 'Senior',
        requiredSkills: ['Java', 'Spring Boot', 'Kafka', 'Microservices', 'Kubernetes'],
        resilienceScore: 92,
        hiringDemand: 'Surging Hub Demand (+45% YoY)',
        courses: [{ title: 'Microservices & Distributed Systems', provider: 'NPTEL', weeks: 12 }],
      },
    ],
  },
  {
    id: 'product-saas',
    name: 'High-Growth B2B & Product SaaS',
    category: 'Product SaaS',
    badgeText: 'SaaS',
    badgeBg: 'bg-emerald-700',
    tagline: 'Global Enterprise SaaS & Developer Platforms',
    hiringHubs: ['Bengaluru', 'Chennai', 'Pune', 'Remote'],
    coreStack: ['TypeScript', 'Node.js', 'React', 'PostgreSQL', 'Docker'],
    roles: [
      {
        id: 'saas-fullstack',
        title: 'Full-Stack Product SDE (React + Node)',
        startingCtcLpa: 17.5,
        level: 'Mid-Level',
        requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
        resilienceScore: 85,
        hiringDemand: 'High (+32% YoY)',
        courses: [{ title: 'Full Stack Node & React Architectures', provider: 'SWAYAM', weeks: 10 }],
      },
    ],
  },
  {
    id: 'fintech-unicorn',
    name: 'Consumer Tech & FinTech Unicorns',
    category: 'FinTech',
    badgeText: 'FT',
    badgeBg: 'bg-purple-700',
    tagline: 'High-Concurrency UPI, Payments & Logistics',
    hiringHubs: ['Bengaluru', 'Gurugram', 'Mumbai', 'Pune'],
    coreStack: ['Java', 'Golang', 'Kafka', 'Redis', 'PostgreSQL'],
    roles: [
      {
        id: 'fintech-payments',
        title: 'High-Concurrency Payments Backend SDE',
        startingCtcLpa: 21.0,
        level: 'Mid / Senior',
        requiredSkills: ['Java', 'Spring Boot', 'Kafka', 'Redis', 'PostgreSQL'],
        resilienceScore: 91,
        hiringDemand: 'Very High (+42% YoY)',
        courses: [{ title: 'High-Concurrency Backend Systems', provider: 'NPTEL', weeks: 12 }],
      },
    ],
  },
  {
    id: 'frontier-ai',
    name: 'Frontier AI & Cloud Platforms',
    category: 'AI & Cloud',
    badgeText: 'AI',
    badgeBg: 'bg-blue-700',
    tagline: 'GenAI Solution Delivery & Vector Intelligence',
    hiringHubs: ['Bengaluru', 'Hyderabad', 'Gurugram'],
    coreStack: ['Python', 'Vector DBs', 'RAG', 'LangChain', 'FastAPI'],
    roles: [
      {
        id: 'ai-genai-eng',
        title: 'GenAI & RAG Solutions Engineer',
        startingCtcLpa: 26.0,
        level: 'Senior',
        requiredSkills: ['Python', 'LangChain', 'Vector DBs', 'RAG', 'FastAPI'],
        resilienceScore: 96,
        hiringDemand: 'Surging Demand (+60% YoY)',
        courses: [{ title: 'LLMs & RAG Deployment', provider: 'NPTEL', weeks: 12 }],
      },
    ],
  },
]
