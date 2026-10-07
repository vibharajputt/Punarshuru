import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile } from '@/types'
import { useProfileStore } from '@/store/profileStore'
import { computeSkillGap } from '@/lib/skillGap'
import { computeRiskScore } from '@/lib/riskScore'

export interface UserProfileState {
  // 10 Unified Canonical Fields
  name: string
  currentRole: string
  currentSalaryLPA: number
  currentCity: string
  targetRole: string
  targetHikePercent: number // e.g. 45 for +45% hike
  skillsHave: string[]
  skillsLearning: string[]
  skillsMissing: string[]
  careerRiskScore: number

  // Derived & Convenience Aliases for Compatibility
  targetSalaryLPA: number // currentSalaryLPA * (1 + targetHikePercent / 100)
  currentSalary: number
  targetSalary: number

  // Actions & Setters
  setName: (name: string) => void
  setCurrentRole: (role: string) => void
  setCurrentSalaryLPA: (salary: number) => void
  setCurrentCity: (city: string) => void
  setTargetRole: (role: string) => void
  setTargetHikePercent: (hikePercent: number) => void
  setSkillsHave: (skills: string[]) => void
  setSkillsLearning: (skills: string[]) => void
  setSkillsMissing: (skills: string[]) => void
  setCareerRiskScore: (score: number) => void
  updateProfile: (updates: Partial<UserProfileState>) => void
  syncWithProfile: (profile: Partial<Profile> | null | undefined) => void
}

export function computeTargetSalary(current: number, hikePct: number): number {
  const normalizedCurrent = Math.max(0, Number(current) || 0)
  const factor = hikePct > 1 ? hikePct / 100 : Math.max(0, Number(hikePct) || 0)
  return Number((normalizedCurrent * (1 + factor)).toFixed(1))
}

export function resolvePersonaDefaults(profile: Partial<Profile> | null | undefined): {
  name: string
  currentRole: string
  currentSalaryLPA: number
  currentCity: string
  targetRole: string
  targetHikePercent: number
  targetSalaryLPA: number
  skillsHave: string[]
  skillsLearning: string[]
  skillsMissing: string[]
  careerRiskScore: number
} {
  const name = profile?.name || 'Arjun Mehta'
  const currentRole = profile?.current_role || 'Manual QA Engineer'
  const currentCity = profile?.current_city || profile?.city || 'Bengaluru'
  const targetRole = profile?.target_role || 'Automation QA / SDET'
  const targetHikePercent = 45

  let salary = 10.0
  if (
    profile?.current_salary_lpa !== undefined &&
    profile?.current_salary_lpa !== null &&
    !isNaN(Number(profile.current_salary_lpa)) &&
    Number(profile.current_salary_lpa) > 0
  ) {
    salary = Number(profile.current_salary_lpa)
  } else if (profile?.user_type === 'gig') {
    salary = 2.4
  } else if (profile?.user_type === 'student') {
    salary = 0.0
  } else if (profile?.user_type === 'returner' || profile?.user_type === 'laid_off') {
    salary = 8.0
  } else if (profile?.user_type === 'stagnant') {
    salary = 10.0
  }

  const targetSalaryLPA = computeTargetSalary(salary, targetHikePercent)

  // Compute skill gap deterministically
  const gap = computeSkillGap(profile as Profile, targetRole)
  const skillsHave =
    gap.have_skills && gap.have_skills.length > 0
      ? gap.have_skills
      : (profile?.skills_raw || ['Manual Testing', 'JIRA', 'Regression Testing'])
  const skillsLearning = gap.partial_skills.map((p) => p.skill)
  const skillsMissing =
    gap.missing_skills && gap.missing_skills.length > 0
      ? gap.missing_skills
      : ['Selenium', 'Playwright', 'CI/CD']

  // Compute risk score deterministically
  const riskResult = computeRiskScore(profile)
  const careerRiskScore =
    profile?.disruption_score != null ? profile.disruption_score : riskResult.score

  return {
    name,
    currentRole,
    currentSalaryLPA: salary,
    currentCity,
    targetRole,
    targetHikePercent,
    targetSalaryLPA,
    skillsHave,
    skillsLearning,
    skillsMissing,
    careerRiskScore,
  }
}

