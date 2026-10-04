import { CheckCircle2, Lock, Unlock, Zap, Sparkles, ArrowRight } from 'lucide-react'
import type { RoleData } from './CompanyCategoriesData'

interface CompanyRoleFitCardProps {
  role: RoleData
  userSkills: string[]
  isSelected: boolean
  onSelectRole: (role: RoleData) => void
  onSimulateLearnSkill: (skill: string, roleTitle: string) => void
}

export default function CompanyRoleFitCard({
  role,
  userSkills,
  isSelected,
  onSelectRole,
  onSimulateLearnSkill,
}: CompanyRoleFitCardProps) {
  const matched = role.requiredSkills.filter((req) =>
    userSkills.some((s) => s.toLowerCase().trim() === req.toLowerCase().trim())
  )
  const missing = role.requiredSkills.filter(
    (req) => !userSkills.some((s) => s.toLowerCase().trim() === req.toLowerCase().trim())
  )
  const matchPct = Math.round((matched.length / role.requiredSkills.length) * 100)
  const isUnlocked = matchPct >= 75

  return (
    <div
      onClick={() => onSelectRole(role)}
      className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
        isUnlocked
          ? isSelected
            ? 'bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-900 dark:to-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg'
            : 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-900/60 shadow-xs'
          : 'bg-slate-50/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="space-y-3">
        {/* Status & CTC */}
        <div className="flex items-center justify-between">
          {isUnlocked ? (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[11px] flex items-center gap-1.5 shadow-2xs">
              <Unlock size={12} className="text-emerald-600" />
              <span>Eligible Fit</span>
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold text-[11px] flex items-center gap-1.5 shadow-2xs">
              <Lock size={12} className="text-amber-600" />
              <span>Missing {missing.length} Skill{missing.length > 1 ? 's' : ''}</span>
            </span>
          )}

          <span className="font-mono font-black text-sm text-emerald-700 dark:text-emerald-400">
            ₹{role.startingCtcLpa} LPA
          </span>
        </div>

        {/* Role Title & Level */}
        <div>
          <h5 className="font-black text-base text-slate-900 dark:text-white leading-tight">
            {role.title}
          </h5>
          <p className="text-xs text-slate-500 mt-0.5">
            {role.level} • Demand: <strong className="text-[#0B4F9C] dark:text-sky-300">{role.hiringDemand}</strong>
          </p>
        </div>

        {/* Readiness Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-slate-500">Profile Readiness</span>
            <span className={isUnlocked ? 'text-emerald-600' : 'text-amber-600'}>
              {matchPct}% Match
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${isUnlocked ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${matchPct}%` }}
            />
          </div>
        </div>

        {/* Skills Matched vs Missing */}
        <div className="space-y-1.5 pt-1">
          <div className="flex flex-wrap gap-1">
            {matched.map((sk) => (
              <span
                key={sk}
                className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1"
              >
                <CheckCircle2 size={10} className="text-emerald-600" />
                <span>{sk}</span>
              </span>
            ))}
            {missing.map((sk) => (
              <span
                key={sk}
                className="px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold flex items-center gap-1"
              >
                <Zap size={10} className="text-amber-500" />
                <span>{sk}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Missing Skill Quick Simulator */}
        {missing.length > 0 && (
          <div className="p-2.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 space-y-1.5">
            <span className="text-[10px] font-bold text-amber-900 dark:text-amber-200 block">
              Simulate mastering missing skill:
            </span>
            <div className="flex flex-wrap gap-1">
              {missing.map((sk) => (
                <button
                  key={sk}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSimulateLearnSkill(sk, role.title)
                  }}
                  className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-[10px] font-extrabold hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-1 shadow-2xs"
                >
                  <span>+ Learn {sk}</span>
                  <Sparkles size={9} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0B4F9C] dark:text-sky-400">
        <span>{isSelected ? 'Viewing Trajectory' : 'Select This Role'}</span>
        <ArrowRight size={13} />
      </div>
    </div>
  )
}
