import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Target,
  TrendingUp,
  Map,
  DollarSign,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

interface ModuleNavCardsProps {
  targetRole?: string
  matchPct?: number
}

export default function ModuleNavCards({
  targetRole = 'GenAI Engineer',
  matchPct = 42,
}: ModuleNavCardsProps) {
  const modules = [
    {
      to: '/skill-gap',
      icon: Target,
      title: 'Skill Gap & Radar',
      metric: `${matchPct}% Match`,
      desc: `Audit exact & missing competencies for ${targetRole}.`,
      badge: 'Interactive Radar',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      to: '/market',
      icon: TrendingUp,
      title: 'Market Intelligence',
      metric: '300+ Roles',
      desc: 'Salary trends, rising tech stacks & hiring city hubs.',
      badge: 'Live Data',
      color: 'from-orange-500 to-amber-600',
    },
    {
      to: '/pathways',
      icon: Map,
      title: 'Learning Pathways',
      metric: '3 Tailored Paths',
      desc: 'Safe, Stretch & Pivot roadmaps with free SWAYAM/NPTEL courses.',
      badge: 'Free Govt Courses',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      to: '/compensation',
      icon: DollarSign,
      title: 'Real CTC Arbitrage',
      metric: '12 Tech Hubs',
      desc: 'Nominal vs Real purchasing power (Mohali baseline vs metros).',
      badge: 'CoL Index',
      color: 'from-purple-600 to-rose-600',
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles size={16} className="text-[#0B4F9C] dark:text-sky-400" />
          <span>Intelligence Deep-Dives</span>
        </h3>
        <span className="text-xs text-slate-500">
          Tailored to your current assessment
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.map((m, idx) => {
          const Icon = m.icon
          return (
            <motion.div
              key={m.to}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.06 }}
            >
              <Link
                to={m.to}
                className="group p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-[#0B4F9C]/60 transition-all flex flex-col justify-between h-full space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${m.color} text-white flex items-center justify-center shadow-sm`}
                    >
                      <Icon size={20} />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {m.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-[#0B4F9C] dark:group-hover:text-sky-400 transition-colors">
                      {m.title}
                    </h4>
                    <p className="text-xs font-bold text-[#0B4F9C] dark:text-sky-300 mt-0.5">
                      {m.metric}
                    </p>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {m.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#0B4F9C] dark:text-sky-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore Module</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
