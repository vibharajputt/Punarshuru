import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Activity, Target, DollarSign, CheckCircle2 } from 'lucide-react'
import ScoreRing from '@/components/charts/ScoreRing'
import SkillRadar from '@/components/charts/SkillRadar'
import CompareBars from '@/components/charts/CompareBars'

export default function FeatureRowsSection() {
  return (
    <section className="py-24 space-y-24 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Feature 1: Disruption Index */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6 space-y-5"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-xs font-bold text-[#F26B1D] border border-orange-200 dark:border-orange-800">
              <Activity size={14} />
              <span>Multi-Dimensional Audit</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Quantify Your Disruption Risk Before the Market Does
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Our 5-factor mathematical model audits skill obsolescence, GenAI automation exposure, career break penalties, and compensation stagnation.
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Zero generic scores — tailored by years of tenure & market velocity</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Actionable 1-line reasons for each component with risk mitigations</span>
              </li>
            </ul>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0B4F9C] dark:text-sky-400 hover:underline pt-2"
            >
              <span>Explore Disruption Audit Dashboard</span>
              <ArrowRight size={15} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-around"
          >
            <ScoreRing
              score={78}
              size={170}
              strokeWidth={13}
              label="Arjun Mehta (Laid-off QA)"
              subtitle="78/100 High Risk"
            />
            <div className="space-y-2 text-xs w-48">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 shadow-xs border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block">Automation Risk</span>
                <span className="font-bold text-orange-600">35 / 35 (Critical)</span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 shadow-xs border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block">Skill Decay</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">10 / 25 (Moderate)</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature 2: Skill Gap Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6 lg:order-2 space-y-5"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-xs font-bold text-[#0B4F9C] dark:text-sky-300 border border-blue-200 dark:border-blue-800">
              <Target size={14} />
              <span>Skill Radar Intelligence</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              High-Fidelity Match: Have, Partial & Missing
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Don't guess what hiring managers require. We extract required skills from 300+ live job descriptions and run fuzzy semantic matching across your resume.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                ✓ Have: Java, MySQL, REST APIs
              </span>
              <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold">
                ~ Partial: Python (C++ match)
              </span>
              <span className="px-3 py-1 rounded-lg bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-semibold">
                ✕ Missing: LangChain, Vector DBs
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6 lg:order-1 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-md"
          >
            <SkillRadar
              height={260}
              data={[
                { category: 'AI / LLMs', have: 1, required: 4, pct: 25 },
                { category: 'Backend', have: 4, required: 4, pct: 100 },
                { category: 'Cloud/DevOps', have: 2, required: 3, pct: 66 },
                { category: 'Data/SQL', have: 3, required: 3, pct: 100 },
                { category: 'Frontend', have: 1, required: 2, pct: 50 },
              ]}
            />
          </motion.div>
        </div>

        {/* Feature 3: Real Compensation Arbitrage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6 space-y-5"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <DollarSign size={14} />
              <span>Real Purchasing Power</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Nominal CTC is a Vanity Metric. Calculate Real Disposable Income.
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              A ₹14 LPA remote offer in Mohali (CoL=1.0) yields higher net savings than ₹22 LPA in Bengaluru (CoL=2.4) after subtracting rent, commute and metro living overhead.
            </p>
            <Link
              to="/compensation"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0B4F9C] dark:text-sky-400 hover:underline pt-2"
            >
              <span>Launch Offer & City Arbitrage Calculator</span>
              <ArrowRight size={15} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-md"
          >
            <CompareBars height={240} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
