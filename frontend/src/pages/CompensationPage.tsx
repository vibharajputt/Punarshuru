import { ShieldCheck } from 'lucide-react'
import LiveFormulaCalculator from '@/components/compensation/LiveFormulaCalculator'
import OfferComparisonTool from '@/components/compensation/OfferComparisonTool'

export default function CompensationPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Real Compensation & City Arbitrage
            </h1>
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Purchasing Power Index
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real Income = (Nominal Salary - Rent - Commute) / Cost of Living Index (Mohali CoL = 1.0 Baseline).
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl self-start sm:self-auto font-medium">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>12 Indian Tech Hubs CoL Indexed</span>
        </div>
      </div>

      {/* Live Formula Calculator */}
      <LiveFormulaCalculator />

      {/* Multi-Offer Comparison Tool */}
      <OfferComparisonTool />
    </div>
  )
}
