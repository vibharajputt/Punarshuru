import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, MapPin, Briefcase, ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react'
import { demoApi } from '@/lib/api'
import { useProfileStore } from '@/store/profileStore'
import { useDemoStore } from '@/store/demoStore'
import { useUserProfileStore } from '@/store/userProfileStore'
import { computeRiskScore } from '@/lib/riskScore'
import type { Profile, UserType } from '@/types'

export interface DemoPersonaItem {
  key: string
  name: string
  user_type: UserType
  badge: string
  badgeColor: string
  city: string
  current_role: string
  target_role: string
  disruption: number
  skills: string[]
  quote: string
  career_gap_years: number
}

export const DEMO_PERSONAS: DemoPersonaItem[] = [
  {
    key: 'priya',
    name: 'Priya Sharma',
    user_type: 'returner',
    badge: 'Career Break Returner',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300',
    city: 'Pune',
    current_role: 'Ex-Java Developer (4yr Gap)',
    target_role: 'GenAI Engineer',
    disruption: 74,
    skills: ['Java', 'Spring Boot', 'MySQL', 'REST APIs'],
    quote: 'Returning to tech post-maternity break; need to bridge the GenAI and modern cloud gap.',
    career_gap_years: 4,
  },
  {
    key: 'ramesh',
    name: 'Ramesh Kumar',
    user_type: 'gig',
    badge: 'Gig Platform Worker',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300',
    city: 'Lucknow',
    current_role: 'Swiggy Delivery Partner (3yr)',
    target_role: 'Logistics Tech Analyst',
    disruption: 78,
    skills: ['Operations', 'Route Optimization', 'Customer Service'],
    quote: 'Algorithms cap delivery earnings; transitioning high-grit logistics intuition into tech ops.',
    career_gap_years: 0,
  },
  {
    key: 'arjun',
    name: 'Arjun Mehta',
    user_type: 'laid_off',
    badge: 'Laid-Off Professional',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300',
    city: 'Bengaluru',
    current_role: 'Manual QA Engineer (6yr)',
    target_role: 'Automation QA / SDET',
    disruption: 73,
    skills: ['Manual QA', 'JIRA', 'Agile', 'SQL Basics'],
    quote: 'Manual QA roles shrinking fast; urgent need to master Playwright, Python & CI/CD automation.',
    career_gap_years: 0.5,
  },
  {
    key: 'sneha',
    name: 'Sneha Patel',
    user_type: 'stagnant',
    badge: 'Stagnant Employee',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300',
    city: 'Noida',
    current_role: 'Customer Support Executive (5yr)',
    target_role: 'AI Chatbot Trainer / Product Analyst',
    disruption: 76,
    skills: ['Support Ops', 'CRM', 'Zendesk', 'Bilingual EN/HI'],
    quote: '3 years in the same support band; moving into prompt evaluation and product ops.',
    career_gap_years: 0,
  },
  {
    key: 'rohit',
    name: 'Rohit Singh',
    user_type: 'student',
    badge: 'Final-Year Student',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300',
    city: 'Mohali',
    current_role: 'BTech CSE Final Year',
    target_role: 'Software / ML Engineer',
    disruption: 27,
    skills: ['Python', 'C++', 'Data Structures', 'SQL'],
    quote: 'Fresher targeting high-ROI Tier-2/Tier-1 software roles with verified GitHub proofs.',
    career_gap_years: 0,
  },
]

