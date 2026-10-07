import {
  Activity,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useUserProfile } from '@/store/userProfileStore'

export default function CareerGrowthDashboard({
  currentRole,
  experienceYears = 3.2,
  currentSalary: propCurrentSalary,
}: {
  currentRole?: string
  experienceYears?: number
  currentSalary?: number
}) {
  const { t } = useTranslation()
  const { currentSalaryLPA: defaultSalary, targetHikePercent, targetRole, currentRole: storeCurrentRole } = useUserProfile()

  const currentSalary = propCurrentSalary !== undefined ? propCurrentSalary : defaultSalary
  const roleTitle = currentRole || storeCurrentRole || targetRole || 'Technical Support Engineer / L2 Lead'

  // Stagnation diagnosis metrics
  const velocityScore = 38 // out of 100 (Slow Velocity)
  const marketPercentile = 32 // 32nd percentile
  const tenureDragPct = 42
  const skillFreshnessPct = 35

  // 3-Year Wealth Simulation
  const internal3YrTotal = Number((currentSalary * (1 + 0.08 + 0.08 * 1.08 + 0.08 * 1.08 * 1.08)).toFixed(1))
  const switchTargetSalary = Number((currentSalary * (1 + targetHikePercent / 100)).toFixed(1))
  const switch3YrTotal = Number((switchTargetSalary * (1 + 0.12 + 0.12 * 1.12 + 0.12 * 1.12 * 1.12)).toFixed(1))
  const threeYearDifference = Number((switch3YrTotal - internal3YrTotal).toFixed(1))

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-7">
      {/* ── 1. Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/60 dark:to-orange-950/60 text-rose-700 dark:text-rose-300 text-xs font-black mb-1.5 border border-rose-200/50">
            <Activity size={13} className="text-rose-600" />
            <span>{t('features.career-growth.badge', 'Diagnostic Audit • Career Velocity & Stagnation Scorecard')}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('features.career-growth.heading', 'Data-Backed Career Stagnation Diagnosis')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            {t('features.career-growth.subtitle', 'Diagnose whether your learning velocity, title elevation, and compensation are keeping pace with modern tech standards or experiencing operational tenure drag.')}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-right">
            <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">{t('features.career-growth.velocity_title', 'Growth Velocity')}</div>
            <div className="text-xl font-black text-rose-700 dark:text-rose-300">
              {velocityScore}/100 <span className="text-xs font-bold">({t('features.career-growth.stagnant_tag', 'Stagnant')})</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. KPI Cards Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">{t('features.career-growth.tenure_drag', 'Current Tenure')}</div>
          <div className="text-xl font-black text-slate-900 dark:text-white">{experienceYears} {t('onboarding.experience', 'Years')}</div>
          <div className="text-[11px] text-rose-500 font-semibold">{t('features.career-growth.tenure_drag', 'Tenure Drag')}</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">{t('onboarding.current_role', 'Current Role')}</div>
          <div className="text-sm font-black text-slate-900 dark:text-white truncate" title={roleTitle}>
            {roleTitle}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Legacy Support & Ops</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">{t('features.career-growth.skill_freshness', 'Modern Stack Index')}</div>
          <div className="text-xl font-black text-amber-500">
            {skillFreshnessPct}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium">4 Critical AI Gaps</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">{t('compensation.title', 'Current Salary')}</div>
          <div className="text-xl font-black text-emerald-600">₹{currentSalary} LPA</div>
          <div className="text-[11px] text-amber-600 font-semibold">P{marketPercentile} ({t('features.career-growth.market_percentile', 'Percentile')})</div>
        </div>
      </div>

      {/* ── 3. Diagnostic Breakdown Bars ── */}
      <div className="p-5 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
        <h4 className="text-sm font-black text-slate-900 dark:text-white">
          4-Factor Stagnation Diagnosis Breakdown
        </h4>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Tenure Drag (Repetitive Support Overhead)</span>
              <span className="text-rose-600 font-black">High Risk ({tenureDragPct}%)</span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: `${tenureDragPct}%` }} />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Over 65% of weekly hours spent answering identical troubleshooting tickets rather than writing production code.
            </p>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Modern Tech Exposure (AI / Cloud / Microservices)</span>
              <span className="text-amber-500 font-black">Moderate Gap ({skillFreshnessPct}%)</span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${skillFreshnessPct}%` }} />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Current organization has not implemented GenAI/RAG, FastAPI, or modern Docker orchestration in your unit.
            </p>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Internal Appraisal Ceiling</span>
              <span className="text-rose-600 font-black">7% - 9% Typical Annual Band</span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-rose-400 rounded-full" style={{ width: `30%` }} />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Standard internal appraisal cycles will take 4+ years to reach the ₹{switchTargetSalary}+ LPA compensation available on external lateral switch.
            </p>
          </div>
        </div>
      </div>

      {/* ── 4. The 3-Year Opportunity Cost Simulation ── */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-50/90 via-emerald-50/40 to-slate-50 dark:from-slate-800 dark:via-blue-950/30 dark:to-slate-900 border-2 border-[#0B4F9C]/30 dark:border-blue-800/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-700/80 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#0B4F9C] dark:text-sky-400">
              {t('features.career-growth.wealth_sim_title', 'Financial Opportunity Cost Analysis')}
            </span>
            <h4 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {t('features.career-growth.wealth_sim_title', '3-Year Earnings: Staying vs Lateral Switch')}
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              ₹{threeYearDifference} Lakhs {t('features.career-growth.net_difference', 'Wealth Upside')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-500">{t('features.career-growth.stay_internal', 'Path A: Stay in Current Org (8% Hikes)')}</span>
              <span className="text-slate-700 dark:text-slate-300">Total: ₹{internal3YrTotal}L</span>
            </div>
            <div className="text-sm font-black text-slate-800 dark:text-slate-100">
              Year 3 Salary: ₹{(currentSalary * 1.25).toFixed(1)} LPA
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Comfortable, familiar domain, but compounding inflation and slow internal promotion bands drag down long-term market valuation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-blue-50/80 dark:from-slate-900 dark:to-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2 shadow-xs">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-emerald-700 dark:text-emerald-300">{t('features.career-growth.switch_external', 'Path B: Lateral Switch with GenAI Stack')} (+{targetHikePercent}%)</span>
              <span className="text-emerald-600 font-black">Total: ₹{switch3YrTotal}L</span>
            </div>
            <div className="text-sm font-black text-[#F26B1D]">
              Year 3 Salary: ₹{(switchTargetSalary * 1.25).toFixed(1)} LPA
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Immediate jump to ₹{switchTargetSalary} LPA by demonstrating 2 working GenAI/FastAPI PoCs, unlocking an extra <strong>₹{threeYearDifference} Lakhs</strong> over 3 years.
            </p>
          </div>
        </div>

        {/* ── 5. Connected Action Paths (Ready-to-Use) ── */}
        <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              {t('pathways.choose_strategy', 'Choose Your Action Plan:')}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {t('features.toolkit', 'Integrated Stagnation Breakout Tools')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              to="/features/manager-1on1"
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-[#0B4F9C] transition group shadow-2xs space-y-1 block"
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0B4F9C]">
                <span>{t('features.career-growth.practice_negotiation', 'Stay & Negotiate')}</span>
                <ArrowRight size={13} className="text-slate-400 group-hover:text-[#0B4F9C] transition" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Use replacement cost math & AI script for off-cycle hike.
              </p>
            </Link>

            <Link
              to="/features/notice-buyout"
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition group shadow-2xs space-y-1 block"
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600">
                <span>{t('features.notice-buyout.sidebar', 'Switch & Buyout')}</span>
                <ArrowRight size={13} className="text-slate-400 group-hover:text-amber-600 transition" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Break the 90-day notice trap & calculate net ROI (+₹8.4L).
              </p>
            </Link>

            <Link
              to="/features/stay-or-switch"
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition group shadow-2xs space-y-1 block"
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600">
                <span>{t('features.stay-or-switch.tab_companies', 'Hiring Companies')}</span>
                <ArrowRight size={13} className="text-slate-400 group-hover:text-emerald-600 transition" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                View 10+ target firms (Razorpay, Barclays, Lowe's) with 45-75% hikes.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
