import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Compass, Sparkles, CheckCircle2, BookOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import SkillRoadmapModal from '@/components/skillgap/SkillRoadmapModal'

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
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
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
                  अपने पर्सनलाइज्ड फ्री रोडमैप पर{' '}
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="text-[#0B4F9C] dark:text-sky-400 font-bold underline decoration-dotted hover:text-[#F26B1D] transition-colors cursor-pointer"
                  >
                    {topMissingSkill}
                  </button>{' '}
                  से शुरुआत करें और अपने करियर रिस्क स्कोर को 24 अंकों तक कम करें।
                </>
              ) : (
                <>
                  Start with{' '}
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="text-[#0B4F9C] dark:text-sky-400 font-bold underline decoration-dotted hover:text-[#F26B1D] transition-colors cursor-pointer"
                  >
                    {topMissingSkill}
                  </button>{' '}
                  on your personalized free roadmap to reduce your Career Risk Score by up to 24 points.
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

        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:border-[#0B4F9C] hover:text-[#0B4F9C] dark:hover:text-sky-400 transition-all shadow-xs cursor-pointer"
          >
            <BookOpen size={14} className="text-[#F26B1D]" />
            <span>Learn {topMissingSkill.split(' ')[0]} (Videos & Notes)</span>
          </button>

          <Link
            to="/path"
            id="home-primary-next-step-btn"
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl bg-[#0B4F9C] text-white font-extrabold text-xs hover:bg-[#083b75] shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>{t('dashboard.follow_path_btn', 'Follow My Path')}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <SkillRoadmapModal
        skillName={topMissingSkill}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  )
}
