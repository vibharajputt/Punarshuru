import { Link } from 'react-router-dom'
import { Target, ArrowRight, CheckCircle2, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface DashboardSkillsTabProps {
  targetRole: string
  matchPct: number
  haveSkills: string[]
  missingSkills: string[]
}

export default function DashboardSkillsTab({
  targetRole,
  matchPct,
  haveSkills,
  missingSkills,
}: DashboardSkillsTabProps) {
  const { t } = useTranslation()

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Target size={18} className="text-[#0B4F9C]" />
            <span>
              {t('dashboard.skill_summary.breakdown_title', { role: targetRole, pct: matchPct })}
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            {t('dashboard.skill_summary.breakdown_desc')}
          </p>
        </div>
        <Link
          to="/skill-gap"
          className="px-3.5 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950 text-[#0B4F9C] dark:text-sky-300 font-bold text-xs hover:bg-sky-100 transition-all flex items-center gap-1 border border-sky-200 dark:border-sky-800"
        >
          <span>{t('dashboard.skill_summary.view_radar_page')}</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 space-y-2">
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
            <CheckCircle2 size={15} /> {t('dashboard.skill_summary.have_title', { count: haveSkills.length })}
          </span>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {haveSkills.map((sk) => (
              <span
                key={sk}
                className="px-2.5 py-1 rounded-lg bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 text-xs font-bold"
              >
                {sk}
              </span>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-2">
          <span className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5 uppercase tracking-wider">
            <XCircle size={15} /> {t('dashboard.skill_summary.missing_title', { count: missingSkills.length })}
          </span>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {missingSkills.map((sk) => (
              <span
                key={sk}
                className="px-2.5 py-1 rounded-lg bg-rose-100/80 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200 text-xs font-bold"
              >
                {sk}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
