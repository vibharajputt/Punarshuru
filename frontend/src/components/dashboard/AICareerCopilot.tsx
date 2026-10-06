import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, X, AlertCircle, RefreshCw, Sparkles } from 'lucide-react'
import { useActiveProfile } from '@/hooks/useActiveProfile'
import { copilotApi } from '@/lib/api'
import type { Profile } from '@/types'

interface MessageItem {
  id: string
  sender: 'user' | 'bot'
  text: string
  structuredActions?: string[]
  quickReplies?: string[]
  timestamp: string
}

function getLocalCopilotFallback(message: string, profile: Profile | null) {
  const name = profile?.name || 'Candidate'
  const city = profile?.city || 'Bengaluru'
  const currentRole = profile?.current_role || 'Professional'
  const targetRole = profile?.target_role || 'GenAI Engineer'
  const skills = profile?.skills_raw || ['Problem Solving', 'Core Tech', 'Communication']
  const skillsStr = skills.slice(0, 4).join(', ')
  const salary = profile?.current_salary_lpa
  const userType = profile?.user_type || 'returner'

  const lower = message.toLowerCase()

  if (lower.includes('salary') || lower.includes('pay') || lower.includes('underpaid') || lower.includes('compensation') || lower.includes('ctc')) {
    const baseSalary = Number(salary || 8.0)
    const targetSalary = Math.round(baseSalary * 1.35 * 10) / 10
    return {
      reply: `Here is your compensation diagnostic for ${currentRole} in ${city}:`,
      actions: [
        `Market Benchmark: Median pay for ${targetRole} in ${city} is ₹${targetSalary}–${Math.round(targetSalary * 1.25 * 10) / 10} LPA.`,
        `Immediate Leverage: Adding modern AI workflows to your existing skills (${skillsStr}) commands a 30–40% premium.`,
        `Purchasing Power: Use our City Parity calculator before deciding between Tier-1 and Tier-2 offers.`,
      ],
      quickReplies: [
        'What adjacent roles can I target?',
        'What should I learn this month?',
        'How to prepare for tech interviews?',
      ],
    }
  }

  if (lower.includes('adjacent') || lower.includes('role') || lower.includes('switch') || lower.includes('pivot') || lower.includes('target')) {
    let roleSuggestions: string[] = []
    if (userType === 'laid_off' || currentRole.toLowerCase().includes('qa')) {
      roleSuggestions = [
        '1. Automation QA / SDET (Master Playwright & CI/CD)',
        '2. QA Ops / Release Engineer (Docker & GitHub Actions)',
        '3. API Test Automation Lead (Postman, RestAssured & Python)',
      ]
    } else if (userType === 'gig' || currentRole.toLowerCase().includes('delivery') || currentRole.toLowerCase().includes('swiggy')) {
      roleSuggestions = [
        '1. Logistics Tech Operations Lead (Route & Dispatch Optimization)',
        '2. Supply Chain Data Specialist (SQL & Warehouse Tech)',
        '3. Customer Experience Operations Associate (B2B SaaS / D2C)',
      ]
    } else if (userType === 'stagnant' || currentRole.toLowerCase().includes('support')) {
      roleSuggestions = [
        '1. AI Chatbot Operations / Trainer (Prompt Eval & LLM Tuning)',
        '2. Product Operations Associate (Customer telemetry & Jira workflows)',
        '3. Tier-2 Technical Account Manager (SaaS integrations & API triage)',
      ]
    } else if (userType === 'student') {
      roleSuggestions = [
        '1. Junior Software / ML Engineer (Python, FastEmbed, LangChain)',
        '2. Full Stack Developer (Next.js, FastAPI, PostgreSQL)',
        '3. Cloud DevOps Intern (Docker, Linux & AWS fundamentals)',
      ]
    } else {
      roleSuggestions = [
        `1. ${targetRole} (Leverage your ${skillsStr} base)`,
        '2. Cloud Backend Architect (Spring Boot 3 / Microservices)',
        '3. Technical Product Specialist (Bridge engineering & domain ops)',
      ]
    }

    return {
      reply: `Based on your profile as ${currentRole}, here are your highest-velocity adjacent career pathways:`,
      actions: roleSuggestions,
      quickReplies: [
        'Am I underpaid for my experience?',
        'What should I learn this month?',
        'How to bridge my skill gap?',
      ],
    }
  }

  if (lower.includes('learn') || lower.includes('month') || lower.includes('30 days') || lower.includes('roadmap') || lower.includes('study') || lower.includes('skills')) {
    return {
      reply: `Here is your focused 30-day sprint plan to bridge toward ${targetRole}:`,
      actions: [
        'Week 1: Audit foundations & modernize syntax (Python 3.12 / Modern Java 21)',
        'Week 2: Build REST / FastAPI endpoints with Docker containerization',
        'Week 3: Integrate Vector Embeddings, RAG or modern SDET automation pipelines',
        'Week 4: Publish 1 production GitHub repo with live demo URL and verifiable readme',
      ],
      quickReplies: [
        'What adjacent roles can I target?',
        'Am I underpaid for my experience?',
        'How can I frame my resume gap?',
      ],
    }
  }

  if (lower.includes('gap') || lower.includes('resume') || lower.includes('break') || lower.includes('maternity') || lower.includes('rebuild')) {
    return {
      reply: `Here is how to frame your career timeline for Indian recruiters:`,
      actions: [
        'Functional Framing: Highlight technical capabilities and durable problem solving upfront before chronology.',
        'Upskilling Evidence: Explicitly list modern courses, certificates, and GitHub links in a Recent Upgrades section.',
        'Confidence Stance: Frame gaps neutrally in one sentence; anchor the interview on what you built this month.',
      ],
      quickReplies: [
        'What should I learn this month?',
        'What adjacent roles can I target?',
        'Am I underpaid for my experience?',
      ],
    }
  }

  return {
    reply: `Here is actionable career advice tailored to your active profile (${name} · ${targetRole} in ${city}):`,
    actions: [
      `Transferable Strengths: Your background in ${skillsStr} provides a durable springboard.`,
      `Strategic Target: Focus on ${targetRole} opportunities with high hiring velocity in ${city}.`,
      'Verifiable Proof: Completing the Skill Passport gives recruiters cryptographic verification of your abilities.',
    ],
    quickReplies: [
      'What adjacent roles can I target?',
      'Am I underpaid for my experience?',
      'What should I learn this month?',
    ],
  }
}

