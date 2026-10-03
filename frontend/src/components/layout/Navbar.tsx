import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Target,
  TrendingUp,
  Map,
  DollarSign,
  Award,
  Menu,
  X,
  Sparkles,
  LogIn,
  User,
  LogOut,
  ChevronDown,
  PlusCircle,
  Users,
  Compass,
  Building2,
} from 'lucide-react'
import HealthBadge from '@/components/common/HealthBadge'
import ThemeToggle from '@/components/common/ThemeToggle'
import AuthModal from '@/components/auth/AuthModal'
import { useProfileStore } from '@/store/profileStore'

interface SubMenuItem {
  title: string
  to: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  tag?: string
  description: string
}

interface NavCategory {
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  activePaths: string[]
  items: SubMenuItem[]
}

const navCategories: NavCategory[] = [
  {
    label: 'Market Intelligence',
    icon: TrendingUp,
    activePaths: ['/market', '/compensation'],
    items: [
      {
        title: 'Market Trends Radar',
        to: '/market',
        icon: TrendingUp,
        tag: 'Live Velocity',
        description: 'City-wise tech hiring velocity, emerging tech demand & domain indices across India.',
      },
      {
        title: 'Compensation Benchmark',
        to: '/compensation',
        icon: DollarSign,
        tag: 'Gap Recovery',
        description: 'Fair wage calculator, career break penalty recovery & 5-year CTC growth models.',
      },
    ],
  },
  {
    label: 'Career Transition',
    icon: Compass,
    activePaths: ['/company-match', '/skill-gap', '/pathways'],
    items: [
      {
        title: 'Company Target Match',
        to: '/company-match',
        icon: Building2,
        tag: 'Gamified Unlock',
        description: 'Test resume against Swiggy, Google, Zomato & unlock adjacent roles with missing skills.',
      },
      {
        title: 'AI Skill Diagnostic',
        to: '/skill-gap',
        icon: Target,
        tag: 'Disruption Risk',
        description: 'Evaluate your AI disruption score, missing skills & targeted assessment quizzes.',
      },
      {
        title: 'Learning Pathways',
        to: '/pathways',
        icon: Map,
        tag: '3-Step Wizard',
        description: 'Structured 12-week roadmaps with SWAYAM / NPTEL courses & live milestone tracker.',
      },
    ],
  },
  {
    label: 'Proof & Credentials',
    icon: Award,
    activePaths: ['/passport', '/onboarding'],
    items: [
      {
        title: 'Career Transition Passport',
        to: '/passport',
        icon: Award,
        tag: 'Verifiable QR',
        description: 'Cryptographically signed proof-of-work portfolio for recruiter instant verification.',
      },
      {
        title: 'New Profile Diagnostic',
        to: '/onboarding',
        icon: Sparkles,
        tag: 'Resume Audit',
        description: 'Run a fresh comprehensive resume breakdown & custom career transition audit.',
      },
    ],
  },
]

