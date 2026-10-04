import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react'

interface FinalCTASectionProps {
  onOpenDemo: () => void
}

export default function FinalCTASection({ onOpenDemo }: FinalCTASectionProps) {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-sky-50/50 dark:from-slate-900 dark:to-[#080F1A] border-t border-slate-200/80 dark:border-slate-800 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0B4F9C]/10 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/90 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-xs font-bold text-[#0B4F9C] dark:text-sky-300 shadow-xs">
          <Sparkles size={14} className="text-[#F26B1D]" />
          <span>Start Your Transformation Today</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight"
        >
          Take Control of Your <span className="text-[#0B4F9C] dark:text-sky-400">Career Next Move</span>.
        </motion.h2>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          No fees, no generic advice. Just real career intelligence, verified market salaries, and personalized learning pathways.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/signup"
            id="final-cta-signup-btn"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#0B4F9C] text-white font-extrabold text-sm hover:bg-[#083b75] shadow-xl shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Get started free</span>
            <ArrowRight size={17} />
          </Link>

          <button
            type="button"
            id="final-cta-demo-btn"
            onClick={onOpenDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl glass dark:glass-dark border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold text-sm hover:border-[#0B4F9C] transition-all hover:scale-[1.02]"
          >
            <Zap size={16} className="text-[#F26B1D]" />
            <span>Try a demo</span>
          </button>
        </div>

        <div className="pt-4 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck size={15} className="text-emerald-500" />
          <span>100% Free · No credit card required · Instant access</span>
        </div>
      </div>
    </section>
  )
}
