import { useMemo } from 'react'
import { useDemoStore } from '@/store/demoStore'
import { useProfileStore } from '@/store/profileStore'
import { DEMO_PERSONAS } from '@/components/demo/DemoModal'
import { PERSONA_FACTOR_DEFAULTS } from '@/components/home/CareerRiskCard'
import type { Profile } from '@/types'

export function generatePassportSlug(name?: string | null, targetRole?: string | null, city?: string | null): string {
  const parts = [name, targetRole, city].filter(Boolean) as string[]
  if (parts.length === 0) return 'punarshuru-talent-passport'
  return parts
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Single source of truth for the active profile across the entire application.
 * When demo mode is active (`useDemoStore.isDemo === true`), this ALWAYS returns
 * the selected demo persona's profile (name, city, skills, target role, etc.),
 * preventing real authenticated user data from leaking into demo sessions.
 * When demo mode is NOT active, it falls back to the authenticated user's profile
 * stored in `useProfileStore`.
 */
export function useActiveProfile() {
  const isDemo = useDemoStore((s) => s.isDemo)
  const personaKey = useDemoStore((s) => s.personaKey)
  const personaName = useDemoStore((s) => s.personaName)
  const personaRole = useDemoStore((s) => s.personaRole)
  const personaCity = useDemoStore((s) => s.personaCity)
  const storeProfile = useProfileStore((s) => s.profile)

  const profile = useMemo<Profile | null>(() => {
    if (isDemo) {
      const demoItem =
        (personaKey && DEMO_PERSONAS.find((p) => p.key === personaKey)) || DEMO_PERSONAS[0]

      const isStoreProfileMatchingDemo =
        storeProfile?.id === `demo-${demoItem.key}` ||
        storeProfile?.id === demoItem.key ||
        storeProfile?.name?.toLowerCase() === demoItem.name.toLowerCase()

      const demoProfile: Profile = {
        id: `demo-${demoItem.key}`,
        user_id: null,
        name: personaName || demoItem.name,
        email: `${demoItem.key}@demo.punarshuru.in`,
        user_type: demoItem.user_type,
        city: personaCity || demoItem.city,
        current_city: personaCity || demoItem.city,
        preferred_city: null,
        gap_reason: null,
        achievements: [],
        current_role: personaRole || demoItem.current_role,
        target_role: demoItem.target_role,
        experience_years:
          isStoreProfileMatchingDemo && storeProfile?.experience_years !== undefined
            ? storeProfile.experience_years
            : (demoItem.user_type === 'student' ? 0 : (demoItem.user_type === 'returner' ? 5 : (demoItem.user_type === 'gig' ? 3 : (demoItem.user_type === 'laid_off' ? 6 : 5)))),
        career_gap_years:
          demoItem.career_gap_years !== undefined
            ? demoItem.career_gap_years
            : (isStoreProfileMatchingDemo && storeProfile?.career_gap_years !== undefined
                ? storeProfile.career_gap_years
                : (demoItem.user_type === 'returner' ? 4 : (demoItem.user_type === 'laid_off' ? 0.5 : 0))),
        current_salary_lpa:
          isStoreProfileMatchingDemo && storeProfile?.current_salary_lpa !== undefined
            ? storeProfile.current_salary_lpa
            : (demoItem.user_type === 'student' ? 0 : (demoItem.user_type === 'returner' ? 8 : (demoItem.user_type === 'gig' ? 2.4 : (demoItem.user_type === 'laid_off' ? 8.0 : 4.5)))),
        skills_raw:
          isStoreProfileMatchingDemo && storeProfile?.skills_raw?.length
            ? storeProfile.skills_raw
            : demoItem.skills,
        skills_taxonomy_ids: [1, 2, 3],
        disruption_score:
          isStoreProfileMatchingDemo && storeProfile?.disruption_score != null
            ? storeProfile.disruption_score
            : demoItem.disruption,
        disruption_breakdown: (PERSONA_FACTOR_DEFAULTS[demoItem.disruption] || null) as any,
        created_at: storeProfile?.created_at || '2026-01-01T00:00:00.000Z',
        updated_at: storeProfile?.updated_at || new Date().toISOString(),
      }

      return demoProfile
    }

    return storeProfile
  }, [isDemo, personaKey, personaName, personaRole, personaCity, storeProfile])

  return {
    profile,
    isDemo,
    personaKey,
    career_gap_years: profile?.career_gap_years ?? (profile?.user_type === 'returner' ? 4 : 0),
    name: profile?.name || 'Active Candidate',
    city: profile?.city || 'India',
    current_role: profile?.current_role || '',
    target_role: profile?.target_role || '',
    user_type: profile?.user_type || 'returner',
    skills_raw: profile?.skills_raw || [],
    disruption_score: profile?.disruption_score ?? 70,
  }
}
