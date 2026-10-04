import { motion } from 'framer-motion'
import { MessageSquare, Activity, Compass } from 'lucide-react'

const steps = [
  {
    step: '01',
    badge: 'Step 1',
    title: 'Upload / Chat',
    desc: 'Upload your resume or chat with our empathetic onboarding agent to extract your skills, experience, and career gaps in plain language.',
    icon: MessageSquare,
  },
  {
    step: '02',
    badge: 'Step 2',
    title: 'See your score',
    desc: 'Understand your Career Risk Score instantly, broken down across outdated skills, automation risk, and current industry demand.',
    icon: Activity,
  },
  {
    step: '03',
    badge: 'Step 3',
    title: 'Follow your path',
    desc: 'Follow your personalized Safe, Stretch, or Switch career roadmap packed with free verified courses from NPTEL, SWAYAM, and Skill India.',
    icon: Compass,
  },
]

export default function StepFlowSection() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[#F26B1D] uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            3 Simple Steps to Your Next Move
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            No endless tests or confusing questionnaires. From onboarding to a verified career roadmap in minutes.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, idx) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative p-7 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between hover:border-[#0B4F9C]/40 hover:shadow-lg transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-slate-300 dark:text-slate-600 group-hover:text-[#0B4F9C] dark:group-hover:text-sky-400 transition-colors">
                      {s.step}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0B4F9C] dark:text-sky-300">
                      {s.badge}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/60 dark:border-slate-700 flex items-center justify-center text-[#0B4F9C] dark:text-sky-400 group-hover:scale-105 transition-transform">
                    <Icon size={22} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {s.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
