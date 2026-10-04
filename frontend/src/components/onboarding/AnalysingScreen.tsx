import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, CheckCircle2, ShieldCheck, Activity, Target, Compass } from 'lucide-react'

interface AnalysingScreenProps {
  onComplete: () => void
}

const analysisSteps = [
  { label: 'Parsing profile vectors & career background...', icon: Activity },
  { label: 'Auditing 5-factor Career Risk Score (Decay, Automation Risk, Gap, Stagnation)...', icon: ShieldCheck },
  { label: 'Matching against 250+ taxonomy skills & 300+ Indian job snapshots...', icon: Target },
  { label: 'Curating Safe, Stretch & Switch paths with free NPTEL/SWAYAM courses...', icon: Compass },
  { label: 'Synthesizing Skill Passport & Real salary (after rent & travel)...', icon: Sparkles },
]

export default function AnalysingScreen({ onComplete }: AnalysingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(15)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < analysisSteps.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, 700)

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(progressTimer)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 18
      })
    }, 450)

    return () => {
      clearInterval(timer)
      clearInterval(progressTimer)
    }
  }, [onComplete])

  return (
    <div className="py-16 max-w-lg mx-auto text-center space-y-8">
      {/* Animated Glowing Ring */}
      <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-dashed border-[#0B4F9C] dark:border-sky-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#0B4F9C] to-[#F26B1D] text-white flex items-center justify-center shadow-lg"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Sparkles size={32} />
        </motion.div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Analysing Your Career Intelligence Profile
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Calculating career risk factors and market alignment for your profile.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 max-w-md mx-auto">
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-[#0B4F9C] to-[#F26B1D] h-full rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between text-[11px] font-bold text-slate-400">
          <span>Processing Engine Vectors</span>
          <span>{Math.min(100, progress)}%</span>
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-2.5 text-left max-w-md mx-auto pt-2">
        {analysisSteps.map((step, idx) => {
          const isDone = idx < currentStep
          const isCurrent = idx === currentStep
          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-3 rounded-xl border text-xs flex items-center gap-3 transition-all ${
                isDone
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 font-semibold'
                  : isCurrent
                  ? 'bg-sky-50 dark:bg-sky-950/40 border-[#0B4F9C] text-[#0B4F9C] dark:text-sky-300 font-bold shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
              }`}
            >
              {isDone ? (
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              ) : isCurrent ? (
                <motion.div
                  className="w-4 h-4 rounded-full border-2 border-[#0B4F9C] border-t-transparent animate-spin shrink-0"
                />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" />
              )}
              <span className="truncate">{step.label}</span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
