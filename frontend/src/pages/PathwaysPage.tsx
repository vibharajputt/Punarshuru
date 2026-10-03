import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Sparkles,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Layers,
  Compass,
} from 'lucide-react'
import { useProfileStore } from '@/store/profileStore'
import { pathwayApi } from '@/lib/api'
import PathwayCard from '@/components/pathways/PathwayCard'
import RoadmapTimeline from '@/components/pathways/RoadmapTimeline'
import PathwayCompareTable from '@/components/pathways/PathwayCompareTable'
import Skeleton from '@/components/common/Skeleton'
import type { PathwayOption } from '@/types'

export default function PathwaysPage() {
  const profile = useProfileStore((s) => s.profile)
  const [selectedIndex, setSelectedIndex] = useState<number>(1) // Default to Stretch (index 1)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1) // 1: Choose Pathway, 2: Compare & Growth, 3: Execution Roadmap

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['pathway', profile?.id],
    queryFn: () => (profile?.id ? pathwayApi.get(profile.id) : null),
    enabled: !!profile?.id,
    staleTime: 60_000,
  })

  const pathways: PathwayOption[] = data?.pathways || [
    {
      type: 'Safe',
      title: 'Refresh & Strengthen: Modern Java Backend',
      target_role: 'Senior Java / Cloud Backend',
      estimated_months: 2,
      target_salary_lpa: 10.0,
      difficulty: 'Low',
      description: 'Re-validate existing Java & Spring foundations with cloud deployment and clean testing.',
      roadmap: [
        {
          week_range: 'Weeks 1-4',
          title: 'Core Stack Refresh',
          description: 'Bridge version gaps and practice hands-on coding in modern environment.',
          skills_covered: ['Java 17', 'Spring Boot 3', 'Clean Architecture'],
          courses: [
            { id: 1, title: 'Java Programming', provider: 'NPTEL', weeks: 12, lang: 'en', url: 'https://nptel.ac.in', level: 'beginner', certificate: true },
          ],
        },
      ],
    },
    {
      type: 'Stretch',
      title: 'High Growth Leap: GenAI Engineer',
      target_role: 'GenAI Engineer',
      estimated_months: 4,
      target_salary_lpa: 18.0,
      difficulty: 'High',
      description: 'Target high-demand frontier roles with comprehensive hands-on project artifacts.',
      roadmap: [
        {
          week_range: 'Weeks 1-4',
          title: 'Python & Vector Embeddings',
          description: 'Master Python data structures, vector math, and API fundamentals.',
          skills_covered: ['Python', 'Vector DBs', 'Prompt Engineering'],
          courses: [
            { id: 2, title: 'Python for Everybody', provider: 'SWAYAM', weeks: 12, lang: 'en', url: 'https://swayam.gov.in', level: 'beginner', certificate: true },
          ],
        },
        {
          week_range: 'Weeks 5-10',
          title: 'LLM Frameworks & RAG Architecture',
          description: 'Implement Retrieval Augmented Generation systems with LangChain/LlamaIndex.',
          skills_covered: ['LangChain', 'RAG Pipelines', 'Embeddings'],
          courses: [
            { id: 3, title: 'Deep Learning Specialization', provider: 'freeCodeCamp', weeks: 16, lang: 'en', url: 'https://freecodecamp.org', level: 'intermediate', certificate: true },
          ],
        },
        {
          week_range: 'Weeks 11-16',
          title: 'Capstone Deployment & Proof of Work',
          description: 'Deploy full-stack GenAI application with CI/CD and publish live demo.',
          skills_covered: ['FastAPI', 'Docker', 'System Evaluation'],
          courses: [
            { id: 4, title: 'Cloud Computing & DevOps', provider: 'Skill India', weeks: 6, lang: 'hi', url: 'https://skillindia.gov.in', level: 'beginner', certificate: true },
          ],
        },
      ],
    },
    {
      type: 'Pivot',
      title: 'Cross-Domain Transition: DevOps & Cloud',
      target_role: 'DevOps / Platform Engineer',
      estimated_months: 3,
      target_salary_lpa: 14.0,
      difficulty: 'Medium',
      description: 'Leverage your backend intuition while pivoting into rapidly expanding infrastructure functions.',
      roadmap: [
        {
          week_range: 'Weeks 1-6',
          title: 'Docker, Kubernetes & Linux Admin',
          description: 'Learn container orchestration and cloud scripting.',
          skills_covered: ['Docker', 'Kubernetes', 'Linux'],
          courses: [
            { id: 5, title: 'DevOps Fundamentals', provider: 'Skill India', weeks: 6, lang: 'hi', url: 'https://skillindia.gov.in', level: 'beginner', certificate: true },
          ],
        },
      ],
    },
  ]

  const activePathway = pathways[selectedIndex] || pathways[0]
  const quote = data?.motivation_quote || `${profile?.name || 'Candidate'}, every master was once a beginner. With focused milestones, your transition to ${profile?.target_role || 'GenAI'} is well within reach.`

  const goToStep = (step: 1 | 2 | 3) => {
    setCurrentStep(step)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Personalized Learning Pathways
            </h1>
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Guided 3-Step Plan
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Step-by-step career transition planning powered by accredited Indian public courses.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-[#0B4F9C] transition-all self-start sm:self-auto shadow-2xs"
        >
          <RefreshCw size={13} className={isFetching ? 'animate-spin' : ''} />
          <span>Regenerate Pathways</span>
        </button>
      </div>

      {/* 3-Step Stepper Navigation Bar */}
      <div className="p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {/* Step 1 Button */}
          <button
            type="button"
            onClick={() => goToStep(1)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              currentStep === 1
                ? 'bg-[#0B4F9C] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === 1 ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
              1
            </span>
            <span>Choose Strategy</span>
            {currentStep > 1 && <CheckCircle2 size={13} className="text-emerald-500 ml-0.5" />}
          </button>

          <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">→</span>

          {/* Step 2 Button */}
          <button
            type="button"
            onClick={() => goToStep(2)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              currentStep === 2
                ? 'bg-[#0B4F9C] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === 2 ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
              2
            </span>
            <span>Strategy Comparison & Growth</span>
            {currentStep > 2 && <CheckCircle2 size={13} className="text-emerald-500 ml-0.5" />}
          </button>

          <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">→</span>

          {/* Step 3 Button */}
          <button
            type="button"
            onClick={() => goToStep(3)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              currentStep === 3
                ? 'bg-[#0B4F9C] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === 3 ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
              3
            </span>
            <span>Execution Roadmap</span>
          </button>
        </div>

        {/* Selected Strategy Label */}
        <div className="text-[11px] font-semibold text-slate-500 hidden lg:flex items-center gap-1.5 px-3">
          <Compass size={13} className="text-[#F26B1D]" />
          <span>Selected:</span>
          <span className="font-bold text-slate-900 dark:text-white">
            {activePathway.type} ({activePathway.target_role})
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: CHOOSE PATHWAY STRATEGY */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <motion.div
          key="step-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-8"
        >
          {/* Motivational Guidance Banner */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-sky-100/90 via-blue-50 to-orange-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border border-sky-200 dark:border-slate-700 shadow-sm flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-2xl bg-[#0B4F9C] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0B4F9C] dark:text-sky-300 uppercase tracking-wider">
                Career Transition Guidance
              </p>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 italic font-medium pt-0.5 leading-relaxed">
                "{quote}"
              </p>
            </div>
          </div>

          {/* 3 Pathway Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers size={17} className="text-[#0B4F9C]" />
                  <span>Select Your Preferred Transition Strategy</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Click on one of the 3 strategies below that best fits your career goals.
                </p>
              </div>
            </div>

            {isLoading && !data ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton variant="card" className="h-64" />
                <Skeleton variant="card" className="h-64" />
                <Skeleton variant="card" className="h-64" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pathways.map((pw, idx) => (
                  <PathwayCard
                    key={pw.type}
                    pathway={pw}
                    isSelected={selectedIndex === idx}
                    onSelect={() => setSelectedIndex(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Proceed Action Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-50 via-white to-orange-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-2 border-[#0B4F9C]/30 dark:border-sky-500/30 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-md bg-[#0B4F9C] text-white">
                  Strategy: {activePathway.type}
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  ₹{activePathway.target_salary_lpa} LPA CTC • {activePathway.estimated_months} Months
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                Selected: "{activePathway.title}"
              </h4>
              <p className="text-xs text-slate-500">
                Next step will show the detailed comparison and 5-year compensation growth model.
              </p>
            </div>

            <button
              type="button"
              onClick={() => goToStep(2)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0B4F9C] text-white font-extrabold text-xs sm:text-sm hover:bg-[#083b75] shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              <span>Next: Compare Growth & Details</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: STRATEGY COMPARISON & 5-YEAR GROWTH MODEL */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <motion.div
          key="step-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-8"
        >
          {/* Header Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B4F9C] dark:text-sky-400 hover:underline self-start"
            >
              <ArrowLeft size={14} />
              <span>Back to Step 1 (Change Strategy)</span>
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Active Choice:</span>
              <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-extrabold text-slate-900 dark:text-white shadow-2xs">
                {activePathway.type} • {activePathway.target_role}
              </span>
            </div>
          </div>

          {/* Strategy Comparison & 5-Year Growth Graph */}
          <PathwayCompareTable
            pathways={pathways}
            selectedPathway={activePathway}
            onSelectPathway={(pw) => {
              const idx = pathways.findIndex((p) => p.type === pw.type)
              if (idx !== -1) setSelectedIndex(idx)
            }}
          />

          {/* Step 2 Proceed Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-2 border-emerald-500/30 dark:border-emerald-600/30 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-md bg-emerald-600 text-white">
                Step 2 Complete
              </span>
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                Ready to execute your {activePathway.type} Roadmap?
              </h4>
              <p className="text-xs text-slate-500">
                Step 3 will open the week-by-week course modules and live milestone tracker.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => goToStep(1)}
                className="flex-1 sm:flex-none px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 flex items-center justify-center gap-1"
              >
                <ArrowLeft size={13} />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => goToStep(3)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs sm:text-sm hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Proceed to Execution Roadmap</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: LIVE EXECUTION ROADMAP & MILESTONE TRACKER */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <motion.div
          key="step-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          {/* Header Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B4F9C] dark:text-sky-400 hover:underline self-start"
            >
              <ArrowLeft size={14} />
              <span>Change Pathway Strategy (Back to Step 1)</span>
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Active Execution:</span>
              <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-extrabold text-slate-900 dark:text-white shadow-2xs">
                {activePathway.type} Pathway • {activePathway.target_role} ({activePathway.estimated_months} Months)
              </span>
            </div>
          </div>

          {/* Active Roadmap Timeline & Live Milestone Tracker */}
          <RoadmapTimeline pathway={activePathway} />

          {/* Bottom Actions Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goToStep(2)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-[#0B4F9C] transition-all"
              >
                <ArrowLeft size={13} />
                <span>View Comparison Model (Step 2)</span>
              </button>

              <button
                type="button"
                onClick={() => goToStep(1)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-[#0B4F9C] transition-all"
              >
                <Layers size={13} />
                <span>Switch Strategy (Step 1)</span>
              </button>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500">
                Milestones completed dynamically drop disruption score across the app in real time.
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
