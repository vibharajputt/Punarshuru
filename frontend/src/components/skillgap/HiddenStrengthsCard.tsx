import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react'
import { Link } from 'react-router-dom'

interface HiddenStrengthsCardProps {
  currentRole?: string
  skills?: string[]
}

export default function HiddenStrengthsCard({
  currentRole = 'Java Developer',
  skills = ['Java', 'Spring Boot', 'MySQL', 'REST APIs'],
}: HiddenStrengthsCardProps) {
  const isReturnerOrJava = skills.some((s) => s.toLowerCase().includes('java'))
  const isGig = skills.some((s) => s.toLowerCase().includes('route') || s.toLowerCase().includes('customer'))
  const isQA = skills.some((s) => s.toLowerCase().includes('qa') || s.toLowerCase().includes('testing'))

  const hiddenStrengths = isGig
    ? [
        {
          strength: 'Real-Time Operational Dispatch',
          crossover: 'High transferability to Tech Operations, Logistics Dispatch Analytics, and Supply Chain Dashboards.',
          target: 'Logistics Tech Analyst',
        },
        {
          strength: 'Bilingual Field Communication',
          crossover: 'Direct advantage for Indian Vernacular AI Chatbot Quality Assurance and Customer Success Ops.',
          target: 'AI Operations Associate',
        },
      ]
    : isQA
    ? [
        {
          strength: 'Defect Root-Cause Intuition',
          crossover: 'Deep SDLC domain knowledge makes automated Playwright/Selenium test framework authoring 3x faster than freshers.',
          target: 'Automation QA / SDET',
        },
        {
          strength: 'Agile & JIRA Workflow Fluency',
          crossover: 'Seamless transition into Scrum Master and Quality Engineering team leadership.',
          target: 'Lead QA Engineer',
        },
      ]
    : isReturnerOrJava
    ? [
        {
          strength: 'Object-Oriented & Concurrency Depth',
          crossover: 'Java multi-threading experience translates seamlessly into Python asynchronous pipeline and high-throughput LLM serving systems.',
          target: 'AI Infrastructure Engineer',
        },
        {
          strength: 'Relational Database Schema Design',
          crossover: 'MySQL/PostgreSQL mastery accelerates Hybrid Search (SQL + Vector Search) implementation.',
          target: 'Backend & Data Engineer',
        },
      ]
    : [
        {
          strength: 'Foundational CS Fundamentals',
          crossover: 'Algorithms and API design provide a resilient baseline that outlasts fast-changing frontend/backend trends.',
          target: 'Full Stack Engineer',
        },
      ]

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-indigo-50/60 via-white to-sky-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border border-indigo-100 dark:border-indigo-900/60 shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-indigo-900 dark:text-sky-300 font-extrabold text-base">
        <Lightbulb size={20} className="text-[#F26B1D]" />
        <span>Hidden Strengths & Crossover Accelerators</span>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400">
        Skills from your background in <strong>{currentRole}</strong> that hiring managers value as unfair advantages:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {hiddenStrengths.map((hs, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-2 flex flex-col justify-between shadow-2xs"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#0B4F9C] dark:text-sky-300 flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#F26B1D]" /> {hs.strength}
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {hs.crossover}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-slate-500 border-t border-slate-100 dark:border-slate-700/60">
              <span>Adjacent Move: <span className="text-slate-800 dark:text-slate-200">{hs.target}</span></span>
              <Link to="/pathways" className="text-[#0B4F9C] dark:text-sky-400 hover:underline flex items-center gap-0.5">
                Path <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
