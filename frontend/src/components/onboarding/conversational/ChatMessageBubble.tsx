import ReactMarkdown from 'react-markdown'
import { Bot, User, Volume2, VolumeX } from 'lucide-react'
import type { Message } from './types'

interface ChatMessageBubbleProps {
  msg: Message
  speakingMsgId: string | null
  onToggleSpeak: (id: string, text: string) => void
  onQuickReply: (text: string) => void
  isTyping: boolean
  isDone: boolean
}

export default function ChatMessageBubble({
  msg,
  speakingMsgId,
  onToggleSpeak,
  onQuickReply,
  isTyping,
  isDone,
}: ChatMessageBubbleProps) {
  const isUser = msg.sender === 'user'
  const isSpeaking = speakingMsgId === msg.id

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-xl bg-[#0B4F9C] text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
          <Bot size={14} />
        </div>
      )}

      <div className="max-w-[85%] space-y-2">
        <div
          className={`p-3.5 rounded-2xl text-xs leading-relaxed relative group ${
            isUser
              ? 'bg-[#0B4F9C] text-white rounded-br-xs shadow-2xs font-medium'
              : 'bg-slate-100/90 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-200/60 dark:border-slate-700/60'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-line">{msg.text}</p>
          ) : (
            <div className="prose prose-xs dark:prose-invert max-w-none text-xs leading-relaxed font-normal [&>p]:mb-1.5 [&>p:last-child]:mb-0 [&>ul]:my-1 [&>ul]:pl-4 [&>ol]:my-1 [&>ol]:pl-4 [&>li]:my-0.5">
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          )}

          <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-200/30 dark:border-slate-700/30">
            <span
              className={`text-[9px] font-mono ${
                isUser ? 'text-sky-200' : 'text-slate-400'
              }`}
            >
              {msg.timestamp}
            </span>

            {!isUser && (
              <button
                type="button"
                onClick={() => onToggleSpeak(msg.id, msg.text)}
                title={isSpeaking ? 'Stop reading' : 'Read aloud'}
                className={`p-1 rounded-md transition-all ${
                  isSpeaking
                    ? 'text-[#F26B1D] bg-orange-100 dark:bg-orange-950/50 animate-pulse'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
              </button>
            )}
          </div>
        </div>

        {/* Quick replies */}
        {msg.quickReplies && msg.quickReplies.length > 0 && !isDone && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {msg.quickReplies.map((qr, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onQuickReply(qr)}
                disabled={isTyping}
                className="px-2.5 py-1 text-[11px] font-bold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#0B4F9C] hover:text-[#0B4F9C] dark:hover:text-sky-400 hover:bg-sky-50/50 transition-all shadow-2xs text-left"
              >
                {qr}
              </button>
            ))}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
          <User size={14} />
        </div>
      )}
    </div>
  )
}
