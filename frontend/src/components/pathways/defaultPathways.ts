import type { PathwayOption } from '@/types'

export interface SprintWeekPlan {
  week: number
  title: string
  focus: string
  hours: number
  tasks: { id: string; text: string; type: 'learn' | 'practice' | 'project' | 'interview' }[]
  recommendedCourses: { title: string; provider: string; url: string; free: boolean }[]
  mockInterviewQ: string
}

// 1. Returner Pathways (Default)
export const returnerPathways: PathwayOption[] = [
  {
    type: 'Safe',
    title: 'Refresh & Strengthen: Modern Java Backend',
    target_role: 'Senior Java / Cloud Backend',
    estimated_months: 2,
    target_salary_lpa: 12.5,
    difficulty: 'Low',
    description: 'Re-validate core Java & Spring foundations with cloud deployment and clean testing.',
    roadmap: [
      {
        week_range: 'Weeks 1-4',
        title: 'Core Stack Refresh',
        description: 'Bridge version gaps and practice hands-on coding in modern environment.',
        skills_covered: ['Java 17/21', 'Spring Boot 3', 'Clean Architecture'],
        courses: [
          {
            id: 1,
            title: 'Programming in Java (IIT Kharagpur)',
            provider: 'NPTEL',
            weeks: 12,
            lang: 'en',
            url: 'https://nptel.ac.in/courses/106105191',
            level: 'beginner',
            certificate: true,
          },
        ],
      },
    ],
  },
  {
    type: 'Stretch',
    title: 'High Growth Leap: GenAI & RAG Engineer',
    target_role: 'GenAI Engineer',
    estimated_months: 4,
    target_salary_lpa: 18.0,
    difficulty: 'High',
    description: 'Target high-demand frontier roles with comprehensive hands-on project artifacts.',
    roadmap: [
      {
        week_range: 'Weeks 1-4',
        title: 'Python & Vector Embeddings',
        description: 'Master Python data structures, vector math, and API fundamentals.',
        skills_covered: ['Python', 'Vector DBs', 'Prompt Engineering'],
        courses: [
          {
            id: 2,
            title: 'Python for Data Science (IIT Madras)',
            provider: 'SWAYAM',
            weeks: 12,
            lang: 'en',
            url: 'https://swayam.gov.in/nd2_noc20_cs56',
            level: 'beginner',
            certificate: true,
          },
        ],
      },
      {
        week_range: 'Weeks 5-10',
        title: 'LLM Frameworks & RAG Architecture',
        description: 'Implement Retrieval Augmented Generation systems with LangChain/LlamaIndex.',
        skills_covered: ['LangChain', 'RAG Pipelines', 'Embeddings'],
        courses: [
          {
            id: 3,
            title: 'Back End Development and APIs',
            provider: 'freeCodeCamp',
            weeks: 16,
            lang: 'en',
            url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/',
            level: 'intermediate',
            certificate: true,
          },
        ],
      },
      {
        week_range: 'Weeks 11-16',
        title: 'Capstone Deployment & Proof of Work',
        description: 'Deploy full-stack GenAI application with CI/CD and publish live demo.',
        skills_covered: ['FastAPI', 'Docker', 'System Evaluation'],
        courses: [
          {
            id: 4,
            title: 'Artificial Intelligence Foundations',
            provider: 'Skill India',
            weeks: 6,
            lang: 'hi',
            url: 'https://www.skillindiadigital.gov.in/courses/detail/7614d3b6-aeec-4eb9-a789-f53833d7bfa5',
            level: 'beginner',
            certificate: true,
          },
        ],
      },
    ],
  },
  {
    type: 'Pivot',
    title: 'Cross-Domain Transition: DevOps & Cloud Infrastructure',
    target_role: 'DevOps / Platform Engineer',
    estimated_months: 3,
    target_salary_lpa: 14.5,
    difficulty: 'Medium',
    description: 'Leverage backend intuition while switching into rapidly expanding infrastructure functions.',
    roadmap: [
      {
        week_range: 'Weeks 1-6',
        title: 'Docker, Kubernetes & Linux Admin',
        description: 'Learn container orchestration and cloud scripting.',
        skills_covered: ['Docker', 'Kubernetes', 'Linux'],
        courses: [
          {
            id: 5,
            title: 'IT-ITeS Associate Software Developer',
            provider: 'Skill India',
            weeks: 6,
            lang: 'hi',
            url: 'https://www.skillindiadigital.gov.in/courses/detail/5ef58e99-4d82-4fcf-85d0-4bf69c2d1b7b',
            level: 'beginner',
            certificate: true,
          },
        ],
      },
    ],
  },
]

