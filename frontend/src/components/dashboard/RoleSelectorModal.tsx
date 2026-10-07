import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RotateCcw,
  Bike,
  Shuffle,
  TrendingUp,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
  Bot,
} from 'lucide-react'
import { useActiveProfile } from '@/hooks/useActiveProfile'
import { DEMO_PERSONAS, activateDemoPersona } from '@/components/demo/DemoModal'
import type { UserType } from '@/types'

export interface RoleSelectorModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ARCHETYPES = [
  {
    type: 'returner' as UserType,
    icon: RotateCcw,
    title: 'Career-Break Returner',
    tagline: 'Returning after maternity, health, caregiving or gap years',
    color: 'from-orange-500/20 to-amber-500/10 border-orange-200 dark:border-orange-900',
    accent: 'text-[#F26B1D]',
    defaultRole: 'Java Developer → GenAI Engineer',
    defaultCity: 'Pune',
    defaultSalary: 12.0,
    skills: ['Java', 'SQL', 'Spring 4', 'JSP', 'Hibernate'],
  },
  {
    type: 'gig' as UserType,
    icon: Bike,
    title: 'Gig / Platform Worker',
    tagline: 'Delivery, field services, or scattered freelance work history',
    color: 'from-amber-500/20 to-yellow-500/10 border-amber-200 dark:border-amber-900',
    accent: 'text-amber-600',
    defaultRole: 'Delivery Partner → Logistics Operations Specialist',
    defaultCity: 'Lucknow',
    defaultSalary: 5.5,
    skills: ['Route Planning', 'Customer Service', 'Cash Reconciliation', 'SLA Management'],
  },
  {
    type: 'laid_off' as UserType,
    icon: Shuffle,
    title: 'Recently Laid Off',
    tagline: 'Seeking adjacent growing roles with existing transferable skills',
    color: 'from-rose-500/20 to-pink-500/10 border-rose-200 dark:border-rose-900',
    accent: 'text-rose-600',
    defaultRole: 'Manual QA → Automation SDET',
    defaultCity: 'Bengaluru',
    defaultSalary: 14.5,
    skills: ['Manual Testing', 'Jira', 'API Testing', 'SQL', 'Test Design'],
  },
  {
    type: 'stagnant' as UserType,
    icon: TrendingUp,
    title: 'Working but Stagnant',
    tagline: 'Employed for 3+ years but underpaid or stuck in repetitive tasks',
    color: 'from-blue-500/20 to-cyan-500/10 border-blue-200 dark:border-blue-900',
    accent: 'text-[#0B4F9C] dark:text-sky-400',
    defaultRole: 'Support Engineer → AI Chatbot Operations Lead',
    defaultCity: 'Noida',
    defaultSalary: 9.5,
    skills: ['Technical Support', 'Linux', 'SQL', 'Ticket SLA', 'Customer Communication'],
  },
  {
    type: 'student' as UserType,
    icon: GraduationCap,
    title: 'Student / Fresh Graduate',
    tagline: 'Final year or recent graduate mapping college syllabus to job market',
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-200 dark:border-emerald-900',
    accent: 'text-emerald-600',
    defaultRole: 'B.Tech Graduate → Software / ML Engineer',
    defaultCity: 'Mohali',
    defaultSalary: 8.0,
    skills: ['Python', 'Data Structures', 'DBMS', 'Operating Systems', 'Git'],
  },
]

export interface DiagnosticQuestion {
  id: number
  badge: string
  title: string
  subtitle: string
  options: { id: string; text: string }[]
}

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 1,
    badge: 'Signal 1 of 3: Employment Situation',
    title: '1. What is your current employment situation?',
    subtitle: 'Identifies your baseline employment continuity and market exposure.',
    options: [
      { id: 'gap', text: 'On a career break / parental or caregiving leave (6+ months)' },
      { id: 'laid_off', text: 'Recently laid off / impacted by corporate downsizing' },
      { id: 'employed', text: 'Employed full-time, but salary & career progression is stagnant' },
      { id: 'gig', text: 'Working in gig delivery, field ops, or irregular freelancing' },
      { id: 'student', text: 'Final-year college student or fresh campus graduate' },
    ],
  },
  {
    id: 2,
    badge: 'Signal 2 of 3: Availability & Timeframe',
    title: '2. What is your current notice period / availability to start?',
    subtitle: 'Evaluates notice period buyout risk and employer joining appetite.',
    options: [
      { id: 'immediate', text: 'Immediate joiner (0-day notice / available to join immediately)' },
      { id: 'notice_90', text: 'Long 60–90 day corporate notice period (notice period bottleneck)' },
      { id: 'flexible', text: 'Flexible / freelance / part-time availability right now' },
      { id: 'campus', text: 'Aligned with upcoming campus placement / semester cycle' },
    ],
  },
  {
    id: 3,
    badge: 'Signal 3 of 3: Target Function & Goal',
    title: '3. What is your primary 12-month career transition goal?',
    subtitle: 'Determines whether your focus is compensation breakout, returnship, or runway protection.',
    options: [
      { id: 'breakout_comp', text: 'Break title stagnation & claim fair market compensation (30%+ hike)' },
      { id: 'relaunch_stem', text: 'Relaunch engineering career with verified proof of work & returnship' },
      { id: 'rapid_rehire', text: 'Secure immediate high-stability tech role & protect financial runway' },
      { id: 'formal_stability', text: 'Transition from informal platform work into stable corporate IT/ops' },
      { id: 'placement_prep', text: 'Bridge academic theory to high-paying cloud/product engineering' },
    ],
  },
]

