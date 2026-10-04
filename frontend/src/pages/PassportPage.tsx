import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { RefreshCw, Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useProfileStore } from '@/store/profileStore'
import { passportApi } from '@/lib/api'
import PassportCard from '@/components/passport/PassportCard'
import ShareActions from '@/components/passport/ShareActions'
import Skeleton from '@/components/common/Skeleton'
import type { PassportResponse } from '@/types'

export default function PassportPage() {
  const { t } = useTranslation()
  const profile = useProfileStore((s) => s.profile)
  const [isPublic, setIsPublic] = useState(true)

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['passport', profile?.id, isPublic],
    queryFn: () => (profile?.id ? passportApi.create(profile.id, { is_public: isPublic }) : null),
    enabled: !!profile?.id,
    staleTime: 60_000,
  })

  const fallbackPassport: PassportResponse = {
    id: 'pass-demo',
    profile_id: profile?.id || 'demo-priya',
    slug: 'priya-sharma-genai-pune',
    is_public: isPublic,
    profile_name: profile?.name || 'Priya Sharma',
    user_type: profile?.user_type || 'returner',
    city: profile?.city || 'Pune',
    current_role: profile?.current_role || 'Java Developer',
    target_role: profile?.target_role || 'GenAI Engineer',
    disruption_score: profile?.disruption_score || 72,
    verified_skills: profile?.skills_raw || ['Java', 'Spring Boot', 'MySQL', 'REST APIs', 'Git'],
    evidence: [
      {
        type: 'Skill Validation',
        title: 'Core Java & REST API Architecture',
        issuer: 'Punarshuru AI Talent Engine',
        verified: true,
        date: new Date().toISOString().slice(0, 10),
      },
      {
        type: 'Disruption Audit',
        title: 'Disruption Resilience Verified: 72/100',
        issuer: 'Punarshuru Intelligence',
        verified: true,
        date: new Date().toISOString().slice(0, 10),
      },
    ],
    qr_data: 'https://punarshuru.in/p/priya-sharma-genai-pune',
    created_at: new Date().toISOString().slice(0, 10),
  }

  const passport = data || fallbackPassport

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