// 2. Student Pathways
export const studentPathways: PathwayOption[] = [
  {
    type: 'Safe',
    title: 'Campus-to-Corporate: Full-Stack SWE Sprint',
    target_role: 'Junior Full-Stack Software Engineer',
    estimated_months: 2.5,
    target_salary_lpa: 8.5,
    difficulty: 'Medium',
    description: 'Master high-frequency campus placement DSA patterns and build 1 live deployed React + Spring Boot/Node app.',
    roadmap: [
      {
        week_range: 'Weeks 1-4',
        title: 'Campus DSA Patterns & Clean OOP',
        description: 'Two pointers, sliding window, binary trees, recursion & clean code conventions.',
        skills_covered: ['Java / C++ DSA', 'Clean Code', 'Git & GitHub'],
        courses: [
          {
            id: 101,
            title: 'Data Structures and Algorithms using Python (IIT Madras)',
            provider: 'NPTEL',
            weeks: 8,
            lang: 'en',
            url: 'https://nptel.ac.in/courses/106106145',
            level: 'beginner',
            certificate: true,
          },
        ],
      },
      {
        week_range: 'Weeks 5-8',
        title: 'Full-Stack Web & Relational Database APIs',
        description: 'React/Next.js frontend with REST APIs in Express/Spring Boot and PostgreSQL indexing.',
        skills_covered: ['React', 'Node / Java', 'PostgreSQL', 'REST APIs'],
        courses: [
          {
            id: 102,
            title: 'JavaScript Algorithms and Data Structures',
            provider: 'freeCodeCamp',
            weeks: 10,
            lang: 'en',
            url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
            level: 'beginner',
            certificate: true,
          },
        ],
      },
      {
        week_range: 'Weeks 9-10',
        title: 'Live Deployment & Mock Technical Rounds',
        description: 'Deploy on AWS/Render with Docker and complete 5 mock placement technical rounds.',
        skills_covered: ['Docker', 'AWS Free Tier', 'Technical Interviews'],
        courses: [
          {
            id: 103,
            title: 'IT-ITeS Associate Software Developer',
            provider: 'Skill India',
            weeks: 4,
            lang: 'hi',
            url: 'https://www.skillindiadigital.gov.in/courses/detail/5ef58e99-4d82-4fcf-85d0-4bf69c2d1b7b',
            level: 'beginner',
            certificate: true,
          },
        ],
      },
    ],
  },
  {
    type: 'Stretch',
    title: 'Tier-1 Product Tech Leap: Cloud & GenAI Associate',
    target_role: 'Associate Cloud & GenAI Engineer',
    estimated_months: 3.5,
    target_salary_lpa: 16.0,
    difficulty: 'High',
    description: 'Target top product unicorns (Razorpay, Swiggy, CRED) with modern RAG, Vector Search, and AWS Microservices.',
    roadmap: [
      {
        week_range: 'Weeks 1-4',
        title: 'Python for Production & Vector Embeddings',
        description: 'FastAPI async routing, Pydantic data validation, and Vector DB retrieval concepts.',
        skills_covered: ['Python 3.12', 'FastAPI', 'Vector DBs (Qdrant)'],
        courses: [
          {
            id: 104,
            title: 'Python for Data Science (IIT Madras)',
            provider: 'SWAYAM',
            weeks: 8,
            lang: 'en',
            url: 'https://swayam.gov.in/nd2_noc20_cs56',
            level: 'beginner',
            certificate: true,
          },
        ],
      },
      {
        week_range: 'Weeks 5-10',
        title: 'RAG Architecture & LangChain Pipeline Engineering',
        description: 'Build production document search agent with chunking, hybrid search, and LLM evaluation.',
        skills_covered: ['LangChain', 'OpenAI/Gemini API', 'RAG Pipelines'],
        courses: [
          {
            id: 105,
            title: 'Natural Language Processing (IIT Bombay)',
            provider: 'NPTEL',
            weeks: 6,
            lang: 'en',
            url: 'https://nptel.ac.in/courses/106101247',
            level: 'intermediate',
            certificate: true,
          },
        ],
      },
      {
        week_range: 'Weeks 11-14',
        title: 'Cloud CI/CD & AWS ECS Microservices Capstone',
        description: 'Containerize multi-service app with Docker Compose and deploy to AWS with GitHub Actions.',
        skills_covered: ['Docker', 'AWS ECS', 'GitHub Actions CI/CD'],
        courses: [
          {
            id: 106,
            title: 'Cloud Computing & Virtualization (IIT Kharagpur)',
            provider: 'NPTEL',
            weeks: 8,
            lang: 'en',
            url: 'https://nptel.ac.in/courses/106105167',
            level: 'intermediate',
            certificate: true,
          },
        ],
      },
    ],
  },
  {
    type: 'Pivot',
    title: 'Fast-Track Data Engineering & Pipelines Sprint',
    target_role: 'Junior Data & Analytics Engineer',
    estimated_months: 3,
    target_salary_lpa: 11.5,
    difficulty: 'Medium',
    description: 'Transition into data engineering roles with SQL query optimization, PySpark, and Airflow ETL pipelines.',
    roadmap: [
      {
        week_range: 'Weeks 1-6',
        title: 'Advanced SQL & Data Modeling',
        description: 'Window functions, CTEs, indexing strategies, and dimensional data modeling.',
        skills_covered: ['PostgreSQL', 'SQL Optimization', 'Data Modeling'],
        courses: [
          {
            id: 107,
            title: 'Database Management Systems (IIT Kharagpur)',
            provider: 'NPTEL',
            weeks: 8,
            lang: 'en',
            url: 'https://nptel.ac.in/courses/106105175',
            level: 'beginner',
            certificate: true,
          },
        ],
      },
      {
        week_range: 'Weeks 7-12',
        title: 'PySpark & Automated ETL Pipelines',
        description: 'Build automated batch and streaming data ingestion pipelines.',
        skills_covered: ['PySpark', 'Apache Airflow', 'Docker'],
        courses: [
          {
            id: 108,
            title: 'Scientific Computing with Python',
            provider: 'freeCodeCamp',
            weeks: 8,
            lang: 'en',
            url: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/',
            level: 'intermediate',
            certificate: true,
          },
        ],
      },
    ],
  },
]

