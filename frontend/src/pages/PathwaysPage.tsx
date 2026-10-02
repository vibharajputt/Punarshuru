import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Sparkles, RefreshCw, Info } from 'lucide-react'
import { useProfileStore } from '@/store/profileStore'
import { pathwayApi } from '@/lib/api'
import PathwayCard from '@/components/pathways/PathwayCard'
import RoadmapTimeline from '@/components/pathways/RoadmapTimeline'
import PathwayCompareTable from '@/components/pathways/PathwayCompareTable'
import Skeleton from '@/components/common/Skeleton'
import type { PathwayOption } from '@/types'

export default function PathwaysPage() {
  const profile = useProfileStore((s) => s.profile)
  const [selectedIndex, setSelectedIndex] = useState<number>(1) // Default to Stretch

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

  return (
    <div className="space-y-8 pb-12">
      {/* Friendly Explainer Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-950 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-emerald-900/50">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-white/10 text-emerald-300 shrink-0 mt-0.5">
            <Info size={20} />
          </div>
          <div className="space-y-1">
            <h2 className="font-bold text-sm text-white flex items-center gap-2">
              <span>What are Personalized Learning Pathways?</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-400/20 text-emerald-300 text-[10px] uppercase font-extrabold tracking-wider">
                100% Free Reskilling
              </span>
            </h2>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              We provide 3 transition options: <strong>Safe</strong> (fastest placement), <strong>Stretch</strong> (highest salary leap), and <strong>Pivot</strong> (domain change). All recommended courses link to free certified government courses from NPTEL, SWAYAM, and Skill India.
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Personalized Learning Pathways
            </h1>
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Zero-Cost Reskilling
            </span>
          </div>
          <p className="text-xs text-slate-500">
            3 curated transition strategies (Safe, Stretch, Pivot) powered by free accredited courses.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-[#0B4F9C] transition-all self-start sm:self-auto"
        >
          <RefreshCw size={13} className={isFetching ? 'animate-spin' : ''} />
          <span>Regenerate Pathways</span>
        </button>
      </div>

      {/* Motivational Quote Banner */}
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

      {/* 3 Pathway Selection Cards */}
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

      {/* Active Roadmap Timeline */}
      <RoadmapTimeline pathway={activePathway} />

      {/* Strategy Comparison Table */}
      <PathwayCompareTable pathways={pathways} />
    </div>
  )
}
