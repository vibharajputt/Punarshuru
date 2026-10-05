import { useState } from 'react'
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
import { useProfileStore } from '@/store/profileStore'
import { useDemoStore } from '@/store/demoStore'
import type { UserType, Profile } from '@/types'

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

export default function RoleSelectorModal({ isOpen, onClose }: RoleSelectorModalProps) {
  const profile = useProfileStore((s) => s.profile)
  const setProfile = useProfileStore((s) => s.setProfile)
  const setDemo = useDemoStore((s) => s.setDemo)

  const [aiDiagnosticMode, setAiDiagnosticMode] = useState(false)
  const [diagAnswers, setDiagAnswers] = useState<Record<number, string>>({})
  const [diagResult, setDiagResult] = useState<UserType | null>(null)

  if (!isOpen) return null

  const handleSelect = (archetype: typeof ARCHETYPES[0]) => {
    const updated: Profile = {
      id: profile?.id || `user-${archetype.type}`,
      name: profile?.name || 'Candidate',
      user_type: archetype.type,
      city: profile?.city || archetype.defaultCity,
      current_role: archetype.defaultRole.split('→')[0].trim(),
      target_role: archetype.defaultRole.split('→')[1]?.trim() || 'Software Engineer',
      experience_years: archetype.type === 'student' ? 0 : archetype.type === 'returner' ? 5 : 3.5,
      career_gap_years: archetype.type === 'returner' ? 3 : 0,
      current_salary_lpa: archetype.defaultSalary,
      skills_raw: archetype.skills,
      skills_taxonomy_ids: [1, 2, 3],
      disruption_score: archetype.type === 'laid_off' ? 78 : archetype.type === 'returner' ? 72 : 64,
      created_at: profile?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setProfile(updated)
    setDemo(archetype.type, updated.name)
    onClose()
  }

  const runDiagnosis = () => {
    const ans1 = diagAnswers[1]
    let detected: UserType = 'stagnant'
    if (ans1 === 'gap') detected = 'returner'
    else if (ans1 === 'gig') detected = 'gig'
    else if (ans1 === 'laid_off') detected = 'laid_off'
    else if (ans1 === 'student') detected = 'student'
    else detected = 'stagnant'

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
                          {isCurrent && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#0B4F9C] text-white">
                              Active Mode
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          {arch.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                          {arch.tagline}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                        <span>{arch.defaultCity}</span>
                        <span className="text-[#F26B1D] flex items-center gap-1 font-bold">
                          Select <ArrowRight size={12} />
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
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-200">
                  <Bot size={16} className="text-purple-600" />
                  <span>AI Career Diagnosis Engine</span>
                </div>
                <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                  Answer 3 quick questions to calculate your risk archetype.
                </p>
              </div>

              {/* Q1 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  1. What is your current employment status?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'gap', text: 'On a career break (6+ months)' },
                    { id: 'gig', text: 'Working in gig / delivery / freelancing' },
                    { id: 'laid_off', text: 'Recently laid off / impacted by downsizing' },
                    { id: 'stagnant', text: 'Employed, but salary/growth is stagnant' },
                    { id: 'student', text: 'Final year student or fresh graduate' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setDiagAnswers({ ...diagAnswers, 1: opt.id })}
                      className={`p-3 rounded-xl border text-xs text-left font-semibold transition-all ${
                        diagAnswers[1] === opt.id
                          ? 'bg-[#0B4F9C] text-white border-[#0B4F9C]'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results button */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setAiDiagnosticMode(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Back to All Roles
                </button>

                {!diagResult ? (
                  <button
                    disabled={!diagAnswers[1]}
                    onClick={runDiagnosis}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Sparkles size={14} />
                    <span>Generate Diagnosis</span>
                  </button>
                ) : (
                  <button
                    onClick={applyDiagnosis}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5 shadow-md"
                  >
                    <CheckCircle2 size={14} />
                    <span>Apply Detected Role ({diagResult.toUpperCase()})</span>
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
