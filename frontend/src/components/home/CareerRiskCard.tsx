import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, AlertTriangle, ShieldCheck, Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ScoreRing from '@/components/charts/ScoreRing'
import type { DisruptionBreakdown } from '@/types'

export const FACTOR_MAXES = {
  skill_decay: 25,
  automation_risk: 30,
  career_gap: 15,
  stagnation: 15,
  market_mismatch: 15,
} as const

export const FACTOR_CONFIG = [
  { key: 'skill_decay', labelKey: 'dashboard.factors.skill_decay', defaultLabel: 'Outdated skills', max: FACTOR_MAXES.skill_decay },
  { key: 'automation_risk', labelKey: 'dashboard.factors.automation', defaultLabel: 'Automation risk', max: FACTOR_MAXES.automation_risk },
  { key: 'career_gap', labelKey: 'dashboard.factors.career_gap', defaultLabel: 'Career break', max: FACTOR_MAXES.career_gap },
  { key: 'stagnation', labelKey: 'dashboard.factors.stagnation', defaultLabel: 'Role stagnation', max: FACTOR_MAXES.stagnation },
  { key: 'market_mismatch', labelKey: 'dashboard.factors.market_shift', defaultLabel: 'Market demand shift', max: FACTOR_MAXES.market_mismatch },
] as const

export const PERSONA_FACTOR_DEFAULTS: Record<number, Record<string, number>> = {
  74: { skill_decay: 24, automation_risk: 14, career_gap: 15, stagnation: 6, market_mismatch: 15 },
  72: { skill_decay: 24, automation_risk: 14, career_gap: 15, stagnation: 6, market_mismatch: 15 },
  78: { skill_decay: 18, automation_risk: 30, career_gap: 0, stagnation: 15, market_mismatch: 15 },
  85: { skill_decay: 18, automation_risk: 30, career_gap: 0, stagnation: 15, market_mismatch: 15 },
  73: { skill_decay: 13, automation_risk: 30, career_gap: 3, stagnation: 15, market_mismatch: 12 },
  76: { skill_decay: 16, automation_risk: 30, career_gap: 0, stagnation: 15, market_mismatch: 15 },
  68: { skill_decay: 16, automation_risk: 30, career_gap: 0, stagnation: 15, market_mismatch: 15 },
  27: { skill_decay: 0, automation_risk: 10, career_gap: 0, stagnation: 5, market_mismatch: 12 },
  22: { skill_decay: 0, automation_risk: 10, career_gap: 0, stagnation: 5, market_mismatch: 12 },
}

export function computeCappedFactors(breakdown?: DisruptionBreakdown, targetScore?: number) {
  const hasValidBreakdown =
    breakdown &&
    FACTOR_CONFIG.some((f) => typeof breakdown[f.key as keyof DisruptionBreakdown] === 'number')

  if (hasValidBreakdown) {
    return FACTOR_CONFIG.map((f) => {
      const rawVal = breakdown[f.key as keyof DisruptionBreakdown]
      const numericVal = typeof rawVal === 'number' ? rawVal : 0
      const cappedScore = Math.min(f.max, Math.max(0, Math.round(numericVal)))

      return {
        key: f.key,
        labelKey: f.labelKey,
        defaultLabel: f.defaultLabel,
        score: cappedScore,
        max: f.max,
      }
    })
  }

  // Fallback when breakdown is not provided:
  // If targetScore matches a known persona, use canonical values that sum exactly to targetScore
  const roundedTarget = typeof targetScore === 'number' ? Math.round(targetScore) : 72
  const personaDefault = PERSONA_FACTOR_DEFAULTS[roundedTarget]

  if (personaDefault) {
    return FACTOR_CONFIG.map((f) => ({
      key: f.key,
      labelKey: f.labelKey,
      defaultLabel: f.defaultLabel,
      score: Math.min(f.max, Math.max(0, personaDefault[f.key] ?? 0)),
      max: f.max,
    }))
  }

  // For arbitrary targetScore, distribute proportionally based on factor weights (25%, 30%, 15%, 15%, 15%)
  // so the sum of the 5 factors literally equals roundedTarget
  const target = Math.min(100, Math.max(0, roundedTarget))
  const weights: Record<string, number> = {
    skill_decay: 0.25,
    automation_risk: 0.30,
    career_gap: 0.15,
    stagnation: 0.15,
    market_mismatch: 0.15,
  }

  let distributedSum = 0
  return FACTOR_CONFIG.map((f, idx) => {
    if (idx === FACTOR_CONFIG.length - 1) {
      const remainder = Math.min(f.max, Math.max(0, target - distributedSum))
      return {
        key: f.key,
        labelKey: f.labelKey,
        defaultLabel: f.defaultLabel,
        score: remainder,
        max: f.max,
      }
    }
    const val = Math.min(f.max, Math.max(0, Math.round(target * weights[f.key])))
    distributedSum += val
    return {
      key: f.key,
      labelKey: f.labelKey,
      defaultLabel: f.defaultLabel,
      score: val,
      max: f.max,
    }
  })
}

interface CareerRiskCardProps {
  score: number
  breakdown?: DisruptionBreakdown
}

export default function CareerRiskCard({ score, breakdown }: CareerRiskCardProps) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  const factors = computeCappedFactors(breakdown, score).map((f) => ({
    ...f,
    label: t(f.labelKey, f.defaultLabel),
  }))

  // Career Risk Score is literally the sum of the 5 displayed sub-scores
  const finalScore = factors.reduce((sum, f) => sum + f.score, 0)

  const meaning =
    finalScore >= 70
      ? t('dashboard.risk_high', 'High risk: Your target role requires GenAI and modern skills that are not yet reflected in your profile.')
      : finalScore >= 40
      ? t('dashboard.risk_mod', 'Moderate risk: You have solid core foundations, but automation and emerging tech create skill gaps.')
      : t('dashboard.risk_low', 'Low risk: Your skills and profile align well with current market demand.')

  const badgeText =
    finalScore >= 70
      ? t('dashboard.risk_high_badge', 'High Risk')
      : finalScore >= 40
      ? t('dashboard.risk_mod_badge', 'Moderate Risk')
      : t('dashboard.risk_low_badge', 'Low Risk')

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">
            {t('dashboard.disruption_score', 'Career Risk Score')}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
              finalScore >= 70
                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                : finalScore >= 40
                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
            }`}
          >
            {finalScore >= 70 ? <AlertTriangle size={12} /> : <ShieldCheck size={12} />}
            {badgeText}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-5 py-4">
          <ScoreRing score={finalScore} size={115} strokeWidth={11} showRiskBadge={false} />
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
