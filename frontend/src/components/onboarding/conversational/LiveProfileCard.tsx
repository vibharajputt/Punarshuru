import React from 'react'
import { Sparkles, CheckCircle2, ArrowRight, RefreshCw } from 'lucide-react'
import type { Profile } from '@/types'
import { ARCHETYPE_BADGES, hasRequiredSlots } from './types'
import ProfileFieldsGrid from './ProfileFieldsGrid'

interface LiveProfileCardProps {
  profileDraft: Partial<Profile>
  setProfileDraft: React.Dispatch<React.SetStateAction<Partial<Profile>>>
  onConfirm: () => void
  isConfirming: boolean
}

export default function LiveProfileCard({
  profileDraft,
  setProfileDraft,
  onConfirm,
  isConfirming,
}: LiveProfileCardProps) {
  const canConfirm = hasRequiredSlots(profileDraft)
  const badgeClass =
    ARCHETYPE_BADGES[profileDraft.user_type || 'returner'] || ARCHETYPE_BADGES.returner

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
            {profileDraft.user_type?.toUpperCase() || 'RETURNER'}
          </span>
        </div>

        {/* Form Fields */}
        <ProfileFieldsGrid
          profileDraft={profileDraft}
          setProfileDraft={setProfileDraft}
        />

        {/* Calibrated Skills */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Calibrated Skills ({profileDraft.skills_raw?.length || 0}/3 min)
            </span>
            {(profileDraft.skills_raw?.length || 0) >= 3 && (
              <span className="text-[10px] font-bold text-emerald-600">✓ Ready</span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {profileDraft.skills_raw && profileDraft.skills_raw.length > 0 ? (
              profileDraft.skills_raw.map((s, i) => (
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

      {/* Confirm Button */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 shrink-0 space-y-2">
        <button
          type="button"
          id="confirm-profile-btn"
          onClick={onConfirm}
          disabled={!canConfirm || isConfirming}
          className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
            canConfirm && !isConfirming
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
          {canConfirm
            ? 'Ready to generate your Career Risk Score.'
            : 'Fill required slots: Role, Target, City & ≥3 Skills to confirm.'}
        </p>
      </div>
    </div>
  )
}
