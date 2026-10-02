import { ExternalLink, Award, Clock, BookOpen } from 'lucide-react'
import type { PathwayOption } from '@/types'

interface RoadmapTimelineProps {
  pathway: PathwayOption
}

export default function RoadmapTimeline({ pathway }: RoadmapTimelineProps) {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen size={18} className="text-[#0B4F9C]" />
            <span>Weekly Execution Roadmap & Free Courses</span>
          </h3>
          <p className="text-xs text-slate-500">
            Curated from accredited government portals (NPTEL, SWAYAM, Skill India) and freeCodeCamp.
          </p>
        </div>
        <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 self-start sm:self-auto">
          100% Free Resources
        </span>
      </div>

      {/* Timeline Steps */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
        {pathway.roadmap.map((step, idx) => (
          <div key={idx} className="relative space-y-3">
            {/* Step marker circle */}
            <div className="absolute -left-6 sm:-left-8 top-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#0B4F9C] text-white flex items-center justify-center font-bold text-[10px] shadow-sm ring-4 ring-white dark:ring-slate-900">
              {idx + 1}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#0B4F9C] text-white text-[11px] font-mono font-bold">
                {step.week_range}
              </span>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {step.title}
              </h4>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              {step.description}
            </p>

            {/* Skills pills */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {step.skills_covered.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-0.5 text-[10px] font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  ✓ {s}
                </span>
              ))}
            </div>

            {/* Recommended Free Courses Cards */}
            {step.courses && step.courses.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {step.courses.map((course) => (
                  <a
                    key={course.id}
                    href={course.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-[#0B4F9C] hover:bg-white dark:hover:bg-slate-800 transition-all group flex flex-col justify-between space-y-2 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-sky-100 dark:bg-sky-950 text-[#0B4F9C] dark:text-sky-300">
                          {course.provider}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span className="flex items-center gap-0.5">
                            <Clock size={10} /> {course.weeks}w
                          </span>
                          <span className="uppercase">{course.lang}</span>
                        </div>
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0B4F9C] dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                        {course.title}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-700/60">
                      <span className="flex items-center gap-1 text-emerald-600">
                        {course.certificate && <Award size={12} />} Free Certificate
                      </span>
                      <span className="text-[#0B4F9C] dark:text-sky-400 flex items-center gap-1">
                        Enroll <ExternalLink size={10} />
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
