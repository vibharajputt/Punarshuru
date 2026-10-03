import { Link } from 'react-router-dom'
import { PlusCircle, Briefcase, MapPin, UserCheck, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Profile } from '@/types'

export interface PersonaOption {
  key: string
  name: string
  role: string
  city: string
  tag: string
}

interface DashboardHeaderProps {
  profile: Profile | null
  targetRole: string
  demoPersonas: PersonaOption[]
  switching: boolean
  onSwitchPersona: (key: string) => void
}

export default function DashboardHeader({
  profile,
  targetRole,
  demoPersonas,
  switching,
  onSwitchPersona,
}: DashboardHeaderProps) {
  const { t } = useTranslation()

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#0B4F9C] to-[#F26B1D] text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
            {profile?.name ? profile.name.slice(0, 2).toUpperCase() : 'PS'}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {profile?.name || 'Priya Sharma'}
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-sky-50 dark:bg-sky-950 text-[#0B4F9C] dark:text-sky-300 border border-sky-200 dark:border-sky-800 capitalize">
                {profile?.user_type ? profile.user_type.replace('_', ' ') : 'Returner'}
              </span>
            </div>

            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 font-medium">
                <Briefcase size={12} className="text-slate-400" />
                {profile?.current_role || 'Java Developer'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium">
                <MapPin size={12} className="text-[#F26B1D]" />
                {profile?.city || 'Pune'}
              </span>
              <span>•</span>
              <span className="font-bold text-[#0B4F9C] dark:text-sky-400">
                {t('onboarding.target_role')}: {targetRole}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/onboarding"
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0B4F9C] text-white hover:bg-[#083b75] shadow-sm transition-all flex items-center gap-1.5"
          >
            <PlusCircle size={14} />
            <span>{t('dashboard.audit_new')}</span>
          </Link>
        </div>
      </div>

      {/* 1-Line Persona Switcher */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <UserCheck size={13} className="text-[#F26B1D]" /> {t('dashboard.switch_persona')}:
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {demoPersonas.map((p) => {
            const active = profile?.name?.toLowerCase().includes(p.key)
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => onSwitchPersona(p.key)}
                disabled={switching}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  active
                    ? 'bg-[#0B4F9C] text-white border-[#0B4F9C] font-bold shadow-2xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#0B4F9C]/50'
                }`}
              >
                {p.name.split(' ')[0]} ({p.tag})
              </button>
            )
          })}
          {switching && <RefreshCw size={12} className="animate-spin text-[#0B4F9C]" />}
        </div>
      </div>
    </div>
  )
}
