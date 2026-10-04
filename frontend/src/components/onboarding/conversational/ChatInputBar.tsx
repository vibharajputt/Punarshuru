import type { FormEvent } from 'react'
import { Send, Mic, MicOff } from 'lucide-react'

interface ChatInputBarProps {
  inputMessage: string
  setInputMessage: (val: string) => void
  onSend: (text: string) => void
  isTyping: boolean
  isMicActive: boolean
  isRecordingFallback: boolean
  voiceLang: 'hi-IN' | 'en-IN'
  onToggleVoice: () => void
}

export default function ChatInputBar({
  inputMessage,
  setInputMessage,
  onSend,
  isTyping,
  isMicActive,
  isRecordingFallback,
  voiceLang,
  onToggleVoice,
}: ChatInputBarProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSend(inputMessage)
  }

  return (
    <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
      {isMicActive && (
        <div className="mb-2 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="font-bold">
              {isRecordingFallback
                ? 'Recording audio... Click mic to finish'
                : `Listening live (${voiceLang})... Speak now`}
            </span>
          </div>
          <button
            type="button"
            onClick={onToggleVoice}
            className="text-[11px] underline font-bold"
          >
            Stop
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleVoice}
          title={isMicActive ? 'Stop Listening' : `Voice Input (${voiceLang})`}
          className={`p-2.5 rounded-xl transition-all border shrink-0 ${
            isMicActive
              ? 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-300 animate-pulse'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
          }`}
        >
          {isMicActive ? <MicOff size={16} /> : <Mic size={16} />}
        </button>

        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type or speak in English, हिन्दी, or Hinglish..."
          disabled={isTyping}
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]/30 focus:border-[#0B4F9C]"
        />

        <button
          type="submit"
          disabled={!inputMessage.trim() || isTyping}
          className="p-2.5 rounded-xl bg-[#0B4F9C] hover:bg-[#083b75] text-white disabled:opacity-40 transition-all shadow-sm shrink-0"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}