// 3. Stagnant / Upskilling Pathways
export const stagnantPathways: PathwayOption[] = [
  {
    type: 'Safe',
    title: 'Internal Promotion & Band Elevation Sprint',
    target_role: 'Senior Technical Lead / AI Operations Lead',
    estimated_months: 2.5,
    target_salary_lpa: 10.5,
    difficulty: 'Medium',
    description: 'Break free from ticket maintenance by building 1 high-visibility internal automation tool that deflects 25% manual overhead.',
    roadmap: [
      {
        week_range: 'Weeks 1-4',
        title: 'Support Automation & Bot Architecture',
        description: 'Build automated FastAPI webhook triage with NLP ticket routing and resolution scripts.',
        skills_covered: ['Python 3.12', 'FastAPI', 'Automation Webhooks'],
        courses: [
          {
            id: 201,
            title: 'Python for Data Science (IIT Madras)',
            provider: 'SWAYAM',
            weeks: 8,
            lang: 'en',
            url: 'https://swayam.gov.in/nd2_noc20_cs56',
            level: 'intermediate',
            certificate: true,
          },
        ],
      },
      {
        week_range: 'Weeks 5-8',
        title: 'Internal Knowledge-Base Vector Search',
        description: 'Implement semantic FAQ search with Vector DBs to accelerate team resolution speeds by 40%.',
        skills_covered: ['ChromaDB', 'Embeddings', 'LangChain'],
        courses: [
          {
            id: 202,
            title: 'Back End Development and APIs',
            provider: 'freeCodeCamp',
            weeks: 6,
            lang: 'en',
            url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/',
            level: 'intermediate',
            certificate: true,
          },
        ],
      },
      {
        week_range: 'Weeks 9-10',
        title: 'ROI Documentation & Manager Appraisal Case',
        description: 'Package metrics (hours saved, deflection %) into an executive deck for 30%+ appraisal pitch.',
        skills_covered: ['Business Case Metrics', 'Executive Presentation'],
        courses: [
          {
            id: 203,
            title: 'Effective Speaking & Technical Presentation (IIT Roorkee)',
            provider: 'SWAYAM',
            weeks: 4,
            lang: 'en',
            url: 'https://swayam.gov.in/nd2_noc20_hs22',
            level: 'beginner',
            certificate: true,
          },
        ],
      },
    ],
  },
  {
    type: 'Stretch',
    title: 'High-Hike Lateral Leap: Cloud & AI Automation Lead',
    target_role: 'Cloud & AI Automation Engineer (Product / GCCs)',
    estimated_months: 3.5,
    target_salary_lpa: 16.5,
    difficulty: 'High',
    description: 'Exit internal salary bands by jumping to a modernized product firm with verifiable GenAI & cloud proof-of-work.',
    roadmap: [
      {
        week_range: 'Weeks 1-4',
        title: 'Modern Python Stack & Docker Microservices',
        description: 'Upgrade legacy support habits into production API engineering with clean Dockerfiles.',
        skills_covered: ['FastAPI', 'Docker', 'PostgreSQL pgvector'],
        courses: [
          {
            id: 204,
            title: 'Back End Development and APIs',
            provider: 'freeCodeCamp',
            weeks: 8,
            lang: 'en',
            url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/',
            level: 'intermediate',
            certificate: true,
          },
        ],
      },
      {
        week_range: 'Weeks 5-10',
        title: 'RAG Systems, Agentic Workflows & Multi-LLM Routing',
        description: 'Build enterprise-grade AI chatbot pipelines with retrieval evaluation & latency caching.',
        skills_covered: ['LangChain', 'LlamaIndex', 'RAG Evaluation'],
        courses: [
          {
            id: 205,
            title: 'Natural Language Processing (IIT Bombay)',
            provider: 'NPTEL',
            weeks: 6,
            lang: 'en',
            url: 'https://nptel.ac.in/courses/106101247',
            level: 'intermediate',
            certificate: true,
          },
        ],
      },
      {
        week_range: 'Weeks 11-14',
        title: 'AWS Cloud Deployment & System Observability',
        description: 'Deploy on AWS ECS with Prometheus metrics, Grafana dashboards, and CI/CD automation.',
        skills_covered: ['AWS Cloud', 'Prometheus / Grafana', 'CI/CD'],
        courses: [
          {
            id: 206,
            title: 'Cloud Computing & Virtualization (IIT Kharagpur)',
            provider: 'NPTEL',
            weeks: 6,
            lang: 'hi',
            url: 'https://nptel.ac.in/courses/106105167',
            level: 'intermediate',
            certificate: true,
          },
        ],
      },
    ],
  },
  {
    type: 'Pivot',
    title: 'Cross-Function Switch: Site Reliability & SRE Engineer',
    target_role: 'SRE / Cloud Operations Specialist',
    estimated_months: 3,
    target_salary_lpa: 14.0,
    difficulty: 'Medium',
    description: 'Transform support troubleshooting experience into high-paying Site Reliability Engineering.',
    roadmap: [
      {
        week_range: 'Weeks 1-6',
        title: 'Linux Deep-Dive, Shell Scripting & Docker',
        description: 'Kernel tuning, systemd, bash automation, and multi-container Docker compose.',
        skills_covered: ['Linux Systems', 'Bash', 'Docker'],
        courses: [
          {
            id: 207,
            title: 'Cloud Computing & SaaS Architectures',
            provider: 'SWAYAM',
            weeks: 8,
            lang: 'en',
            url: 'https://swayam.gov.in/nd1_noc20_cs68',
            level: 'beginner',
            certificate: true,
          },
        ],
      },
      {
        week_range: 'Weeks 7-12',
        title: 'Kubernetes Orchestration & Incident Automation',
        description: 'Deploy k8s clusters, manage config maps, and automate incident response runbooks.',
        skills_covered: ['Kubernetes', 'Terraform', 'SRE Practices'],
        courses: [
          {
            id: 208,
            title: 'Back End Development and APIs',
            provider: 'freeCodeCamp',
            weeks: 8,
            lang: 'en',
            url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/',
            level: 'intermediate',
            certificate: true,
          },
        ],
      },
    ],
  },
]

// 4. Laid-Off / Urgent Transition Pathways
export const laidOffPathways: PathwayOption[] = [
  {
    type: 'Safe',
    title: 'Rapid Re-Entry: Immediate SWE Placement (4–6 Wks)',
    target_role: 'Full-Stack / Backend SWE (Immediate Joiner)',
    estimated_months: 1.5,
    target_salary_lpa: 14.0,
    difficulty: 'Low',
    description: 'Capitalize on 0-day notice period advantage to quickly land in top GCCs and tech firms with fast-track interviews.',
    roadmap: [
      {
        week_range: 'Weeks 1-2',
        title: 'Core Stack Refinement & Immediate Availability Pitch',
        description: 'Re-align core backend (Node/Java/Python) and optimize resume for ATS with 0-Day Notice priority tags.',
        skills_covered: ['Core Backend', 'System Troubleshooting', 'ATS Optimization'],
        courses: [
          {
            id: 301,
            title: 'Back End Development and APIs',
            provider: 'freeCodeCamp',
            weeks: 4,
            lang: 'en',
            url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/',
            level: 'intermediate',
            certificate: true,
          },
        ],
      },
      {
        week_range: 'Weeks 3-4',
        title: 'High-Velocity Referral Outreach & Mock Rounds',
        description: 'Target 15+ immediate-hiring recruiters across Bengaluru, Pune, and NCR with verified GitHub portfolio.',
        skills_covered: ['Interview Readiness', 'Live Coding Speed', 'Referral Outreach'],
        courses: [
          {
            id: 302,
            title: 'Data Structures and Algorithms (IIT Madras)',
            provider: 'NPTEL',
            weeks: 4,
            lang: 'en',
            url: 'https://nptel.ac.in/courses/106106145',
            level: 'intermediate',
            certificate: true,
          },
        ],
      },
      {
        week_range: 'Weeks 5-6',
        title: 'Multi-Offer Negotiation & Offer Closure',
        description: 'Leverage competing immediate joiner offers to secure 100% salary retention and sign-on bonus.',
        skills_covered: ['Offer Negotiation', 'Contract Evaluation'],
        courses: [
          {
            id: 303,
            title: 'IT-ITeS Associate Software Developer',
            provider: 'Skill India',
            weeks: 2,
            lang: 'hi',
            url: 'https://www.skillindiadigital.gov.in/courses/detail/5ef58e99-4d82-4fcf-85d0-4bf69c2d1b7b',
            level: 'beginner',
            certificate: true,
          },
        ],
      },
    ],
  },
  {
    type: 'Stretch',
    title: 'High-Growth Leap: Senior Distributed Systems Architect',
    target_role: 'Senior Cloud & Systems Architect',
    estimated_months: 2.5,
    target_salary_lpa: 22.0,
    difficulty: 'High',
    description: 'Turn an unexpected transition into a compensation upgrade by proving high-scale distributed systems and microservices expertise.',
    roadmap: [
      {
        week_range: 'Weeks 1-4',
        title: 'Distributed System Design & Microservice Scalability',
        description: 'Master rate limiting, cache stampede prevention, Kafka pub-sub, and database sharding.',
        skills_covered: ['Kafka', 'Redis Caching', 'System Design (HLD/LLD)'],
        courses: [
          {
            id: 304,
            title: 'Back End Development and APIs',
            provider: 'freeCodeCamp',
            weeks: 6,
            lang: 'en',
            url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/',
            level: 'advanced',
            certificate: true,
          },
        ],
      },
      {
        week_range: 'Weeks 5-8',
        title: 'AWS Cloud Infrastructure & Kubernetes at Scale',
        description: 'Deploy resilient multi-region architectures with Terraform and automated failover monitoring.',
        skills_covered: ['AWS EKS', 'Terraform', 'Observability (Prometheus)'],
        courses: [
          {
            id: 305,
            title: 'Cloud Computing & Virtualization (IIT Kharagpur)',
            provider: 'NPTEL',
            weeks: 8,
            lang: 'en',
            url: 'https://nptel.ac.in/courses/106105167',
            level: 'intermediate',
            certificate: true,
          },
        ],
      },
    ],
  },
  {
    type: 'Pivot',
    title: 'Contract-to-Permanent Fast Track: FinTech Platform Lead',
    target_role: 'FinTech Platform Specialist',
    estimated_months: 2,
    target_salary_lpa: 17.5,
    difficulty: 'Medium',
    description: 'Quickly onboard as an elite contract specialist in US/UK GCCs with clear 6-month full-time absorption terms.',
    roadmap: [
      {
        week_range: 'Weeks 1-4',
        title: 'Payment Gateways, Idempotency & Financial Security',
        description: 'Build zero-loss webhook handlers, PCI-DSS compliance concepts, and double-entry ledgers.',
        skills_covered: ['Fintech APIs', 'Data Security', 'PostgreSQL ACID'],
        courses: [
          {
            id: 306,
            title: 'Cloud Computing & SaaS Architectures',
            provider: 'SWAYAM',
            weeks: 6,
            lang: 'en',
            url: 'https://swayam.gov.in/nd1_noc20_cs68',
            level: 'intermediate',
            certificate: true,
          },
        ],
      },
      {
        week_range: 'Weeks 5-8',
        title: 'Enterprise Onboarding & Performance Showcasing',
        description: 'Deliver early sprint velocity to convert contract into permanent leadership band.',
        skills_covered: ['Enterprise Delivery', 'Sprint Leadership'],
        courses: [
          {
            id: 307,
            title: 'Agile Software Development (IIT Roorkee)',
            provider: 'SWAYAM',
            weeks: 4,
            lang: 'hi',
            url: 'https://swayam.gov.in/nd2_noc21_mg57',
            level: 'beginner',
            certificate: true,
          },
        ],
      },
    ],
  },
]

