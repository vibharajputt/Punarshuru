import type { Profile, SkillGapResponse, PartialSkill, CategoryRadar } from '@/types'

// Benchmark required skills for industry target roles
export const BENCHMARK_ROLE_SKILLS: Record<string, string[]> = {
  'genai engineer': [
    'Python',
    'GenAI',
    'LangChain',
    'Vector Databases',
    'RAG',
    'Prompt Engineering',
    'Hugging Face',
  ],
  'automation qa / sdet': [
    'Selenium',
    'Playwright',
    'Python',
    'CI/CD',
    'JIRA',
    'Agile',
    'SQL',
  ],
  'ai chatbot trainer / product analyst': [
    'Customer Support',
    'CRM',
    'Zendesk',
    'Prompt Engineering',
    'Data Analysis',
    'Communication Skills',
  ],
  'logistics tech analyst': [
    'Operations',
    'Route Optimization',
    'SQL',
    'Excel',
    'Data Analysis',
    'Supply Chain',
  ],
  'senior python developer': [
    'Python',
    'FastAPI',
    'PostgreSQL',
    'Docker',
    'AWS',
    'REST APIs',
    'Microservices',
  ],
  'devops engineer': [
    'Docker',
    'Kubernetes',
    'Terraform',
    'AWS',
    'CI/CD',
    'Linux',
    'Prometheus',
  ],
  'software / ml engineer': [
    'Python',
    'Data Structures',
    'Algorithms',
    'SQL',
    'Git',
    'REST APIs',
    'Docker',
  ],
  'software engineer': [
    'Python',
    'Data Structures',
    'Algorithms',
    'SQL',
    'Git',
    'REST APIs',
    'Docker',
  ],
  'data analyst': [
    'SQL',
    'Python',
    'Power BI',
    'Excel',
    'Data Analysis',
    'Statistics',
  ],
  'full stack developer': [
    'React',
    'Node.js',
    'TypeScript',
    'MongoDB',
    'REST APIs',
    'Docker',
    'AWS',
  ],
}

// Canonical aliases for common skills
const SKILL_ALIASES: Record<string, string> = {
  py: 'Python',
  python3: 'Python',
  java8: 'Java',
  java11: 'Java',
  java17: 'Java',
  'sql basics': 'SQL',
  mysql: 'SQL',
  postgres: 'PostgreSQL',
  'rest api': 'REST APIs',
  'rest apis': 'REST APIs',
  github: 'Git',
  gitlab: 'Git',
  'manual qa': 'Manual Testing',
  'ms excel': 'Excel',
  'communication': 'Communication Skills',
  crm: 'CRM',
  zendesk: 'Zendesk',
  'support ops': 'Customer Support',
}

// Known transferrable/adjacent skill crossovers with deterministic similarity scores
const ADJACENT_SKILL_MAP: Array<{
  required: string
  source: string
  similarity: number
}> = [
  { required: 'Python', source: 'Java', similarity: 0.82 },
  { required: 'Python', source: 'C++', similarity: 0.8 },
  { required: 'Selenium', source: 'Manual QA', similarity: 0.78 },
  { required: 'Playwright', source: 'Manual QA', similarity: 0.75 },
  { required: 'SQL', source: 'Excel', similarity: 0.76 },
  { required: 'Data Analysis', source: 'Excel', similarity: 0.76 },
  { required: 'Prompt Engineering', source: 'Customer Support', similarity: 0.85 },
  { required: 'Supply Chain', source: 'Operations', similarity: 0.8 },
]

// Skill categorization for radar analysis
const SKILL_CATEGORIES: Record<string, string> = {
  Python: 'Programming',
  Java: 'Programming',
  'C++': 'Programming',
  JavaScript: 'Programming',
  TypeScript: 'Programming',
  'Data Structures': 'Programming',
  Algorithms: 'Programming',
  GenAI: 'AI/ML',
  LangChain: 'AI/ML',
  'Vector Databases': 'AI/ML',
  RAG: 'AI/ML',
  'Prompt Engineering': 'AI/ML',
  'Hugging Face': 'AI/ML',
  'Data Analysis': 'AI/ML',
  Docker: 'Cloud/DevOps',
  Kubernetes: 'Cloud/DevOps',
  'CI/CD': 'Cloud/DevOps',
  AWS: 'Cloud/DevOps',
  Terraform: 'Cloud/DevOps',
  Linux: 'Cloud/DevOps',
  SQL: 'Database',
  PostgreSQL: 'Database',
  MySQL: 'Database',
  MongoDB: 'Database',
  'REST APIs': 'Tools/QA',
  Git: 'Tools/QA',
  Selenium: 'Tools/QA',
  Playwright: 'Tools/QA',
  JIRA: 'Tools/QA',
  Agile: 'Tools/QA',
  'Customer Support': 'Domain/Ops',
  CRM: 'Domain/Ops',
  Zendesk: 'Domain/Ops',
  Operations: 'Domain/Ops',
  'Route Optimization': 'Domain/Ops',
  Excel: 'Domain/Ops',
  'Communication Skills': 'Domain/Ops',
}

// In-memory memoization cache
const skillGapCache = new Map<string, SkillGapResponse>()

