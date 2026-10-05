import { useState } from 'react'
import { CheckCircle2, AlertCircle, HelpCircle, BookOpen, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { PartialSkill } from '@/types'
import SkillRoadmapModal from './SkillRoadmapModal'

interface SkillCategorizationCardsProps {
  haveSkills: string[]
  partialSkills: PartialSkill[]
  missingSkills: string[]
}

export default function SkillCategorizationCards({
  haveSkills = [],
  partialSkills = [],
  missingSkills = [],
}: SkillCategorizationCardsProps) {
  const { t } = useTranslation()
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Verified Have Skills */}
        <div className="p-6 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-extrabold text-sm text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <span>{t('skill_gap.have', 'Have Skills')}</span>
            </div>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300">
              {haveSkills.length} {t('skill_gap.verified', 'Verified')}
            </span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {t('skill_gap.have_desc', 'Direct 100% matches against target role hiring criteria.')}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {haveSkills.map((sk) => (
              <button
                key={sk}
                type="button"
                onClick={() => setSelectedSkill(sk)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 border border-emerald-200/60 dark:border-emerald-900 shadow-2xs hover:border-emerald-400 hover:scale-[1.03] transition-all cursor-pointer text-left"
                title="Click to view deep dive roadmap & notes"
              >
                ✓ {sk}
              </button>
            ))}
            {haveSkills.length === 0 && (
              <p className="text-xs text-slate-400 italic">{t('skill_gap.no_exact_matches', 'No exact matches yet.')}</p>
            )}
          </div>
        </div>

        {/* 2. Partial / Transferable Skills */}
        <div className="p-6 rounded-3xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-extrabold text-sm text-amber-800 dark:text-amber-300">
              <HelpCircle size={18} className="text-amber-600" />
              <span>{t('skill_gap.partial', 'Learning Needed')}</span>
            </div>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300">
              {partialSkills.length} {t('skill_gap.needed', 'Needed')}
            </span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {t('skill_gap.partial_desc', '≥75% fuzzy match or foundational skill with high crossover potential.')}
          </p>

          <div className="space-y-2 pt-1">
            {partialSkills.map((ps) => (
              <button
                key={ps.skill}
                type="button"
                onClick={() => setSelectedSkill(ps.skill)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-900 text-xs flex items-center justify-between shadow-2xs hover:border-amber-400 hover:scale-[1.02] transition-all cursor-pointer text-left"
                title="Click to view roadmap, videos & notes"
              >
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span>{ps.skill}</span>
                    <BookOpen size={11} className="text-amber-500" />
                  </p>
                  <p className="text-[10px] text-slate-400">{t('skill_gap.matched_with', `Matched with: ${ps.matched_with}`, { with: ps.matched_with })}</p>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono text-[10px] font-bold">
                  {Math.round(ps.similarity * 100)}%
                </span>
              </button>
            ))}
            {partialSkills.length === 0 && (
              <p className="text-xs text-slate-400 italic">{t('skill_gap.no_adjacent_skills', 'No adjacent bridge skills found.')}</p>
            )}
          </div>
        </div>

        {/* 3. Missing Skills */}
        <div className="p-6 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-extrabold text-sm text-rose-800 dark:text-rose-300">
              <AlertCircle size={18} className="text-rose-600" />
              <span>{t('skill_gap.missing', 'Missing Focus')}</span>
            </div>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-300">
              {missingSkills.length} {t('skill_gap.deficits', 'Deficits')}
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {t('skill_gap.missing_desc', 'Critical hiring requisites to cover in your learning milestones.')}
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0B4F9C] dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded-md border border-sky-200/60 dark:border-sky-800">
              <Sparkles size={11} className="text-[#F26B1D]" />
              <span>Click any skill for Complete Roadmap, Videos & Notes</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {missingSkills.map((sk) => (
              <button
                key={sk}
                type="button"
                onClick={() => setSelectedSkill(sk)}
                className="group px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold text-rose-700 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900 shadow-2xs hover:border-[#0B4F9C] hover:text-[#0B4F9C] dark:hover:text-sky-300 hover:scale-105 hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                title={`Click to view ${sk} complete roadmap, videos & study notes`}
              >
                <span>✕ {sk}</span>
                <BookOpen size={11} className="text-slate-400 group-hover:text-[#0B4F9C] dark:group-hover:text-sky-400 transition-colors" />
              </button>
            ))}
            {missingSkills.length === 0 && (
              <p className="text-xs text-emerald-600 font-bold">{t('skill_gap.zero_deficit', 'Zero skill deficit detected!')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Skill Learning Roadmap Modal */}
      <SkillRoadmapModal
        skillName={selectedSkill}
        isOpen={Boolean(selectedSkill)}
        onClose={() => setSelectedSkill(null)}
      />
    </>
  )
}
