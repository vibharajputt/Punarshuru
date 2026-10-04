import { useNavigate } from 'react-router-dom'
import { Sparkles, RefreshCw, LogOut } from 'lucide-react'
import { useDemoStore } from '@/store/demoStore'
import { useProfileStore } from '@/store/profileStore'

interface DemoStripProps {
  onSwitch: () => void
}

export default function DemoStrip({ onSwitch }: DemoStripProps) {
  const navigate = useNavigate()
  const personaName = useDemoStore((s) => s.personaName)
  const clearDemo = useDemoStore((s) => s.clearDemo)
  const clearProfile = useProfileStore((s) => s.clearProfile)

  const handleExitDemo = () => {
    clearDemo()
    clearProfile()
    navigate('/', { replace: true })
  }

  return (
    <div
      id="demo-strip"
      className="w-full bg-gradient-to-r from-amber-500/15 via-sky-500/15 to-amber-500/15 dark:from-amber-950/40 dark:via-sky-950/40 dark:to-amber-950/40 border-b border-amber-200/50 dark:border-amber-900/40 py-1.5 px-4 text-xs z-50 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Indicator & Name */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-amber-500 text-white shadow-2xs shrink-0">
            <Sparkles size={12} />
          </span>
          <span className="font-medium text-slate-700 dark:text-slate-200 truncate">
            Demo: <strong className="font-bold text-[#0B4F9C] dark:text-sky-400">{personaName || 'Persona'}</strong>
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0 font-medium text-slate-500 dark:text-slate-400 text-xs">
          <span>·</span>
          <button
            type="button"
            id="demo-strip-switch-btn"
            onClick={onSwitch}
            className="font-bold text-[#0B4F9C] dark:text-sky-400 hover:text-[#083b75] dark:hover:text-sky-300 underline underline-offset-2 transition-colors flex items-center gap-1"
          >
            <RefreshCw size={11} className="hidden sm:inline" />
            <span>Switch</span>
          </button>
          <span>·</span>
          <button
            type="button"
            id="demo-strip-exit-btn"
            onClick={handleExitDemo}
            className="text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center gap-1"
          >
            <LogOut size={11} className="hidden sm:inline" />
            <span>Exit demo</span>
          </button>
        </div>
      </div>
    </div>
  )
}