// 5. Gig / Freelance Transition Pathways
export const gigPathways: PathwayOption[] = [
  {
    type: 'Safe',
    title: 'Freelancer-to-Fulltime: Enterprise Full-Stack SWE',
    target_role: 'Senior Full-Stack Engineer (Enterprise)',
    estimated_months: 2.5,
    target_salary_lpa: 14.5,
    difficulty: 'Medium',
    description: 'Transform informal gig portfolios into rigorous enterprise codebases with testing suites, CI/CD, and clean architecture.',
    roadmap: [
      {
        week_range: 'Weeks 1-4',
        title: 'Enterprise Code Standards & Unit/Integration Testing',
        description: 'Upgrade freelance habits with Jest/PyTest, TypeScript strictness, and clean design patterns.',
        skills_covered: ['TypeScript', 'Testing (Jest/Pytest)', 'Clean Architecture'],
        courses: [
          {
            id: 401,
            title: 'Software Testing & Automation (IIT Kharagpur)',
            provider: 'NPTEL',
            weeks: 8,
            lang: 'en',
            url: 'https://nptel.ac.in/courses/106105150',
            level: 'intermediate',
            certificate: true,
          },
        ],
      },
      {
        week_range: 'Weeks 5-8',
        title: 'CI/CD Automation & Team Collaboration Workflows',
        description: 'Master agile standups, Jira story estimation, GitHub Actions, and production deployment checklists.',
        skills_covered: ['GitHub Actions', 'Docker', 'Agile & Jira'],
        courses: [
          {
            id: 402,
            title: 'Back End Development and APIs',
            provider: 'freeCodeCamp',
            weeks: 6,
            lang: 'en',
            url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/',
            level: 'beginner',
            certificate: true,
          },
        ],
      },
      {
        week_range: 'Weeks 9-10',
        title: 'Enterprise Portfolio Packaging & Salary Alignment',
        description: 'Package past client deliverables as verified case studies and negotiate full-time benefits & PF.',
        skills_covered: ['Case Studies', 'Full-Time Compensation'],
        courses: [
          {
            id: 403,
            title: 'Effective Speaking & Technical Presentation (IIT Roorkee)',
            provider: 'SWAYAM',
            weeks: 4,
            lang: 'hi',
            url: 'https://swayam.gov.in/nd2_noc20_hs22',
            level: 'beginner',
            certificate: true,
          },
        ],
      },
    ],
  },
  {
    type: 'Stretch',
    title: 'High-Ticket Transition: Specialized AI Solutions Consultant',
    target_role: 'GenAI Solutions Consultant & Tech Lead',
    estimated_months: 3.5,
    target_salary_lpa: 20.0,
    difficulty: 'High',
    description: 'Leverage independent client handling experience to lead AI integration projects for global enterprises.',
    roadmap: [
      {
        week_range: 'Weeks 1-6',
        title: 'Enterprise RAG, Vector Search & Agentic Workflows',
        description: 'Build enterprise-grade LLM applications with LangChain, LangSmith observability, and ChromaDB/Pinecone.',
        skills_covered: ['LangChain', 'Agentic Workflows', 'Vector Databases'],
        courses: [
          {
            id: 404,
            title: 'Natural Language Processing (IIT Bombay)',
            provider: 'NPTEL',
            weeks: 6,
            lang: 'en',
            url: 'https://nptel.ac.in/courses/106101247',
            level: 'intermediate',
            certificate: true,
          },
        ],
      },
      {
        week_range: 'Weeks 7-14',
        title: 'Multi-Tenant SaaS Deployment on AWS Cloud',
        description: 'Deploy scalable multi-tenant architectures with Stripe billing, JWT security, and Docker Compose.',
        skills_covered: ['AWS ECS', 'Multi-Tenancy', 'FastAPI'],
        courses: [
          {
            id: 405,
            title: 'Cloud Computing & SaaS Architectures',
            provider: 'SWAYAM',
            weeks: 8,
            lang: 'en',
            url: 'https://swayam.gov.in/nd1_noc20_cs68',
            level: 'intermediate',
            certificate: true,
          },
        ],
      },
    ],
  },
  {
    type: 'Pivot',
    title: 'Global Remote Engineer: High-Currency Retainers',
    target_role: 'International Remote SWE',
    estimated_months: 3,
    target_salary_lpa: 18.0,
    difficulty: 'Medium',
    description: 'Target US/European remote startups offering async flexibility and global market parity pay.',
    roadmap: [
      {
        week_range: 'Weeks 1-6',
        title: 'Async Communication, Open Source PRs & Deep Work',
        description: 'Contribute to top open-source repositories and master async RFC technical documentation.',
        skills_covered: ['Open Source PRs', 'Technical Writing', 'Modern Next.js / Python'],
        courses: [
          {
            id: 406,
            title: 'JavaScript Algorithms and Data Structures',
            provider: 'freeCodeCamp',
            weeks: 6,
            lang: 'en',
            url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
            level: 'intermediate',
            certificate: true,
          },
        ],
      },
      {
        week_range: 'Weeks 7-12',
        title: 'Global Remote Platforms & Direct Outreach',
        description: 'Optimize Wellfound, Remotive, and Toptal profiles with live production URLs.',
        skills_covered: ['Global Platforms', 'Asynchronous Collaboration'],
        courses: [
          {
            id: 407,
            title: 'IT-ITeS Associate Software Developer',
            provider: 'Skill India',
            weeks: 4,
            lang: 'en',
            url: 'https://www.skillindiadigital.gov.in/courses/detail/5ef58e99-4d82-4fcf-85d0-4bf69c2d1b7b',
            level: 'beginner',
            certificate: true,
          },
        ],
      },
    ],
  },
]

