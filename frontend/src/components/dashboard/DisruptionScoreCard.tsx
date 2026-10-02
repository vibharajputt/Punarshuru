import { motion } from 'framer-motion'
import { ShieldAlert, CheckCircle2, AlertTriangle, Info } from 'lucide-react'
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

  const getRiskExplanation = () => {
    if (score <= 35) {
      return {
        badge: '🟢 Low Risk',
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300',
        text: 'Your current skills are well-aligned with active hiring trends. Keep up-to-date with emerging tools.',
        icon: CheckCircle2,
      }
    }
    if (score <= 65) {
      return {
        badge: '🟡 Moderate Risk',
        bg: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300',
        text: 'Some of your skills are facing partial automation or market stagnation. Adding 1-2 new skills is recommended.',
        icon: AlertTriangle,
      }
    }
    return {
      badge: '🔴 High Disruption Exposure',
      bg: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300',
      text: 'High automation risk or career gap detected. Upskilling in AI & modern frameworks is strongly recommended.',
      icon: ShieldAlert,
    }
  }

  const riskInfo = getRiskExplanation()
  const RiskIcon = riskInfo.icon

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Disruption Score Audit</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0B4F9C] dark:text-sky-300">
              AI Skill Audit
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Evaluating career gap, automation vulnerability, and market demand for {userName} ({currentRole})
          </p>
        </div>
      </div>

      {/* Easy-to-Understand Risk Summary Banner */}
      <div className={`p-4 rounded-2xl border ${riskInfo.bg} flex items-start gap-3 text-xs`}>
        <RiskIcon size={18} className="shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-extrabold uppercase tracking-wider">{riskInfo.badge}</span>
            <span className="text-[10px] opacity-80">(Score: {score}/100)</span>
          </div>
          <p className="font-medium leading-relaxed">{riskInfo.text}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Score Ring */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3">
          <ScoreRing
            score={score}
            size={180}
            strokeWidth={14}
            label="Overall Disruption Index"
            subtitle={`${score}/100 Risk Index`}
            showRiskBadge={true}
          />

          {/* Simple 3-Tier Legend */}
          <div className="w-full pt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] space-y-1">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1 font-bold"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"/> 0 - 35</span>
              <span>Low Risk (Safe)</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1 font-bold"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block"/> 36 - 65</span>
              <span>Moderate Risk</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1 font-bold"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block"/> 66 - 100</span>
              <span>High Risk (Upgrade Needed)</span>
            </div>
          </div>
        </div>

        {/* Right: Breakdown Progress Bars */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Info size={14} className="text-[#0B4F9C]" />
              <span>5 Factor Risk Breakdown</span>
            </span>
            <span className="text-[11px] text-slate-400">Lower score is better</span>
          </div>

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
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, delay: idx * 0.08 }}
                    className={`${f.color} h-full rounded-full`}
                  />
                </div>
                {f.reason && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                    💡 {f.reason}
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
