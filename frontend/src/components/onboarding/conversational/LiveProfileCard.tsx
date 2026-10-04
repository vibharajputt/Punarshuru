import { Sparkles, CheckCircle2, ArrowRight, RefreshCw, RotateCcw } from 'lucide-react'
import { ARCHETYPE_BADGES } from './types'

interface LiveProfileCardProps {
  profileDraft: Record<string, unknown>
  canConfirm: boolean
  onConfirm: () => void
  isConfirming: boolean
  onStartOver: () => void
}

export default function LiveProfileCard({
  profileDraft,
  canConfirm,
  onConfirm,
  isConfirming,
  onStartOver,
}: LiveProfileCardProps) {
  const userType = profileDraft.user_type as string | undefined
  const isClassified = !!userType && userType !== 'detecting'
  const badgeClass = isClassified
    ? (ARCHETYPE_BADGES[userType!] || 'bg-slate-100 text-slate-700 border-slate-200')
    : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'

  const skillsRaw = (profileDraft.skills_raw as string[]) || []
  const skillsCount = skillsRaw.length

  const isFilled = Boolean(
    profileDraft.current_role &&
    profileDraft.target_role &&
    profileDraft.city &&
    skillsCount >= 3
  )
  const isConfirmEnabled = canConfirm || isFilled

  return (
    <div className="lg:col-span-5 flex flex-col h-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs p-5 overflow-hidden justify-between">
      <div className="space-y-4 overflow-y-auto pr-1 flex-1">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#F26B1D]" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Live Profile Card</h3>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeClass}`}>
            {isClassified ? userType!.toUpperCase() : 'Detecting…'}
          </span>
        </div>

        {/* Profile Fields */}
        <div className="space-y-2.5">
          {[
            { label: 'Current Role', key: 'current_role' },
            { label: 'Target Role', key: 'target_role' },
            { label: 'City', key: 'city' },
            { label: 'Experience', key: 'experience_years', suffix: ' yrs' },
          ].map(({ label, key, suffix }) => {
            const val = profileDraft[key]
            const display = val !== undefined && val !== '' && val !== 0 ? `${val}${suffix || ''}` : null
            return (
              <div key={key} className="flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-[#0B4F9C]/30 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {label}
                  </span>
                  <span className={`text-sm font-semibold truncate block ${display ? 'text-slate-800 dark:text-white' : 'text-slate-300 dark:text-slate-600 italic'}`}>
                    {display || 'Not filled yet'}
                  </span>
                </div>
                {display && <CheckCircle2 size={13} className="text-emerald-500 mt-1 shrink-0" />}
              </div>
            )
          })}
        </div>

        {/* Skills */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {skillsCount} {skillsCount === 1 ? 'skill' : 'skills'}
              {skillsCount < 3 && (
                <span className="ml-1 text-amber-500 font-normal normal-case">(add at least 3)</span>
              )}
            </span>
            {skillsCount >= 3 && (
              <span className="text-[10px] font-bold text-emerald-600">✓ Ready</span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {skillsRaw.length > 0 ? (
              skillsRaw.map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-lg bg-sky-100/70 dark:bg-slate-700 text-[#0B4F9C] dark:text-sky-300 font-bold text-[11px]"
                >
                  {s}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-slate-400 italic">
                Skills appear as you chat or upload a resume...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Button + Start Over */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 shrink-0 space-y-2">
        <button
          type="button"
          id="confirm-profile-btn"
          onClick={onConfirm}
          disabled={!isConfirmEnabled || isConfirming}
          className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
            isConfirmEnabled && !isConfirming
              ? 'bg-[#0B4F9C] text-white hover:bg-[#083b75] hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60'
          }`}
        >
          {isConfirming ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              <span>Confirming...</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={16} />
              <span>Confirm Profile</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
        <p className="text-[10px] text-slate-400 text-center">
          {isConfirmEnabled
            ? 'Ready to generate your Career Risk Score.'
            : 'Fill required slots: Role, Target, City & ≥3 Skills to confirm.'}
        </p>
        <button
          type="button"
          onClick={onStartOver}
          className="w-full flex items-center justify-center gap-1.5 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors py-1"
        >
          <RotateCcw size={11} />
          Start over
        </button>
      </div>
    </div>
  )
}
