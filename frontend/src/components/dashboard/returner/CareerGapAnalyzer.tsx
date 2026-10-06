import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Clock, ArrowRight, Flame, FileText } from 'lucide-react'
import { useActiveProfile } from '@/hooks/useActiveProfile'

export interface GapTimelineItem {
  year: string
  title: string
  marketStandard: string
  yourLegacyStack: string
  delta: string
}

export default function CareerGapAnalyzer({
  role,
  gapYears,
  skills = ['Java', 'SQL', 'Spring 4', 'JSP'],
}: {
  role?: string
  gapYears?: number
  skills?: string[]
}) {
  const { profile } = useActiveProfile()
  const canonicalRole = role || profile?.current_role || 'Java Developer'
  const canonicalGapYears = gapYears !== undefined ? gapYears : (profile?.career_gap_years ?? 4)

  const [previousRole, setPreviousRole] = useState(canonicalRole)
  const [gapDuration, setGapDuration] = useState(canonicalGapYears)
  const [industry, setIndustry] = useState('IT & Software Services')

  useEffect(() => {
    if (gapYears !== undefined) {
      setGapDuration(gapYears)
    } else if (profile?.career_gap_years !== undefined) {
      setGapDuration(profile.career_gap_years)
    }
  }, [gapYears, profile?.career_gap_years])

  useEffect(() => {
    if (role) {
      setPreviousRole(role)
    } else if (profile?.current_role) {
      setPreviousRole(profile.current_role)
    }
  }, [role, profile?.current_role])

  const timelineData: GapTimelineItem[] = [
    {
      year: `${new Date().getFullYear() - gapDuration}`,
      title: 'When You Were Active',
      yourLegacyStack: 'Monolithic Spring 4, XML Config, JSP, jQuery, SVN',
      marketStandard: 'Traditional enterprise deployments & on-prem VMs',
      delta: 'Established baseline engineering principles',
    },
    {
      year: `${new Date().getFullYear() - Math.max(1, Math.floor(gapDuration / 2))}`,
      title: 'Industry Inflection Point',
      yourLegacyStack: 'Limited cloud exposure',
      marketStandard: 'Spring Boot 2.x, Microservices, Docker containers, REST APIs',
      delta: 'Shift towards distributed architecture and CI/CD pipelines',
    },
    {
      year: `${new Date().getFullYear()}`,
      title: 'Current Market Reality',
      yourLegacyStack: 'Gap in GenAI & Cloud-Native workflows',
      marketStandard: 'Spring Boot 3, AWS/GCP, LangChain, Vector Embeddings, Kubernetes, Kafka',
      delta: 'High demand for AI-augmented backend engineers and cloud-first designs',
    },
  ]

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-bold mb-1">
            <Clock size={12} />
            <span>Feature 1 • Career Gap Analyzer</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            What Changed While You Were Away?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Market evolution timeline mapped to your {gapDuration}-year career break in {previousRole}.
          </p>
        </div>

        {/* Quick controls */}
        <div className="flex items-center gap-2">
          <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Break Duration: <span className="text-[#F26B1D] font-bold">{gapDuration} Years</span>
          </div>
        </div>
      </div>

      {/* Interactive Quick Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl text-xs">
        <div>
          <label className="text-slate-400 font-semibold block mb-1">Previous Role</label>
          <input
            type="text"
            value={previousRole}
            onChange={(e) => setPreviousRole(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
          />
        </div>
        <div>
          <label className="text-slate-400 font-semibold block mb-1">Break Duration (Years)</label>
          <input
            type="number"
            min={1}
            max={15}
            value={gapDuration}
            onChange={(e) => setGapDuration(Number(e.target.value) || 1)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
          />
        </div>
        <div>
          <label className="text-slate-400 font-semibold block mb-1">Industry Domain</label>
          <input
            type="text"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
          />
        </div>
      </div>

      {/* Visual Timeline Comparison */}
      <div className="relative pl-6 border-l-2 border-dashed border-[#0B4F9C]/30 dark:border-blue-900/60 space-y-6">
        {timelineData.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative group"
          >
            {/* Timeline node */}
            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-[#F26B1D] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#F26B1D]" />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:border-[#0B4F9C]/40 transition-colors">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-[#0B4F9C] dark:text-sky-300">
                  {item.year}
                </span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {item.title}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Your Legacy Stack
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 font-medium">
                    {item.yourLegacyStack}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40">
                  <div className="text-[10px] uppercase font-bold text-[#0B4F9C] dark:text-sky-400 mb-1">
                    Market Standard
                  </div>
                  <div className="text-slate-800 dark:text-slate-200 font-semibold">
                    {item.marketStandard}
                  </div>
                </div>
              </div>

              <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 italic">
                💡 Key Shift: {item.delta}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Strategic Takeaway Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-orange-50 dark:from-slate-800 dark:to-slate-800/80 border border-blue-100 dark:border-slate-700 flex items-start gap-3">
        <Sparkles size={18} className="text-[#F26B1D] shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-bold text-slate-900 dark:text-white">
            Good News: Your foundational problem solving and {skills.slice(0, 2).join(', ')} experience are 100% durable.
          </span>
          <p className="text-slate-600 dark:text-slate-300">
            You only need to bridge the tool layer (Spring Boot 3, Cloud, Vector DBs) rather than starting from scratch.
          </p>
        </div>
      </div>

      {/* ── Interconnected Re-Entry Next Steps ── */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-50 via-teal-50 to-indigo-50 dark:from-slate-800/90 dark:via-teal-950/30 dark:to-slate-900 border border-blue-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
            <Sparkles size={14} className="text-teal-600 dark:text-teal-400" />
            <span>Bridge the Gap in 5 Minutes: Next Step</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            Sharpen modern Java/React syntax in Code Gym or rebuild your resume with modernization sprint badges.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link
            to="/features/muscle-memory"
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition"
          >
            <Flame size={13} className="text-orange-500" />
            <span>Code Gym Drills</span>
          </Link>

          <Link
            to="/features/resume-rebuilder"
            className="px-4 py-2 rounded-xl bg-[#0B4F9C] hover:bg-blue-800 text-white text-xs font-black flex items-center gap-1.5 transition shadow-sm"
          >
            <FileText size={13} />
            <span>Rebuild ATS Resume</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}
