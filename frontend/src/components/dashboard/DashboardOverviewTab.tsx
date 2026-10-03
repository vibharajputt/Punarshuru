import { Target, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import DisruptionScoreCard from '@/components/dashboard/DisruptionScoreCard'
import ModuleNavCards from '@/components/dashboard/ModuleNavCards'
import NextActionsChecklist from '@/components/dashboard/NextActionsChecklist'
import type { DisruptionResponse, Profile } from '@/types'

interface DashboardOverviewTabProps {
  profile: Profile | null
  disruptionData: DisruptionResponse | null
  currentScore: number
  targetRole: string
  matchPct: number
  haveSkills: string[]
  missingSkills: string[]
  topMissing: string
  onOpenSkillsTab: () => void
}

export default function DashboardOverviewTab({
  profile,
  disruptionData,
  currentScore,
  targetRole,
  matchPct,
  haveSkills,
  missingSkills,
  topMissing,
  onOpenSkillsTab,
}: DashboardOverviewTabProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      {/* Quick Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t('dashboard.metrics.disruption_risk')}
          </span>
          <div className="text-2xl font-black text-[#F26B1D] mt-1">{currentScore}/100</div>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('dashboard.metrics.disruption_desc')}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t('dashboard.metrics.skill_match')}
          </span>
          <div className="text-2xl font-black text-[#0B4F9C] dark:text-sky-400 mt-1">{matchPct}%</div>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('dashboard.metrics.skill_match_desc', { role: targetRole })}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t('dashboard.metrics.top_gap_skill')}
          </span>
          <div className="text-sm font-black text-slate-900 dark:text-white mt-1 truncate">{topMissing}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('dashboard.metrics.top_gap_desc')}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t('dashboard.metrics.free_courses')}
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">NPTEL / SWAYAM</div>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('dashboard.metrics.free_courses_desc')}</p>
        </div>
      </div>

      {/* Quick Disruption + Skill Match Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DisruptionScoreCard
          disruption={disruptionData || null}
          score={currentScore}
          userName={profile?.name || 'Priya Sharma'}
          currentRole={profile?.current_role || 'Java Developer'}
        />

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Target size={18} className="text-[#0B4F9C]" />
                <span>{t('dashboard.skill_summary.title')}</span>
              </h3>
              <span className="px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-[#0B4F9C] dark:text-sky-300 font-extrabold text-xs">
                {t('dashboard.skill_summary.matched_badge', { pct: matchPct })}
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1 mb-1">
                  <CheckCircle2 size={14} /> {t('dashboard.skill_summary.have_title', { count: haveSkills.length })}
                </span>
                <div className="flex flex-wrap gap-1">
                  {haveSkills.slice(0, 4).map((sk) => (
                    <span key={sk} className="px-2 py-0.5 rounded bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 text-xs font-bold">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40">
                <span className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1 mb-1">
                  <XCircle size={14} /> {t('dashboard.skill_summary.missing_title', { count: missingSkills.length })}
                </span>
                <div className="flex flex-wrap gap-1">
                  {missingSkills.slice(0, 4).map((sk) => (
                    <span key={sk} className="px-2 py-0.5 rounded bg-rose-100/80 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200 text-xs font-bold">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">{t('dashboard.skill_summary.interactive_prompt')}</span>
            <button
              type="button"
              onClick={onOpenSkillsTab}
              className="px-3 py-1.5 rounded-xl bg-[#0B4F9C] text-white text-xs font-bold flex items-center gap-1 hover:bg-[#083b75] transition-all"
            >
              <span>{t('dashboard.skill_summary.open_tab_btn')}</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Deep-Dive Modules */}
      <ModuleNavCards targetRole={targetRole} matchPct={matchPct} />

      {/* Next 3 High-Impact Actions Checklist */}
      <NextActionsChecklist targetRole={targetRole} topMissingSkill={topMissing} />
    </div>
  )
}
