import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ArrowRight, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useProfileStore } from '@/store/profileStore'
import { pathwayApi } from '@/lib/api'
import PathCardsGrid from '@/components/pathways/PathCardsGrid'
import RoadmapTimeline from '@/components/pathways/RoadmapTimeline'
import Skeleton from '@/components/common/Skeleton'
import { defaultPathways } from '@/components/pathways/defaultPathways'
import type { PathwayOption } from '@/types'

export default function PathPage() {
  const { t } = useTranslation()
  const profile = useProfileStore((s) => s.profile)
  const [selectedIndex, setSelectedIndex] = useState<number>(1) // Default to Stretch

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['pathway', profile?.id],
    queryFn: () => (profile?.id ? pathwayApi.get(profile.id) : null),
    enabled: !!profile?.id,
    staleTime: 60_000,
  })

  const pathways: PathwayOption[] =
    data?.pathways && data.pathways.length >= 3 ? data.pathways : defaultPathways
  const selectedPathway = pathways[selectedIndex] || pathways[0]

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('pathways.title', 'My Path')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t('pathways.subtitle', '3 personalized career roadmaps tailored to your skills, time commitment, and salary target.')}
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

      {isLoading && !data ? (
        <Skeleton variant="card" className="h-64" />
      ) : (
        <>
          {/* 2. 3 Path Cards (Safe / Stretch / Switch) */}
          <PathCardsGrid
            pathways={pathways}
            selectedIndex={selectedIndex}
            onSelectIndex={setSelectedIndex}
          />

          {/* 3. Selected Roadmap Timeline with Free Courses */}
          <RoadmapTimeline pathway={selectedPathway} />
        </>
      )}
    </div>
  )
}
