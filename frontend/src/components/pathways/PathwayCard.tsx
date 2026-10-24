import { Shield, Rocket, RefreshCw, Clock, IndianRupee, ArrowRight, CheckCircle2, Circle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { PathwayOption } from '@/types'

interface PathwayCardProps {
  pathway: PathwayOption
  isSelected: boolean
  onSelect: () => void
}

export default function PathwayCard({
  pathway,
  isSelected,
  onSelect,
}: PathwayCardProps) {
  const { i18n } = useTranslation()
  const isHi = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('hi')

  const isSafe = pathway.type === 'Safe'
  const isStretch = pathway.type === 'Stretch'

  const getStyle = () => {
    if (isSafe) {
      return {
        badgeBg: 'bg-blue-100 text-[#0B4F9C] dark:bg-blue-950 dark:text-sky-300',
        borderColor: 'border-blue-400 dark:border-blue-600 ring-4 ring-[#0B4F9C]/15',
        icon: Shield,
        accentColor: 'text-[#0B4F9C]',
        label: isHi ? 'सुरक्षित मार्ग (Safe)' : 'Safe Pathway',
      }
    }
    if (isStretch) {
      return {
        badgeBg: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
        borderColor: 'border-orange-400 dark:border-orange-600 ring-4 ring-[#F26B1D]/15',
        icon: Rocket,
        accentColor: 'text-[#F26B1D]',
        label: isHi ? 'उच्च वृद्धि मार्ग (Stretch)' : 'Stretch Pathway (Recommended)',
      }
    }
    return {
      badgeBg: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
      borderColor: 'border-purple-400 dark:border-purple-600 ring-4 ring-purple-600/15',
      icon: RefreshCw,
      accentColor: 'text-purple-600',
      label: isHi ? 'स्विच मार्ग (Switch)' : 'Switch Pathway',
    }
  }

  const { badgeBg, borderColor, icon: Icon, accentColor, label } = getStyle()

  return (
    <div
      onClick={onSelect}
      className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 relative ${
        isSelected
          ? `bg-white dark:bg-slate-900 ${borderColor} shadow-xl scale-[1.01]`
          : 'bg-slate-50/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:bg-white dark:hover:bg-slate-900 shadow-2xs'
      }`}
    >
      <div className="space-y-3">
        {/* Top Tag & Selection Indicator */}
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 ${badgeBg}`}>
            <Icon size={13} />
            <span>{label}</span>
          </span>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400">
              {isHi ? 'कठिनाई:' : 'Difficulty:'}{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {isHi
                  ? pathway.difficulty === 'Medium'
                    ? 'मध्यम'
                    : pathway.difficulty === 'High'
                    ? 'उच्च'
                    : 'सरल'
                  : pathway.difficulty}
              </span>
            </span>

            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                isSelected
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
              }`}
            >
              {isSelected ? <CheckCircle2 size={18} /> : <Circle size={14} className="text-slate-300 dark:text-slate-600" />}
            </div>
          </div>
        </div>

        {/* Title & Target Role */}
        <div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            {pathway.title}
          </h3>
          <p className="text-xs font-bold text-[#0B4F9C] dark:text-sky-300 mt-0.5">
            {isHi ? 'लक्ष्य:' : 'Target:'} {pathway.target_role}
          </p>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {pathway.description}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
            <Clock size={15} className="text-slate-500" />
            <div>
              <p className="text-[10px] text-slate-400 font-semibold">{isHi ? 'समयावधि' : 'Timeline'}</p>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                {pathway.estimated_months} {isHi ? 'महीने' : 'Months'}
              </p>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
            <IndianRupee size={15} className="text-emerald-600" />
            <div>
              <p className="text-[10px] text-slate-400 font-semibold">{isHi ? 'लक्षित सीटीसी' : 'Target CTC'}</p>
              <p className="font-bold text-emerald-700 dark:text-emerald-400">₹{pathway.target_salary_lpa} LPA</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold ${accentColor}`}>
        <span className="flex items-center gap-1.5">
          {isSelected ? (
            <>
              <CheckCircle2 size={15} className="text-emerald-600" />
              <span className="text-emerald-700 dark:text-emerald-400 font-black">
                {isHi ? '✓ चुनी गई रणनीति' : '✓ Selected Strategy'}
              </span>
            </>
          ) : (
            <span>
              {isHi ? 'यह रणनीति चुनें' : 'Click to Select Strategy'}
            </span>
          )}
        </span>
        <ArrowRight size={14} />
      </div>
    </div>
  )
}

