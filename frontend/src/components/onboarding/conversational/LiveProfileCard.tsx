import { Sparkles, CheckCircle2, ArrowRight, RefreshCw, RotateCcw, Award } from 'lucide-react'
import { ARCHETYPE_BADGES, ARCHETYPE_LABELS, ARCHETYPE_DESCRIPTIONS } from './types'

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

  const archetypeTitle = isClassified ? (ARCHETYPE_LABELS[userType!] || userType!.toUpperCase()) : 'Detecting…'
  const archetypeDesc = isClassified ? ARCHETYPE_DESCRIPTIONS[userType!] : null

  const skillsRaw = (profileDraft.skills_raw as string[]) || []
  const skillsCount = skillsRaw.length

  const gapVal = profileDraft.career_gap_years !== undefined && profileDraft.career_gap_years !== null
    ? Number(profileDraft.career_gap_years)
    : null

  const currentCity = (profileDraft.current_city || profileDraft.city) as string | undefined
  const preferredCity = profileDraft.preferred_city as string | undefined
  const gapReason = profileDraft.gap_reason as string | undefined
  const achievements = (profileDraft.achievements as string[]) || []

  const isFilled = Boolean(
    profileDraft.current_role &&
    profileDraft.target_role &&
    currentCity &&
    preferredCity &&
    skillsCount >= 3
  )
  const isConfirmEnabled = canConfirm || isFilled

  return (
    <div className="lg:col-span-5 flex flex-col h-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs p-5 overflow-hidden justify-between">
      <div className="space-y-4 overflow-y-auto pr-1 flex-1">
        {/* Header */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#F26B1D]" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Live Profile Card</h3>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeClass}`}>
              {archetypeTitle}
            </span>
          </div>
          {archetypeDesc && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {archetypeDesc}
            </p>
          )}
        </div>

        {/* Profile Fields */}
        <div className="space-y-2.5">
          {[
            { label: 'Current Role', value: profileDraft.current_role },
            { label: 'Target Role', value: profileDraft.target_role },
            { label: 'Current City (Residence)', value: currentCity },
            { label: 'Preferred Work City', value: preferredCity },
            { label: 'Experience', value: profileDraft.experience_years ? `${profileDraft.experience_years} yrs` : null },
          ].map(({ label, value }) => {
            const display = value !== undefined && value !== '' && value !== null ? String(value) : null
            return (
              <div key={label} className="flex items-start gap-2.5">
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

          {/* Dynamic Career Gap Field */}
          <div className="flex items-start gap-2.5">
            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${gapVal && gapVal > 0 ? 'bg-[#F26B1D]' : 'bg-[#0B4F9C]/30'}`} />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Career Gap (System Date Analyzed)
              </span>
              {gapVal !== null ? (
                <div className="space-y-1 mt-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-800 dark:text-white">
                      {gapVal > 0 ? `${gapVal} yrs` : 'No gap (Continuous)'}
                    </span>
                    {gapVal > 0 && (
                      <span className="text-[10px] px-2 py-0.2 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                        Break Detected
                      </span>
                    )}
                  </div>
                  {gapReason && (
                    <div className="inline-flex items-center gap-1 text-[10px] text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800/40">
                      <span className="font-semibold text-amber-700 dark:text-amber-400">Context:</span>
                      <span>{gapReason}</span>
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-sm text-slate-300 dark:text-slate-600 italic">
                  Not stated yet
                </span>
              )}
            </div>
            {gapVal !== null && <CheckCircle2 size={13} className="text-emerald-500 mt-1 shrink-0" />}
          </div>
        </div>

        {/* Notable Achievements & Co-Curriculars */}
        {achievements.length > 0 && (
          <div className="p-3 rounded-2xl bg-amber-50/50 dark:bg-slate-850 border border-amber-100/80 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Award size={13} className="text-[#F26B1D]" />
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Highlights & Co-Curriculars ({achievements.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {achievements.map((ach, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-750 text-[#F26B1D] font-bold text-[11px] border border-amber-200 dark:border-amber-900/50 shadow-2xs"
                >
                  🏆 {ach}
                </span>
              ))}
            </div>
          </div>
        )}

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
          id="start-over-btn"
          onClick={onStartOver}
          className="w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors py-1 cursor-pointer active:scale-95"
        >
          <RotateCcw size={12} />
          Start over
        </button>
      </div>
    </div>
  )
}
