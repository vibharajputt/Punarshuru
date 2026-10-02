import { ShieldCheck, Info } from 'lucide-react'
import LiveFormulaCalculator from '@/components/compensation/LiveFormulaCalculator'
import OfferComparisonTool from '@/components/compensation/OfferComparisonTool'

export default function CompensationPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Friendly Explainer Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-950 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-purple-900/50">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-white/10 text-purple-300 shrink-0 mt-0.5">
            <Info size={20} />
          </div>
          <div className="space-y-1">
            <h2 className="font-bold text-sm text-white flex items-center gap-2">
              <span>What is Real Purchasing Power?</span>
              <span className="px-2 py-0.5 rounded-md bg-purple-400/20 text-purple-300 text-[10px] uppercase font-extrabold tracking-wider">
                City Living Cost Index
              </span>
            </h2>
            <p className="text-xs text-purple-100/90 leading-relaxed">
              A ₹20 LPA CTC offer in Bengaluru can leave you with less monthly bank savings than a ₹14 LPA offer in Mohali or Pune once rent & commute are deducted. Calculate your real in-hand wealth creation below.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-purple-200 bg-white/10 px-3 py-1.5 rounded-xl shrink-0 self-end md:self-auto font-medium">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>12 Hubs Indexed</span>
        </div>
      </div>

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
      </div>

      {/* Live Formula Calculator */}
      <LiveFormulaCalculator />

      {/* Multi-Offer Comparison Tool */}
      <OfferComparisonTool />
    </div>
  )
}