export default function RoleSelectorModal({ isOpen, onClose }: RoleSelectorModalProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile } = useActiveProfile()

  const [aiDiagnosticMode, setAiDiagnosticMode] = useState(false)
  const [diagAnswers, setDiagAnswers] = useState<Record<number, string>>({})
  const [diagResult, setDiagResult] = useState<UserType | null>(null)

  if (!isOpen) return null

  const handleSelect = (archetype: typeof ARCHETYPES[0]) => {
    // 1. Resolve canonical demo persona for this archetype
    const canonical = DEMO_PERSONAS.find((p) => p.user_type === archetype.type) || DEMO_PERSONAS[0]

    // 2. Dispatch through unified activateDemoPersona (sets demoStore + canonical profileStore + background enrichment)
    activateDemoPersona(canonical)
    onClose()

    if (location.pathname.startsWith('/features')) {
      navigate('/features')
    }
  }

  const runDiagnosis = () => {
    const ans1 = diagAnswers[1]
    const ans2 = diagAnswers[2]
    const ans3 = diagAnswers[3]

    if (!ans1 || !ans2 || !ans3) return

    type PersonaType = 'returner' | 'stagnant' | 'laid_off' | 'gig' | 'student'
    const scores: Record<PersonaType, number> = {
      returner: 0,
      stagnant: 0,
      laid_off: 0,
      gig: 0,
      student: 0,
    }

    // Signal 1: Current Employment Situation (Weight: 4)
    if (ans1 === 'gap') scores.returner += 4
    else if (ans1 === 'laid_off') scores.laid_off += 4
    else if (ans1 === 'employed') scores.stagnant += 4
    else if (ans1 === 'gig') scores.gig += 4
    else if (ans1 === 'student') scores.student += 4

    // Signal 2: Notice Period & Availability (Weight: 2-3)
    if (ans2 === 'immediate') {
      scores.laid_off += 2
      scores.returner += 1
    } else if (ans2 === 'notice_90') {
      scores.stagnant += 3 // 60-90 day notice is hallmark of stagnant Indian tech employees
    } else if (ans2 === 'flexible') {
      scores.gig += 2
      scores.returner += 1
    } else if (ans2 === 'campus') {
      scores.student += 3
    }

    // Signal 3: Primary Career Goal & Trajectory (Weight: 3)
    if (ans3 === 'breakout_comp') {
      scores.stagnant += 3
    } else if (ans3 === 'relaunch_stem') {
      scores.returner += 3
    } else if (ans3 === 'rapid_rehire') {
      scores.laid_off += 3
    } else if (ans3 === 'formal_stability') {
      scores.gig += 3
    } else if (ans3 === 'placement_prep') {
      scores.student += 3
    }

    // Determine highest scoring archetype with stable tie-break order
    let detected: UserType = 'stagnant'
    let maxScore = -1

    const priorityOrder: PersonaType[] = ['laid_off', 'returner', 'student', 'gig', 'stagnant']
    for (const type of priorityOrder) {
      if (scores[type] > maxScore) {
        maxScore = scores[type]
        detected = type
      }
    }

    setDiagResult(detected)
  }

  const applyDiagnosis = () => {
    if (!diagResult) return
    const matched = ARCHETYPES.find((a) => a.type === diagResult) || ARCHETYPES[0]
    handleSelect(matched)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0B4F9C] dark:text-sky-300 text-xs font-bold mb-1">
                <Sparkles size={12} />
                <span>Career Situation Assessment</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Where are you in your career journey?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose the profile that best describes your situation to dynamically unlock tailored intelligence tools.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X size={20} />
            </button>
          </div>

          {!aiDiagnosticMode ? (
            <>
              {/* 5 Archetype Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ARCHETYPES.map((arch) => {
                  const Icon = arch.icon
                  const canonical = DEMO_PERSONAS.find((p) => p.user_type === arch.type)
                  const isCurrent = profile?.user_type === arch.type

                  return (
                    <motion.div
                      key={arch.type}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelect(arch)}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden ${
                        isCurrent
                          ? 'border-[#0B4F9C] dark:border-sky-500 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-500/20 shadow-md'
                          : `border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-300`
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className={`p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-2xs ${arch.accent}`}>
                            <Icon size={20} />
                          </div>
                          {isCurrent ? (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#0B4F9C] text-white">
                              Active Mode
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {canonical?.name}
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                            {arch.title}
                          </h3>
                          {canonical && (
                            <p className="text-[11px] font-semibold text-[#0B4F9C] dark:text-sky-400 mt-0.5">
                              Persona: {canonical.name} ({canonical.city})
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                          {arch.tagline}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                        <span>{canonical?.city || arch.defaultCity}</span>
                        <span className="text-[#F26B1D] flex items-center gap-1 font-bold">
                          Select {canonical?.name?.split(' ')[0] || ''} <ArrowRight size={12} />
                        </span>
                      </div>
                    </motion.div>
                  )
                })}

                {/* "I'm not sure" AI Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setAiDiagnosticMode(true)}
                  className="p-5 rounded-2xl border-2 border-dashed border-purple-300 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-950/20 hover:bg-purple-50/60 transition-all cursor-pointer flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300 inline-block shadow-2xs">
                      <Bot size={20} />
                    </div>
                    <h3 className="font-bold text-sm text-purple-900 dark:text-purple-200">
                      I'm Not Sure — Diagnose Me
                    </h3>
                    <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                      Take a 60-second AI Career Diagnosis to detect your risk archetype automatically.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-purple-200/60 dark:border-purple-800/60 text-[11px] font-bold text-purple-600 dark:text-purple-400 flex items-center justify-between">
                    <span>AI Disruption Detector</span>
                    <span className="flex items-center gap-1">Launch <ArrowRight size={12} /></span>
                  </div>
                </motion.div>
              </div>
            </>
          ) : (
            /* AI Disruption Diagnostic Questionnaire */
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-200">
                    <Bot size={16} className="text-purple-600" />
                    <span>AI Career Diagnosis Engine</span>
                  </div>
                  <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                    Answer 3 quick questions to calculate your risk archetype across employment state, notice availability, and target goals.
                  </p>
                </div>
                <div className="shrink-0 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-xs font-black self-start sm:self-auto">
                  {Object.keys(diagAnswers).length} / 3 Completed
                </div>
              </div>

              {/* 3 Interactive Questions */}
              <div className="space-y-5">
                {DIAGNOSTIC_QUESTIONS.map((q) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                        {q.badge}
                      </span>
                      {diagAnswers[q.id] && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                          <CheckCircle2 size={11} /> Saved
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                        {q.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {q.subtitle}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt) => {
                        const isSelected = diagAnswers[q.id] === opt.id
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setDiagAnswers((prev) => ({ ...prev, [q.id]: opt.id }))
                              setDiagResult(null)
                            }}
                            className={`p-3 rounded-xl border text-xs text-left font-semibold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                              isSelected
                                ? 'bg-[#0B4F9C] text-white border-[#0B4F9C] shadow-xs'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                            }`}
                          >
                            <span>{opt.text}</span>
                            {isSelected && <CheckCircle2 size={14} className="shrink-0 text-white" />}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Detected Outcome Card when diagnosis is generated */}
              {diagResult && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 dark:from-emerald-950/40 dark:via-slate-850 dark:to-blue-950/30 border-2 border-emerald-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-600 text-white shrink-0 shadow-xs">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                          AI Detected Archetype (3/3 Signals Reconciled)
                        </span>
                      </div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        {ARCHETYPES.find((a) => a.type === diagResult)?.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                        {ARCHETYPES.find((a) => a.type === diagResult)?.tagline}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={applyDiagnosis}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center justify-center gap-2 transition shrink-0 cursor-pointer"
                  >
                    <span>Apply Detected Role</span>
                    <ArrowRight size={14} />
                  </button>
                </motion.div>
              )}

              {/* Results button */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setAiDiagnosticMode(false)
                    setDiagResult(null)
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition"
                >
                  Back to All Roles
                </button>

                {!diagResult ? (
                  <button
                    type="button"
                    disabled={!diagAnswers[1] || !diagAnswers[2] || !diagAnswers[3]}
                    onClick={runDiagnosis}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <Sparkles size={14} />
                    <span>
                      Generate Diagnosis ({Object.keys(diagAnswers).length}/3 Answered)
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={applyDiagnosis}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <CheckCircle2 size={14} />
                    <span>Apply Detected Role ({ARCHETYPES.find((a) => a.type === diagResult)?.title})</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
