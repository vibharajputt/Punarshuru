import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Phone, CheckCircle2, ArrowRight, ShieldCheck, Briefcase } from 'lucide-react'
import { useProfileStore } from '@/store/profileStore'
import { demoApi, profileApi } from '@/lib/api'
import type { UserType } from '@/types'
import { useNavigate } from 'react-router-dom'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialTab?: 'signin' | 'signup'
}

export default function AuthModal({ isOpen, onClose, initialTab = 'signin' }: AuthModalProps) {
  const [tab, setTab] = useState<'signin' | 'signup'>(initialTab)
  const [phoneOrEmail, setPhoneOrEmail] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setProfile = useProfileStore((s) => s.setProfile)
  const navigate = useNavigate()

  const demoAccounts = [
    { key: 'priya', name: 'Priya Sharma', role: 'Career Break Returner (4yr)', city: 'Pune' },
    { key: 'ramesh', name: 'Ramesh Kumar', role: 'Gig Worker → Tech Ops', city: 'Lucknow' },
    { key: 'arjun', name: 'Arjun Mehta', role: 'Laid-Off QA → SDET', city: 'Bengaluru' },
    { key: 'sneha', name: 'Sneha Patel', role: 'Stagnant Support → AI Trainer', city: 'Noida' },
    { key: 'rohit', name: 'Rohit Singh', role: 'BTech Final Year Student', city: 'Mohali' },
  ]

  const handleDemoLogin = async (key: string) => {
    try {
      setLoading(true)
      setError(null)
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
      onClose()
      navigate('/dashboard')
    } catch {
      setError('Could not sign in with demo account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneOrEmail.trim()) {
      setError('Please enter a valid mobile number or email.')
      return
    }
    setError(null)
    setLoading(true)
    setTimeout(() => {
      setOtpSent(true)
      setLoading(false)
    }, 600)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otpCode.length < 4) {
      setError('Please enter the 4-digit verification code.')
      return
    }
    setLoading(true)
    try {
      const created = await profileApi.create({
        name: phoneOrEmail.includes('@') ? phoneOrEmail.split('@')[0] : 'Punarshuru User',
        email: phoneOrEmail.includes('@') ? phoneOrEmail : `${phoneOrEmail}@user.punarshuru.in`,
        user_type: 'returner',
        city: 'Bengaluru',
        current_role: 'Career Transition Candidate',
        target_role: 'GenAI & Cloud Specialist',
        experience_years: 3,
        career_gap_years: 0,
        skills_raw: ['Python', 'SQL', 'Problem Solving'],
      })
      setProfile(created)
      onClose()
      navigate('/dashboard')
    } catch {
      setError('Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10"
          >
            {/* Modal Header */}
            <div className="relative p-6 pb-4 bg-gradient-to-br from-sky-50 via-white to-orange-50/50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0B4F9C] to-[#F26B1D] flex items-center justify-center text-white shadow-md shadow-blue-900/10">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                    Welcome to <span className="text-[#0B4F9C] dark:text-sky-400">Punar</span>
                    <span className="text-[#F26B1D]">shuru</span>
                  </h3>
                  <p className="text-xs text-slate-500">AI Career Intelligence • Bharat 2.0</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex mt-5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                <button
                  type="button"
                  onClick={() => setTab('signin')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    tab === 'signin'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  Candidate Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setTab('signup')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    tab === 'signup'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  New Account / Audit
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-medium">
                  {error}
                </div>
              )}

              {/* Fast 1-Click Demo Logins */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={13} className="text-emerald-500" />
                    Instant 1-Click Demo Sign In:
                  </span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md font-semibold">
                    No Password Needed
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-1.5">
                  {demoAccounts.slice(0, 3).map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      disabled={loading}
                      onClick={() => handleDemoLogin(item.key)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0B4F9C] dark:hover:border-sky-500 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-sky-50/50 dark:hover:bg-slate-800 text-left flex items-center justify-between transition-all group"
                    >
                      <div>
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-[#0B4F9C] dark:group-hover:text-sky-300">
                          {item.name}
                        </span>
                        <p className="text-[11px] text-slate-400">
                          {item.role} • {item.city}
                        </p>
                      </div>
                      <div className="w-6 h-6 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 group-hover:text-[#0B4F9C] group-hover:border-[#0B4F9C]">
                        <ArrowRight size={13} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                  Or via Mobile OTP / Email
                </span>
              </div>

              {/* OTP Form */}
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Mobile Number or Email
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={phoneOrEmail}
                        onChange={(e) => setPhoneOrEmail(e.target.value)}
                        placeholder="+91 98765 43210 or your@email.com"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#0B4F9C]"
                      />
                      <Phone size={14} className="absolute left-3 top-3.5 text-slate-400" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0B4F9C] text-white text-xs font-bold hover:bg-[#083b75] transition-all shadow-md shadow-blue-900/10 flex items-center justify-center gap-1.5"
                  >
                    <span>{loading ? 'Sending OTP…' : 'Get Verification Code (OTP)'}</span>
                    <ArrowRight size={14} />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Enter 4-digit OTP sent to {phoneOrEmail}
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="e.g. 1234"
                      className="w-full text-center tracking-widest text-lg font-mono font-bold py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#0B4F9C]"
                    />
                    <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1">
                      <CheckCircle2 size={11} /> Demo mode: Enter any 4 numbers (e.g. 1234)
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0B4F9C] text-white text-xs font-bold hover:bg-[#083b75] transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{loading ? 'Verifying…' : 'Verify & Continue'}</span>
                    <ArrowRight size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-full text-center text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                  >
                    Change Number / Email
                  </button>
                </form>
              )}

              {/* Recruiter / Direct Audit footer */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Briefcase size={12} className="text-[#F26B1D]" /> Recruiter looking for verified talent?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    navigate('/passport')
                  }}
                  className="font-bold text-[#0B4F9C] dark:text-sky-400 hover:underline"
                >
                  Talent Registry →
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
