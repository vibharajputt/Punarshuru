import { TrendingUp, TrendingDown, ShieldAlert } from 'lucide-react'
import type { SkillEntry } from '@/lib/api'

interface SkillsDemandTrendsProps {
  rising: SkillEntry[]
  declining: SkillEntry[]
}

export default function SkillsDemandTrends({
  rising = [],
  declining = [],
}: SkillsDemandTrendsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Rising Skills */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 font-extrabold text-sm text-emerald-700 dark:text-emerald-400">
            <TrendingUp size={18} />
            <span>Top Rising Skills (GenAI & Modern Cloud)</span>
          </div>
          <span className="text-xs font-bold text-slate-400">Demand Velocity ↑</span>
        </div>

        <div className="space-y-2">
          {rising.slice(0, 7).map((sk) => (
            <div
              key={sk.id}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">{sk.name}</span>
                <span className="text-[10px] text-slate-400 ml-2">({sk.category})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                  Auto Risk: {sk.automation_risk}%
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-bold text-[10px]">
                  Rising
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Declining Skills */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 font-extrabold text-sm text-rose-700 dark:text-rose-400">
            <TrendingDown size={18} />
            <span>Declining / High Automation Exposure</span>
          </div>
          <span className="text-xs font-bold text-slate-400">Decline Rate ↓</span>
        </div>

        <div className="space-y-2">
          {declining.slice(0, 7).map((sk) => (
            <div
              key={sk.id}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">{sk.name}</span>
                <span className="text-[10px] text-slate-400 ml-2">({sk.category})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <ShieldAlert size={11} /> Auto Risk: {sk.automation_risk}%
                </span>
                <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 font-bold text-[10px]">
                  Declining
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
