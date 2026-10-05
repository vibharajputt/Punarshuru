import {
  Activity,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CareerGrowthDashboard({
  currentRole = 'Technical Support Engineer / L2 Lead',
  experienceYears = 3.2,
  currentSalary = 6.8,
}: {
  currentRole?: string
  experienceYears?: number
  currentSalary?: number
}) {

  // Stagnation diagnosis metrics
  const velocityScore = 38 // out of 100 (Slow Velocity)
  const marketPercentile = 32 // 32nd percentile
  const tenureDragPct = 42
  const skillFreshnessPct = 35

  // 3-Year Wealth Simulation
  const internal3YrTotal = Number((currentSalary * (1 + 0.08 + 0.08 * 1.08 + 0.08 * 1.08 * 1.08)).toFixed(1))
  const switchTargetSalary = Number((currentSalary * 1.45).toFixed(1))
  const switch3YrTotal = Number((switchTargetSalary * (1 + 0.12 + 0.12 * 1.12 + 0.12 * 1.12 * 1.12)).toFixed(1))
  const threeYearDifference = Number((switch3YrTotal - internal3YrTotal).toFixed(1))

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-7">
      {/* ── 1. Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/60 dark:to-orange-950/60 text-rose-700 dark:text-rose-300 text-xs font-black mb-1.5 border border-rose-200/50">
            <Activity size={13} className="text-rose-600" />
            <span>Diagnostic Audit • Career Velocity & Stagnation Scorecard</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Data-Backed Career Stagnation Diagnosis
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            Diagnose whether your learning velocity, title elevation, and compensation are keeping pace with modern tech standards or experiencing operational tenure drag.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-right">
            <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">Growth Velocity</div>
            <div className="text-xl font-black text-rose-700 dark:text-rose-300">
              {velocityScore}/100 <span className="text-xs font-bold">(Stagnant)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. KPI Cards Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Current Tenure</div>
          <div className="text-xl font-black text-slate-900 dark:text-white">{experienceYears} Years</div>
          <div className="text-[11px] text-rose-500 font-semibold">Tenure Drag Risk</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Current Role</div>
          <div className="text-sm font-black text-slate-900 dark:text-white truncate" title={currentRole}>
            {currentRole}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Legacy Support & Ops</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Modern Stack Index</div>
          <div className="text-xl font-black text-amber-500">
            {skillFreshnessPct}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium">4 Critical AI Gaps</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Current Salary</div>
          <div className="text-xl font-black text-emerald-600">₹{currentSalary} LPA</div>
          <div className="text-[11px] text-amber-600 font-semibold">P{marketPercentile} (32% Percentile)</div>
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
              Standard internal appraisal cycles will take 4+ years to reach the ₹12+ LPA compensation available on external lateral switch.
            </p>
          </div>
        </div>
      </div>

      {/* ── 4. The 3-Year Opportunity Cost Simulation ── */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-50/90 via-emerald-50/40 to-slate-50 dark:from-slate-800 dark:via-blue-950/30 dark:to-slate-900 border-2 border-[#0B4F9C]/30 dark:border-blue-800/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-700/80 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#0B4F9C] dark:text-sky-400">
              Financial Opportunity Cost Analysis
            </span>
            <h4 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              3-Year Earnings: Staying vs Lateral Switch
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              ₹{threeYearDifference} Lakhs Wealth Upside
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-500">Path A: Stay in Current Org (8% Hikes)</span>
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
              <span className="text-emerald-700 dark:text-emerald-300">Path B: Lateral Switch with GenAI Stack (+45%)</span>
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

        <div className="pt-2 flex items-center justify-between text-xs">
          <span className="text-slate-500">Ready to break the stagnation cycle? Check your custom action sprint.</span>
          <Link
            to="/path"
            className="font-bold text-[#0B4F9C] dark:text-sky-400 hover:text-blue-800 flex items-center gap-1 transition"
          >
            <span>View 30-Day Growth Sprint</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}
