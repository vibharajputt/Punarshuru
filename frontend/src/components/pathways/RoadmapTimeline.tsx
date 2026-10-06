import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Sparkles, RotateCcw, Trophy, ArrowDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { PathwayOption } from '@/types'
import { useProfileStore } from '@/store/profileStore'
import { useActiveProfile } from '@/hooks/useActiveProfile'
import RoadmapStepItem from '@/components/pathways/RoadmapStepItem'

interface RoadmapTimelineProps {
  pathway: PathwayOption
}

export default function RoadmapTimeline({ pathway }: RoadmapTimelineProps) {
  const { t, i18n } = useTranslation()
  const isHi = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('hi')

  const { profile } = useActiveProfile()
  const completedMilestones = useProfileStore((s) => s.completedMilestones)
  const baselineScore = useProfileStore((s) => s.baselineDisruptionScore) ?? profile?.disruption_score ?? 72
  const toggleMilestone = useProfileStore((s) => s.toggleMilestone)
  const resetMilestones = useProfileStore((s) => s.resetMilestones)

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const totalSteps = pathway.roadmap.length
  const completedStepCount = pathway.roadmap.filter((_, idx) =>
    completedMilestones.includes(`${pathway.type}-${idx}`)
  ).length

  const progressPct = totalSteps > 0 ? Math.round((completedStepCount / totalSteps) * 100) : 0
  const currentScore = profile?.disruption_score ?? baselineScore
  const scoreSaved = Math.max(0, baselineScore - currentScore)

  const handleStepToggle = (idx: number, stepTitle: string, skills: string[]) => {
    const key = `${pathway.type}-${idx}`
    const isNowDone = !completedMilestones.includes(key)
    toggleMilestone(key, skills)

    if (isNowDone) {
      setToastMessage(
        isHi
          ? `माइलस्टोन "${stepTitle}" पूरा हुआ! करियर रिस्क स्कोर में -8 अंकों की कमी हुई।`
          : `Milestone "${stepTitle}" completed! Career Risk Score reduced by -8 points.`
      )
      setTimeout(() => setToastMessage(null), 3500)
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Celebration Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="p-3.5 rounded-2xl bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={16} />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white text-xs px-2 cursor-pointer">
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Roadmap Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        {/* Header & Milestone Tracker */}
        <div className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen size={18} className="text-[#0B4F9C]" />
                <span>{t('pathways.execution_roadmap_title', 'Execution Roadmap & Free Courses')}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('pathways.execution_roadmap_sub', 'Complete milestones to dynamically lower your Career Risk Score.')}
              </p>
            </div>

            {completedStepCount > 0 && (
              <button
                onClick={resetMilestones}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-all cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>{t('pathways.reset', 'Reset')}</span>
              </button>
            )}
          </div>

          {/* Progress & Risk Score Recovery Meter */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-slate-50 to-emerald-50/50 dark:from-slate-850 dark:via-slate-850 dark:to-slate-800 border border-sky-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Trophy size={14} className="text-amber-500" />
                  <span>
                    {t('pathways.progress_text', `Pathway Progress: ${completedStepCount} of ${totalSteps} Milestones`, {
                      completed: completedStepCount,
                      total: totalSteps,
                    })}
                  </span>
                </span>
                <span className="font-mono font-bold text-[#0B4F9C] dark:text-sky-400">{progressPct}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#0B4F9C] to-emerald-500 transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 md:pl-5">
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  {t('dashboard.disruption_score', 'Career Risk Score')}
                </p>
                <span className="text-xl font-black font-mono text-[#0B4F9C] dark:text-sky-400">
                  {currentScore}/100
                </span>
              </div>
              {scoreSaved > 0 && (
                <span className="px-2 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-0.5">
                  <ArrowDown size={12} /> -{scoreSaved}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Steps List */}
        <div className="pt-2">
          {pathway.roadmap.map((step, idx) => (
            <RoadmapStepItem
              key={step.title}
              step={step}
              stepIndex={idx}
              isDone={completedMilestones.includes(`${pathway.type}-${idx}`)}
              onToggle={() => handleStepToggle(idx, step.title, step.skills_covered || [])}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
