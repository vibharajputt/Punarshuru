import { useState } from 'react'
import { CheckCircle2, Circle, BookOpen } from 'lucide-react'

export interface LearningStep {
  step: number
  title: string
  skillsTaught: string[]
  freeCourse: { title: string; provider: string; url: string }
  handsOnRepo: string
  outcome: string
}

export default function LaidOffLearningPath() {
  const [completed, setCompleted] = useState<number[]>([1])

  const steps: LearningStep[] = [
    {
      step: 1,
      title: 'Phase 1: Playwright / Cypress Automation Fundamentals',
      skillsTaught: ['Playwright Test Runner', 'Page Object Model', 'Async Assertions'],
      freeCourse: {
        title: 'Playwright Full Course 2026',
        provider: 'freeCodeCamp',
        url: 'https://www.freecodecamp.org',
      },
      handsOnRepo: 'github.com/punarshuru-templates/playwright-e2e-starter',
      outcome: 'Write first 15 automated test specs for an e-commerce checkout flow.',
    },
    {
      step: 2,
      title: 'Phase 2: API Contract Automation & Mock Servers',
      skillsTaught: ['REST Assured / Supertest', 'JSON Schema Validation', 'Mockoon / WireMock'],
      freeCourse: {
        title: 'API Testing & Automation Masterclass',
        provider: 'SWAYAM',
        url: 'https://swayam.gov.in',
      },
      handsOnRepo: 'github.com/punarshuru-templates/api-contract-testing',
      outcome: 'Automate 50+ backend microservice API integration endpoints.',
    },
    {
      step: 3,
      title: 'Phase 3: CI/CD Pipeline Integration with GitHub Actions',
      skillsTaught: ['GitHub Actions Workflows', 'Headless Browser Execution', 'HTML Test Reporting'],
      freeCourse: {
        title: 'CI/CD Pipelines for Test Automation',
        provider: 'NPTEL',
        url: 'https://nptel.ac.in',
      },
      handsOnRepo: 'github.com/punarshuru-templates/github-actions-qa-runner',
      outcome: 'Automatically trigger test runs on every pull request with visual diff artifacts.',
    },
  ]

  const toggleStep = (stepNum: number) => {
    setCompleted((prev) =>
      prev.includes(stepNum) ? prev.filter((s) => s !== stepNum) : [...prev, stepNum]
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-1">
            <BookOpen size={12} />
            <span>Feature 3 • Targeted Bridge Learning Path</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Hands-on Portfolio Milestones
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Build proof that recruiters and engineering managers evaluate instead of generic multiple-choice quizzes.
          </p>
        </div>

        <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {completed.length} of {steps.length} Milestones Done
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {steps.map((step) => {
          const isDone = completed.includes(step.step)
          return (
            <div
              key={step.step}
              className={`p-5 rounded-2xl border transition-all space-y-3 ${
                isDone
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleStep(step.step)}
                    className="mt-0.5 shrink-0 focus:outline-hidden"
                  >
                    {isDone ? (
                      <CheckCircle2 size={20} className="text-emerald-600" />
                    ) : (
                      <Circle size={20} className="text-slate-300 dark:text-slate-600" />
                    )}
                  </button>
                  <div>
                    <h4
                      className={`text-sm font-bold ${
                        isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {step.title}
                    </h4>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {step.skillsTaught.map((s, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#0B4F9C] dark:text-sky-300 shrink-0">
                  Step {step.step}
                </span>
              </div>

              {/* Course & Repo Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <a
                  href={step.freeCourse.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between hover:border-blue-400 group"
                >
                  <span className="truncate text-slate-700 dark:text-slate-300 font-medium group-hover:text-[#0B4F9C]">
                    📖 {step.freeCourse.title}
                  </span>
                  <span className="text-[10px] font-bold text-[#F26B1D] shrink-0 ml-1">
                    {step.freeCourse.provider} ↗
                  </span>
                </a>

                <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                  <span className="truncate">💻 {step.handsOnRepo.split('/')[2]}</span>
                  <span className="text-emerald-600 font-bold shrink-0">Free Template</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic">
                🎯 Verification Milestone: {step.outcome}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