export function getSkillGapCacheKey(
  userProfile: Profile | null | undefined,
  targetRole?: string | null
): string {
  const pId = userProfile?.id || userProfile?.name || 'anonymous'
  const pSkills = (userProfile?.skills_raw || []).slice().sort().join('|')
  const role = (targetRole || userProfile?.target_role || 'GenAI Engineer').trim().toLowerCase()
  return `${pId}::${role}::${pSkills}`
}

export function clearSkillGapCache(): void {
  skillGapCache.clear()
}

/**
 * Single Source of Truth for Skill Gap computation.
 * Pure, deterministic function memoized per user profile and target role.
 * Calling twice with identical inputs is guaranteed to return identical results.
 */
export function computeSkillGap(
  userProfile: Profile | null | undefined,
  targetRole?: string | null
): SkillGapResponse {
  const cacheKey = getSkillGapCacheKey(userProfile, targetRole)
  const cached = skillGapCache.get(cacheKey)
  if (cached) {
    return cached
  }

  const roleName = (targetRole || userProfile?.target_role || 'GenAI Engineer').trim()
  const roleKey = roleName.toLowerCase()

  // 1. Resolve required skills for target role
  const roleRequiredSkills =
    BENCHMARK_ROLE_SKILLS[roleKey] ||
    Object.entries(BENCHMARK_ROLE_SKILLS).find(([k]) => roleKey.includes(k) || k.includes(roleKey))?.[1] || [
      'Python',
      'SQL',
      'Git',
      'REST APIs',
      'Docker',
    ]

  // 2. Resolve user skills
  const userSkillsRaw = userProfile?.skills_raw || []
  const userSkillsNorm = new Set<string>()
  const userSkillDisplayMap = new Map<string, string>()

  for (const sk of userSkillsRaw) {
    if (!sk) continue
    const trimmed = sk.trim()
    const lower = trimmed.toLowerCase()
    userSkillsNorm.add(lower)
    userSkillDisplayMap.set(lower, trimmed)

    const alias = SKILL_ALIASES[lower]
    if (alias) {
      userSkillsNorm.add(alias.toLowerCase())
      userSkillDisplayMap.set(alias.toLowerCase(), alias)
    }
  }

  // 3. Match Have Skills (exact / alias)
  const haveSkills: string[] = []
  const unmatchedReq: string[] = []

  for (const req of roleRequiredSkills) {
    const reqLower = req.toLowerCase()
    const alias = SKILL_ALIASES[reqLower]
    if (userSkillsNorm.has(reqLower) || (alias && userSkillsNorm.has(alias.toLowerCase()))) {
      haveSkills.push(req)
    } else {
      unmatchedReq.push(req)
    }
  }

  // 4. Match Partial / Adjacent Skills
  const partialSkills: PartialSkill[] = []
  const missingSkills: string[] = []

  for (const req of unmatchedReq) {
    let matchedAdjacent = false
    for (const rule of ADJACENT_SKILL_MAP) {
      if (rule.required.toLowerCase() === req.toLowerCase()) {
        const sourceLower = rule.source.toLowerCase()
        if (userSkillsNorm.has(sourceLower)) {
          const originalSource = userSkillDisplayMap.get(sourceLower) || rule.source
          partialSkills.push({
            skill: req,
            matched_with: originalSource,
            similarity: rule.similarity,
          })
          matchedAdjacent = true
          break
        }
      }
    }
    if (!matchedAdjacent) {
      missingSkills.push(req)
    }
  }

  // 5. Match % calculation
  const totalReq = Math.max(1, roleRequiredSkills.length)
  const matchPct = Math.round(
    ((haveSkills.length * 1.0 + partialSkills.length * 0.5) / totalReq) * 100
  )

  // 6. Category Radar Breakdown
  const categoriesTracker: Record<string, { have: number; required: number }> = {
    Programming: { have: 0, required: 0 },
    'AI/ML': { have: 0, required: 0 },
    'Cloud/DevOps': { have: 0, required: 0 },
    Database: { have: 0, required: 0 },
    'Tools/QA': { have: 0, required: 0 },
  }

  for (const req of roleRequiredSkills) {
    const cat = SKILL_CATEGORIES[req] || 'Tools/QA'
    if (!categoriesTracker[cat]) {
      categoriesTracker[cat] = { have: 0, required: 0 }
    }
    categoriesTracker[cat].required += 1

    if (haveSkills.includes(req) || partialSkills.some((p) => p.skill === req)) {
      categoriesTracker[cat].have += 1
    }
  }

  const radar: CategoryRadar[] = Object.entries(categoriesTracker).map(([category, stats]) => ({
    category,
    have: stats.have,
    required: stats.required,
    pct: Math.round((stats.have / Math.max(1, stats.required)) * 100),
  }))

  const result: SkillGapResponse = {
    profile_id: userProfile?.id || 'demo-profile',
    target_role: roleName,
    match_pct: matchPct,
    have_skills: haveSkills,
    partial_skills: partialSkills,
    missing_skills: missingSkills,
    radar,
    role_required_skills: roleRequiredSkills,
    recommended_focus_areas: missingSkills.slice(0, 4),
  }

  skillGapCache.set(cacheKey, result)
  return result
}
