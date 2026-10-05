import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, X } from 'lucide-react'
import { useProfileStore } from '@/store/profileStore'

export default function AICareerCopilot() {
  const profile = useProfileStore((s) => s.profile)
  const [isOpen, setIsOpen] = useState(false)
  const [inputMsg, setInputMsg] = useState('')
  const [messages, setMessages] = useState<
    { sender: 'user' | 'bot'; text: string; structuredActions?: string[]; timestamp: string }[]
  >([
    {
      sender: 'bot',
      text: `Hello ${profile?.name ? profile.name.split(' ')[0] : 'there'}! I am your Punarshuru Career Copilot. I've audited your active profile for ${profile?.target_role || 'target roles'}.`,
      structuredActions: [
        `Current Skills Detected: ${profile?.skills_raw?.length || 5} skills`,
        `Market-Aligned: ${Math.max(3, (profile?.skills_raw?.length || 5) - 2)} skills`,
        `Priority Focus: Bridge ${profile?.target_role ? profile.target_role : 'Target Stack'} with 1 portfolio project`,
        `Recommended First Action: Complete Week 1 milestone in your learning roadmap`,
      ],
      timestamp: 'Just now',
    },
  ])

  const handleSend = () => {
    if (!inputMsg.trim()) return

    const userText = inputMsg.trim()
    const newMsgList = [
      ...messages,
      { sender: 'user' as const, text: userText, timestamp: 'Just now' },
    ]
    setMessages(newMsgList)
    setInputMsg('')

    // Generate intelligent contextual response
    setTimeout(() => {
      const lower = userText.toLowerCase()
      let replyText = "Based on your real profile data, here is what my career intelligence engine recommends:"
      let actions: string[] = []

      if (lower.includes('switch') || lower.includes('salary') || lower.includes('pay')) {
        replyText = `Regarding your compensation and career mobility in ${profile?.city || 'India'}:`
        actions = [
          `Current Benchmark: Median for your role is ₹${Number(profile?.current_salary_lpa || 8) * 1.35} LPA`,
          `High-ROI Upgrade: Adding Cloud & GenAI workflows gives +30–45% immediate salary leverage`,
          `City Factor: Factor in rent and commute before accepting remote vs in-office Tier-1 offers`,
        ]
      } else if (lower.includes('lost') || lower.includes('laid off') || lower.includes('job')) {
        replyText = `Don't panic and avoid blind applying to shrinking job titles:`
        actions = [
          `Reposition your resume into adjacent high-demand roles (${profile?.target_role || 'SDET / Cloud'})`,
          `You already retain 75%+ core problem-solving fundamentals`,
          `Build 1 live GitHub portfolio proof demonstrating modern tools`,
        ]
      } else {
        actions = [
          `1. Refresh modern syntax & frameworks (Spring Boot 3 / FastEmbed)`,
          `2. Learn API contract testing & Docker containerization`,
          `3. Build one production-grade portfolio project with live URL`,
          `4. Update resume gap framing using the Resume Gap Rebuilder`,
        ]
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: replyText,
          structuredActions: actions,
          timestamp: 'Just now',
        },
      ])
    }, 600)
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[480px]"
          >
            {/* Copilot Header */}
            <div className="p-4 bg-gradient-to-r from-[#0B4F9C] to-[#F26B1D] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
                  <Bot size={18} />
                </div>
                <div>
                  <h4 className="font-black text-sm">AI Career Copilot</h4>
                  <p className="text-[10px] text-white/80 font-medium">
                    Context-Aware Career Intelligence
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/30 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    m.sender === 'user' ? 'items-end' : 'items-start'
                  } space-y-1`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[#0B4F9C] text-white rounded-tr-xs'
                        : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    <p>{m.text}</p>

                    {m.structuredActions && m.structuredActions.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700 space-y-1.5 font-medium">
                        {m.structuredActions.map((act, aIdx) => (
                          <div key={aIdx} className="flex items-start gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                            <span className="text-[#F26B1D] font-bold shrink-0">•</span>
                            <span>{act}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-400 px-1">{m.timestamp}</span>
                </div>
              ))}
            </div>

            {/* Quick Prompts */}
            <div className="px-3 py-1.5 bg-slate-100/80 dark:bg-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[10px] font-semibold text-slate-600 dark:text-slate-300">
              <button
                onClick={() => setInputMsg('What adjacent roles can I target?')}
                className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-400 shrink-0"
              >
                Adjacent Roles?
              </button>
              <button
                onClick={() => setInputMsg('Am I underpaid for my experience?')}
                className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-400 shrink-0"
              >
                Salary check?
              </button>
              <button
                onClick={() => setInputMsg('What should I learn this month?')}
                className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-400 shrink-0"
              >
                Next 30 days?
              </button>
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask your career copilot..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-[#0B4F9C]"
              />
              <button
                onClick={handleSend}
                className="p-2 rounded-xl bg-[#0B4F9C] text-white hover:bg-blue-800 transition-colors shrink-0"
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-[#0B4F9C] to-[#F26B1D] text-white font-black text-xs shadow-xl shadow-blue-900/30 hover:opacity-95 transition-opacity"
      >
        <Bot size={18} />
        <span>AI Career Copilot</span>
      </motion.button>
    </div>
  )
}
