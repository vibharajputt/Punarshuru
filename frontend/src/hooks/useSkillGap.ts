import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useActiveProfile } from './useActiveProfile'
import { assessApi } from '@/lib/api'
import { computeSkillGap } from '@/lib/skillGap'
import type { SkillGapResponse } from '@/types'

/**
 * Shared hook that ensures EVERY consumer across the app (Home dashboard,
 * /skills page, AI Career Copilot, Jobs company fit) reads the EXACT SAME
 * computed skill gap result without initial render flashes or disagreement.
 */
export function useSkillGap(targetRoleOverride?: string | null) {
  const { profile } = useActiveProfile()
  const targetRole = targetRoleOverride || profile?.target_role || 'GenAI Engineer'
  const profileId = profile?.id || 'demo-profile'

  // Single source-of-truth immediate calculation: 0 delay, 0 flash, deterministic
  const localGap = useMemo(() => {
    return computeSkillGap(profile, targetRole)
  }, [profile, targetRole])

  // Sync with backend API in background if profileId exists, caching in React Query
  const {
    data: serverGap,
    isFetching,
    refetch,
  } = useQuery<SkillGapResponse | null>({
    queryKey: ['skill-gap-unified', profileId, targetRole],
    queryFn: async () => {
      try {
        if (!profileId) return null
        return await assessApi.gap(profileId, targetRole)
      } catch {
        return null
      }
    },
    enabled: !!profileId,
    staleTime: 5 * 60 * 1000,
  })

  // Use server result if populated with actual skills, otherwise single source of truth
  const gap: SkillGapResponse = useMemo(() => {
    if (serverGap && Array.isArray(serverGap.have_skills) && serverGap.role_required_skills?.length) {
      return serverGap
    }
    return localGap
  }, [serverGap, localGap])

  return {
    gap,
    matchPct: gap.match_pct,
    haveSkills: gap.have_skills,
    partialSkills: gap.partial_skills,
    missingSkills: gap.missing_skills,
    radar: gap.radar,
    roleRequiredSkills: gap.role_required_skills,
    recommendedFocusAreas: gap.recommended_focus_areas,
    targetRole,
    isLoading: false,
    isFetching,
    refetch,
  }
}
