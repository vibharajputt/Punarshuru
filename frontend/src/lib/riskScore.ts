import type { DisruptionBreakdown, Profile } from '@/types'

export interface RiskScoreResult {
  score: number
  riskLevel: 'Low' | 'Moderate' | 'High'
  breakdown: DisruptionBreakdown
}

/**
 * Single source of truth for Career Risk Score (Disruption Index) computation.
 * Guarantees that the score displayed in the "Try a Demo Persona" picker card
 * strictly equals the score displayed on the Home Dashboard and CareerRiskCard widget.
 */
export function computeRiskScore(
  profileOrPersona:
    | Partial<Profile>
    | {
        key?: string
        id?: string
        user_type?: string
        current_role?: string
        target_role?: string
        career_gap_years?: number
        skills?: string[]
        skills_raw?: string[]
        disruption?: number
      }
    | null
    | undefined
): RiskScoreResult {
  if (!profileOrPersona) {
    return {
      score: 72,
      riskLevel: 'High',
      breakdown: {
        skill_decay: 20,
        automation_risk: 22,
        career_gap: 12,
        stagnation: 8,
        market_mismatch: 10,
        top_risks: [],
        strengths: [],
      },
    }
  }

  const p = profileOrPersona as Record<string, any>
  const key = String(p.key || p.id || '').toLowerCase()

  // 1. Canonical Demo Personas: strictly aligned with backend calculation
  if (key.includes('arjun')) {
    const breakdown: DisruptionBreakdown = {
      skill_decay: 13,
      automation_risk: 30,
      career_gap: 3,
      stagnation: 15,
      market_mismatch: 12,
      top_risks: ['Automation pressure on Manual QA Engineer'],
      strengths: ['6+ years of problem solving and professional domain maturity'],
    }
    return {
      score: 73,
      riskLevel: 'High',
      breakdown,
    }
  }

  if (key.includes('priya')) {
    const breakdown: DisruptionBreakdown = {
      skill_decay: 24,
      automation_risk: 14,
      career_gap: 15,
      stagnation: 6,
      market_mismatch: 15,
      top_risks: ['4.0-year career gap demands demonstrative project proof'],
      strengths: ['5+ years of problem solving', 'Strong foundational engineering discipline'],
    }
    return {
      score: 74,
      riskLevel: 'High',
      breakdown,
    }
  }

  if (key.includes('ramesh')) {
    const breakdown: DisruptionBreakdown = {
      skill_decay: 18,
      automation_risk: 30,
      career_gap: 0,
      stagnation: 15,
      market_mismatch: 15,
      top_risks: ['Automation pressure on Delivery Partner (Swiggy)'],
      strengths: ['High resilience, operational grit, and real-time navigation intelligence'],
    }
    return {
      score: 78,
      riskLevel: 'High',
      breakdown,
    }
  }

  if (key.includes('sneha')) {
    const breakdown: DisruptionBreakdown = {
      skill_decay: 16,
      automation_risk: 30,
      career_gap: 0,
      stagnation: 15,
      market_mismatch: 15,
      top_risks: ['Automation pressure on Customer Support Executive'],
      strengths: ['5+ years of problem solving', 'Solid baseline tech fundamentals'],
    }
    return {
      score: 76,
      riskLevel: 'High',
      breakdown,
    }
  }

  if (key.includes('rohit')) {
    const breakdown: DisruptionBreakdown = {
      skill_decay: 0,
      automation_risk: 10,
      career_gap: 0,
      stagnation: 5,
      market_mismatch: 12,
      top_risks: ['Increasing competition from GenAI-native professionals'],
      strengths: ['Hands-on familiarity with in-demand skills: Python, DSA, Machine Learning'],
    }
    return {
      score: 27,
      riskLevel: 'Low',
      breakdown,
    }
  }

  // 2. Dynamic Algorithmic Assessment for arbitrary user profiles
  const userType = p.user_type || 'stagnant'
  const careerGapYears = Number(p.career_gap_years || 0)
  const currentRole = (p.current_role || '').toLowerCase()
  const targetRole = (p.target_role || '').toLowerCase()

  // Gap score (0-15)
  const gapScore = Math.min(15, Math.round(careerGapYears * 5.0))

  // Automation risk (0-30)
  let autoScore = 15
  if (
    currentRole.includes('manual qa') ||
    currentRole.includes('qa tester') ||
    currentRole.includes('delivery') ||
    currentRole.includes('driver') ||
    currentRole.includes('customer support') ||
    currentRole.includes('bpo') ||
    currentRole.includes('telecaller')
  ) {
    autoScore = 30
  } else if (userType === 'student') {
    autoScore = 10
  }

  // Stagnation (0-15)
  let stagScore = 10
  if (userType === 'stagnant' || userType === 'gig' || userType === 'laid_off') {
    stagScore = 15
  } else if (userType === 'student') {
    stagScore = 5
  } else if (userType === 'returner') {
    stagScore = 6
  }

  // Market mismatch (0-15)
  let mismatchScore = 12
  if (targetRole && targetRole !== currentRole) {
    mismatchScore = 15
  }
  if (targetRole.includes('sdet') || targetRole.includes('automation qa')) {
    mismatchScore = 12
  }

  // Skill decay (0-25)
  let decayScore = Math.min(25, Math.round(careerGapYears * 4.0 + (userType === 'returner' ? 8 : 0)))
  if (currentRole.includes('manual qa')) decayScore = 13
  if (currentRole.includes('support')) decayScore = 16
  if (currentRole.includes('delivery')) decayScore = 18

  const totalScore = Math.min(100, Math.max(0, gapScore + autoScore + stagScore + mismatchScore + decayScore))
  const riskLevel = totalScore >= 70 ? 'High' : totalScore >= 40 ? 'Moderate' : 'Low'

  return {
    score: totalScore,
    riskLevel,
    breakdown: {
      skill_decay: decayScore,
      automation_risk: autoScore,
      career_gap: gapScore,
      stagnation: stagScore,
      market_mismatch: mismatchScore,
      top_risks: [],
      strengths: [],
    },
  }
}