// 6. Dynamic Helper
export function getRolePathways(userType: string): PathwayOption[] {
  if (userType === 'student') return studentPathways
  if (userType === 'stagnant') return stagnantPathways
  if (userType === 'laid_off') return laidOffPathways
  if (userType === 'gig') return gigPathways
  return returnerPathways
}

export const defaultPathways: PathwayOption[] = returnerPathways

// 7. Role-Specific 30-Day Sprint Plans
export const RETURNER_30_DAY_PLAN: SprintWeekPlan[] = [
  {
    week: 1,
    title: 'Week 1 — Spring Boot 3 Refresh & Modern Java',
    focus: 'Core syntax modernization (Java 17/21), Spring Initializr, Dependency Injection, Actuator & Logging.',
    hours: 8,
    tasks: [
      { id: 'w1-1', text: 'Refresh Java 17 records, pattern matching & virtual threads', type: 'learn' },
      { id: 'w1-2', text: 'Build a standalone CRUD service using Spring Boot 3 and JPA', type: 'practice' },
      { id: 'w1-3', text: 'Configure custom health checks with Spring Actuator', type: 'practice' },
      { id: 'w1-4', text: 'Prepare response: "How does Spring Boot 3 simplify configuration compared to older XML/Java config?"', type: 'interview' },
    ],
    recommendedCourses: [
      { title: 'Spring Boot 3 Fundamentals', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/', free: true },
      { title: 'Modern Java In Practice', provider: 'NPTEL', url: 'https://nptel.ac.in/courses/106105191', free: true },
    ],
    mockInterviewQ: 'Can you explain the inversion of control container lifecycle in modern Spring Boot?',
  },
  {
    week: 2,
    title: 'Week 2 — REST APIs, PostgreSQL & Microservice Basics',
    focus: 'OpenAPI/Swagger docs, JWT security authentication, connection pooling, and multi-service communication.',
    hours: 10,
    tasks: [
      { id: 'w2-1', text: 'Design RESTful contracts with OpenAPI 3.0 documentation', type: 'learn' },
      { id: 'w2-2', text: 'Implement JWT authentication and role-based access control', type: 'practice' },
      { id: 'w2-3', text: 'Setup Flyway migrations for PostgreSQL schema evolution', type: 'practice' },
      { id: 'w2-4', text: 'Review REST idempotency & error handling standard HTTP status codes', type: 'interview' },
    ],
    recommendedCourses: [
      { title: 'Building RESTful Web Services', provider: 'SWAYAM', url: 'https://swayam.gov.in/nd1_noc20_cs68', free: true },
      { title: 'Database Indexing & Optimization', provider: 'NPTEL', url: 'https://nptel.ac.in/courses/106105175', free: true },
    ],
    mockInterviewQ: 'How do you handle distributed transactions across microservices?',
  },
  {
    week: 3,
    title: 'Week 3 — Docker, Cloud Deployment & CI/CD',
    focus: 'Containerizing backend services, multi-stage Dockerfiles, GitHub Actions workflow, and AWS deployment.',
    hours: 10,
    tasks: [
      { id: 'w3-1', text: 'Write production-grade multi-stage Dockerfile for Spring app', type: 'practice' },
      { id: 'w3-2', text: 'Deploy container to AWS EC2 or App Runner with environment variables', type: 'project' },
      { id: 'w3-3', text: 'Setup automated CI pipeline in GitHub Actions for build & test', type: 'practice' },
      { id: 'w3-4', text: 'Prepare explanation of container lifecycle and networking in interviews', type: 'interview' },
    ],
    recommendedCourses: [
      { title: 'Docker for Java Developers', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/', free: true },
      { title: 'Cloud Computing Fundamentals', provider: 'NPTEL', url: 'https://nptel.ac.in/courses/106105167', free: true },
    ],
    mockInterviewQ: 'What are multi-stage Docker builds and why are they critical for JVM images?',
  },
  {
    week: 4,
    title: 'Week 4 — Capstone Portfolio Project + Live Interview Prep',
    focus: 'Full-stack integration, live GitHub repository with README, and confident career gap framing.',
    hours: 12,
    tasks: [
      { id: 'w4-1', text: 'Build & deploy Capstone: AI-augmented Order Management / Catalog Service', type: 'project' },
      { id: 'w4-2', text: 'Integrate OpenAI / Gemini API for semantic search or summarization', type: 'project' },
      { id: 'w4-3', text: 'Record 2-minute Loom demo video showing running system & code', type: 'project' },
      { id: 'w4-4', text: 'Complete 3 mock technical interviews using the Resume Gap Rebuilder script', type: 'interview' },
    ],
    recommendedCourses: [
      { title: 'AI Engineering for Developers', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/', free: true },
      { title: 'Technical Interview Mastery', provider: 'SWAYAM', url: 'https://swayam.gov.in/nd2_noc20_hs22', free: true },
    ],
    mockInterviewQ: 'Walk me through your recent project architecture and how you integrated GenAI features.',
  },
]

export const STUDENT_30_DAY_PLAN: SprintWeekPlan[] = [
  {
    week: 1,
    title: 'Week 1 — Campus DSA Patterns & Clean GitHub Setup',
    focus: 'Two-pointer, sliding window, binary tree traversals, Git branch workflows, and clean README portfolio setup.',
    hours: 8,
    tasks: [
      { id: 'st-w1-1', text: 'Solve 15 high-frequency placement DSA patterns (Sliding Window & HashMaps)', type: 'practice' },
      { id: 'st-w1-2', text: 'Setup public GitHub profile with professional bio, tech stack badges & pinned repos', type: 'practice' },
      { id: 'st-w1-3', text: 'Practice Git branching: feature branch, PR creation, and merge conflict resolution', type: 'learn' },
      { id: 'st-w1-4', text: 'Mock Q: "How would you optimize search over 10M records using indexing vs binary search?"', type: 'interview' },
    ],
    recommendedCourses: [
      { title: 'Data Structures for Campus Drives', provider: 'NPTEL', url: 'https://nptel.ac.in/courses/106106145', free: true },
      { title: 'Git & GitHub Bootcamp', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', free: true },
    ],
    mockInterviewQ: 'Can you explain the time complexity trade-offs between QuickSort and MergeSort with large dataset memory constraints?',
  },
  {
    week: 2,
    title: 'Week 2 — Production REST API & Database Indexing',
    focus: 'FastAPI / Express / Spring Boot API design, PostgreSQL foreign keys, indexing, and JWT security tokens.',
    hours: 10,
    tasks: [
      { id: 'st-w2-1', text: 'Build modular REST API with CRUD endpoints, request validation & error middleware', type: 'practice' },
      { id: 'st-w2-2', text: 'Design PostgreSQL schema with indexed lookup columns and test EXPLAIN ANALYZE queries', type: 'practice' },
      { id: 'st-w2-3', text: 'Implement JWT token authentication & protected route guards', type: 'learn' },
      { id: 'st-w2-4', text: 'Mock Q: "Explain the difference between authentication and authorization with JWT tokens."', type: 'interview' },
    ],
    recommendedCourses: [
      { title: 'RESTful API Design & Best Practices', provider: 'SWAYAM', url: 'https://swayam.gov.in/nd2_noc20_cs56', free: true },
      { title: 'SQL Indexing & Database Tuning', provider: 'NPTEL', url: 'https://nptel.ac.in/courses/106105175', free: true },
    ],
    mockInterviewQ: 'Why should you never store plain JWT tokens in localStorage without CSRF/XSS mitigations?',
  },
  {
    week: 3,
    title: 'Week 3 — Containerization & Cloud Deployment (Docker + AWS)',
    focus: 'Multi-stage Dockerfiles, Docker Compose local networking, deploying on AWS Free Tier / Render with CI/CD.',
    hours: 10,
    tasks: [
      { id: 'st-w3-1', text: 'Write production multi-stage Dockerfile to minimize image size (<120MB)', type: 'practice' },
      { id: 'st-w3-2', text: 'Write docker-compose.yml orchestrating Frontend, Backend API & PostgreSQL database', type: 'practice' },
      { id: 'st-w3-3', text: 'Deploy containerized web app to AWS App Runner / Render with automated GitHub Actions CI/CD', type: 'project' },
      { id: 'st-w3-4', text: 'Mock Q: "Why do product companies insist on containerization over raw VM installations?"', type: 'interview' },
    ],
    recommendedCourses: [
      { title: 'Docker for Beginners', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/', free: true },
      { title: 'AWS Cloud Foundations', provider: 'NPTEL', url: 'https://nptel.ac.in/courses/106105167', free: true },
    ],
    mockInterviewQ: 'How do Docker bridge networks isolate container traffic and resolve service names locally?',
  },
  {
    week: 4,
    title: 'Week 4 — Live Portfolio Capstone & Senior Mock Interviews',
    focus: 'End-to-end deployed capstone with live URL, 2-minute Loom video demo, and 1-on-1 placed senior feedback.',
    hours: 12,
    tasks: [
      { id: 'st-w4-1', text: 'Finalize Capstone project: Add live demo URL, architecture diagram & Swagger API docs in README', type: 'project' },
      { id: 'st-w4-2', text: 'Record 2-minute Loom demo walking through system design, features & performance', type: 'project' },
      { id: 'st-w4-3', text: 'Book 1-on-1 Free Guidance session with a placed senior for resume audit & referral review', type: 'interview' },
      { id: 'st-w4-4', text: 'Complete 3 mock placement interviews using the STAR method for behavioral & technical rounds', type: 'interview' },
    ],
    recommendedCourses: [
      { title: 'Cracking the Product Placement Interview', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', free: true },
      { title: 'Professional Communication for Engineers', provider: 'SWAYAM', url: 'https://swayam.gov.in/nd2_noc20_hs22', free: true },
    ],
    mockInterviewQ: 'Walk me through the hardest bug you faced in your project and how you profiled the root cause.',
  },
]

export const STAGNANT_30_DAY_PLAN: SprintWeekPlan[] = [
  {
    week: 1,
    title: 'Week 1 — Stagnation Audit & Automated Bot PoC',
    focus: 'Identify repetitive daily support tasks, setup Python FastAPI automation script to deflect 15% ticket load.',
    hours: 8,
    tasks: [
      { id: 'sg-w1-1', text: 'Audit past 90 days of support tickets to categorize top 3 repetitive query patterns', type: 'learn' },
      { id: 'sg-w1-2', text: 'Build standalone Python FastAPI webhook script automating resolution for top 1 query pattern', type: 'practice' },
      { id: 'sg-w1-3', text: 'Record time savings metric (e.g. 6.5 hours/week saved across team)', type: 'practice' },
      { id: 'sg-w1-4', text: 'Mock Q: "How do you identify automation opportunities in legacy technical operations?"', type: 'interview' },
    ],
    recommendedCourses: [
      { title: 'Process Automation with Python', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/', free: true },
      { title: 'FastAPI Backend Architecture', provider: 'SWAYAM', url: 'https://swayam.gov.in/nd2_noc20_cs56', free: true },
    ],
    mockInterviewQ: 'Can you give an example of an operational process you automated that directly saved engineering hours?',
  },
  {
    week: 2,
    title: 'Week 2 — Internal Knowledge-Base Vector Search (RAG)',
    focus: 'Connect company/domain documentation with ChromaDB and Gemini/OpenAI API for instant semantic triage.',
    hours: 10,
    tasks: [
      { id: 'sg-w2-1', text: 'Parse internal SOPs/runbooks and generate vector embeddings with ChromaDB', type: 'practice' },
      { id: 'sg-w2-2', text: 'Build semantic search API returning verified troubleshooting steps in <400ms', type: 'project' },
      { id: 'sg-w2-3', text: 'Add telemetry tracking query accuracy and fallback deflection rates', type: 'practice' },
      { id: 'sg-w2-4', text: 'Mock Q: "What are vector embeddings and how do they differ from simple keyword SQL search?"', type: 'interview' },
    ],
    recommendedCourses: [
      { title: 'Natural Language Processing', provider: 'NPTEL', url: 'https://nptel.ac.in/courses/106101247', free: true },
      { title: 'Deep Learning with PyTorch', provider: 'NPTEL', url: 'https://nptel.ac.in/courses/106106211', free: true },
    ],
    mockInterviewQ: 'How do you handle hallucination and ensure strict retrieval bounding in enterprise internal search?',
  },
  {
    week: 3,
    title: 'Week 3 — Quantifiable ROI Case & Docker Deployment',
    focus: 'Containerize internal tool with Docker Compose, calculate annual financial savings for company.',
    hours: 10,
    tasks: [
      { id: 'sg-w3-1', text: 'Write multi-stage Dockerfile and deploy internal PoC to cloud test environment', type: 'practice' },
      { id: 'sg-w3-2', text: 'Calculate quantifiable impact: ₹4.2 Lakhs/year operational cost reduction for org', type: 'project' },
      { id: 'sg-w3-3', text: 'Create 5-slide Executive Pitch deck detailing architecture & measurable business ROI', type: 'project' },
      { id: 'sg-w3-4', text: 'Mock Q: "How do you justify moving from maintenance into an architectural leadership band?"', type: 'interview' },
    ],
    recommendedCourses: [
      { title: 'Docker for Engineers', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/', free: true },
      { title: 'Agile Software Development', provider: 'SWAYAM', url: 'https://swayam.gov.in/nd2_noc21_mg57', free: true },
    ],
    mockInterviewQ: 'Describe how you present technical debt and modern tooling ROI to non-technical business stakeholders.',
  },
  {
    week: 4,
    title: 'Week 4 — Appraisal Negotiation & Lateral Switch Loops',
    focus: 'Present internal case for 35%+ promotion hike or initiate fast-track lateral switch interviews.',
    hours: 12,
    tasks: [
      { id: 'sg-w4-1', text: 'Schedule 1:1 manager alignment session presenting live automation PoC and promotion proposal', type: 'interview' },
      { id: 'sg-w4-2', text: 'Update LinkedIn & resume showcasing "AI Automation & System Optimization Lead" metrics', type: 'practice' },
      { id: 'sg-w4-3', text: 'Apply to 8 target lateral openings offering ₹14 - ₹18 LPA with verified live PoC links', type: 'interview' },
      { id: 'sg-w4-4', text: 'Execute salary negotiation script aiming for +45% market parity compensation', type: 'interview' },
    ],
    recommendedCourses: [
      { title: 'Strategic Career Negotiation for Techies', provider: 'SWAYAM', url: 'https://swayam.gov.in/nd2_noc20_hs22', free: true },
      { title: 'Cloud Computing & Distributed Systems', provider: 'NPTEL', url: 'https://nptel.ac.in/courses/106105167', free: true },
    ],
    mockInterviewQ: 'Why are you looking to switch after 3+ years in your current organization?',
  },
]

export const LAID_OFF_30_DAY_PLAN: SprintWeekPlan[] = [
  {
    week: 1,
    title: 'Week 1 — Emergency Profile Revamp & 0-Day Notice Activation',
    focus: 'Immediate notice badge on LinkedIn/Naukri, ATS resume audit with quantifiable impact, and target company shortlist.',
    hours: 10,
    tasks: [
      { id: 'lo-w1-1', text: 'Update LinkedIn headline with "Immediately Available • Ex-[Company] Fullstack Lead"', type: 'practice' },
      { id: 'lo-w1-2', text: 'Rewrite resume with metric-driven bullets: reduced latency 35%, scaled to 1M users', type: 'practice' },
      { id: 'lo-w1-3', text: 'Create target hit list of 25 companies currently hiring immediate joiners in India', type: 'learn' },
      { id: 'lo-w1-4', text: 'Mock Q: "Can you explain the context of your recent transition confidently and positively?"', type: 'interview' },
    ],
    recommendedCourses: [
      { title: 'High-Impact Resume Crafting for Senior Engineers', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/', free: true },
      { title: 'Associate Software Developer Certification', provider: 'Skill India', url: 'https://www.skillindiadigital.gov.in/courses/detail/5ef58e99-4d82-4fcf-85d0-4bf69c2d1b7b', free: true },
    ],
    mockInterviewQ: 'How do you handle sudden team restructuring and what lessons did you carry forward into your next role?',
  },
  {
    week: 2,
    title: 'Week 2 — High-Velocity Referral Outreach & Technical Drills',
    focus: 'Direct reach-outs to hiring managers/alumni, daily timed live coding and system design refresher.',
    hours: 12,
    tasks: [
      { id: 'lo-w2-1', text: 'Send 20 personalized LinkedIn messages to engineering managers with portfolio links', type: 'practice' },
      { id: 'lo-w2-2', text: 'Complete 10 high-frequency medium LeetCode/DSA problems in under 30 mins each', type: 'practice' },
      { id: 'lo-w2-3', text: 'Review High-Level System Design (HLD) patterns: caching, message queues, database indexing', type: 'learn' },
      { id: 'lo-w2-4', text: 'Mock Q: "Design an idempotency key mechanism for a payment service under high concurrency."', type: 'interview' },
    ],
    recommendedCourses: [
      { title: 'Cloud Computing & SaaS Architectures', provider: 'SWAYAM', url: 'https://swayam.gov.in/nd1_noc20_cs68', free: true },
      { title: 'Data Structures & Algorithms in Python', provider: 'NPTEL', url: 'https://nptel.ac.in/courses/106106145', free: true },
    ],
    mockInterviewQ: 'How do you prevent cache stampede during sudden traffic spikes in distributed applications?',
  },
  {
    week: 3,
    title: 'Week 3 — First & Second Round Interview Blitz',
    focus: 'Execute 4–6 first-round technical screens, live coding sessions, and architecture discussions.',
    hours: 12,
    tasks: [
      { id: 'lo-w3-1', text: 'Attend 5+ first-round screening calls and live coding technical evaluations', type: 'interview' },
      { id: 'lo-w3-2', text: 'Demonstrate live GitHub repository highlighting production microservices and clean tests', type: 'project' },
      { id: 'lo-w3-3', text: 'Perform post-interview debriefs: catalog unexpected questions and refine answers', type: 'learn' },
      { id: 'lo-w3-4', text: 'Mock Q: "Explain a trade-off where you chose eventual consistency over strict ACID transactions."', type: 'interview' },
    ],
    recommendedCourses: [
      { title: 'Distributed Systems & Microservices', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/', free: true },
      { title: 'Effective Speaking & Technical Presentation', provider: 'SWAYAM', url: 'https://swayam.gov.in/nd2_noc20_hs22', free: true },
    ],
    mockInterviewQ: 'Can you describe a production incident you resolved under tight time constraints and how you led post-mortem RCA?',
  },
  {
    week: 4,
    title: 'Week 4 — Multi-Offer Negotiation & Final Joining',
    focus: 'Leverage multiple offers for compensation parity, review contract terms, and finalize joining date.',
    hours: 10,
    tasks: [
      { id: 'lo-w4-1', text: 'Evaluate 2+ offer letters comparing Fixed CTC, Performance Bonus, and ESOP vesting', type: 'practice' },
      { id: 'lo-w4-2', text: 'Execute salary negotiation script securing immediate joiner sign-on incentive', type: 'interview' },
      { id: 'lo-w4-3', text: 'Sign offer letter and initiate 30-day onboarding technical ramp-up checklist', type: 'project' },
      { id: 'lo-w4-4', text: 'Celebrate career recovery and post milestone on PunarSetu community', type: 'practice' },
    ],
    recommendedCourses: [
      { title: 'Executive Communication & Negotiation', provider: 'SWAYAM', url: 'https://swayam.gov.in/nd2_noc20_hs22', free: true },
      { title: 'Software Developer Career Foundations', provider: 'Skill India', url: 'https://www.skillindiadigital.gov.in/courses/detail/5ef58e99-4d82-4fcf-85d0-4bf69c2d1b7b', free: true },
    ],
    mockInterviewQ: 'What are your top priorities for your first 30 days once you join our engineering team?',
  },
]

export const GIG_30_DAY_PLAN: SprintWeekPlan[] = [
  {
    week: 1,
    title: 'Week 1 — Freelance Portfolio Audit & Code Modernization',
    focus: 'Audit client repos, convert informal scripts into TypeScript/Python clean architecture with unit tests.',
    hours: 8,
    tasks: [
      { id: 'gg-w1-1', text: 'Refactor 2 best freelance client projects into clean modular GitHub repositories', type: 'practice' },
      { id: 'gg-w1-2', text: 'Add 80%+ test coverage with Jest / PyTest and ESLint / Ruff formatting rules', type: 'practice' },
      { id: 'gg-w1-3', text: 'Write professional README documentation with architecture diagrams and API docs', type: 'learn' },
      { id: 'gg-w1-4', text: 'Mock Q: "How do you transition from single-person freelance delivery to enterprise team standards?"', type: 'interview' },
    ],
    recommendedCourses: [
      { title: 'Enterprise Software Standards & Testing', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', free: true },
      { title: 'Programming in Java (IIT Kharagpur)', provider: 'NPTEL', url: 'https://nptel.ac.in/courses/106105191', free: true },
    ],
    mockInterviewQ: 'How do you ensure maintainability and testability when writing code intended for large engineering teams?',
  },
  {
    week: 2,
    title: 'Week 2 — Enterprise CI/CD, Containerization & Cloud',
    focus: 'Build multi-stage Dockerfiles, GitHub Actions automated test & deploy pipelines, and AWS App Runner hosting.',
    hours: 10,
    tasks: [
      { id: 'gg-w2-1', text: 'Containerize full-stack application with Docker Compose and PostgreSQL database', type: 'practice' },
      { id: 'gg-w2-2', text: 'Setup automated GitHub Actions workflow running unit tests & build validation on every PR', type: 'project' },
      { id: 'gg-w2-3', text: 'Deploy live demo to AWS / Render and configure custom SSL domain', type: 'practice' },
      { id: 'gg-w2-4', text: 'Mock Q: "Explain how CI/CD pipelines prevent regression in high-velocity agile sprints."', type: 'interview' },
    ],
    recommendedCourses: [
      { title: 'DevOps & Continuous Integration with GitHub Actions', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/', free: true },
      { title: 'Cloud Infrastructure for SaaS Applications', provider: 'SWAYAM', url: 'https://swayam.gov.in/nd1_noc20_cs68', free: true },
    ],
    mockInterviewQ: 'How do you configure secrets management and environment isolation between Staging and Production?',
  },
  {
    week: 3,
    title: 'Week 3 — Enterprise Case Studies & System Architecture',
    focus: 'Package freelance client outcomes into corporate Case Studies (Problem, Solution, Scale, Metrics).',
    hours: 10,
    tasks: [
      { id: 'gg-w3-1', text: 'Document 2 case studies: "Delivered 35% checkout conversion increase for e-commerce client"', type: 'project' },
      { id: 'gg-w3-2', text: 'Prepare System Design presentation on scalable multi-tenant SaaS architecture', type: 'learn' },
      { id: 'gg-w3-3', text: 'Practice agile collaboration behavioral stories: sprint planning, code review feedback', type: 'interview' },
      { id: 'gg-w3-4', text: 'Mock Q: "Walk me through how you handled difficult client requirements and scope creep."', type: 'interview' },
    ],
    recommendedCourses: [
      { title: 'Agile Software Development & Jira Workflows', provider: 'SWAYAM', url: 'https://swayam.gov.in/nd2_noc21_mg57', free: true },
      { title: 'Cloud Computing & Virtualization', provider: 'NPTEL', url: 'https://nptel.ac.in/courses/106105167', free: true },
    ],
    mockInterviewQ: 'How do you handle asynchronous communication and code review feedback when collaborating with global remote teams?',
  },
  {
    week: 4,
    title: 'Week 4 — Full-Time Enterprise Pitch & Offer Conversion',
    focus: 'Apply to enterprise tech firms & high-growth startups for full-time senior positions with benefits & equity.',
    hours: 12,
    tasks: [
      { id: 'gg-w4-1', text: 'Apply to 12 target enterprise & SaaS companies for Full-Time SWE / Lead roles', type: 'interview' },
      { id: 'gg-w4-2', text: 'Showcase live client case studies & verified GitHub repos during hiring manager rounds', type: 'interview' },
      { id: 'gg-w4-3', text: 'Negotiate full-time CTC package (matching ₹14–20 LPA freelance earnings + PF + health cover)', type: 'interview' },
      { id: 'gg-w4-4', text: 'Finalize full-time employment agreement and transition ongoing gig retainers smoothly', type: 'practice' },
    ],
    recommendedCourses: [
      { title: 'Tech Career Negotiation for Freelancers', provider: 'SWAYAM', url: 'https://swayam.gov.in/nd2_noc20_hs22', free: true },
      { title: 'Enterprise Leadership & Communication', provider: 'SWAYAM', url: 'https://swayam.gov.in/nd2_noc20_hs22', free: true },
    ],
    mockInterviewQ: 'Why are you transitioning from freelancing to full-time enterprise engineering at this point in your career?',
  },
]

export function getRole30DayPlan(userType: string): SprintWeekPlan[] {
  if (userType === 'student') return STUDENT_30_DAY_PLAN
  if (userType === 'stagnant') return STAGNANT_30_DAY_PLAN
  if (userType === 'laid_off') return LAID_OFF_30_DAY_PLAN
  if (userType === 'gig') return GIG_30_DAY_PLAN
  return RETURNER_30_DAY_PLAN
}


