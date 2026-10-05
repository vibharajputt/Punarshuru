import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, CheckCircle2, Circle, BookOpen, MessageSquare, GraduationCap, TrendingUp, Briefcase, Clock } from 'lucide-react'
import { useProfileStore } from '@/store/profileStore'
import { getRole30DayPlan } from '@/components/pathways/defaultPathways'

export interface WeekPlan {
  week: number
  title: string
  focus: string
  hours: number
  tasks: { id: string; text: string; type: 'learn' | 'practice' | 'project' | 'interview' }[]
  recommendedCourses: { title: string; provider: string; url: string; free: boolean }[]
  mockInterviewQ: string
}

export default function ReentryRoadmap() {
  const profile = useProfileStore((s) => s.profile)
  const userType = profile?.user_type || 'returner'
  const isStudent = userType === 'student'
  const isStagnant = userType === 'stagnant'
  const isLaidOff = userType === 'laid_off'
  const isGig = userType === 'gig'

  const planData: WeekPlan[] = getRole30DayPlan(userType)

  const [completedTasks, setCompletedTasks] = useState<string[]>([
    'w1-1',
    'st-w1-1',
    'sg-w1-1',
    'lo-w1-1',
    'gg-w1-1',
  ])
  const [activeWeek, setActiveWeek] = useState<number>(1)

  const toggleTask = (id: string) => {
    setCompletedTasks((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
  }

  const allTaskIds = planData.flatMap((w) => w.tasks.map((t) => t.id))
  const progressPct = Math.round(
    (completedTasks.filter((id) => allTaskIds.includes(id)).length / allTaskIds.length) * 100
  )

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0B4F9C] dark:text-sky-300 text-xs font-bold mb-1">
            {isStudent ? (
              <GraduationCap size={13} className="text-[#F26B1D]" />
            ) : isStagnant ? (
              <TrendingUp size={13} className="text-emerald-600" />
            ) : isLaidOff ? (
              <Clock size={13} className="text-amber-500" />
            ) : isGig ? (
              <Briefcase size={13} className="text-purple-600" />
            ) : (
              <Calendar size={12} />
            )}
            <span>
              {isStudent
                ? 'Campus Placement Sprint • 30-Day Intensive Execution'
                : isStagnant
                ? 'Promotion & Salary Leap Sprint • 30-Day Execution'
                : isLaidOff
                ? 'Rapid Re-Employment Sprint • 30-Day Fast-Track'
                : isGig
                ? 'Enterprise Full-Time Conversion Sprint • 30-Day Checklist'
                : 'Returner Action Sprint • 30-Day Intensive Checklist'}
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            {isStudent
              ? '4-Week Campus-to-Corporate Placement Sprint'
              : isStagnant
              ? '4-Week Promotion & 40%+ Hike Acceleration Sprint'
              : isLaidOff
              ? '4-Week Rapid Re-Employment & 0-Day Notice Sprint'
              : isGig
              ? '4-Week Freelancer-to-Fulltime Enterprise Sprint'
              : '4-Week Intensive Career Re-Entry Action Sprint'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isStudent
              ? 'Day-by-day practical execution plan: Placement DSA patterns, Docker containerization, live AWS deployment, and placed senior mock rounds.'
              : isStagnant
              ? 'Action plan to build high-visibility AI/Cloud PoCs, calculate quantifiable business cost savings, and negotiate a 40%+ salary hike.'
              : isLaidOff
              ? 'Fast-track checklist: 0-day notice activation, high-velocity referral outreach, system design drills, and multi-offer closure.'
              : isGig
              ? 'Convert freelance client projects into tested enterprise repositories, setup CI/CD pipelines, and land full-time roles with stability & benefits.'
              : 'Day-by-day hands-on checklist with curated free courses, capstone AI integration project & weekly mock interview practice.'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full sm:w-48 space-y-1.5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-500">Plan Progress</span>
            <span className="text-[#0B4F9C] dark:text-sky-400">{progressPct}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#0B4F9C] to-[#F26B1D] transition-all duration-500 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Week Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {planData.map((w) => {
          const weekTaskIds = w.tasks.map((t) => t.id)
          const weekDoneCount = weekTaskIds.filter((id) => completedTasks.includes(id)).length
          const isCurrent = activeWeek === w.week

          return (
            <button
              key={w.week}
              onClick={() => setActiveWeek(w.week)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isCurrent
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-[#0B4F9C] dark:border-sky-500 ring-2 ring-blue-500/20'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300'
              }`}
            >
              <div className="text-[11px] font-bold text-slate-400 uppercase">Week {w.week}</div>
              <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                {w.title.split('—')[1] || w.title}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold mt-1">
                {weekDoneCount}/{w.tasks.length} tasks completed
              </div>
            </button>
          )
        })}
      </div>

      {/* Active Week Content */}
      {planData
        .filter((w) => w.week === activeWeek)
        .map((week) => (
          <motion.div
            key={week.week}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700">
              <div className="text-xs font-bold text-[#0B4F9C] dark:text-sky-400 uppercase tracking-wide">
                Target Focus ({week.hours} Hours / Week)
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium leading-relaxed">
                {week.focus}
              </p>
            </div>

            {/* Action Tasks */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Week {week.week} Action Checklist
              </h4>
              <div className="space-y-2">
                {week.tasks.map((task) => {
                  const done = completedTasks.includes(task.id)
                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        done
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-[#0B4F9C]/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {done ? (
                          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                        ) : (
                          <Circle size={18} className="text-slate-300 dark:text-slate-600 shrink-0" />
                        )}
                        <span
                          className={`text-xs font-medium ${
                            done ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {task.text}
                        </span>
                      </div>

                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">
                        {task.type}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Free Courses & Interview Question */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {/* Courses */}
              <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                  <BookOpen size={14} className="text-[#0B4F9C]" />
                  <span>Curated Free Resources</span>
                </div>
                <div className="space-y-1.5">
                  {week.recommendedCourses.map((c, i) => (
                    <a
                      key={i}
                      href={c.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 hover:border-blue-400 text-xs text-slate-700 dark:text-slate-200 group"
                    >
                      <span className="font-medium group-hover:text-[#0B4F9C] truncate">{c.title}</span>
                      <span className="text-[10px] font-bold text-[#F26B1D] shrink-0 ml-2">{c.provider} ↗</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Mock Interview Q */}
              <div className="p-4 rounded-2xl border border-blue-100 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B4F9C] dark:text-sky-400">
                  <MessageSquare size={14} />
                  <span>Mock Interview Question of the Week</span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold italic">
                  "{week.mockInterviewQ}"
                </p>
                <p className="text-[11px] text-slate-500">
                  {isStudent
                    ? 'Practice answering with runtime complexity and structural design trade-offs.'
                    : 'Practice framing your answer emphasizing foundational Java architecture + modern Spring Boot upgrades.'}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
    </div>
  )
}
