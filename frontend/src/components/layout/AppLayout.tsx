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
  FileSearch,
  Compass,
  FileText,
  Calculator,
  Database,
  Shuffle,
  CreditCard,
  GitBranch,
  Layers,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Scale,
  ScanLine,
  BookOpen,
  Sliders,
  MapPin,
  Users,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/authStore'
import { useProfileStore } from '@/store/profileStore'
import { useDemoStore } from '@/store/demoStore'
import DemoStrip from '@/components/demo/DemoStrip'
import DemoModal from '@/components/demo/DemoModal'
import { ARCHETYPES } from '@/components/dashboard/RoleSelectorModal'
import { ROLE_FEATURES } from '@/pages/RoleFeaturesPage'
import RoleSelectorModal from '@/components/dashboard/RoleSelectorModal'

/* ── Nav item definition ──────────────────────────────────────────────────── */
interface NavItem {
  to: string
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

const getNavItems = (t: (key: string, fallback: string) => string): NavItem[] => [
  { to: '/home',     label: t('nav.dashboard', 'Home'),          icon: Home },
  { to: '/skills',   label: t('nav.skill_gap', 'My Skills'),     icon: Zap },
  { to: '/path',     label: t('nav.pathways', 'My Path'),        icon: Map },
  { to: '/jobs',     label: t('nav.market', 'Jobs & Salary'),    icon: Briefcase },
]

function getPageTitle(pathname: string, userType: string, t: (key: string, fallback: string) => string): string {
  if (pathname === '/home') return t('nav.dashboard', 'Home')
  if (pathname === '/skills') return t('nav.skill_gap', 'My Skills')
  if (pathname === '/path') return t('nav.pathways', 'My Path')
  if (pathname === '/jobs') return t('nav.market', 'Jobs & Salary')
  if (pathname === '/passport') return t('nav.passport', 'Skill Passport')
  if (pathname === '/onboarding') return t('onboarding.title', 'Onboarding')
  
  if (pathname.startsWith('/features')) {
    const featureKey = pathname.split('/')[2]
    const features = ROLE_FEATURES[userType] || ROLE_FEATURES.returner
    if (featureKey) {
      const match = features.find((f) => f.key === featureKey)
      if (match) return match.title
    }
    return 'Role Toolkit'
  }
  return t('app_name', 'Punarshuru')
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
          className="absolute right-0 mt-2 w-52 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-900 shadow-[0_8px_32px_rgba(11,79,156,0.12)] overflow-hidden z-50 animate-fade-in-up"
        >
          {user && (
            <div className="px-4 py-3 border-b border-[#E2E8F0] dark:border-slate-700">
              <p className="text-xs text-[#64748B] dark:text-slate-400">Signed in as</p>
              <p className="text-sm font-semibold text-[#0F172A] dark:text-white truncate">{user.email}</p>
            </div>
          )}

          <button
            role="menuitem"
            id="avatar-skill-passport"
            onClick={() => { setOpen(false); navigate('/passport') }}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[#0F172A] dark:text-slate-200 hover:bg-[#E8F3FF] dark:hover:bg-slate-800 transition-colors"
          >
            <Award size={15} className="text-[#0B4F9C] dark:text-sky-400" />
            <span>Skill Passport</span>
          </button>

          <button
            role="menuitem"
            id="avatar-edit-profile"
            onClick={() => { setOpen(false); navigate('/onboarding') }}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[#0F172A] dark:text-slate-200 hover:bg-[#E8F3FF] dark:hover:bg-slate-800 transition-colors"
          >
            <User size={15} />
            <span>Edit profile</span>
          </button>

          <div className="border-t border-[#E2E8F0] dark:border-slate-700 my-1" />

          <button
            role="menuitem"
            id="avatar-logout"
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          >
            <LogOut size={15} />
            <span>Log out</span>
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Language toggle ──────────────────────────────────────────────────────── */
function LangToggle() {
  const { i18n } = useTranslation()
  const currentLang = i18n.resolvedLanguage || i18n.language || 'en'
  const isHi = currentLang.startsWith('hi')

  const handleToggle = () => {
    const next = isHi ? 'en' : 'hi'
    i18n.changeLanguage(next)
    localStorage.setItem('i18nextLng', next)
  }

  return (
    <button
      id="lang-toggle-btn"
      type="button"
      onClick={handleToggle}
      className="px-2.5 py-1.5 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-[#0F172A] dark:text-white hover:border-[#0B4F9C]/40 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
      title={isHi ? 'Switch to English' : 'हिंदी में बदलें'}
      aria-label="Switch language"
    >
      <Globe size={13} className="text-[#0B4F9C] dark:text-sky-400" />
      <span>{isHi ? 'English' : 'हिन्दी'}</span>
    </button>
  )
}

const FEATURE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  // Returner
  'gap-analyzer': FileSearch,
  'reentry-roadmap': Compass,
  'resume-rebuilder': FileText,
  'purchasing-power': Calculator,

  // Gig
  'skill-passport': Award,
  'evidence-vault': Database,
  'job-translator': Shuffle,
  'portable-profile': CreditCard,

  // Laid Off
  'adjacent-roles': GitBranch,
  'transferability': Layers,
  'laidoff-path': Zap,
  'market-direction': BarChart3,

  // Stagnant
  'career-growth': TrendingUp,
  'promotion-readiness': CheckCircle2,
  'salary-benchmark': Calculator,
  'stay-or-switch': Scale,

  // Student
  'senior-mentorship': Users,
  'readiness-scan': ScanLine,
  'curriculum-mapper': BookOpen,
  'what-if': Sliders,
  'pathways-explorer': MapPin,
}

export default function AppLayout() {
  const { t } = useTranslation()
  const { theme, toggle } = useTheme()
  const location = useLocation()
  const profile = useProfileStore((s) => s.profile)
  const userType = profile?.user_type || 'returner'
  const title = getPageTitle(location.pathname, userType, t)
  const isDemo = useDemoStore((s) => s.isDemo)
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const [roleModalOpen, setRoleModalOpen] = useState(false)
  const navItems = getNavItems(t)

  const currentArchetype = ARCHETYPES.find((a) => a.type === userType) || ARCHETYPES[0]
  const ArchetypeIcon = currentArchetype.icon
  const roleFeatures = ROLE_FEATURES[userType] || ROLE_FEATURES.returner

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#080F1A] text-[#0F172A] dark:text-white">
      {/* ── Demo Mode Strip (ux.md: Demo: <name> · Switch · Exit demo) ── */}
      {isDemo && <DemoStrip onSwitch={() => setDemoModalOpen(true)} />}

      <div className="flex flex-1 min-w-0">
        {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
        <aside
          id="app-sidebar"
          className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#0D1526]"
        >
          {/* Logo */}
          <div className="px-5 py-4 border-b border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between">
            <span className="text-xl font-black tracking-tight text-gradient">Punarshuru</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0B4F9C] dark:text-sky-300 border border-blue-200/60 dark:border-blue-800/60">
              v2.0
            </span>
          </div>

          {/* Nav links (All items rendered continuously) */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Main navigation">
            {navItems.map((item) => (
              <SideNavLink key={item.to} item={item} />
            ))}

            {roleFeatures.map((feat) => {
              const targetPath = `/features/${feat.key}`
              const Icon = FEATURE_ICONS[feat.key] || Zap
              return (
                <NavLink
                  key={feat.key}
                  to={targetPath}
                  id={`nav-feat-${feat.key}`}
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
                  <span>{feat.shortTitle}</span>
                </NavLink>
              )
            })}
          </nav>

          {/* Footer hint & Role Switch Card */}
          <div className="p-3 border-t border-[#E2E8F0] dark:border-slate-800 space-y-2">
            <button
              onClick={() => setRoleModalOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 transition text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center text-xs shadow-2xs">
                  <ArchetypeIcon size={12} className={currentArchetype.accent} />
                </div>
                <div className="truncate">
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-[#0B4F9C] transition">
                    {currentArchetype.title}
                  </p>
                  <p className="text-[9px] text-slate-400 dark:text-slate-500">Tap to change role</p>
                </div>
              </div>
              <ChevronDown size={12} className="text-slate-400 group-hover:text-[#0B4F9C] transition" />
            </button>
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
            <div className="flex items-center gap-2 truncate">
              <h2 className="text-base font-bold text-[#0F172A] dark:text-white truncate">{title}</h2>
              {location.pathname.startsWith('/features') && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0B4F9C] dark:text-sky-300">
                  {currentArchetype.title}
                </span>
              )}
            </div>

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
        {navItems.map((item) => (
          <BottomNavLink key={item.to} item={item} />
        ))}
      </nav>

      {/* ── Demo Switcher Modal ── */}
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />

      {/* ── Role Archetype Switcher Modal ── */}
      <RoleSelectorModal isOpen={roleModalOpen} onClose={() => setRoleModalOpen(false)} />
    </div>
  )
}
