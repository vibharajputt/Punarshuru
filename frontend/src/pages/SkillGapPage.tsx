import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Target, Sparkles, ArrowRight, RefreshCw, Layers } from 'lucide-react'
import { useProfileStore } from '@/store/profileStore'
import { assessApi } from '@/lib/api'
import SkillRadar from '@/components/charts/SkillRadar'
import SkillCategorizationCards from '@/components/skillgap/SkillCategorizationCards'
import HiddenStrengthsCard from '@/components/skillgap/HiddenStrengthsCard'
import Skeleton from '@/components/common/Skeleton'

const benchmarkRoles = [
  'GenAI Engineer',
  'Logistics Tech Analyst',
  'Automation QA / SDET',
  'AI Chatbot Trainer / Product Analyst',
  'Senior Python Developer',
  'DevOps Engineer',
  'Full Stack Developer (React + Node)',
]

export default function SkillGapPage() {
  const profile = useProfileStore((s) => s.profile)
  const [selectedRole, setSelectedRole] = useState<string>(
    profile?.target_role || 'GenAI Engineer'
  )

  const { data: gapData, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['gap', profile?.id, selectedRole],
    queryFn: () => (profile?.id ? assessApi.gap(profile.id, selectedRole) : null),
    enabled: !!profile?.id,
    staleTime: 60_000,
  })

  const matchPct = gapData?.match_pct || 40
  const haveSkills = gapData?.have_skills || profile?.skills_raw || ['Java', 'MySQL', 'REST APIs', 'Git']
  const partialSkills = gapData?.partial_skills || [
    { skill: 'Python', matched_with: 'Java', similarity: 0.82 },
  ]
  const missingSkills = gapData?.missing_skills || ['LangChain', 'Vector Databases', 'Prompt Engineering', 'RAG']
  const radarData = gapData?.radar || [
    { category: 'AI/LLM', have: 1, required: 4, pct: 25 },
    { category: 'Backend', have: 4, required: 4, pct: 100 },
    { category: 'Frontend', have: 2, required: 3, pct: 66 },
    { category: 'Database', have: 3, required: 3, pct: 100 },
    { category: 'DevOps', have: 1, required: 3, pct: 33 },
  ]

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Skill Gap & Competency Radar
            </h1>
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-100 dark:bg-blue-950 text-[#0B4F9C] dark:text-sky-300">
              Taxonomy Matcher
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Exact, partial (≥75% fuzzy) and missing skills audited against 300+ live job descriptions.
          </p>
        </div>

        <Link
          to="/pathways"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0B4F9C] text-white hover:bg-[#083b75] shadow-xs self-start md:self-auto transition-all"
        >
          <span>Generate Pathway</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Role Benchmark Selector */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Target size={14} className="text-[#0B4F9C]" /> Benchmark Target Role:
          </span>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-[11px] font-semibold text-slate-500 hover:text-[#0B4F9C] flex items-center gap-1"
          >
            <RefreshCw size={11} className={isFetching ? 'animate-spin' : ''} />
            Recalculate
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {benchmarkRoles.map((role) => {
            const active = selectedRole === role
            return (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  active
                    ? 'bg-[#0B4F9C] text-white border-[#0B4F9C] shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                {role}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Radar & Match Stats */}
      {isLoading && !gapData ? (
        <Skeleton variant="chart" className="h-80" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Radar Chart */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers size={16} className="text-[#0B4F9C]" />
                <span>Multi-Category Competency Radar</span>
              </h3>
              <span className="text-xs font-mono font-bold text-[#0B4F9C] dark:text-sky-400">
                {selectedRole}
              </span>
            </div>
            <SkillRadar data={radarData} height={280} />
          </div>

          {/* Match Score Summary */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Overall Compatibility Match
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 dark:text-white">
                  {Math.round(matchPct)}%
                </span>
                <span className="text-xs font-bold text-slate-500">
                  of required role skills met
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-[#0B4F9C] h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.round(matchPct)}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900">
                <p className="font-extrabold text-emerald-800 dark:text-emerald-300 text-lg">
                  {haveSkills.length}
                </p>
                <p className="text-[11px] text-slate-500 font-semibold">Have</p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900">
                <p className="font-extrabold text-amber-800 dark:text-amber-300 text-lg">
                  {partialSkills.length}
                </p>
                <p className="text-[11px] text-slate-500 font-semibold">Partial</p>
              </div>
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900">
                <p className="font-extrabold text-rose-800 dark:text-rose-300 text-lg">
                  {missingSkills.length}
                </p>
                <p className="text-[11px] text-slate-500 font-semibold">Missing</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900 text-xs flex items-center gap-2">
              <Sparkles size={16} className="text-[#F26B1D] shrink-0" />
              <span className="text-slate-700 dark:text-slate-300">
                Recommended 1st Focus: <strong>{missingSkills[0] || 'Modern AI Toolchain'}</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3-Column Categorization Cards */}
      <SkillCategorizationCards
        haveSkills={haveSkills}
        partialSkills={partialSkills}
        missingSkills={missingSkills}
      />

      {/* Hidden Strengths */}
      <HiddenStrengthsCard
        currentRole={profile?.current_role || 'Professional'}
        skills={profile?.skills_raw || haveSkills}
      />
    </div>
  )
}
