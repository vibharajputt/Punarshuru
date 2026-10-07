import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  TrendingUp,
  Award,
  Menu,
  X,
  Sparkles,
  LogIn,
  User,
  LogOut,
  ChevronDown,
  PlusCircle,
  Building2,
} from 'lucide-react'
import HealthBadge from '@/components/common/HealthBadge'
import ThemeToggle from '@/components/common/ThemeToggle'
import AuthModal from '@/components/auth/AuthModal'
import { useProfileStore } from '@/store/profileStore'
import { useAuthStore } from '@/store/authStore'
import { useDemoStore } from '@/store/demoStore'

interface NavLinkItem {
  to: string
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  badge?: string
  isPrimary?: boolean
}

const getMainNavLinks = (t: (key: string, fallback: string) => string): NavLinkItem[] => [
  {
    to: '/home',
    label: t('nav.dashboard', 'Home'),
    icon: LayoutDashboard,
  },
  {
    to: '/skills',
    label: t('nav.skill_gap', 'My Skills'),
    icon: Sparkles,
  },
  {
    to: '/path',
    label: t('nav.pathways', 'My Path'),
    icon: TrendingUp,
  },
  {
    to: '/jobs',
    label: t('nav.market', 'Jobs & Salary'),
    icon: Building2,
  },
  {
    to: '/passport',
    label: t('nav.passport', 'Skill Passport'),
    icon: Award,
  },
]

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  const profile = useProfileStore((s) => s.profile)
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const isDemo = useDemoStore((s) => s.isDemo)
  const isAuthenticated = !!token && !isDemo

  const mainNavLinks = getMainNavLinks(t)

  const toggleLang = () => {
    const current = i18n.resolvedLanguage || i18n.language || 'en'
    const next = current.startsWith('hi') ? 'en' : 'hi'
    i18n.changeLanguage(next)
    localStorage.setItem('i18nextLng', next)
  }

  const handleLogout = () => {
    useAuthStore.getState().clearAuth()
    useDemoStore.getState().clearDemo()
    useProfileStore.getState().clearProfile()
    setProfileDropdownOpen(false)
    navigate('/')
  }

  return (
    <>
      <header className="sticky top-0 z-40 glass dark:glass-dark border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors">
        <nav className="w-full px-3 sm:px-6 h-15 flex items-center justify-between gap-3">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <img
              src="/logo.png"
              alt="Punarshuru"
              className="h-9 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform"
            />
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-tight text-[#0B4F9C] dark:text-sky-400">
                Punar<span className="text-[#F26B1D]">shuru</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-md bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 text-[9px] font-black uppercase tracking-wider">
                Bharat 2.0
              </span>
            </div>
          </Link>

          {/* Center: Clean Main Navigation Pill Bar (Single-Line, No Wrapping) */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/60 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 whitespace-nowrap">
            {mainNavLinks.map((item) => {
              const active = location.pathname === item.to
              const Icon = item.icon
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                    item.isPrimary
                      ? active
                        ? 'bg-[#0B4F9C] text-white shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-[#0B4F9C] dark:text-sky-300 border border-sky-200 dark:border-sky-800 hover:bg-[#0B4F9C] hover:text-white'
                      : active
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#0B4F9C] dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={14} className={item.isPrimary && !active ? 'text-[#F26B1D]' : ''} />
                  <span>{item.label}</span>
                  {item.badge && !active && (
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-[#F26B1D] text-white uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right: Controls & User Actions */}
          <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
            {/* Health status */}
            <div className="hidden xl:block">
              <HealthBadge />
            </div>

            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="text-[11px] font-bold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#0B4F9C] hover:text-[#0B4F9C] dark:hover:text-sky-400 transition-all shadow-2xs cursor-pointer"
              aria-label="Toggle language"
              title="Switch English / हिन्दी"
            >
              {(i18n.resolvedLanguage || i18n.language || 'en').startsWith('hi') ? 'English' : 'हिन्दी'}
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Account / Sign In */}
            {isAuthenticated && user && profile ? (
              /* Logged-In User Profile Dropdown */
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#0B4F9C] transition-all shadow-2xs cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#0B4F9C] to-[#F26B1D] text-white flex items-center justify-center font-bold text-[9px]">
                    {profile.name ? profile.name.slice(0, 2).toUpperCase() : <User size={11} />}
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[90px] truncate hidden sm:inline">
                    {profile.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={12} className="text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 space-y-1"
                    >
                      <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {profile.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {profile.current_role || 'Candidate'} • {profile.city || 'India'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false)
                          navigate('/company-match')
                        }}
                        className="w-full px-2.5 py-1.5 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2 cursor-pointer"
                      >
                        <Building2 size={13} className="text-[#0B4F9C]" />
                        <span>Company Career Matcher</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false)
                          navigate('/onboarding')
                        }}
                        className="w-full px-2.5 py-1.5 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2 cursor-pointer"
                      >
                        <PlusCircle size={13} className="text-emerald-500" />
                        <span>{t('dashboard.audit_new', 'New Profile Audit')}</span>
                      </button>

                      <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full px-2.5 py-1.5 text-left text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut size={13} />
                          <span>{t('common.logout', 'Sign Out')}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Sign In Button */
              <Link
                to="/login"
                id="navbar-signin-btn"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#0B4F9C] hover:text-[#0B4F9C] dark:hover:text-sky-400 text-xs font-bold transition-all shadow-2xs"
              >
                <LogIn size={13} className="text-[#0B4F9C]" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              className="md:hidden p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden px-4 py-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 space-y-2 overflow-hidden"
            >
              <div className="space-y-1">
                {mainNavLinks.map((link) => {
                  const Icon = link.icon
                  const active = location.pathname === link.to
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                        active
                          ? 'bg-[#0B4F9C] text-white'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={15} />
                        <span>{link.label}</span>
                      </div>
                      {link.badge && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-orange-500 text-white">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <HealthBadge />
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false)
                    if (isAuthenticated) {
                      navigate('/home')
                    } else {
                      navigate('/login')
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-[#0B4F9C] text-white"
                >
                  {isAuthenticated ? 'My Dashboard' : 'Sign In'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}
