import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  RefreshCw,
  Map,
  Zap,
  Users,
  Scale,
  Clock,
  Briefcase,
  Sparkles,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useActiveProfile } from '@/hooks/useActiveProfile'
import { useUserProfile } from '@/store/userProfileStore'
import { pathwayApi } from '@/lib/api'
import PathCardsGrid from '@/components/pathways/PathCardsGrid'
import RoadmapTimeline from '@/components/pathways/RoadmapTimeline'
import ReentryRoadmap from '@/components/dashboard/returner/ReentryRoadmap'
import Skeleton from '@/components/common/Skeleton'
import { getRolePathways } from '@/components/pathways/defaultPathways'
import type { PathwayOption } from '@/types'

export default function PathPage() {
  const { t } = useTranslation()
  const { profile } = useActiveProfile()
  const userProfile = useUserProfile()
  const userType = profile?.user_type || 'returner'

  const isStudent = userType === 'student'
  const isStagnant = userType === 'stagnant'
  const isLaidOff = userType === 'laid_off'
  const isGig = userType === 'gig'
  const isReturner = !isStudent && !isStagnant && !isLaidOff && !isGig

  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<'pathways' | 'sprint'>('pathways')
  const [selectedIndex, setSelectedIndex] = useState<number>(1) // Default to Stretch

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'sprint') {
      setActiveTab('sprint')
    } else {
      setActiveTab('pathways')
    }
  }, [searchParams])

  const handleTabChange = (tab: 'pathways' | 'sprint') => {
    setActiveTab(tab)
    setSearchParams(tab === 'sprint' ? { tab: 'sprint' } : {})
  }

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['pathway', profile?.id, userType],
    queryFn: () => (profile?.id ? pathwayApi.get(profile.id) : null),
    enabled: !!profile?.id,
    staleTime: 60_000,
  })

  const fallbackPathways = getRolePathways(userType)
  // Use fallback if API returns generic data or for tailored personas
  const pathways: PathwayOption[] =
    data?.pathways && data.pathways.length >= 3 && isReturner ? data.pathways : fallbackPathways
  const selectedPathway = pathways[selectedIndex] || pathways[0]

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {isStudent
                ? 'Campus-to-Corporate Placement Roadmaps'
                : isStagnant
                ? 'Career Acceleration & 40%+ Hike Roadmaps'
                : isLaidOff
                ? 'Rapid Re-Employment & Immediate Joiner Roadmaps'
                : isGig
                ? 'Freelancer-to-Fulltime Enterprise Roadmaps'
                : t('pathways.title', 'Career Re-entry & Confidence Reboot Roadmaps')}
            </h1>
            {isStudent ? (
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60">
                Fresher & Campus Track
              </span>
            ) : isStagnant ? (
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-[#0B4F9C] dark:text-sky-300 border border-blue-200/60">
                Promotion & Lateral Leap Track
              </span>
            ) : isLaidOff ? (
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200/60">
                0-Day Notice Immediate Track
              </span>
            ) : isGig ? (
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200/60">
                Enterprise Stability Track
              </span>
            ) : (
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border border-teal-200/60">
                Returner Reboot Track
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {isStudent
              ? 'Structured roadmaps to crack Software Engineer, Cloud/AI Associate, and Data roles with 100% free verified Govt/NPTEL courses.'
              : isStagnant
              ? 'Targeted pathways to break internal stagnation, build high-visibility GenAI automation PoCs, and execute 40%+ lateral switches.'
              : isLaidOff
              ? 'Fast-track 4-8 week pathways to leverage 0-day notice advantage, target high-velocity referrals, and secure salary parity.'
              : isGig
              ? 'Transform informal client projects into verified enterprise codebases, setup CI/CD pipelines, and secure full-time roles with benefits.'
              : 'Bridge employment gaps with modernized Java/GenAI/Cloud stacks, verified Govt/NPTEL courses, and confident career gap framing.'}
            {userProfile.targetRole ? ` • Focused sprint toward ${userProfile.targetRole}` : ''}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-[#0B4F9C] transition-all cursor-pointer"
            title="Recalculate pathways"
          >
            <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
          </button>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-extrabold bg-[#0B4F9C] text-white hover:bg-[#083b75] shadow-md transition-all"
          >
            <span>{t('pathways.check_jobs_btn', 'Check Jobs & Salary')}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* 2. Persona-Specific Spotlight Banners */}
      {isStudent && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-blue-600/10 to-purple-600/5 dark:from-emerald-950/40 dark:via-blue-950/30 dark:to-slate-900 border border-emerald-200/70 dark:border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-xs border border-emerald-100 dark:border-emerald-800">
              <Users size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  Senior Mentorship Network
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                  18 Online
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight mt-0.5">
                Need 1-on-1 Help Cracking These Roadmaps?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Talk directly with recently placed seniors at Amazon, Razorpay, Swiggy & TCS Digital for free 1-on-1 guidance.
              </p>
            </div>
          </div>

          <Link
            to="/features/senior-mentorship"
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>Connect with Placed Seniors</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {isStagnant && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-600/10 to-emerald-600/5 dark:from-blue-950/40 dark:via-purple-950/30 dark:to-slate-900 border border-blue-200/70 dark:border-blue-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-[#0B4F9C] dark:text-sky-400 shrink-0 shadow-xs border border-blue-100 dark:border-blue-800">
              <Scale size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#0B4F9C] dark:text-sky-300">
                  Decision Engine
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-[#0B4F9C] dark:text-sky-200">
                  +₹48k/mo In-Hand
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight mt-0.5">
                Stay vs Switch Financial & Target Company Diagnostic
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Compare internal promotion appraisal vs 40%+ lateral jump and view companies actively hiring for your skills.
              </p>
            </div>
          </div>

          <Link
            to="/features/stay-or-switch"
            className="px-4 py-2.5 rounded-2xl bg-[#0B4F9C] hover:bg-[#083b75] text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>Run Stay vs Switch Analysis</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {isLaidOff && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-rose-600/10 to-blue-600/5 dark:from-amber-950/40 dark:via-rose-950/30 dark:to-slate-900 border border-amber-200/70 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 shadow-xs border border-amber-100 dark:border-amber-800">
              <Clock size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
                  Immediate Joiner Network
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                  0-Day Notice Priority
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight mt-0.5">
                Leverage 0-Day Availability with Immediate-Hiring Tech Firms
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Browse verified openings in Bengaluru, Pune & NCR with fast-track 2-round interview screening.
              </p>
            </div>
          </div>

          <Link
            to="/jobs"
            className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>View Immediate Joiner Jobs</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {isGig && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-500/10 via-indigo-600/10 to-blue-600/5 dark:from-purple-950/40 dark:via-indigo-950/30 dark:to-slate-900 border border-purple-200/70 dark:border-purple-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 shadow-xs border border-purple-100 dark:border-purple-800">
              <Briefcase size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300">
                  Enterprise Transition Engine
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                  PF & Health Cover
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight mt-0.5">
                Transform Freelance Client Work into Corporate Case Studies
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Package independent gig projects into clean enterprise repositories with automated testing & CI/CD.
              </p>
            </div>
          </div>

          <Link
            to="/features/client-to-resume"
            className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>Convert Gigs to Enterprise Resume</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {isReturner && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-teal-500/10 via-blue-600/10 to-emerald-600/5 dark:from-teal-950/40 dark:via-blue-950/30 dark:to-slate-900 border border-teal-200/70 dark:border-teal-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0 shadow-xs border border-teal-100 dark:border-teal-800">
              <Sparkles size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-300">
                  Career Reboot Network
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200">
                  Returnee Friendly
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight mt-0.5">
                Frame Your Career Break as a Strategic Advantage
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Use AI-assisted gap framing and target returnship programs at leading product & GCC tech hubs.
              </p>
            </div>
          </div>

          <Link
            to="/features/gap-rebuilder"
            className="px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>Rebuild Career Gap Narrative</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {/* 3. Unified Path View Mode Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 w-full sm:w-fit">
        <button
          type="button"
          onClick={() => handleTabChange('pathways')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'pathways'
              ? 'bg-white dark:bg-slate-900 text-[#0B4F9C] dark:text-sky-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Map size={14} />
          <span>
            {isStudent
              ? 'Campus Placement Pathways (10-14 Weeks)'
              : isStagnant
              ? 'Career Acceleration Pathways (10-14 Weeks)'
              : isLaidOff
              ? 'Rapid Re-Employment Pathways (4-8 Weeks)'
              : isGig
              ? 'Enterprise Conversion Pathways (8-12 Weeks)'
              : 'Full Career Reboot Pathways (12-16 Weeks)'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('sprint')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'sprint'
              ? 'bg-white dark:bg-slate-900 text-[#0B4F9C] dark:text-sky-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Zap size={14} className="text-[#F26B1D]" />
          <span>
            {isStudent
              ? '30-Day Placement Execution Sprint'
              : isStagnant
              ? '30-Day Stagnation Breakout Sprint'
              : isLaidOff
              ? '30-Day Emergency Re-Employment Sprint'
              : isGig
              ? '30-Day Enterprise Transition Sprint'
              : '30-Day Intensive Re-Entry Action Sprint'}
          </span>
        </button>
      </div>

      {/* 4. Render Selected View */}
      {activeTab === 'pathways' ? (
        isLoading && !data && isReturner ? (
          <Skeleton variant="card" className="h-64" />
        ) : (
          <div className="space-y-6">
            {/* 3 Path Cards (Safe / Stretch / Switch) */}
            <PathCardsGrid
              pathways={pathways}
              selectedIndex={selectedIndex}
              onSelectIndex={setSelectedIndex}
            />

            {/* Selected Roadmap Timeline with Free Courses */}
            <RoadmapTimeline pathway={selectedPathway} />
          </div>
        )
      ) : (
        /* 30-Day Action Sprint Component Integrated Seamlessly */
        <ReentryRoadmap />
      )}
    </div>
  )
}
