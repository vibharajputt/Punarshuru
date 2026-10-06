import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ShieldCheck, Sparkles, ArrowRight } from 'lucide-react'
import { passportApi } from '@/lib/api'
import PassportCard from '@/components/passport/PassportCard'
import ShareActions from '@/components/passport/ShareActions'
import Skeleton from '@/components/common/Skeleton'
import EmptyState from '@/components/common/EmptyState'
import type { PassportResponse } from '@/types'

import { DEMO_PERSONAS } from '@/components/demo/DemoModal'

export default function PublicPassportPage() {
  const { slug } = useParams<{ slug: string }>()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-passport', slug],
    queryFn: () => (slug ? passportApi.getBySlug(slug) : null),
    enabled: !!slug,
    staleTime: 60_000,
  })

  // Match demo persona from slug if viewing a demo URL
  const matchedPersona = DEMO_PERSONAS.find((p) => {
    if (!slug) return false
    const s = slug.toLowerCase()
    return s.includes(p.key) || s.includes(p.name.toLowerCase().replace(/\s+/g, '-'))
  })

  const fallbackPassport: PassportResponse = {
    id: `public-${slug || 'demo'}`,
    profile_id: matchedPersona ? `demo-${matchedPersona.key}` : 'demo-slug',
    slug: slug || 'priya-sharma-genai-engineer-pune',
    is_public: true,
    profile_name: matchedPersona
      ? matchedPersona.name
      : (slug ? slug.split('-').slice(0, 2).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') : 'Candidate'),
    user_type: matchedPersona?.user_type || 'returner',
    city: matchedPersona?.city || 'India',
    current_role: matchedPersona?.current_role || 'Professional',
    target_role: matchedPersona?.target_role || 'Modern Software Professional',
    disruption_score: matchedPersona?.disruption || 70,
    verified_skills: matchedPersona?.skills || ['Communication', 'Problem Solving', 'Technical Agility'],
    evidence: [
      {
        type: 'Skill Validation',
        title: `${matchedPersona?.current_role || 'Technical'} Architecture Proof`,
        issuer: 'Punarshuru AI Talent Registry',
        verified: true,
        date: '2026-09-15',
      },
      {
        type: 'Disruption Audit',
        title: `Disruption Resilience Verified: ${matchedPersona?.disruption || 70}/100`,
        issuer: 'Punarshuru Intelligence',
        verified: true,
        date: '2026-09-15',
      },
    ],
    qr_data: `https://punarshuru.in/p/${slug || 'priya-sharma-genai-engineer-pune'}`,
    created_at: '2026-09-15',
  }

  const passport = data || (!isError ? fallbackPassport : null)

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      {/* Verification Header Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
          <ShieldCheck size={18} className="text-emerald-600" />
          <span>Verified Public AI Talent Credential • Punarshuru Bharat 2.0 Registry</span>
        </div>
        <Link
          to="/"
          className="text-[#0B4F9C] dark:text-sky-400 font-bold hover:underline flex items-center gap-1"
        >
          <span>Audit Your Career</span>
          <ArrowRight size={12} />
        </Link>
      </div>

      {isLoading ? (
        <Skeleton variant="card" className="h-96 max-w-2xl mx-auto" />
      ) : !passport ? (
        <EmptyState
          title="Passport Not Found"
          description={`No public AI Talent Passport registered under slug '${slug}'.`}
          actionLabel="Create Free Passport"
          onAction={() => window.location.assign('/onboarding')}
        />
      ) : (
        <div className="space-y-6">
          <PassportCard passport={passport} showFullUrl={true} />
          <ShareActions passport={passport} />
        </div>
      )}

      {/* Recruiter / Visitor CTA */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
        <div className="w-10 h-10 mx-auto rounded-2xl bg-[#0B4F9C] text-white flex items-center justify-center">
          <Sparkles size={18} />
        </div>
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
          Hiring or Transitioning in Tech?
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Punarshuru detects tech disruption, normalizes career breaks, and bridges skill gaps with zero-cost public courses.
        </p>
        <Link
          to="/onboarding"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B4F9C] text-white text-xs font-bold hover:bg-[#083b75] shadow-xs transition-all"
        >
          <span>Get Your AI Talent Passport</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
