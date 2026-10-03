import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ExternalLink,
  Clock,
  BookOpen,
  CheckCircle2,
  Circle,
  TrendingDown,
  Sparkles,
  RotateCcw,
  Trophy,
} from 'lucide-react'
import type { PathwayOption } from '@/types'
import { useProfileStore } from '@/store/profileStore'

interface RoadmapTimelineProps {
  pathway: PathwayOption
}

export default function RoadmapTimeline({ pathway }: RoadmapTimelineProps) {
  const profile = useProfileStore((s) => s.profile)
  const completedMilestones = useProfileStore((s) => s.completedMilestones)
  const completedCourses = useProfileStore((s) => s.completedCourses)
  const baselineScore = useProfileStore((s) => s.baselineDisruptionScore) ?? profile?.disruption_score ?? 72
  const toggleMilestone = useProfileStore((s) => s.toggleMilestone)
  const toggleCourse = useProfileStore((s) => s.toggleCourse)
  const resetMilestones = useProfileStore((s) => s.resetMilestones)

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const totalSteps = pathway.roadmap.length
  const completedStepCount = pathway.roadmap.filter((_, idx) =>
    completedMilestones.includes(`${pathway.type}-${idx}`),
  ).length

  const progressPct = totalSteps > 0 ? Math.round((completedStepCount / totalSteps) * 100) : 0
  const currentScore = profile?.disruption_score ?? baselineScore
  const scoreSaved = Math.max(0, baselineScore - currentScore)

  const handleStepToggle = (idx: number, stepTitle: string, skills: string[]) => {
    const key = `${pathway.type}-${idx}`
    const isNowDone = !completedMilestones.includes(key)
    toggleMilestone(key, skills)

    if (isNowDone) {
      setToastMessage(`🎉 Milestone "${stepTitle}" completed! Disruption reduced by -8 points.`)
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
            <button
              onClick={() => setToastMessage(null)}
              className="text-white/80 hover:text-white text-xs px-2"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Roadmap Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        {/* Header & Milestone Progress Bar */}
        <div className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen size={18} className="text-[#0B4F9C]" />
                <span>Live Execution Roadmap & Milestone Tracker</span>
              </h3>
              <p className="text-xs text-slate-500">
                Mark milestones as completed to dynamically reduce your Career Disruption Index.
              </p>
            </div>

            {completedStepCount > 0 && (
              <button
                onClick={resetMilestones}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 self-start sm:self-auto transition-all"
                title="Reset milestone progress"
              >
                <RotateCcw size={12} />
                <span>Reset Progress</span>
              </button>
            )}
          </div>

          {/* Dynamic Progress & Disruption Recovery Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-slate-50 to-emerald-50/50 dark:from-slate-800/80 dark:via-slate-800/40 dark:to-slate-800/80 border border-sky-100 dark:border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Progress Meter */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Trophy size={14} className="text-amber-500" />
                  <span>Pathway Progress: {completedStepCount} of {totalSteps} Milestones Done</span>
                </span>
                <span className="font-mono font-bold text-[#0B4F9C] dark:text-sky-400">
                  {progressPct}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-[#0B4F9C] via-[#0284c7] to-emerald-500"
                />
              </div>
            </div>

            {/* Dynamic Disruption Impact Badge */}
            <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 md:pl-5">
              <div className="space-y-0.5 text-right">
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Live Disruption Score
                </p>
                <div className="flex items-center gap-2 justify-end">
                  {scoreSaved > 0 && (
                    <span className="text-xs line-through text-slate-400 font-mono">
                      {baselineScore}
                    </span>
                  )}
                  <span className={`text-base font-black font-mono ${currentScore < 40 ? 'text-emerald-600' : 'text-[#0B4F9C] dark:text-sky-400'}`}>
                    {currentScore}/100
                  </span>
                </div>
              </div>

              {scoreSaved > 0 ? (
                <div className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-black flex items-center gap-1">
                  <TrendingDown size={14} />
                  <span>-{scoreSaved} pts</span>
                </div>
              ) : (
                <div className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-semibold">
                  Baseline
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline Steps */}
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
          {pathway.roadmap.map((step, idx) => {
            const stepKey = `${pathway.type}-${idx}`
            const isCompleted = completedMilestones.includes(stepKey)

            return (
              <motion.div
                key={idx}
                layout
                className={`relative p-5 rounded-3xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/80 shadow-xs'
                    : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/70 dark:border-slate-800'
                }`}
              >
                {/* Step marker circle */}
                <div
                  className={`absolute -left-9 sm:-left-11 top-4 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ring-4 ring-white dark:ring-slate-900 transition-colors ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-[#0B4F9C] text-white'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={14} /> : idx + 1}
                </div>

                {/* Header row with complete action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#0B4F9C] text-white text-[11px] font-mono font-bold">
                      {step.week_range}
                    </span>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      {step.title}
                    </h4>
                  </div>

                  {/* Toggle Milestone Button */}
                  <button
                    type="button"
                    onClick={() => handleStepToggle(idx, step.title, step.skills_covered)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all self-start sm:self-auto shadow-2xs ${
                      isCompleted
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-600'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 size={14} />
                        <span>Completed (Done)</span>
                      </>
                    ) : (
                      <>
                        <Circle size={14} className="text-slate-400" />
                        <span>Mark as Completed</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl pt-2">
                  {step.description}
                </p>

                {/* Skills pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <span className="text-[11px] font-bold text-slate-400 mr-1">Skills Targeted:</span>
                  {step.skills_covered.map((s) => (
                    <span
                      key={s}
                      className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-md border transition-all ${
                        isCompleted
                          ? 'bg-emerald-100 dark:bg-emerald-900/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {isCompleted ? '✓ ' : '+ '}{s}
                    </span>
                  ))}
                </div>

                {/* Recommended Free Courses Cards */}
                {step.courses && step.courses.length > 0 && (
                  <div className="space-y-2 pt-3">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span>Curated Zero-Cost Courses for this Milestone:</span>
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {step.courses.map((course) => {
                        const isCourseDone = completedCourses.includes(course.id)

                        return (
                          <div
                            key={course.id}
                            className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-2.5 shadow-2xs ${
                              isCourseDone
                                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700'
                                : 'bg-white dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700 hover:border-[#0B4F9C]'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-[#0B4F9C] dark:text-sky-300">
                                  {course.provider}
                                </span>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                  <span className="flex items-center gap-0.5">
                                    <Clock size={10} /> {course.weeks}w
                                  </span>
                                  <span className="uppercase font-semibold">{course.lang}</span>
                                </div>
                              </div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                                {course.title}
                              </p>
                            </div>

                            <div className="flex items-center justify-between text-[11px] font-bold pt-2 border-t border-slate-100 dark:border-slate-700/60">
                              <button
                                type="button"
                                onClick={() => toggleCourse(course.id)}
                                className={`flex items-center gap-1 transition-colors ${
                                  isCourseDone
                                    ? 'text-emerald-700 dark:text-emerald-300'
                                    : 'text-slate-500 hover:text-emerald-600'
                                }`}
                              >
                                <CheckCircle2 size={13} className={isCourseDone ? 'text-emerald-500' : 'text-slate-300'} />
                                <span>{isCourseDone ? 'Course Done' : 'Mark Course'}</span>
                              </button>

                              <a
                                href={course.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#0B4F9C] dark:text-sky-400 hover:underline flex items-center gap-1 font-semibold"
                              >
                                <span>Open Free Portal</span>
                                <ExternalLink size={11} />
                              </a>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
