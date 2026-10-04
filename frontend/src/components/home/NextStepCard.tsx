import { Link } from 'react-router-dom'
import { ArrowRight, Compass, Sparkles, CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface NextStepCardProps {
  targetRole?: string
  topMissingSkill?: string
}

export default function NextStepCard({
  targetRole = 'GenAI Engineer',
  topMissingSkill = 'Python & Vector Embeddings',
}: NextStepCardProps) {
  const { t, i18n } = useTranslation()
  const isHi = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('hi')

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-sky-50 via-white to-orange-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-850 border border-sky-100 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 dark:bg-blue-950/80 text-xs font-bold text-[#0B4F9C] dark:text-sky-300">
            <Compass size={13} />
            <span>{t('dashboard.next_step_badge', 'Your Next Step')}</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400">
            {t('dashboard.step_count', 'Step 1 of 3')}
          </span>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
            {t('dashboard.bridge_gap_title', `Bridge your top skill gap for ${targetRole}`, { role: targetRole })}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            {isHi ? (
              <>
                अपने पर्सनलाइज्ड फ्री रोडमैप पर <strong className="text-[#0B4F9C] dark:text-sky-400">{topMissingSkill}</strong> से शुरुआत करें और अपने करियर रिस्क स्कोर को 24 अंकों तक कम करें।
              </>
            ) : (
              <>
                Start with <strong className="text-[#0B4F9C] dark:text-sky-400">{topMissingSkill}</strong> on your personalized free roadmap to reduce your Career Risk Score by up to 24 points.
              </>
            )}
          </p>
        </div>

        <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
            <span>{t('dashboard.free_courses_bullet', '120+ verified free Govt & NPTEL courses')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={13} className="text-[#F26B1D] shrink-0" />
            <span>{t('dashboard.milestones_bullet', 'Interactive milestones with real project proofs')}</span>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Link
          to="/path"
          id="home-primary-next-step-btn"
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-[#0B4F9C] text-white font-extrabold text-sm hover:bg-[#083b75] shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <span>{t('dashboard.follow_path_btn', 'Follow My Path')}</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
