import type { Profile } from '@/types'

interface ProfileFieldsGridProps {
  profileDraft: Partial<Profile>
}

export default function ProfileFieldsGrid({ profileDraft }: ProfileFieldsGridProps) {
  return (
    <div className="space-y-3 text-xs">
      <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Candidate Name (Auth)
        </span>
        <div className="font-bold text-slate-900 dark:text-white truncate">
          {profileDraft.name || 'Candidate'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Current Role *
          </span>
          <div
            className={`font-bold truncate ${
              profileDraft.current_role
                ? 'text-slate-800 dark:text-slate-200'
                : 'text-slate-400 italic'
            }`}
          >
            {profileDraft.current_role || 'Waiting for agent...'}
          </div>
        </div>

        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Target Role *
          </span>
          <div
            className={`font-bold truncate ${
              profileDraft.target_role
                ? 'text-[#0B4F9C] dark:text-sky-400'
                : 'text-slate-400 italic'
            }`}
          >
            {profileDraft.target_role || 'Waiting for agent...'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">City *</span>
          <div
            className={`font-bold truncate text-xs ${
              profileDraft.city
                ? 'text-slate-800 dark:text-slate-200'
                : 'text-slate-400 italic'
            }`}
          >
            {profileDraft.city || '—'}
          </div>
        </div>

        <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Exp (yrs)</span>
          <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">
            {profileDraft.experience_years !== undefined ? `${profileDraft.experience_years} yrs` : '0 yrs'}
          </div>
        </div>

        <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gap (yrs)</span>
          <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">
            {profileDraft.career_gap_years ? `${profileDraft.career_gap_years} yrs` : '0 yrs'}
          </div>
        </div>
      </div>
    </div>
  )
}