// Initial resolution from active profile store if available
const initialDefaults = resolvePersonaDefaults(useProfileStore.getState().profile)

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set, get) => ({
      name: initialDefaults.name,
      currentRole: initialDefaults.currentRole,
      currentSalaryLPA: initialDefaults.currentSalaryLPA,
      currentCity: initialDefaults.currentCity,
      targetRole: initialDefaults.targetRole,
      targetHikePercent: initialDefaults.targetHikePercent,
      skillsHave: initialDefaults.skillsHave,
      skillsLearning: initialDefaults.skillsLearning,
      skillsMissing: initialDefaults.skillsMissing,
      careerRiskScore: initialDefaults.careerRiskScore,

      targetSalaryLPA: initialDefaults.targetSalaryLPA,
      currentSalary: initialDefaults.currentSalaryLPA,
      targetSalary: initialDefaults.targetSalaryLPA,

      setName: (name: string) => {
        set({ name })
        const store = useProfileStore.getState()
        if (store.profile) {
          store.setProfile({ ...store.profile, name })
        }
      },

      setCurrentRole: (currentRole: string) => {
        set({ currentRole })
        const store = useProfileStore.getState()
        if (store.profile) {
          store.setProfile({ ...store.profile, current_role: currentRole })
        }
      },

      setCurrentSalaryLPA: (salary: number) => {
        const num = Math.max(0, Number(salary) || 0)
        const target = computeTargetSalary(num, get().targetHikePercent)
        set({
          currentSalaryLPA: num,
          currentSalary: num,
          targetSalaryLPA: target,
          targetSalary: target,
        })
        const store = useProfileStore.getState()
        if (store.profile) {
          store.setProfile({ ...store.profile, current_salary_lpa: num })
        }
      },

      setCurrentCity: (currentCity: string) => {
        set({ currentCity })
        const store = useProfileStore.getState()
        if (store.profile) {
          store.setProfile({ ...store.profile, city: currentCity, current_city: currentCity })
        }
      },

      setTargetRole: (targetRole: string) => {
        const currentSkills = get().skillsHave
        const tempProfile: any = {
          ...useProfileStore.getState().profile,
          skills_raw: currentSkills,
          target_role: targetRole,
        }
        const gap = computeSkillGap(tempProfile, targetRole)
        set({
          targetRole,
          skillsHave: gap.have_skills,
          skillsLearning: gap.partial_skills.map((p) => p.skill),
          skillsMissing: gap.missing_skills,
        })
        const store = useProfileStore.getState()
        if (store.profile) {
          store.setProfile({ ...store.profile, target_role: targetRole })
        }
      },

      setTargetHikePercent: (hikePercent: number) => {
        const num = Number(hikePercent) || 0
        const target = computeTargetSalary(get().currentSalaryLPA, num)
        set({
          targetHikePercent: num,
          targetSalaryLPA: target,
          targetSalary: target,
        })
      },

      setSkillsHave: (skillsHave: string[]) => {
        set({ skillsHave })
        const store = useProfileStore.getState()
        if (store.profile) {
          store.setProfile({ ...store.profile, skills_raw: skillsHave })
        }
      },

      setSkillsLearning: (skillsLearning: string[]) => {
        set({ skillsLearning })
      },

      setSkillsMissing: (skillsMissing: string[]) => {
        set({ skillsMissing })
      },

      setCareerRiskScore: (careerRiskScore: number) => {
        set({ careerRiskScore })
        const store = useProfileStore.getState()
        if (store.profile) {
          store.setProfile({ ...store.profile, disruption_score: careerRiskScore })
        }
      },

      updateProfile: (updates: Partial<UserProfileState>) => {
        set((state) => {
          const next = { ...state, ...updates }
          if (updates.currentSalaryLPA !== undefined || updates.targetHikePercent !== undefined) {
            const sal =
              updates.currentSalaryLPA !== undefined
                ? updates.currentSalaryLPA
                : next.currentSalaryLPA
            const hike =
              updates.targetHikePercent !== undefined
                ? updates.targetHikePercent
                : next.targetHikePercent
            const target = computeTargetSalary(sal, hike)
            next.currentSalaryLPA = sal
            next.currentSalary = sal
            next.targetSalaryLPA = target
            next.targetSalary = target
          }
          return next
        })
      },

      syncWithProfile: (profile: Partial<Profile> | null | undefined) => {
        if (!profile) return
        const resolved = resolvePersonaDefaults(profile)
        set({
          name: resolved.name,
          currentRole: resolved.currentRole,
          currentSalaryLPA: resolved.currentSalaryLPA,
          currentCity: resolved.currentCity,
          targetRole: resolved.targetRole,
          targetHikePercent: resolved.targetHikePercent,
          targetSalaryLPA: resolved.targetSalaryLPA,
          currentSalary: resolved.currentSalaryLPA,
          targetSalary: resolved.targetSalaryLPA,
          skillsHave: resolved.skillsHave,
          skillsLearning: resolved.skillsLearning,
          skillsMissing: resolved.skillsMissing,
          careerRiskScore: resolved.careerRiskScore,
        })
      },
    }),
    {
      name: 'punarshuru-unified-user-profile-v2',
    }
  )
)

/**
 * Hook providing direct access to unified UserProfile defaults and reactive setters
 */
export function useUserProfile() {
  const store = useUserProfileStore()

  return {
    name: store.name,
    currentRole: store.currentRole,
    currentSalaryLPA: store.currentSalaryLPA,
    currentCity: store.currentCity,
    targetRole: store.targetRole,
    targetHikePercent: store.targetHikePercent,
    skillsHave: store.skillsHave,
    skillsLearning: store.skillsLearning,
    skillsMissing: store.skillsMissing,
    careerRiskScore: store.careerRiskScore,

    targetSalaryLPA: store.targetSalaryLPA,
    currentSalary: store.currentSalaryLPA,
    targetSalary: store.targetSalaryLPA,

    setName: store.setName,
    setCurrentRole: store.setCurrentRole,
    setCurrentSalaryLPA: store.setCurrentSalaryLPA,
    setCurrentCity: store.setCurrentCity,
    setTargetRole: store.setTargetRole,
    setTargetHikePercent: store.setTargetHikePercent,
    setSkillsHave: store.setSkillsHave,
    setSkillsLearning: store.setSkillsLearning,
    setSkillsMissing: store.setSkillsMissing,
    setCareerRiskScore: store.setCareerRiskScore,
    updateProfile: store.updateProfile,
    syncWithProfile: store.syncWithProfile,
  }
}
