import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, AlertTriangle, ShieldCheck, Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ScoreRing from '@/components/charts/ScoreRing'
import type { DisruptionBreakdown } from '@/types'

interface CareerRiskCardProps {
  score: number
  breakdown?: DisruptionBreakdown
}

export default function CareerRiskCard({ score, breakdown }: CareerRiskCardProps) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  const meaning =
    score >= 70
      ? t('dashboard.risk_high', 'High risk: Your target role requires GenAI and modern skills that are not yet reflected in your profile.')
      : score >= 40
      ? t('dashboard.risk_mod', 'Moderate risk: You have solid core foundations, but automation and emerging tech create skill gaps.')
      : t('dashboard.risk_low', 'Low risk: Your skills and profile align well with current market demand.')

  const badgeText =
    score >= 70
      ? t('dashboard.risk_high_badge', 'High Risk')
      : score >= 40
      ? t('dashboard.risk_mod_badge', 'Moderate Risk')
      : t('dashboard.risk_low_badge', 'Low Risk')

  const factors = [
    { label: t('dashboard.factors.skill_decay', 'Outdated skills'), score: breakdown?.skill_decay ?? 26, max: 35 },
    { label: t('dashboard.factors.automation', 'Automation risk'), score: breakdown?.automation_risk ?? 22, max: 30 },
    { label: t('dashboard.factors.career_gap', 'Career break'), score: breakdown?.career_gap ?? 14, max: 20 },
    { label: t('dashboard.factors.stagnation', 'Role stagnation'), score: breakdown?.stagnation ?? 8, max: 15 },
    { label: t('dashboard.factors.market_shift', 'Market demand shift'), score: breakdown?.market_mismatch ?? 6, max: 15 },
  ]

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">
            {t('dashboard.disruption_score', 'Career Risk Score')}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
              score >= 70
                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                : score >= 40
                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
            }`}
          >
            {score >= 70 ? <AlertTriangle size={12} /> : <ShieldCheck size={12} />}
            {badgeText}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-5 py-4">
          <ScoreRing score={score} size={115} strokeWidth={11} showRiskBadge={false} />
          <div className="space-y-1 text-center sm:text-left flex-1">
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {meaning}
            </p>
            <p className="text-[11px] text-slate-400">
              {t('dashboard.risk_calc_note', 'Score calculated from your verified skills, experience, and market trends.')}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-xs font-bold text-[#0B4F9C] dark:text-sky-400 hover:text-[#083b75] transition-colors py-1 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Info size={13} />
            <span>{expanded ? t('dashboard.hide_factors', 'Hide 5-factor breakdown') : t('dashboard.see_factors', 'See why (5 factors)')}</span>
          </span>
          <ChevronDown
            size={15}
            className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2.5 pt-3 overflow-hidden text-xs"
            >
              {factors.map((f) => (
                <div key={f.label} className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400">
                    <span>{f.label}</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {f.score}/{f.max}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-[#0B4F9C] rounded-full"
                      style={{ width: `${Math.min(100, (f.score / f.max) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
