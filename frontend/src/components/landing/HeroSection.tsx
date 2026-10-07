import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp, Zap } from 'lucide-react'
import ScoreRing from '@/components/charts/ScoreRing'

interface HeroSectionProps {
  onOpenDemo: () => void
}

export default function HeroSection({ onOpenDemo }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 gradient-mesh">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/90 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-xs font-bold text-[#0B4F9C] dark:text-sky-300 shadow-xs">
              <img src="/logo.png" alt="Punarshuru" className="w-5 h-5 object-contain" />
              <span>Intelligent Talent & Workforce Ecosystem • Bharat 2.0</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Detect the <span className="text-[#0B4F9C] dark:text-sky-400">Career Risk</span>.
              <br />
              Understand the <span className="text-[#F26B1D]">Gap</span>.
              <br />
              Find the Next Move.
            </h1>

            {/* Subtitle - 1 Line per ux.md */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              AI-powered career intelligence for career-break returners, gig workers, laid-off professionals, stagnant employees, and students in India.
            </p>

            {/* CTA Buttons: Get started free + Try a demo per ux.md */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/signup"
                id="hero-get-started-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#0B4F9C] text-white font-extrabold text-sm hover:bg-[#083b75] shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Get started free</span>
                <ArrowRight size={17} />
              </Link>
              <button
                type="button"
                id="hero-try-demo-btn"
                onClick={onOpenDemo}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl glass dark:glass-dark border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold text-sm hover:border-[#0B4F9C] transition-all hover:scale-[1.02]"
              >
                <Zap size={16} className="text-[#F26B1D]" />
                <span>Try a demo</span>
              </button>
            </div>

            {/* Trust points */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>Zero Hallucination Scoring</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp size={16} className="text-[#0B4F9C]" />
                <span>Real Purchasing Power Index</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles size={16} className="text-[#F26B1D]" />
                <span>120+ Free Govt & NPTEL Courses</span>
              </div>
            </div>
          </motion.div>

          {/* Right Live Product Preview Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="relative p-6 sm:p-7 rounded-3xl glass dark:glass-dark border border-white/40 dark:border-slate-800 shadow-2xl shadow-blue-900/10 space-y-6">
              {/* Header inside preview */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0B4F9C] to-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                    PS
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                      Priya Sharma
                    </h2>
                    <p className="text-xs text-slate-400">Pune • Ex-Java Developer (4yr Gap)</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                  Returner
                </span>
              </div>

              {/* Gauge & Stats */}
              <div className="grid grid-cols-2 gap-4 items-center">
                <ScoreRing
                  score={72}
                  size={130}
                  strokeWidth={11}
                  label="Career Risk Score"
                  subtitle="72/100 · High Risk"
                  showRiskBadge={false}
                />

                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-400">Target Role</p>
                    <p className="font-bold text-[#0B4F9C] dark:text-sky-400">GenAI Engineer</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-400">Skill Overlap</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">38% Matched (Java Base)</p>
                  </div>
                </div>
              </div>

              {/* Recommended pathway preview */}
              <div className="p-3 rounded-2xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/60 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">Recommended Next Move</p>
                  <p className="text-slate-500 dark:text-slate-400">Switch Path: Python + LangChain RAG</p>
                </div>
                <span className="font-bold text-[#0B4F9C] dark:text-sky-300">16 Weeks</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
