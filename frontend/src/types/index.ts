export type UserType = 'returner' | 'gig' | 'laid_off' | 'stagnant' | 'student'

export interface Profile {
  id: string
  name: string
  email?: string | null
  user_type: UserType
  city?: string | null
  current_role?: string | null
  target_role?: string | null
  experience_years: number
  career_gap_years: number
  current_salary_lpa?: number | null
  skills_raw: string[]
  skills_taxonomy_ids: number[]
  resume_text?: string | null
  disruption_score?: number | null
  disruption_breakdown?: DisruptionBreakdown | null
  created_at: string
  updated_at: string
}

export interface DisruptionBreakdown {
  skill_decay: number
  automation_risk: number
  career_gap: number
  stagnation: number
  market_mismatch: number
  reasons?: Record<string, string>
  top_risks: string[]
  strengths: string[]
}

export interface DisruptionResponse {
  profile_id: string
  score: number
  risk_level: 'Low' | 'Moderate' | 'High'
  summary: string
  breakdown: DisruptionBreakdown
}

export interface PartialSkill {
  skill: string
  matched_with: string
  similarity: number
}

export interface CategoryRadar {
  category: string
  have: number
  required: number
  pct: number
}

export interface SkillGapResponse {
  profile_id: string
  target_role: string
  match_pct: number
  have_skills: string[]
  partial_skills: PartialSkill[]
  missing_skills: string[]
  radar: CategoryRadar[]
  role_required_skills: string[]
  recommended_focus_areas: string[]
}

export interface MilestoneCourse {
  id: number
  title: string
  provider: 'NPTEL' | 'SWAYAM' | 'Skill India' | 'freeCodeCamp' | string
  weeks: number
  lang: string
  url: string
  level: string
  certificate: boolean
}

export interface PathwayStep {
  week_range: string
  title: string
  description: string
  skills_covered: string[]
  courses: MilestoneCourse[]
}

export interface PathwayOption {
  type: 'Safe' | 'Stretch' | 'Pivot'
  title: string
  target_role: string
  estimated_months: number
  target_salary_lpa: number
  difficulty: 'Low' | 'Medium' | 'High'
  description: string
  roadmap: PathwayStep[]
}

export interface PathwayResponse {
  profile_id: string
  motivation_quote: string
  pathways: PathwayOption[]
}

export interface RealCompRequest {
  salary_lpa: number
  city: string
  bhk?: number
}

export interface RealCompResponse {
  city: string
  nominal_salary_lpa: number
  col_index: number
  annual_rent_inr: number
  annual_commute_inr: number
  real_salary_lpa: number
  in_hand_monthly_inr: number
  monthly_savings_potential_inr: number
  cost_breakdown: {
    monthly_rent_inr: number
    monthly_commute_inr: number
    avg_meal_inr: number
  }
}

export interface OfferItem {
  offer_name: string
  city: string
  salary_lpa: number
  bhk?: number
}

export interface CityCompareItem {
  city: string
  offer_name?: string
  nominal_salary_lpa: number
  col_index: number
  rent_monthly_inr: number
  commute_monthly_inr: number
  real_salary_lpa: number
  in_hand_monthly_inr: number
  monthly_savings_inr: number
  purchasing_power_score: number
}

export interface CompareRequest {
  offers: OfferItem[]
}

export interface CompareResponse {
  best_offer_by_real_income: string
  comparisons: CityCompareItem[]
  five_year_projection: Array<Record<string, string | number>>
}

export interface PassportEvidence {
  type: string
  title: string
  issuer: string
  verified: boolean
  date: string
}

export interface PassportResponse {
  id: string
  profile_id: string
  slug: string
  is_public: boolean
  profile_name: string
  user_type: string
  city?: string | null
  current_role?: string | null
  target_role?: string | null
  disruption_score?: number | null
  verified_skills: string[]
  evidence: PassportEvidence[]
  qr_data: string
  created_at: string
}

export interface PersonaSummary {
  key: string
  name: string
  user_type: UserType
  city: string
  current_role: string
  target_role: string
  experience_years: number
  career_gap_years: number
  current_salary_lpa: number | null
  skills_raw: string[]
  description: string
  disruption_score: number
  disruption_breakdown?: DisruptionBreakdown
}

export interface ResumeParseResponse {
  name?: string | null
  email?: string | null
  phone?: string | null
  city?: string | null
  current_role?: string | null
  target_role?: string | null
  experience_years?: number
  career_gap_years?: number
  skills?: string[]
  education?: string | null
  summary?: string | null
  confidence_score?: number
}

export interface ApiError {
  detail: string
}
