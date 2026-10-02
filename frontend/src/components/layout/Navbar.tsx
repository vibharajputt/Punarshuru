import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
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
  User,
  PlusCircle,
} from 'lucide-react'
import { useState } from 'react'
import HealthBadge from '@/components/common/HealthBadge'
import ThemeToggle from '@/components/common/ThemeToggle'
import { useProfileStore } from '@/store/profileStore'

const navLinks = [
  { to: '/dashboard', icon: LayoutDashboard, key: 'nav.dashboard' },
  { to: '/skill-gap', icon: Target, key: 'nav.skill_gap' },
  { to: '/market', icon: TrendingUp, key: 'nav.market' },
  { to: '/pathways', icon: Map, key: 'nav.pathways' },
  { to: '/compensation', icon: DollarSign, key: 'nav.compensation' },
  { to: '/passport', icon: Award, key: 'nav.passport' },
]

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const profile = useProfileStore((s) => s.profile)

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en')
  }

  return (
    <header className="sticky top-0 z-50 glass dark:glass-dark border-b border-white/20 dark:border-slate-800/80 shadow-sm transition-colors">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B4F9C] to-[#F26B1D] flex items-center justify-center text-white shadow-md shadow-blue-900/10 group-hover:scale-105 transition-transform">
            <Sparkles size={18} />
          </div>
          <span className="font-black text-xl tracking-tight text-[#0B4F9C] dark:text-sky-400">
            Punar<span className="text-[#F26B1D]">shuru</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map(({ to, icon: Icon, key }) => {
            const active = location.pathname === to
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-[#E8F3FF] text-[#0B4F9C] dark:bg-sky-950/60 dark:text-sky-300'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#0B4F9C] dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon size={15} />
                  {t(key)}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Right controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {profile && (
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200">
              <User size={13} className="text-[#0B4F9C]" />
              <span>{profile.name.split(' ')[0]}</span>
              <span className="px-1.5 py-0.2 rounded bg-sky-200 dark:bg-sky-900 text-[#0B4F9C] dark:text-sky-300 text-[10px] capitalize">
                {profile.user_type}
              </span>
            </div>
          )}

          <div className="hidden sm:block">
            <HealthBadge />
          </div>

          <button
            onClick={toggleLang}
            className="text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:border-[#0B4F9C] hover:text-[#0B4F9C] dark:hover:text-sky-400 transition-all shadow-sm"
            id="lang-toggle"
            aria-label="Toggle language"
            title="Switch English / हिन्दी"
          >
            {i18n.language === 'en' ? 'हिन्दी' : 'English'}
          </button>

          <ThemeToggle />

          <Link
            to="/onboarding"
            className="hidden sm:inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[#0B4F9C] text-white hover:bg-[#083b75] shadow-sm shadow-blue-900/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle size={13} />
            <span>Audit Profile</span>
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            id="mobile-menu-toggle"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="lg:hidden px-6 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 space-y-1"
        >
          {navLinks.map(({ to, icon: Icon, key }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-[#E8F3FF] text-[#0B4F9C] dark:bg-sky-950/60 dark:text-sky-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon size={17} />
                {t(key)}
              </Link>
            )
          })}
          <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <HealthBadge />
            <Link
              to="/onboarding"
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-[#0B4F9C] text-white"
            >
              Audit Profile
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  )
}