export function activateDemoPersona(
  persona: DemoPersonaItem,
  navigate?: (path: string) => void
) {
  const fallbackProfile: Profile = {
    id: `demo-${persona.key}`,
    user_id: null,
    name: persona.name,
    email: `${persona.key}@demo.punarshuru.in`,
    user_type: persona.user_type,
    city: persona.city,
    current_city: persona.city,
    preferred_city: null,
    gap_reason: null,
    achievements: [],
    current_role: persona.current_role,
    target_role: persona.target_role,
    experience_years:
      persona.user_type === 'student'
        ? 0
        : persona.user_type === 'returner'
        ? 5
        : persona.user_type === 'gig'
        ? 3
        : persona.user_type === 'laid_off'
        ? 6
        : 5,
    career_gap_years:
      persona.career_gap_years !== undefined
        ? persona.career_gap_years
        : (persona.user_type === 'returner' ? 4 : persona.user_type === 'laid_off' ? 0.5 : 0),
    current_salary_lpa:
      persona.user_type === 'student'
        ? 0
        : persona.user_type === 'returner'
        ? 8
        : persona.user_type === 'gig'
        ? 2.4
        : persona.user_type === 'laid_off'
        ? 8.0
        : 4.5,
    skills_raw: persona.skills,
    skills_taxonomy_ids: [1, 2, 3],
    disruption_score: computeRiskScore(persona).score,
    disruption_breakdown: computeRiskScore(persona).breakdown as any,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  // 1. Immediately update demoStore and profileStore
  useDemoStore.getState().setDemo(persona.key, persona.name, {
    role: persona.current_role,
    city: persona.city,
    career_gap_years: fallbackProfile.career_gap_years,
  })
  useProfileStore.getState().setProfile(fallbackProfile)
  useUserProfileStore.getState().syncWithProfile(fallbackProfile)

  // 2. Immediately navigate to /home (instant responsive UI)
  if (navigate) {
    navigate('/home')
  }

  // 3. Background enrichment from demo API without blocking UI or navigation
  demoApi
    .loadPersona(persona.key)
    .then((data) => {
      if (data) {
        const enriched: Profile = {
          ...fallbackProfile,
          id: String(data.id || fallbackProfile.id),
          name: String(data.name || fallbackProfile.name),
          city: String(data.city || fallbackProfile.city),
          current_city: String(data.city || fallbackProfile.city),
          current_role: String(data.current_role || fallbackProfile.current_role),
          target_role: String(data.target_role || fallbackProfile.target_role),
          experience_years: Number(data.experience_years ?? fallbackProfile.experience_years),
          career_gap_years: Number(data.career_gap_years ?? fallbackProfile.career_gap_years),
          current_salary_lpa:
            data.current_salary_lpa != null
              ? Number(data.current_salary_lpa)
              : fallbackProfile.current_salary_lpa,
          skills_raw: Array.isArray(data.skills_raw)
            ? (data.skills_raw as string[])
            : fallbackProfile.skills_raw,
          disruption_score: Number(data.disruption_score ?? fallbackProfile.disruption_score),
          disruption_breakdown: (data.disruption_breakdown || fallbackProfile.disruption_breakdown) as any,
        }
        useProfileStore.getState().setProfile(enriched)
        useUserProfileStore.getState().syncWithProfile(enriched)
      }
    })
    .catch(() => {
      // Fallback is already active
    })
}

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const navigate = useNavigate()
  const [loadingKey, setLoadingKey] = useState<string | null>(null)

  const handleSelect = (persona: DemoPersonaItem) => {
    setLoadingKey(persona.key)
    onClose()
    activateDemoPersona(persona, navigate)
    setLoadingKey(null)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 my-8"
          >
            {/* Header */}
            <div className="p-6 pb-4 bg-gradient-to-br from-sky-50 via-white to-orange-50/50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-[11px] font-bold text-[#0B4F9C] dark:text-sky-300 border border-blue-100 dark:border-blue-900 mb-2">
                  <Sparkles size={13} className="text-[#F26B1D]" />
                  <span>Instant Demo Mode</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Try a Demo Persona
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Pick any candidate archetype to explore real career risk audits, skill gap maps, and learning pathways.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close demo modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Persona Cards List */}
            <div className="p-6 max-h-[68vh] overflow-y-auto space-y-3">
              {DEMO_PERSONAS.map((p) => {
                const isLoading = loadingKey === p.key
                return (
                  <button
                    key={p.key}
                    type="button"
                    disabled={!!loadingKey}
                    onClick={() => handleSelect(p)}
                    className="w-full text-left p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-850/60 hover:border-[#0B4F9C] dark:hover:border-sky-500 hover:bg-sky-50/40 dark:hover:bg-slate-800/80 transition-all shadow-xs group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-[#0B4F9C] dark:group-hover:text-sky-400 transition-colors">
                          {p.name}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.badgeColor}`}>
                          {p.badge}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-[#F26B1D]" />
                          {p.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase size={12} />
                          {p.current_role}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 italic pt-0.5 line-clamp-1">
                        "{p.quote}"
                      </p>
                    </div>

                    {/* Right side stats & CTA */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                      <div className="text-left sm:text-right">
                        <p className="text-[10px] font-medium text-slate-400">Career Risk Score</p>
                        <p className="text-sm font-black font-mono text-[#0B4F9C] dark:text-sky-400">
                          {computeRiskScore(p).score}/100
                        </p>
                      </div>

                      <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-[#0B4F9C] group-hover:text-white dark:group-hover:bg-sky-500 flex items-center justify-center text-slate-500 transition-all">
                        {isLoading ? (
                          <RefreshCw size={14} className="animate-spin text-[#0B4F9C] group-hover:text-white" />
                        ) : (
                          <ArrowRight size={14} />
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 px-6">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-500" />
                No login or password required for demo mode
              </span>
              <button
                type="button"
                onClick={onClose}
                className="font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
