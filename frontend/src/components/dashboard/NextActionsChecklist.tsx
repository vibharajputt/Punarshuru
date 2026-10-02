import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckSquare, Square, ArrowUpRight, Award, Map, Target } from 'lucide-react'

interface NextActionsChecklistProps {
  targetRole?: string
  topMissingSkill?: string
}

export default function NextActionsChecklist({
  targetRole = 'GenAI Engineer',
  topMissingSkill = 'Python & Vector Embeddings',
}: NextActionsChecklistProps) {
  const [completed, setCompleted] = useState<number[]>([])

  const toggleAction = (idx: number) => {
    setCompleted((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    )
  }

  const actions = [
    {
      id: 1,
      title: `Bridge Top Gap: ${topMissingSkill}`,
      desc: `Complete the week-1 milestone required for ${targetRole} transition.`,
      to: '/skill-gap',
      icon: Target,
      tag: 'Immediate Leverage',
    },
    {
      id: 2,
      title: 'Enroll in 1 Free SWAYAM / NPTEL Course',
      desc: 'Accredited certificate to prove recent academic & practical currency post-break.',
      to: '/pathways',
      icon: Map,
      tag: 'Zero Cost',
    },
    {
      id: 3,
      title: 'Generate Your Verified AI Talent Passport',
      desc: 'Publish your shareable URL slug and QR verification badge for recruiters.',
      to: '/passport',
      icon: Award,
      tag: 'Proof of Work',
    },
  ]

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Next 3 High-Impact Actions
          </h3>
          <p className="text-xs text-slate-500">
            Structured roadmap to reduce disruption risk by 40%+
          </p>
        </div>
        <span className="text-xs font-bold text-[#0B4F9C] dark:text-sky-300">
          {completed.length} of {actions.length} Completed
        </span>
      </div>

      <div className="space-y-3">
        {actions.map((act) => {
          const isDone = completed.includes(act.id)
          return (
            <div
              key={act.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                isDone
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 line-through opacity-75'
                  : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => toggleAction(act.id)}
                  className="mt-0.5 text-slate-400 hover:text-[#0B4F9C] dark:hover:text-sky-400"
                >
                  {isDone ? (
                    <CheckSquare size={18} className="text-emerald-600" />
                  ) : (
                    <Square size={18} />
                  )}
                </button>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {act.title}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0B4F9C] dark:text-sky-300">
                      {act.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {act.desc}
                  </p>
                </div>
              </div>

              <Link
                to={act.to}
                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[#0B4F9C] dark:text-sky-400 hover:bg-[#0B4F9C] hover:text-white dark:hover:bg-sky-500 dark:hover:text-slate-900 transition-all shrink-0"
              >
                <ArrowUpRight size={16} />
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
