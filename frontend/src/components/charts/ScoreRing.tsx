import { motion } from 'framer-motion'

interface ScoreRingProps {
  score: number
  size?: number
  strokeWidth?: number
  label?: string
  subtitle?: string
  showRiskBadge?: boolean
  className?: string
}

export default function ScoreRing({
  score = 0,
  size = 180,
  strokeWidth = 14,
  label = 'Career Risk Score',
  subtitle,
  showRiskBadge = true,
  className = '',
}: ScoreRingProps) {
  const clampedScore = Math.min(100, Math.max(0, score))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference

  // Color selection based on risk
  const getColors = () => {
    if (clampedScore < 35) {
      return {
        stroke: '#10B981', // Emerald green
        glow: 'rgba(16, 185, 129, 0.25)',
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300',
        text: 'Low Risk',
      }
    }
    if (clampedScore <= 65) {
      return {
        stroke: '#F59E0B', // Amber
        glow: 'rgba(245, 158, 11, 0.25)',
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300',
        text: 'Moderate Risk',
      }
    }
    return {
      stroke: '#F26B1D', // Punarshuru Orange/Coral
      glow: 'rgba(242, 107, 29, 0.3)',
      badgeBg: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300',
      text: 'High Risk',
    }
  }

  const { stroke, glow, badgeBg, text: riskText } = getColors()

  return (
    <div className={`flex flex-col items-center justify-center relative ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* SVG Circle */}
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
          />
          {/* Animated Progress Arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${glow})`,
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span
            className="text-4xl font-black tracking-tight text-slate-800 dark:text-white"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {Math.round(clampedScore)}
          </motion.span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            / 100
          </span>
        </div>
      </div>

      {label && (
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-3">
          {label}
        </span>
      )}

      {subtitle && (
        <span className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          {subtitle}
        </span>
      )}

      {showRiskBadge && (
        <span
          className={`mt-2 px-3 py-0.5 text-xs font-bold rounded-full border ${badgeBg}`}
        >
          {riskText}
        </span>
      )}
    </div>
  )
}
