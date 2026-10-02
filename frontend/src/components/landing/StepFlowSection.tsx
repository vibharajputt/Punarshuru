import { motion } from 'framer-motion'
import {
  FileText,
  Activity,
  Target,
  Compass,
  Award,
} from 'lucide-react'

const steps = [
  {
    step: '01',
    title: 'Career Background',
    desc: 'Upload resume or complete a 1-minute career audit. Our parser extracts skills, experience & career gaps.',
    icon: FileText,
    badge: 'AI Resume Parser',
  },
  {
    step: '02',
    title: 'Disruption Index',
    desc: 'Audit your vulnerability (0-100) across skill decay, GenAI automation exposure, career break and role stagnation.',
    icon: Activity,
    badge: 'Mathematical Model',
  },
  {
    step: '03',
    title: 'Skill Gap & Radar',
    desc: 'Compare existing competencies against 300+ live Indian tech roles with exact, partial and missing categorization.',
    icon: Target,
    badge: 'Taxonomy Matcher',
  },
  {
    step: '04',
    title: '3-Tiered Pathways',
    desc: 'Get Safe, Stretch, and Pivot roadmaps with 120+ free, verified courses from NPTEL, SWAYAM, and Skill India.',
    icon: Compass,
    badge: 'Personalized Roadmap',
  },
  {
    step: '05',
    title: 'Real CTC & Passport',
    desc: 'Calculate real purchasing power across 12 tech hubs and generate your public AI Talent Passport with QR verification.',
    icon: Award,
    badge: 'Verifiable Proof',
  },
]

export default function StepFlowSection() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[#F26B1D] uppercase tracking-wider">
            Methodology & Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            The 5-Step Intelligence Engine
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            From detecting career friction to deploying production-ready verified skills — tailored specifically for Indian tech ecosystems.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="relative p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-300 dark:text-slate-600">
                      {s.step}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0B4F9C] dark:text-sky-300">
                      {s.badge}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/60 dark:border-slate-700 flex items-center justify-center text-[#0B4F9C] dark:text-sky-400">
                    <Icon size={20} />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {s.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
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
