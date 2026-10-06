import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { RefreshCw, Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useActiveProfile, generatePassportSlug } from '@/hooks/useActiveProfile'
import { passportApi } from '@/lib/api'
import PassportCard from '@/components/passport/PassportCard'
import ShareActions from '@/components/passport/ShareActions'
import Skeleton from '@/components/common/Skeleton'
import type { PassportResponse } from '@/types'

export default function PassportPage() {
  const { t } = useTranslation()
  const { profile, isDemo, personaKey } = useActiveProfile()
  const [isPublic, setIsPublic] = useState(true)

  const activeProfileId = profile?.id || (isDemo ? `demo-${personaKey || 'priya'}` : '')

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['passport', activeProfileId, isPublic],
    queryFn: () => (activeProfileId ? passportApi.create(activeProfileId, { is_public: isPublic }) : null),
    enabled: !!activeProfileId,
    staleTime: 60_000,
  })

  // Dynamic slug regenerated from currently active persona (demo or real)
  const dynamicSlug = useMemo(() => {
    return generatePassportSlug(
      profile?.name || (isDemo ? 'Priya Sharma' : 'Candidate'),
      profile?.target_role || undefined,
      profile?.city || undefined
    )
  }, [profile?.name, profile?.target_role, profile?.city, isDemo])

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://punarshuru.in'

  const fallbackPassport: PassportResponse = {
    id: `pass-${activeProfileId || 'active'}`,
    profile_id: activeProfileId || 'demo-priya',
    slug: data?.slug || dynamicSlug,
    is_public: isPublic,
    profile_name: profile?.name || 'Priya Sharma',
    user_type: profile?.user_type || 'returner',
    city: profile?.city || 'Pune',
    current_role: profile?.current_role || 'Java Developer',
    target_role: profile?.target_role || 'GenAI Engineer',
    disruption_score: profile?.disruption_score || 72,
    verified_skills: profile?.skills_raw?.length
      ? profile.skills_raw
      : ['Java', 'Spring Boot', 'MySQL', 'REST APIs', 'Git'],
    evidence: [
      {
        type: 'Skill Validation',
        title: `${profile?.current_role || 'Technical'} Architecture Proof`,
        issuer: 'Punarshuru AI Talent Engine',
        verified: true,
        date: new Date().toISOString().slice(0, 10),
      },
      {
        type: 'Disruption Audit',
        title: `Disruption Resilience Verified: ${Math.round(profile?.disruption_score || 72)}/100`,
        issuer: 'Punarshuru Intelligence',
        verified: true,
        date: new Date().toISOString().slice(0, 10),
      },
    ],
    qr_data: `${origin}/p/${data?.slug || dynamicSlug}`,
    created_at: new Date().toISOString().slice(0, 10),
  }

  // Ensure passport always respects the active persona
  const passport = useMemo(() => {
    if (data && (!isDemo || data.profile_id?.startsWith('demo-') || data.profile_name === profile?.name)) {
      return {
        ...data,
        profile_name: profile?.name || data.profile_name,
        city: profile?.city || data.city,
        current_role: profile?.current_role || data.current_role,
        target_role: profile?.target_role || data.target_role,
        verified_skills: profile?.skills_raw?.length ? profile.skills_raw : data.verified_skills,
        slug: data.slug || dynamicSlug,
        qr_data: `${origin}/p/${data.slug || dynamicSlug}`,
      }
    }
    return fallbackPassport
  }, [data, isDemo, profile, dynamicSlug, origin, fallbackPassport])

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('passport.title', 'AI Talent Passport & QR Credential')}
            </h1>
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              {t('passport.verifiable_badge', 'Verifiable Badge')}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {t('passport.subtitle', 'Shareable proof of competencies, evidence artifacts, and career break resilience for recruiters.')}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsPublic(!isPublic)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isPublic
                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            {isPublic ? <Eye size={14} /> : <EyeOff size={14} />}
            <span>{isPublic ? t('passport.public', 'Public') : t('passport.unlisted', 'Unlisted')}</span>
          </button>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            title="Refresh Passport"
          >
            <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Passport Card Component */}
      {isLoading && !data ? (
        <Skeleton variant="card" className="h-96 max-w-2xl mx-auto" />
      ) : (
        <div className="space-y-6">
          <PassportCard passport={passport} />
          <ShareActions passport={passport} />
        </div>
      )}
    </div>
  )
}
