import React from 'react'
import type { Profile } from '@/types'

interface ProfileFieldsGridProps {
  profileDraft: Partial<Profile>
  setProfileDraft: React.Dispatch<React.SetStateAction<Partial<Profile>>>
}

export default function ProfileFieldsGrid({
  profileDraft,
  setProfileDraft,
}: ProfileFieldsGridProps) {
  return (
    <div className="space-y-3 text-xs">
      <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Candidate Name (Auth)
        </span>
        <input
          type="text"
          value={profileDraft.name || ''}
          onChange={(e) => setProfileDraft((p) => ({ ...p, name: e.target.value }))}
          placeholder="Enter full name"
          className="w-full font-bold text-slate-900 dark:text-white bg-transparent border-none p-0 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Current Role *
          </span>
          <input
            type="text"
            value={profileDraft.current_role || ''}
            onChange={(e) => setProfileDraft((p) => ({ ...p, current_role: e.target.value }))}
            placeholder="e.g. Java Dev"
            className="w-full font-bold text-slate-800 dark:text-slate-200 bg-transparent border-none p-0 focus:outline-none"
          />
        </div>

        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Target Role *
          </span>
          <input
            type="text"
            value={profileDraft.target_role || ''}
            onChange={(e) => setProfileDraft((p) => ({ ...p, target_role: e.target.value }))}
            placeholder="e.g. GenAI Engineer"
            className="w-full font-bold text-[#0B4F9C] dark:text-sky-400 bg-transparent border-none p-0 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">City *</span>
          <input
            type="text"
            value={profileDraft.city || ''}
            onChange={(e) => setProfileDraft((p) => ({ ...p, city: e.target.value }))}
            placeholder="e.g. Pune"
            className="w-full font-bold text-slate-800 dark:text-slate-200 bg-transparent border-none p-0 focus:outline-none text-xs"
          />
        </div>

        <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Exp (yrs)</span>
          <input
            type="number"
            value={profileDraft.experience_years ?? 0}
            onChange={(e) => setProfileDraft((p) => ({ ...p, experience_years: Number(e.target.value) }))}
            className="w-full font-bold text-slate-800 dark:text-slate-200 bg-transparent border-none p-0 focus:outline-none text-xs"
          />
        </div>

        <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gap (yrs)</span>
          <input
            type="number"
            step="0.5"
            value={profileDraft.career_gap_years ?? 0}
            onChange={(e) => setProfileDraft((p) => ({ ...p, career_gap_years: Number(e.target.value) }))}
            className="w-full font-bold text-slate-800 dark:text-slate-200 bg-transparent border-none p-0 focus:outline-none text-xs"
          />
        </div>
      </div>
    </div>
  )
}
