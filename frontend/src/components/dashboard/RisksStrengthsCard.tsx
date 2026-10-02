import { AlertTriangle, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react'

interface RisksStrengthsCardProps {
  risks: string[]
  strengths: string[]
}

export default function RisksStrengthsCard({
  risks = [],
  strengths = [],
}: RisksStrengthsCardProps) {
  const displayRisks = risks.length > 0 ? risks : [
    'Automation exposure to routine tasks in current role',
    'Career break creates hiring friction without recent GitHub proofs',
    'Legacy framework reliance vs modern GenAI toolchain',
  ]

  const displayStrengths = strengths.length > 0 ? strengths : [
    'Strong software fundamentals and problem-solving maturity',
    'High adaptability and rapid domain relearning capability',
    'Transferable customer intuition and operational grit',
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Risks Card */}
      <div className="p-6 rounded-3xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/60 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-extrabold text-sm">
          <ShieldAlert size={18} />
          <span>Top Identified Risk Factors</span>
        </div>
        <ul className="space-y-2.5">
          {displayRisks.map((risk, i) => (
            <li
              key={i}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-rose-100 dark:border-rose-900/40 text-xs text-slate-700 dark:text-slate-200 flex items-start gap-2.5 shadow-2xs"
            >
              <AlertTriangle size={15} className="text-rose-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{risk}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Strengths Card */}
      <div className="p-6 rounded-3xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/60 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-extrabold text-sm">
          <Sparkles size={18} />
          <span>Transferable Strengths & Assets</span>
        </div>
        <ul className="space-y-2.5">
          {displayStrengths.map((str, i) => (
            <li
              key={i}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-emerald-100 dark:border-emerald-900/40 text-xs text-slate-700 dark:text-slate-200 flex items-start gap-2.5 shadow-2xs"
            >
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{str}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
