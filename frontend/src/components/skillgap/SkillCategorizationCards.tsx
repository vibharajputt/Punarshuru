import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react'
import type { PartialSkill } from '@/types'

interface SkillCategorizationCardsProps {
  haveSkills: string[]
  partialSkills: PartialSkill[]
  missingSkills: string[]
}

export default function SkillCategorizationCards({
  haveSkills = [],
  partialSkills = [],
  missingSkills = [],
}: SkillCategorizationCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. Verified Have Skills */}
      <div className="p-6 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/60 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-sm text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <span>Have Skills</span>
          </div>
          <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300">
            {haveSkills.length} Verified
          </span>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Direct 100% matches against target role hiring criteria.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {haveSkills.map((sk) => (
            <span
              key={sk}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 border border-emerald-200/60 dark:border-emerald-900 shadow-2xs"
            >
              ✓ {sk}
            </span>
          ))}
          {haveSkills.length === 0 && (
            <p className="text-xs text-slate-400 italic">No exact matches yet.</p>
          )}
        </div>
      </div>

      {/* 2. Partial / Transferable Skills */}
      <div className="p-6 rounded-3xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/60 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-sm text-amber-800 dark:text-amber-300">
            <HelpCircle size={18} className="text-amber-600" />
            <span>Partial / Adjacent</span>
          </div>
          <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300">
            {partialSkills.length} Bridges
          </span>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          ≥75% fuzzy match or foundational skill with high crossover potential.
        </p>

        <div className="space-y-2 pt-1">
          {partialSkills.map((ps) => (
            <div
              key={ps.skill}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-900 text-xs flex items-center justify-between shadow-2xs"
            >
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">{ps.skill}</p>
                <p className="text-[10px] text-slate-400">Matched with: {ps.matched_with}</p>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono text-[10px] font-bold">
                {Math.round(ps.similarity * 100)}%
              </span>
            </div>
          ))}
          {partialSkills.length === 0 && (
            <p className="text-xs text-slate-400 italic">No adjacent bridge skills found.</p>
          )}
        </div>
      </div>

      {/* 3. Missing Skills */}
      <div className="p-6 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/60 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-sm text-rose-800 dark:text-rose-300">
            <AlertCircle size={18} className="text-rose-600" />
            <span>Missing Focus</span>
          </div>
          <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-300">
            {missingSkills.length} Deficits
          </span>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Critical hiring requisites to cover in your learning milestones.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {missingSkills.map((sk) => (
            <span
              key={sk}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold text-rose-700 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900 shadow-2xs"
            >
              ✕ {sk}
            </span>
          ))}
          {missingSkills.length === 0 && (
            <p className="text-xs text-emerald-600 font-bold">Zero skill deficit detected!</p>
          )}
        </div>
      </div>
    </div>
  )
}
