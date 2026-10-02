import { motion } from 'framer-motion'
import {
  RotateCcw,
  Truck,
  TrendingDown,
  Clock,
  GraduationCap,
  CheckCircle2,
} from 'lucide-react'
import type { UserType } from '@/types'

export interface SegmentOption {
  type: UserType
  title: string
  tagline: string
  description: string
  icon: typeof RotateCcw
  color: string
}

const segments: SegmentOption[] = [
  {
    type: 'returner',
    title: 'Career Break Returner',
    tagline: 'Maternity, eldercare, or sabbatical gap',
    description: 'Modernize legacy skills, normalize career breaks, and build proof-of-work to re-enter tech.',
    icon: RotateCcw,
    color: 'from-rose-500 to-pink-600',
  },
  {
    type: 'gig',
    title: 'Gig Platform Worker',
    tagline: 'Delivery, logistics, or field services',
    description: 'Turn high-grit operational experience into entry-level tech ops and data analyst pathways.',
    icon: Truck,
    color: 'from-amber-500 to-orange-600',
  },
  {
    type: 'laid_off',
    title: 'Laid-off Professional',
    tagline: 'Company downsizing or role phase-out',
    description: 'Pivot away from declining manual functions (e.g. manual QA/data) into GenAI & automation.',
    icon: TrendingDown,
    color: 'from-orange-500 to-red-600',
  },
  {
    type: 'stagnant',
    title: 'Stagnant Employee',
    tagline: '3+ years in identical salary/role band',
    description: 'Break free from role lock-in with high-value AI tooling and compensation arbitrage.',
    icon: Clock,
    color: 'from-purple-500 to-indigo-600',
  },
  {
    type: 'student',
    title: 'Tier-2/3 Student / Fresher',
    tagline: 'Graduating BTech / BCA / MCA student',
    description: 'Level the playing field with verifiable project proofs, Git repositories, and market-fit skills.',
    icon: GraduationCap,
    color: 'from-emerald-500 to-teal-600',
  },
]

interface Step1SegmentProps {
  selected: UserType
  onSelect: (type: UserType) => void
}

export default function Step1Segment({ selected, onSelect }: Step1SegmentProps) {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Select Your Current Career Situation
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Our intelligence engine personalizes disruption algorithms and pathways based on your specific archetype.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        {segments.map((seg, idx) => {
          const isSelected = selected === seg.type
          const Icon = seg.icon
          return (
            <motion.div
              key={seg.type}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              onClick={() => onSelect(seg.type)}
              className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-sky-50/80 dark:bg-sky-950/40 border-[#0B4F9C] dark:border-sky-500 shadow-md ring-2 ring-[#0B4F9C]/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${seg.color} text-white flex items-center justify-center shadow-sm`}
                  >
                    <Icon size={20} />
                  </div>
                  {isSelected && (
                    <CheckCircle2 size={20} className="text-[#0B4F9C] dark:text-sky-400" />
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {seg.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#0B4F9C] dark:text-sky-400 mt-0.5">
                    {seg.tagline}
                  </p>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {seg.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
