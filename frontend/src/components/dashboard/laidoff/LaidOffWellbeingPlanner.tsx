import { useState } from 'react'
import {
  Heart,
  Clock,
  CheckCircle2,
  Smile,
  Flame,
  Coffee,
  BookOpen,
  Send,
  Dumbbell,
} from 'lucide-react'

export interface RoutineBlock {
  id: string
  time: string
  title: string
  category: 'applications' | 'upskilling' | 'networking' | 'wellness'
  done: boolean
  icon: any
}

export default function LaidOffWellbeingPlanner() {
  const [selectedMood, setSelectedMood] = useState<'high' | 'neutral' | 'anxious'>('neutral')
  const [streakDays] = useState(8)

  const [routine, setRoutine] = useState<RoutineBlock[]>([
    {
      id: 'r-1',
      time: '09:00 AM – 11:00 AM',
      title: 'Targeted High-ROI Job Applications (3 Max)',
      category: 'applications',
      done: true,
      icon: Send,
    },
    {
      id: 'r-2',
      time: '11:30 AM – 01:30 PM',
      title: 'Hands-on Coding Sprint (PyTest / Playwright PoC)',
      category: 'upskilling',
      done: true,
      icon: BookOpen,
    },
    {
      id: 'r-3',
      time: '01:30 PM – 02:30 PM',
      title: 'Healthy Lunch & Tech Detox Walk',
      category: 'wellness',
      done: true,
      icon: Coffee,
    },
    {
      id: 'r-4',
      time: '03:00 PM – 04:30 PM',
      title: 'Networking & Ex-Colleague Outreach (2 Warm Messages)',
      category: 'networking',
      done: false,
      icon: Send,
    },
    {
      id: 'r-5',
      time: '05:30 PM – 06:30 PM',
      title: 'Workout / Jog / Mental Reset',
      category: 'wellness',
      done: false,
      icon: Dumbbell,
    },
  ])

  const toggleRoutine = (id: string) => {
    setRoutine(routine.map((r) => (r.id === id ? { ...r, done: !r.done } : r)))
  }

  const completedBlocks = routine.filter((r) => r.done).length

  return (
    <div className="space-y-6">
      {/* ── 1. Top Header ── */}
      <div className="bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-blue-500/10 dark:from-teal-950/30 dark:via-emerald-950/20 dark:to-slate-900 border border-teal-200/80 dark:border-teal-900/60 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-800 dark:text-teal-300 text-xs font-black mb-2">
            <Heart size={13} className="text-teal-600 fill-teal-600" />
            <span>Pillar 5 • Wellbeing, Routine & Mental Resilience</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Daily Re-Employment Routine & Resilience Tracker
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Maintain high structure, celebrate daily micro-wins, and eliminate layoff anxiety through daily discipline.
          </p>
        </div>

        {/* Streak Indicator */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs flex items-center gap-2 shadow-md">
          <Flame size={18} className="fill-white" />
          <div>
            <p className="text-[10px] text-orange-100 uppercase">Consistency Streak</p>
            <p className="text-base leading-none mt-0.5">{streakDays} Days Disciplined 🔥</p>
          </div>
        </div>
      </div>

      {/* ── 2. Daily Routine Planner ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Clock size={16} className="text-[#0B4F9C]" />
                <span>Today's Structured Schedule (दिन का टाइमटेबल)</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                {completedBlocks} of {routine.length} Blocks Completed Today
              </p>
            </div>

            <span className="text-xs font-black text-emerald-600">
              {Math.round((completedBlocks / routine.length) * 100)}% Done
            </span>
          </div>

          <div className="space-y-3">
            {routine.map((b) => {
              const Icon = b.icon
              return (
                <div
                  key={b.id}
                  onClick={() => toggleRoutine(b.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    b.done
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        b.done ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                      }`}
                    >
                      <Icon size={14} />
                    </div>
                    <div>
                      <p className={`text-xs font-black ${b.done ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                        {b.title}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{b.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold shrink-0">
                    {b.done ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 size={16} /> Completed
                      </span>
                    ) : (
                      <span className="text-slate-400">Click to complete</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Weekly Mood & Mental Resilience Check-In */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-bold">
              <Smile size={16} />
              <span>WEEKLY RESILIENCE CHECK-IN</span>
            </div>
            <h3 className="text-base font-black text-white">How Are You Feeling Today?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Job hunting can feel emotionally exhausting. Acknowledging your stress level helps avoid burnout.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                onClick={() => setSelectedMood('high')}
                className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                  selectedMood === 'high' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <span className="text-xl block">⚡</span>
                <span className="text-[10px] font-bold block mt-1">High Energy</span>
              </button>

              <button
                onClick={() => setSelectedMood('neutral')}
                className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                  selectedMood === 'neutral' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <span className="text-xl block">🎯</span>
                <span className="text-[10px] font-bold block mt-1">Focused</span>
              </button>

              <button
                onClick={() => setSelectedMood('anxious')}
                className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                  selectedMood === 'anxious' ? 'bg-rose-600 border-rose-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <span className="text-xl block">🌧️</span>
                <span className="text-[10px] font-bold block mt-1">Anxious</span>
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-xs space-y-1">
            <p className="font-bold text-teal-400">Punarshuru Community Tip:</p>
            <p className="text-[11px] text-slate-300">
              "Never apply to more than 5 jobs in a single day. Quality tailored applications convert 7x better than 50 generic one-click Easy Applies."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
