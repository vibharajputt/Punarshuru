import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ArrowRight, RefreshCw, Zap } from 'lucide-react'
import { useProfileStore } from '@/store/profileStore'
import { assessApi } from '@/lib/api'
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
]

export default function SkillsPage() {
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

  const matchPct = gapData?.match_pct || 42
  const haveSkills = gapData?.have_skills || profile?.skills_raw || ['Java', 'MySQL', 'REST APIs', 'Git']
  const partialSkills = gapData?.partial_skills || [
    { skill: 'Python', matched_with: 'Java', similarity: 0.82 },
  ]
  const missingSkills = gapData?.missing_skills || ['LangChain', 'Vector Databases', 'Prompt Engineering', 'RAG']

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            My Skills
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit your competencies against live market benchmarks and bridge critical deficits.
          </p>
        </div>

        <Link
          to="/path"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-extrabold bg-[#0B4F9C] text-white hover:bg-[#083b75] shadow-md transition-all self-start sm:self-auto"
        >
          <span>View My Path</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* 2. Match % Card + Role Selector */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-500 flex items-center justify-center">
              <Zap size={18} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Target Role Benchmark
              </span>
              <span className="font-extrabold text-base text-slate-900 dark:text-white">
                {selectedRole}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="text-xs font-bold text-[#0B4F9C] dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              <RefreshCw size={12} className={isFetching ? 'animate-spin' : ''} />
              <span>Recalculate match</span>
            </button>
          </div>
        </div>

        {/* Role Selector Pills */}
        <div className="flex flex-wrap gap-1.5">
          {benchmarkRoles.map((role) => {
            const active = selectedRole === role
            return (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  active
                    ? 'bg-[#0B4F9C] text-white border-[#0B4F9C] shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                {role}
              </button>
            )
          })}
        </div>

        {/* Match Progress Bar */}
        {isLoading && !gapData ? (
          <Skeleton variant="chart" className="h-16" />
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/80 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Skills Match for {selectedRole}
              </span>
              <span className="text-2xl font-black text-[#0B4F9C] dark:text-sky-400">
                {Math.round(matchPct)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-[#0B4F9C] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.round(matchPct)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Have / Learning needed / Missing lists */}
      <SkillCategorizationCards
        haveSkills={haveSkills}
        partialSkills={partialSkills}
        missingSkills={missingSkills}
      />

      {/* 4. Hidden Strengths */}
      <HiddenStrengthsCard
        currentRole={profile?.current_role || 'Professional'}
        skills={profile?.skills_raw || haveSkills}
      />
    </div>
  )
}