export default function Navbar() {
  const { i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const profile = useProfileStore((s) => s.profile)
  const setProfile = useProfileStore((s) => s.setProfile)

  const isLanding = location.pathname === '/'

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null)
    setMobileOpen(false)
  }, [location.pathname])

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en')
  }

  const handleLogout = () => {
    setProfile(null)
    setProfileDropdownOpen(false)
    navigate('/')
  }

  return (
    <>
      <header className="sticky top-0 z-40 glass dark:glass-dark border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-3">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0B4F9C] to-[#F26B1D] flex items-center justify-center text-white shadow-md shadow-blue-900/10 group-hover:scale-105 transition-transform">
              <Sparkles size={16} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-tight text-[#0B4F9C] dark:text-sky-400">
                Punar<span className="text-[#F26B1D]">shuru</span>
              </span>
              {!isLanding && (
                <span className="hidden md:inline-block px-1.5 py-0.2 rounded-md bg-sky-100/80 dark:bg-sky-950 text-[#0B4F9C] dark:text-sky-300 text-[9px] font-extrabold uppercase tracking-wider">
                  App
                </span>
              )}
            </div>
          </Link>

          {/* Center: Desktop Categorized Navigation */}
          <div ref={dropdownRef} className="hidden lg:flex items-center justify-center gap-1">
            {/* Direct Link: Dashboard */}
            {!isLanding && (
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  location.pathname === '/dashboard'
                    ? 'bg-[#0B4F9C] text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#0B4F9C] dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard size={14} />
                <span>Dashboard</span>
              </Link>
            )}

            {/* Categorized Dropdowns */}
            {navCategories.map((category) => {
              const isActiveCategory = category.activePaths.some((p) => location.pathname === p)
              const isOpen = activeDropdown === category.label
              const CategoryIcon = category.icon

              return (
                <div key={category.label} className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(isOpen ? null : category.label)}
                    onMouseEnter={() => setActiveDropdown(category.label)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActiveCategory
                        ? 'bg-sky-100/80 dark:bg-sky-950/80 text-[#0B4F9C] dark:text-sky-300'
                        : isOpen
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:text-[#0B4F9C] dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800'
                    }`}
                  >
                    <CategoryIcon size={14} />
                    <span>{category.label}</span>
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#0B4F9C]' : 'text-slate-400'}`}
                    />
                  </button>

                  {/* Mega Dropdown Popover */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        onMouseLeave={() => setActiveDropdown(null)}
                        className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl z-50 space-y-1.5"
                      >
                        <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                            {category.label}
                          </p>
                        </div>

                        {category.items.map((sub) => {
                          const SubIcon = sub.icon
                          const isSubActive = location.pathname === sub.to
                          return (
                            <Link
                              key={sub.to}
                              to={sub.to}
                              onClick={() => setActiveDropdown(null)}
                              className={`flex items-start gap-3 p-2.5 rounded-xl transition-all group ${
                                isSubActive
                                  ? 'bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-900/60'
                                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/80'
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                  isSubActive
                                    ? 'bg-[#0B4F9C] text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-950 group-hover:text-[#0B4F9C] dark:group-hover:text-sky-300'
                                }`}
                              >
                                <SubIcon size={16} />
                              </div>

                              <div className="space-y-0.5 flex-1">
                                <div className="flex items-center justify-between">
                                  <span
                                    className={`text-xs font-bold leading-tight ${
                                      isSubActive
                                        ? 'text-[#0B4F9C] dark:text-sky-300 font-extrabold'
                                        : 'text-slate-900 dark:text-white group-hover:text-[#0B4F9C] dark:group-hover:text-sky-400'
                                    }`}
                                  >
                                    {sub.title}
                                  </span>
                                  {sub.tag && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                      {sub.tag}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium">
                                  {sub.description}
                                </p>
                              </div>
                            </Link>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          {/* Right: Controls & User Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Health status */}
            <div className="hidden xl:block">
              <HealthBadge />
            </div>

            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="text-[11px] font-bold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#0B4F9C] hover:text-[#0B4F9C] dark:hover:text-sky-400 transition-all shadow-2xs"
              aria-label="Toggle language"
              title="Switch English / हिन्दी"
            >
              {i18n.language === 'en' ? 'हिन्दी' : 'EN'}
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Account / Sign In */}
            {profile ? (
              /* Logged-In User Profile Dropdown */
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#0B4F9C] transition-all shadow-2xs"
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
                          navigate('/dashboard')
                        }}
                        className="w-full px-2.5 py-1.5 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                      >
                        <LayoutDashboard size={13} className="text-[#0B4F9C]" />
                        <span>Go to Dashboard</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false)
                          setAuthOpen(true)
                        }}
                        className="w-full px-2.5 py-1.5 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                      >
                        <Users size={13} className="text-[#F26B1D]" />
                        <span>Switch Persona / Login</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false)
                          navigate('/onboarding')
                        }}
                        className="w-full px-2.5 py-1.5 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                      >
                        <PlusCircle size={13} className="text-emerald-500" />
                        <span>New Profile Audit</span>
                      </button>

                      <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full px-2.5 py-1.5 text-left text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg flex items-center gap-2"
                        >
                          <LogOut size={13} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Sign In Button */
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#0B4F9C] hover:text-[#0B4F9C] dark:hover:text-sky-400 text-xs font-bold transition-all shadow-2xs"
              >
                <LogIn size={13} className="text-[#0B4F9C]" />
                <span>Sign In</span>
              </button>
            )}

            {/* Landing-Only Start Free Button */}
            {isLanding && (
              <Link
                to="/onboarding"
                className="hidden sm:inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[#0B4F9C] text-white hover:bg-[#083b75] shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Audit Free</span>
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              className="lg:hidden p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu (Clean Categorized View) */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden px-4 py-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 space-y-4 max-h-[85vh] overflow-y-auto"
            >
              {/* Direct Dashboard Link */}
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 py-2 px-3 rounded-xl text-xs font-bold text-slate-900 dark:text-white bg-slate-100/80 dark:bg-slate-800/80"
              >
                <LayoutDashboard size={15} className="text-[#0B4F9C]" />
                <span>Dashboard Overview</span>
              </Link>

              {/* Categorized Sections */}
              {navCategories.map((cat) => (
                <div key={cat.label} className="space-y-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3">
                    {cat.label}
                  </p>
                  <div className="space-y-1">
                    {cat.items.map((sub) => {
                      const SubIcon = sub.icon
                      const isActive = location.pathname === sub.to
                      return (
                        <Link
                          key={sub.to}
                          to={sub.to}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center justify-between py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-sky-50 dark:bg-sky-950 text-[#0B4F9C] dark:text-sky-300'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <SubIcon size={14} className="text-[#0B4F9C]" />
                            <span>{sub.title}</span>
                          </div>
                          {sub.tag && (
                            <span className="text-[9px] font-semibold text-slate-400">
                              {sub.tag}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <HealthBadge />
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false)
                    setAuthOpen(true)
                  }}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-[#0B4F9C] text-white"
                >
                  {profile ? 'Switch Persona' : 'Sign In'}
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
