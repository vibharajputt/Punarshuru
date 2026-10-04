import { motion } from 'framer-motion'
import { CheckCircle2, RefreshCw, ArrowRight } from 'lucide-react'
import type { Profile } from '@/types'
import { ARCHETYPE_BADGES } from './types'

interface ConfirmScreenProps {
  profileDraft: Partial<Profile>
  onFinish: () => void
  onBackToChat: () => void
  isFinalizing: boolean
}

export default function ConfirmScreen({
  profileDraft,
  onFinish,
  onBackToChat,
  isFinalizing,
}: ConfirmScreenProps) {
  const badgeClass =
    ARCHETYPE_BADGES[profileDraft.user_type || 'returner'] || ARCHETYPE_BADGES.returner

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6"
      >
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-md">
            <CheckCircle2 size={30} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Your Profile is Ready!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            We've calibrated your background and mapped your skills. Ready to see your Career Risk Score?
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-3">
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white block">
                {profileDraft.name || 'Candidate'}
              </span>
              <span className="text-xs text-slate-400">{profileDraft.city || 'India'}</span>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeClass}`}>
              {profileDraft.user_type?.toUpperCase() || 'RETURNER'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] font-medium text-slate-400 block">Current Role</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {profileDraft.current_role || 'Not specified'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-medium text-slate-400 block">Target Role</span>
              <span className="font-bold text-[#0B4F9C] dark:text-sky-400">
                {profileDraft.target_role || 'Software Engineer'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-medium text-slate-400 block">Experience</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {profileDraft.experience_years || 0} years
              </span>
            </div>
            <div>
              <span className="text-[10px] font-medium text-slate-400 block">Career Gap</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {profileDraft.career_gap_years ? `${profileDraft.career_gap_years} years` : 'None'}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Calibrated Skills ({profileDraft.skills_raw?.length || 0})
            </span>
            <div className="flex flex-wrap gap-1.5">
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
                <span className="text-xs text-slate-400 italic">Core skills calibrated</span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <button
            type="button"
            id="confirm-go-home-btn"
            onClick={onFinish}
            disabled={isFinalizing}
            className="w-full py-4 px-6 rounded-2xl bg-[#0B4F9C] text-white font-extrabold text-sm hover:bg-[#083b75] transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
          >
            {isFinalizing ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Finalizing Profile...</span>
              </>
            ) : (
              <>
                <span>Go to Home</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={onBackToChat}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline transition-colors"
            >
              ← Back to chat to make changes
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
