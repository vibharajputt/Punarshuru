/**
 * AppLayout — UX spec v3
 * Desktop: persistent left sidebar (240px) + scrollable main content + top bar
 * Mobile:  full-width content + fixed bottom nav (5 items)
 * Top bar: page title | language toggle | theme | avatar menu
 *
 * 5 nav items (ux.md Navigation):
 *   Home /home | My Skills /skills | My Path /path | Jobs & Salary /jobs | Skill Passport /passport
 */
import { useState, useRef, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  Home,
  Zap,
  Map,
  Briefcase,
  Award,
  LogOut,
  User,
  ChevronDown,
  Sun,
  Moon,
  Globe,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/authStore'
import { useProfileStore } from '@/store/profileStore'
import { useDemoStore } from '@/store/demoStore'
import DemoStrip from '@/components/demo/DemoStrip'
import DemoModal from '@/components/demo/DemoModal'

/* ── Nav item definition ──────────────────────────────────────────────────── */
interface NavItem {
  to: string
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

const NAV_ITEMS: NavItem[] = [
  { to: '/home',    label: 'Home',          icon: Home },
  { to: '/skills',  label: 'My Skills',     icon: Zap },
  { to: '/path',    label: 'My Path',       icon: Map },
  { to: '/jobs',    label: 'Jobs & Salary', icon: Briefcase },
  { to: '/passport',label: 'Skill Passport',icon: Award },
]

/* ── Page titles derived from pathname ────────────────────────────────────── */
const PAGE_TITLES: Record<string, string> = {
  '/home':     'Home',
  '/skills':   'My Skills',
  '/path':     'My Path',
  '/jobs':     'Jobs & Salary',
  '/passport': 'Skill Passport',
  '/onboarding': 'Onboarding',
}

function pageTitle(pathname: string) {
  const exact = PAGE_TITLES[pathname]
  if (exact) return exact
  for (const [k, v] of Object.entries(PAGE_TITLES)) {
    if (pathname.startsWith(k)) return v
  }
  return 'Punarshuru'
}

/* ── Theme hook ───────────────────────────────────────────────────────────── */
function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('punarshuru-theme')
    return stored === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    localStorage.setItem('punarshuru-theme', theme)
  }, [theme])

  return { theme, toggle: () => setTheme((p) => (p === 'light' ? 'dark' : 'light')) }
}

/* ── Sidebar nav link ─────────────────────────────────────────────────────── */
function SideNavLink({ item }: { item: NavItem }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      id={`nav-${item.to.replace('/', '')}`}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
          isActive
            ? 'bg-[#0B4F9C] text-white shadow-[0_4px_14px_rgba(11,79,156,0.30)]'
            : 'text-[#475569] dark:text-slate-400 hover:bg-[#E8F3FF] dark:hover:bg-slate-800 hover:text-[#0B4F9C] dark:hover:text-white',
        ].join(' ')
      }
    >
      <Icon size={18} />
      <span>{item.label}</span>
    </NavLink>
  )
}

/* ── Bottom nav link (mobile) ─────────────────────────────────────────────── */
function BottomNavLink({ item }: { item: NavItem }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      id={`mobile-nav-${item.to.replace('/', '')}`}
      className={({ isActive }) =>
        [
          'flex flex-col items-center gap-0.5 pt-1.5 pb-1 px-1 flex-1 text-[10px] font-medium transition-colors',
          isActive
            ? 'text-[#0B4F9C] dark:text-[#60A5FA]'
            : 'text-[#94A3B8] dark:text-slate-500',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          <span className={[
            'flex items-center justify-center w-8 h-8 rounded-xl transition-all',
            isActive ? 'bg-[#E8F3FF] dark:bg-[#0B4F9C]/20' : '',
          ].join(' ')}>
            <Icon size={19} />
          </span>
          <span className="leading-tight">{item.label.split(' ')[0]}</span>
        </>
      )}
    </NavLink>
  )
}

