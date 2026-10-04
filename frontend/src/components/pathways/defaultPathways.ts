import type { PathwayOption } from '@/types'

export const defaultPathways: PathwayOption[] = [
  {
    type: 'Safe',
    title: 'Refresh & Strengthen: Modern Java Backend',
    target_role: 'Senior Java / Cloud Backend',
    estimated_months: 2,
    target_salary_lpa: 10.0,
    difficulty: 'Low',
    description: 'Re-validate core Java & Spring foundations with cloud deployment and clean testing.',
    roadmap: [
      {
        week_range: 'Weeks 1-4',
        title: 'Core Stack Refresh',
        description: 'Bridge version gaps and practice hands-on coding in modern environment.',
        skills_covered: ['Java 17', 'Spring Boot 3', 'Clean Architecture'],
        courses: [
          {
            id: 1,
            title: 'Java Programming',
            provider: 'NPTEL',
            weeks: 12,
            lang: 'en',
            url: 'https://nptel.ac.in',
            level: 'beginner',
            certificate: true,
          },
        ],
      },
    ],
  },
  {
    type: 'Stretch',
    title: 'High Growth Leap: GenAI Engineer',
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
            title: 'Python for Everybody',
            provider: 'SWAYAM',
            weeks: 12,
            lang: 'en',
            url: 'https://swayam.gov.in',
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
            title: 'Deep Learning Specialization',
            provider: 'freeCodeCamp',
            weeks: 16,
            lang: 'en',
            url: 'https://freecodecamp.org',
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
            title: 'Cloud Computing & DevOps',
            provider: 'Skill India',
            weeks: 6,
            lang: 'hi',
            url: 'https://skillindia.gov.in',
            level: 'beginner',
            certificate: true,
          },
        ],
      },
    ],
  },
  {
    type: 'Pivot',
    title: 'Cross-Domain Transition: DevOps & Cloud',
    target_role: 'DevOps / Platform Engineer',
    estimated_months: 3,
    target_salary_lpa: 14.0,
    difficulty: 'Medium',
    description: 'Leverage your backend intuition while switching into rapidly expanding infrastructure functions.',
    roadmap: [
      {
        week_range: 'Weeks 1-6',
        title: 'Docker, Kubernetes & Linux Admin',
        description: 'Learn container orchestration and cloud scripting.',
        skills_covered: ['Docker', 'Kubernetes', 'Linux'],
        courses: [
          {
            id: 5,
            title: 'DevOps Fundamentals',
            provider: 'Skill India',
            weeks: 6,
            lang: 'hi',
            url: 'https://skillindia.gov.in',
            level: 'beginner',
            certificate: true,
          },
        ],
      },
    ],
  },
]
