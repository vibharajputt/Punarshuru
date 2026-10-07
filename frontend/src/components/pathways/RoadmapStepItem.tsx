import { CheckCircle2, Circle, ExternalLink, Clock, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { PathwayStep } from '@/types'
import type { VerificationArtifact } from '@/store/profileStore'

interface RoadmapStepItemProps {
  step: PathwayStep
  stepIndex: number
  isDone: boolean
  artifact?: VerificationArtifact
  onToggle: () => void
  onOpenVerification?: () => void
}

export default function RoadmapStepItem({
  step,
  stepIndex,
  isDone,
  artifact,
  onToggle,
  onOpenVerification,
}: RoadmapStepItemProps) {
  const { i18n } = useTranslation()
  const isHi = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('hi')

  return (
    <div className="relative pl-8 pb-8 last:pb-2 border-l-2 border-slate-200 dark:border-slate-800 last:border-transparent">
      {/* Node circle */}
      <button
        type="button"
        onClick={onToggle}
        title={
          isDone
            ? isHi
              ? 'अपूर्ण चिन्हित करें'
              : 'Mark as incomplete'
            : isHi
            ? 'पूर्ण चिन्हित करें'
            : 'Mark as completed'
        }
        className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
          isDone
            ? 'bg-emerald-500 border-emerald-600 text-white shadow-md shadow-emerald-500/30'
            : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400 hover:border-[#0B4F9C]'
        }`}
      >
        {isDone ? <CheckCircle2 size={16} /> : <Circle size={16} />}
      </button>

      {/* Step Content */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-[#0B4F9C] dark:text-sky-300 font-mono text-[11px] font-bold">
              {step.week_range}
            </span>
            <span className="text-xs font-bold text-slate-400">
              {isHi ? `माइलस्टोन ${stepIndex + 1}` : `Milestone ${stepIndex + 1}`}
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenVerification || onToggle}
            className={`text-xs font-bold px-3 py-1 rounded-xl transition-all cursor-pointer ${
              isDone
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {isDone ? (isHi ? '✓ प्रूफ रेडी' : '✓ Proof Ready') : isHi ? 'सत्यापित करें' : 'Verify & Complete'}
          </button>
        </div>

        <div>
          <h4
            className={`text-base font-bold transition-colors ${
              isDone
                ? 'line-through text-slate-400 dark:text-slate-500'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {step.title}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            {step.description}
          </p>
        </div>

        {/* Verified Proof Artifact Banner */}
        {isDone && (
          <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-300 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-black text-[10px] uppercase flex items-center gap-1 shrink-0">
                <ShieldCheck size={11} /> Proof Ready
              </span>
              <span className="font-mono text-xs text-slate-800 dark:text-slate-200 truncate font-semibold">
                {artifact?.method === 'github' && `🔗 GitHub: ${artifact.repoFullName || artifact.title}`}
                {artifact?.method === 'certificate' && `📜 Proof: ${artifact.fileName || artifact.title}`}
                {artifact?.method === 'quiz' && `🧠 Quiz Passed: ${artifact.quizScore || '3/3'}`}
                {!artifact && 'Verified Proof Attached'}
              </span>
            </div>
            {onOpenVerification && (
              <button
                type="button"
                onClick={onOpenVerification}
                className="text-xs font-bold text-[#0B4F9C] dark:text-sky-300 hover:underline shrink-0 text-left sm:text-right cursor-pointer"
              >
                Inspect Evidence ↗
              </button>
            )}
          </div>
        )}

        {/* Skills Covered */}
        {step.skills_covered && step.skills_covered.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {step.skills_covered.map((skill: string) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Free Courses */}
        {step.courses && step.courses.length > 0 && (
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {isHi ? 'चयनित मुफ्त कोर्सेज और प्रमाणन' : 'Curated Free Courses & Verification'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {step.courses.map((course) => (
                <a
                  key={course.id}
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:border-[#0B4F9C] hover:bg-sky-50/30 dark:hover:bg-slate-750 transition-all flex items-start justify-between gap-2 group"
                >
                  <div className="space-y-1 min-w-0">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-[#0B4F9C] dark:group-hover:text-sky-400 line-clamp-1">
                      {course.title}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950/80 text-[#0B4F9C] dark:text-sky-300 font-bold uppercase">
                        {course.provider}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Clock size={10} /> {course.weeks}w
                      </span>
                      <span>{course.lang.toUpperCase()}</span>
                    </div>
                  </div>
                  <ExternalLink size={13} className="text-slate-400 group-hover:text-[#0B4F9C] shrink-0 mt-0.5" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