/* ── Avatar dropdown ──────────────────────────────────────────────────────── */
function AvatarMenu() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { clearAuth, user } = useAuthStore()
  const { clearProfile } = useProfileStore()

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  function handleLogout() {
    clearAuth()
    clearProfile()
    setOpen(false)
    navigate('/', { replace: true })
  }

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  return (
    <div ref={menuRef} className="relative">
      <button
        id="avatar-menu-btn"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[#E8F3FF] dark:hover:bg-slate-800 transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0B4F9C] to-[#F26B1D] flex items-center justify-center text-white text-xs font-bold">
          {initials}
        </span>
        <span className="hidden sm:block text-sm font-medium text-[#0F172A] dark:text-white max-w-[100px] truncate">
          {user?.name ?? 'Account'}
        </span>
        <ChevronDown size={14} className={`text-[#94A3B8] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-48 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-900 shadow-[0_8px_32px_rgba(11,79,156,0.12)] overflow-hidden z-50 animate-fade-in-up"
        >
          {user && (
            <div className="px-4 py-3 border-b border-[#E2E8F0] dark:border-slate-700">
              <p className="text-xs text-[#64748B] dark:text-slate-400">Signed in as</p>
              <p className="text-sm font-semibold text-[#0F172A] dark:text-white truncate">{user.email}</p>
            </div>
          )}
          <button
            role="menuitem"
            id="avatar-edit-profile"
            onClick={() => { setOpen(false); navigate('/onboarding') }}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[#0F172A] dark:text-slate-200 hover:bg-[#E8F3FF] dark:hover:bg-slate-800 transition-colors"
          >
            <User size={15} />
            Edit profile
          </button>
          <button
            role="menuitem"
            id="avatar-logout"
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          >
            <LogOut size={15} />
            Log out
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Language toggle ──────────────────────────────────────────────────────── */
function LangToggle() {
  const { i18n } = useTranslation()
  const isHi = i18n.language === 'hi'
  return (
    <button
      id="lang-toggle-btn"
      onClick={() => i18n.changeLanguage(isHi ? 'en' : 'hi')}
      className="px-2.5 py-1.5 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-[#0F172A] dark:text-white hover:border-[#0B4F9C]/40 transition"
      title="Switch language"
      aria-label="Switch language"
    >
      <Globe size={13} className="inline mr-1 opacity-60" />
      {isHi ? 'EN' : 'हिं'}
    </button>
  )
}

/* ── Main layout ──────────────────────────────────────────────────────────── */
export default function AppLayout() {
  const { theme, toggle } = useTheme()
  const location = useLocation()
  const title = pageTitle(location.pathname)
  const isDemo = useDemoStore((s) => s.isDemo)
  const [demoModalOpen, setDemoModalOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#080F1A] text-[#0F172A] dark:text-white">
      {/* ── Demo Mode Strip (ux.md: Demo: <name> · Switch · Exit demo) ── */}
      {isDemo && <DemoStrip onSwitch={() => setDemoModalOpen(true)} />}

      <div className="flex flex-1 min-w-0">
        {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
        <aside
          id="app-sidebar"
          className="hidden lg:flex flex-col w-60 shrink-0 h-[calc(100vh-2rem)] sticky top-0 border-r border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#0D1526]"
        >
          {/* Logo */}
          <div className="px-5 py-5 border-b border-[#E2E8F0] dark:border-slate-800">
            <span className="text-xl font-black tracking-tight text-gradient">Punarshuru</span>
          </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <SideNavLink key={item.to} item={item} />
          ))}
        </nav>

        {/* Footer hint */}
        <div className="px-4 py-4 border-t border-[#E2E8F0] dark:border-slate-800">
          <p className="text-[11px] text-[#94A3B8] dark:text-slate-500 leading-snug">
            AI career intelligence<br />for Bharat 2.0
          </p>
        </div>
      </aside>

      {/* ── Content area ────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* ── Top bar ─────────────────────────────────────────────────── */}
        <header
          id="app-topbar"
          className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 h-14 border-b border-[#E2E8F0] dark:border-slate-800 bg-white/90 dark:bg-[#0D1526]/90 backdrop-blur-md"
        >
          {/* Page title */}
          <h2 className="text-base font-bold text-[#0F172A] dark:text-white truncate">{title}</h2>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <LangToggle />

            {/* Theme toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggle}
              className="p-2 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#0B4F9C]/40 transition"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark'
                ? <Sun size={16} className="text-amber-400" />
                : <Moon size={16} className="text-slate-500" />}
            </button>

            <AvatarMenu />
          </div>
        </header>

        {/* ── Page content ────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-6">
          <Outlet />
        </main>
      </div>
      </div>

      {/* ── Mobile bottom nav ────────────────────────────────────────────── */}
      <nav
        id="mobile-bottom-nav"
        aria-label="Mobile navigation"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex items-stretch border-t border-[#E2E8F0] dark:border-slate-800 bg-white/95 dark:bg-[#0D1526]/95 backdrop-blur-md safe-bottom"
      >
        {NAV_ITEMS.map((item) => (
          <BottomNavLink key={item.to} item={item} />
        ))}
      </nav>

      {/* ── Demo Switcher Modal ── */}
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </div>
  )
}
