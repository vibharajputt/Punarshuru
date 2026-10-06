import { useState } from 'react'
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Loader2, LogIn, AlertCircle } from 'lucide-react'
import { authApi, profileApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { useProfileStore } from '@/store/profileStore'
import { useDemoStore } from '@/store/demoStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const initialMsg = searchParams.get('message')
  const [error, setError] = useState<string | null>(initialMsg || null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!email.trim() || !password) { setError('Email and password are required.'); return }

    setLoading(true)
    try {
      const { access_token } = await authApi.login({ email: email.trim(), password })
      const me = await authApi.me(access_token)
      useDemoStore.getState().clearDemo()
      useProfileStore.getState().clearProfile()
      setAuth(access_token, me)

      // Fetch user's own profile from server
      let userProfile = null
      try {
        userProfile = await profileApi.getMyProfile(access_token)
        if (userProfile) {
          useProfileStore.getState().setProfile(userProfile)
        }
      } catch {
        userProfile = null
      }

      // Profile complete = all required onboarding slots filled
      const isComplete =
        !!userProfile?.current_role &&
        (userProfile?.skills_raw?.length ?? 0) >= 1 &&
        !!userProfile?.target_role &&
        !!userProfile?.city
      const locationState = location.state as { from?: { pathname?: string; search?: string } } | null
      const targetFrom = locationState?.from?.pathname ? `${locationState.from.pathname}${locationState.from.search || ''}` : null
      const next = searchParams.get('next') || targetFrom
      navigate(next || (isComplete ? '/home' : '/onboarding'), { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Check your email and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F8FAFC] dark:bg-[#080F1A]">
      {/* Ambient glow */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#0B4F9C]/8 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[#F26B1D]/6 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <span className="text-2xl font-black tracking-tight text-gradient">Punarshuru</span>
          <p className="mt-1 text-sm text-[#64748B] dark:text-slate-400">AI career intelligence for Bharat 2.0</p>
        </div>

        {/* Card */}
        <div className="glass dark:glass-dark rounded-2xl p-8 shadow-[0_8px_40px_rgba(11,79,156,0.10)]">
          <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-1">Welcome back</h1>
          <p className="text-sm text-[#64748B] dark:text-slate-400 mb-6">Sign in to continue your journey.</p>

          <form id="login-form" onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-[#0F172A] dark:text-slate-200 mb-1">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white placeholder:text-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]/40 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-[#0F172A] dark:text-slate-200 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white placeholder:text-[#94A3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]/40 transition"
                />
                <button
                  type="button"
                  id="login-toggle-pw"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0B4F9C] transition"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div role="alert" id="login-error" className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0B4F9C] hover:bg-[#0B4F9C]/90 text-white font-semibold text-sm transition-all shadow-[0_4px_20px_rgba(11,79,156,0.25)] hover:shadow-[0_6px_28px_rgba(11,79,156,0.35)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[#64748B] dark:text-slate-400">
            No account yet?{' '}
            <Link to="/signup" id="go-to-signup" className="font-semibold text-[#0B4F9C] dark:text-[#60A5FA] hover:underline">
              Get started free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
