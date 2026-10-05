import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, XCircle, Layers } from 'lucide-react'

export interface SkillDriftItem {
  name: string
  status: 'active' | 'refresh' | 'learn'
  category: string
  relevancePct: number
  marketTrend: 'rising' | 'declining' | 'stable'
  action: string
}

export default function SkillDriftScore({
  skills = ['Java', 'SQL', 'Spring', 'Spring Boot', 'Docker', 'AWS', 'Microservices'],
}: {
  skills?: string[]
}) {
  const [filter, setFilter] = useState<'all' | 'active' | 'refresh' | 'learn'>('all')

  const driftItems: SkillDriftItem[] = [
    {
      name: 'Java & Core OOP',
      status: 'active',
      category: 'Core Language',
      relevancePct: 92,
      marketTrend: 'stable',
      action: 'Valid baseline; focus on modern Java 17/21 records and virtual threads',
    },
    {
      name: 'SQL & Relational DBs',
      status: 'active',
      category: 'Database',
      relevancePct: 88,
      marketTrend: 'stable',
      action: 'Fully retained; index tuning and query planning still crucial',
    },
    {
      name: 'Spring Framework',
      status: 'active',
      category: 'Framework',
      relevancePct: 80,
      marketTrend: 'stable',
      action: 'Core IoC & DI concepts carry over cleanly',
    },
    {
      name: 'Spring Boot 3.x',
      status: 'refresh',
      category: 'Framework',
      relevancePct: 65,
      marketTrend: 'rising',
      action: 'Refresh autoconfiguration, Actuator, and modern security patterns',
    },
    {
      name: 'Microservices & REST APIs',
      status: 'refresh',
      category: 'Architecture',
      relevancePct: 60,
      marketTrend: 'rising',
      action: 'Refresh circuit breakers, API Gateway routing, and OpenAPI specs',
    },
    {
      name: 'Docker & Containerization',
      status: 'learn',
      category: 'DevOps & Cloud',
      relevancePct: 25,
      marketTrend: 'rising',
      action: 'Learn Dockerfiles, multi-stage builds, and container registry push',
    },
    {
      name: 'AWS Cloud Services (EC2, S3, RDS)',
      status: 'learn',
      category: 'Cloud Infrastructure',
      relevancePct: 20,
      marketTrend: 'rising',
      action: 'Learn basic cloud hosting, IAM roles, and serverless lambdas',
    },
    {
      name: 'GenAI & Vector Embeddings',
      status: 'learn',
      category: 'Emerging AI',
      relevancePct: 10,
      marketTrend: 'rising',
      action: 'Learn LangChain4j, RAG pipelines, and embedding models integration',
    },
  ]

  const activeCount = driftItems.filter((i) => i.status === 'active').length
  const refreshCount = driftItems.filter((i) => i.status === 'refresh').length
  const learnCount = driftItems.filter((i) => i.status === 'learn').length
  const overallRetainedScore = Math.round(
    (activeCount * 1.0 + refreshCount * 0.6) / driftItems.length * 100
  )

  const filtered = filter === 'all' ? driftItems : driftItems.filter((i) => i.status === filter)

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0B4F9C] dark:text-sky-300 text-xs font-bold mb-1">
            <Layers size={12} />
            <span>Feature 2 • Skill Drift Engine</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Skill Drift & Market Relevance Score
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Audit of your legacy skillset against current target requirements ({skills.length} baseline skills).
          </p>
        </div>

        {/* Score Pill */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Core Retention</div>
            <div className="text-xl font-black text-[#0B4F9C] dark:text-sky-400">
              {overallRetainedScore}% <span className="text-xs font-semibold text-slate-500">durable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setFilter(filter === 'active' ? 'all' : 'active')}
          className={`p-3 rounded-2xl border text-left transition-all ${
            filter === 'active'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 ring-2 ring-emerald-500/20'
              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
            <CheckCircle2 size={14} />
            <span>Active / Retained</span>
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white">{activeCount} Skills</div>
          <div className="text-[11px] text-slate-500">Core foundations ready</div>
        </button>

        <button
          onClick={() => setFilter(filter === 'refresh' ? 'all' : 'refresh')}
          className={`p-3 rounded-2xl border text-left transition-all ${
            filter === 'refresh'
              ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 ring-2 ring-amber-500/20'
              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/80 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">
            <AlertTriangle size={14} />
            <span>Needs Refresh</span>
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white">{refreshCount} Skills</div>
          <div className="text-[11px] text-slate-500">1-2 weeks upgrade</div>
        </button>

        <button
          onClick={() => setFilter(filter === 'learn' ? 'all' : 'learn')}
          className={`p-3 rounded-2xl border text-left transition-all ${
            filter === 'learn'
              ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 ring-2 ring-rose-500/20'
              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/80 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">
            <XCircle size={14} />
            <span>Learn New</span>
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white">{learnCount} Skills</div>
          <div className="text-[11px] text-slate-500">Target role delta</div>
        </button>
      </div>

      {/* Breakdown List */}
      <div className="space-y-2.5">
        {filtered.map((item, idx) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            className="p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              {item.status === 'active' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={18} />
                </div>
              )}
              {item.status === 'refresh' && (
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
                  <AlertTriangle size={18} />
                </div>
              )}
              {item.status === 'learn' && (
                <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center shrink-0">
                  <XCircle size={18} />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.action}</p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
              <span
                className={`text-xs font-black px-2.5 py-1 rounded-xl uppercase tracking-wider ${
                  item.status === 'active'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : item.status === 'refresh'
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                }`}
              >
                {item.status === 'active' ? '✓ Ready' : item.status === 'refresh' ? '⚠ Refresh' : '✕ Learn'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
