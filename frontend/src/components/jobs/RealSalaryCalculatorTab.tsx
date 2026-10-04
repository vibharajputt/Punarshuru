import { ShieldCheck } from 'lucide-react'
import LiveFormulaCalculator from '@/components/compensation/LiveFormulaCalculator'
import OfferComparisonTool from '@/components/compensation/OfferComparisonTool'

export default function RealSalaryCalculatorTab() {
  return (
    <div className="space-y-6 pb-8">
      {/* Intro Context Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Real Salary After Rent & Travel (CoL Indexed)
          </h4>
          <p className="text-xs text-slate-500">
            Real Income = (Nominal CTC - Annual Rent - Commute) / City Cost of Living Index (Mohali baseline = 1.0x).
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl self-start sm:self-auto font-medium shrink-0">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>12 Tech Hubs Indexed</span>
        </div>
      </div>

      {/* Live Formula Calculator */}
      <LiveFormulaCalculator />

      {/* Multi-Offer Comparison Tool */}
      <OfferComparisonTool />
    </div>
  )
}
