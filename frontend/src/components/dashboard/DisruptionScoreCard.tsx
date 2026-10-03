import { motion } from 'framer-motion'
import ScoreRing from '@/components/charts/ScoreRing'
import type { DisruptionResponse } from '@/types'

interface DisruptionScoreCardProps {
  disruption: DisruptionResponse | null
  score: number
  userName?: string
  currentRole?: string
}

export default function DisruptionScoreCard({
  disruption,
  score = 68,
  userName = 'Learner',
  currentRole = 'Professional',
}: DisruptionScoreCardProps) {
  const breakdown = disruption?.breakdown || {
    skill_decay: 18,
    automation_risk: 28,
    career_gap: 15,
    stagnation: 12,
    market_mismatch: 10,
    reasons: {
      skill_decay: 'Legacy frameworks require modernization toward cloud & AI tooling',
      automation_risk: `Routine execution tasks in ${currentRole} face GenAI automation`,
      career_gap: 'Career break requires updated demonstrable project proof',
      stagnation: 'Tenure in current band requires higher cognitive mobility',
      market_mismatch: 'Gap between existing toolset and active job openings',
    },
    top_risks: [],
    strengths: [],
  }

  const factors = [
    { label: 'Automation Exposure', score: breakdown.automation_risk, max: 35, color: 'bg-orange-500', reason: breakdown.reasons?.automation_risk },
    { label: 'Skill Obsolescence', score: breakdown.skill_decay, max: 25, color: 'bg-amber-500', reason: breakdown.reasons?.skill_decay },
    { label: 'Career Gap Penalty', score: breakdown.career_gap, max: 20, color: 'bg-rose-500', reason: breakdown.reasons?.career_gap },
    { label: 'Role Stagnation', score: breakdown.stagnation, max: 25, color: 'bg-purple-500', reason: breakdown.reasons?.stagnation },
    { label: 'Market Mismatch', score: breakdown.market_mismatch, max: 20, color: 'bg-blue-500', reason: breakdown.reasons?.market_mismatch },
  ]

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Disruption Score Audit
          </h2>
          <p className="text-xs text-slate-500">
            5-factor mathematical analysis for {userName} ({currentRole})
          </p>
        </div>
        <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-[#0B4F9C] dark:bg-sky-950 dark:text-sky-300 self-start sm:self-auto">
          Deterministic AI Model
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Score Ring */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <ScoreRing
            score={score}
            size={180}
            strokeWidth={14}
            label="Overall Disruption Index"
            subtitle={`${score}/100 Risk Index`}
            showRiskBadge={true}
          />
        </div>

        {/* Right: Breakdown Progress Bars */}
        <div className="lg:col-span-8 space-y-3.5">
          {factors.map((f, idx) => {
            const pct = Math.min(100, Math.round((f.score / f.max) * 100))
            return (
              <div key={f.label} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">{f.label}</span>
                  <span className="text-slate-500 font-mono">
                    {f.score} / {f.max} ({pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, delay: idx * 0.08 }}
                    className={`${f.color} h-full rounded-full`}
                  />
                </div>
                {f.reason && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                    {f.reason}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