export default function AICareerCopilot() {
  const { profile } = useActiveProfile()
  const [isOpen, setIsOpen] = useState(false)
  const [inputMsg, setInputMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'initial',
      sender: 'bot',
      text: `Hello ${profile?.name ? profile.name.split(' ')[0] : 'there'}! I am your Punarshuru Career Copilot. I've audited your active profile for ${profile?.target_role || 'target roles'}.`,
      structuredActions: [
        `Current Skills Detected: ${profile?.skills_raw?.length || 5} skills`,
        `Market-Aligned: ${Math.max(3, (profile?.skills_raw?.length || 5) - 2)} skills`,
        `Priority Focus: Bridge ${profile?.target_role ? profile.target_role : 'Target Stack'} with 1 portfolio project`,
        `Recommended First Action: Complete Week 1 milestone in your learning roadmap`,
      ],
      quickReplies: [
        'What adjacent roles can I target?',
        'Am I underpaid for my experience?',
        'What should I learn this month?',
      ],
      timestamp: 'Just now',
    },
  ])

  // Sync initial message when profile changes
  useEffect(() => {
    if (messages.length === 1 && messages[0].sender === 'bot') {
      const candidateName = profile?.name ? profile.name.split(' ')[0] : 'there'
      const targetRole = profile?.target_role || 'target tech roles'
      setMessages([
        {
          id: 'initial',
          sender: 'bot',
          text: `Hello ${candidateName}! I am your Punarshuru Career Copilot. I've audited your active profile for ${targetRole}.`,
          structuredActions: [
            `Current Skills Detected: ${profile?.skills_raw?.length || 5} skills`,
            `Market-Aligned: ${Math.max(3, (profile?.skills_raw?.length || 5) - 2)} skills`,
            `Priority Focus: Bridge ${targetRole} with 1 portfolio project`,
            `Recommended First Action: Complete Week 1 milestone in your learning roadmap`,
          ],
          quickReplies: [
            'What adjacent roles can I target?',
            'Am I underpaid for my experience?',
            'What should I learn this month?',
          ],
          timestamp: 'Just now',
        },
      ])
    }
  }, [profile?.name, profile?.target_role, profile?.skills_raw?.length])

  // Auto-scroll on new messages or loading change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading, isOpen])

  const handleSend = async (overrideText?: string) => {
    const textToSend = (typeof overrideText === 'string' ? overrideText : inputMsg).trim()
    if (!textToSend || isLoading) return

    setInputMsg('')
    setErrorMsg(null)
    setLastFailedMessage(null)

    const userMessage: MessageItem = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now',
    }

    const updatedHistory = [...messages, userMessage]
    setMessages(updatedHistory)
    setIsLoading(true)

    try {
      // 1. Try backend Copilot API
      const res = await copilotApi.chat({
        message: textToSend,
        profile: profile || undefined,
        history: updatedHistory.slice(-6).map((m) => ({
          sender: m.sender,
          text: m.text,
        })),
      })

      const botMessage: MessageItem = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: res.reply || 'Here is what I recommend based on your career trajectory:',
        structuredActions: res.actions?.length ? res.actions : undefined,
        quickReplies: res.quick_replies?.length ? res.quick_replies : undefined,
        timestamp: 'Just now',
      }

      setMessages((prev) => [...prev, botMessage])
    } catch {
      // 2. Intelligent Client-Side Fallback if backend API is unreachable or times out
      try {
        const fallback = getLocalCopilotFallback(textToSend, profile)
        const botMessage: MessageItem = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: fallback.reply,
          structuredActions: fallback.actions,
          quickReplies: fallback.quickReplies,
          timestamp: 'Just now',
        }
        setMessages((prev) => [...prev, botMessage])
      } catch {
        // If even fallback encounters an unexpected error, show visible error state
        setErrorMsg('Unable to process career advice right now. Please try again.')
        setLastFailedMessage(textToSend)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Active quick replies from the latest bot response
  const latestBotMessage = [...messages].reverse().find((m) => m.sender === 'bot')
  const activeQuickReplies = latestBotMessage?.quickReplies || [
    'What adjacent roles can I target?',
    'Am I underpaid for my experience?',
    'What should I learn this month?',
  ]

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[500px]"
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
                    Bharat 2.0 Career Intelligence · {profile?.name || 'Active Mode'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Close Copilot"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Messages Scroll View */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/30 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.sender === 'user' ? 'items-end' : 'items-start'
                  } space-y-1`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-[88%] leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[#0B4F9C] text-white rounded-tr-xs'
                        : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    <p className="font-medium whitespace-pre-wrap">{m.text}</p>

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

              {/* Animated Typing Indicator */}
              {isLoading && (
                <div className="flex flex-col items-start space-y-1">
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-xs shadow-2xs flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0B4F9C] dark:bg-sky-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0B4F9C] dark:bg-sky-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0B4F9C] dark:bg-sky-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Analyzing career signals & recommendations...
                    </span>
                  </div>
                </div>
              )}

              {/* Visible Error Message */}
              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-[11px] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle size={14} className="shrink-0 text-rose-500" />
                    <span>{errorMsg}</span>
                  </div>
                  {lastFailedMessage && (
                    <button
                      onClick={() => handleSend(lastFailedMessage)}
                      className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-bold hover:bg-rose-700 transition cursor-pointer shrink-0"
                    >
                      Retry
                    </button>
                  )}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Chips (Immediately submit on click) */}
            <div className="px-3 py-1.5 bg-slate-100/80 dark:bg-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[10px] font-semibold text-slate-600 dark:text-slate-300">
              {activeQuickReplies.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-sky-400 hover:text-[#0B4F9C] dark:hover:text-sky-300 shrink-0 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
              <input
                type="text"
                value={inputMsg}
                disabled={isLoading}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder={isLoading ? "Copilot is analyzing..." : "Ask your career copilot..."}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-[#0B4F9C] disabled:opacity-60"
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !inputMsg.trim()}
                className="p-2 rounded-xl bg-[#0B4F9C] text-white hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 cursor-pointer shadow-xs"
                title="Send Message"
              >
                {isLoading ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
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
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-[#0B4F9C] to-[#F26B1D] text-white font-black text-xs shadow-xl shadow-blue-900/30 hover:opacity-95 transition-opacity cursor-pointer"
      >
        <Bot size={18} />
        <span>AI Career Copilot</span>
        <Sparkles size={12} className="text-amber-300" />
      </motion.button>
    </div>
  )
}
