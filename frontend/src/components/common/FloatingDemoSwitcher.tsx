import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, UserCheck, RefreshCw } from 'lucide-react'
import { demoApi, profileApi } from '@/lib/api'
import { useProfileStore } from '@/store/profileStore'
import type { UserType } from '@/types'

const personas = [
  { key: 'priya', name: 'Priya Sharma', role: 'Ex-Java Developer (4yr Gap)', city: 'Pune', type: 'Returner', disruption: 72 },
  { key: 'ramesh', name: 'Ramesh Kumar', role: 'Swiggy Delivery Partner', city: 'Lucknow', type: 'Gig Worker', disruption: 85 },
  { key: 'arjun', name: 'Arjun Mehta', role: 'Manual QA Tester (6yr)', city: 'Bengaluru', type: 'Laid Off', disruption: 78 },
  { key: 'sneha', name: 'Sneha Patel', role: 'Customer Support (5yr)', city: 'Noida', type: 'Stagnant', disruption: 68 },
  { key: 'rohit', name: 'Rohit Singh', role: 'BTech CSE Final Year', city: 'Mohali', type: 'Student', disruption: 22 },
]

export default function FloatingDemoSwitcher() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const profile = useProfileStore((s) => s.profile)
  const setProfile = useProfileStore((s) => s.setProfile)
  const [open, setOpen] = useState(false)
  const [loadingKey, setLoadingKey] = useState<string | null>(null)

  const handleSelect = async (key: string) => {
    try {
      setLoadingKey(key)
      const data = await demoApi.loadPersona(key)
      const created = await profileApi.create({
        name: String(data.name || 'Demo Candidate'),
        email: `${key}@demo.punarshuru.in`,
        user_type: data.user_type as UserType,
        city: String(data.city || 'Bengaluru'),
        current_role: String(data.current_role || 'Professional'),
        target_role: String(data.target_role || 'Software Engineer'),
        experience_years: Number(data.experience_years || 0),
        career_gap_years: Number(data.career_gap_years || 0),
        current_salary_lpa: data.current_salary_lpa ? Number(data.current_salary_lpa) : null,
        skills_raw: Array.isArray(data.skills_raw) ? (data.skills_raw as string[]) : [],
        skills_taxonomy_ids: Array.isArray(data.skills_taxonomy_ids)
          ? (data.skills_taxonomy_ids as number[])
          : [],
      })
      setProfile(created)
      setSearchParams({ demo: key })
      setOpen(false)
    } catch {
      // Keep state
    } finally {
      setLoadingKey(null)
    }
  }

  // Handle ?demo= parameter on initial load or change
  useEffect(() => {
    const demoParam = searchParams.get('demo')
    if (demoParam && ['priya', 'ramesh', 'arjun', 'sneha', 'rohit'].includes(demoParam)) {
      if (!profile || !profile.name.toLowerCase().includes(demoParam)) {
        handleSelect(demoParam)
      }
    }
  }, [searchParams])

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="mb-3 w-80 sm:w-96 p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0B4F9C] to-[#F26B1D] text-white flex items-center justify-center">
                  <Sparkles size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Demo Persona Switcher
                  </h4>
                  <p className="text-[10px] text-slate-400">Load instant verified career audits</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {personas.map((p) => {
                const isActive = profile?.name?.toLowerCase().includes(p.key)
                const isLoading = loadingKey === p.key
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => handleSelect(p.key)}
                    disabled={isLoading}
                    className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-sky-50 dark:bg-sky-950/60 border-[#0B4F9C] text-[#0B4F9C] dark:text-sky-300 shadow-xs'
                        : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="truncate mr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {p.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {p.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {p.role} • {p.city}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      {isLoading ? (
                        <RefreshCw size={14} className="animate-spin text-[#0B4F9C]" />
                      ) : (
                        <span className="text-[11px] font-mono font-bold text-slate-500">
                          {p.disruption}/100
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Or audit your own profile:</span>
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  navigate('/onboarding')
                }}
                className="font-bold text-[#0B4F9C] dark:text-sky-400 hover:underline"
              >
                + New Audit
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-[#0B4F9C] to-[#083b75] text-white shadow-xl shadow-blue-900/30 hover:scale-105 active:scale-95 transition-all text-xs font-bold border border-white/20"
        title="Open Persona Switcher"
        id="floating-persona-btn"
      >
        <UserCheck size={16} />
        <span className="hidden sm:inline">Demo Personas</span>
        <Sparkles size={13} className="text-[#F26B1D]" />
      </button>
    </div>
  )
}
