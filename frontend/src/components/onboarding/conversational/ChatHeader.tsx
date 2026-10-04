import { Bot, Languages } from 'lucide-react'

interface ChatHeaderProps {
  voiceLang: 'hi-IN' | 'en-IN'
  onToggleLang: () => void
  onSwitchToForm: () => void
}

export default function ChatHeader({
  voiceLang,
  onToggleLang,
  onSwitchToForm,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-2 shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#0B4F9C] to-indigo-600 text-white flex items-center justify-center shadow-xs">
          <Bot size={15} />
        </div>
        <div>
          <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block">
            AI Career Intelligence Agent
          </span>
          <span className="text-[10px] text-slate-400">
            Conversational onboarding & calibration
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleLang}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-[#0B4F9C] transition-all"
          title="Switch Language"
        >
          <Languages size={12} />
          <span>{voiceLang === 'hi-IN' ? 'हिन्दी' : 'EN'}</span>
        </button>

        <button
          type="button"
          onClick={onSwitchToForm}
          className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline transition-colors"
        >
          Use form instead
        </button>
      </div>
    </div>
  )
}
