import { TrendingUp, TrendingDown, Compass } from 'lucide-react'

export default function JobMarketDirection() {
  const marketSectors = [
    {
      sector: 'Legacy IT Services (Manual Testing / L1 Support)',
      demandTrend: 'declining',
      deltaPct: -38,
      hiringStatus: 'Hiring Freeze / Attrition Unfilled',
      action: 'Avoid applying only to generic QA job titles; rebrand resume to SDET.',
    },
    {
      sector: 'Fintech & Digital Banking (API Automation & Security)',
      demandTrend: 'rising',
      deltaPct: +44,
      hiringStatus: 'Aggressive Hiring Across Tier 1 & 2',
      action: 'High willingness to pay premium for reliable API test automation.',
    },
    {
      sector: 'AI Infra & Agentic Platforms (Eval & Quality)',
      demandTrend: 'rising',
      deltaPct: +88,
      hiringStatus: 'High Demand / Talent Scarcity',
      action: 'Pioneering domain with low candidate competition.',
    },
  ]

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0B4F9C] dark:text-sky-300 text-xs font-bold mb-1">
            <Compass size={12} />
            <span>Feature 4 • Job Market Direction & Sector Velocity</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Market Context vs Blind Applications
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Apply where budgets are expanding rather than sending hundreds of resumes to saturated queues.
          </p>
        </div>
      </div>

      {/* Sector Trends Comparison */}
      <div className="space-y-3">
        {marketSectors.map((s) => (
          <div
            key={s.sector}
            className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">{s.sector}</span>
                <span
                  className={`text-xs font-black px-2 py-0.5 rounded-md flex items-center gap-0.5 ${
                    s.demandTrend === 'rising'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  {s.demandTrend === 'rising' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  <span>{s.deltaPct > 0 ? `+${s.deltaPct}%` : `${s.deltaPct}%`} YoY</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{s.action}</p>
            </div>

            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 shrink-0">
              Status: <span className="font-bold text-[#0B4F9C] dark:text-sky-400">{s.hiringStatus}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
