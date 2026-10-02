import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp, LayoutDashboard, UserCheck, Briefcase, MapPin } from 'lucide-react'
import ScoreRing from '@/components/charts/ScoreRing'
import { demoApi, profileApi } from '@/lib/api'
import { useProfileStore } from '@/store/profileStore'
import type { UserType } from '@/types'

const heroPersonas = [
  {
    key: 'priya',
    name: 'Priya Sharma',
    user_type: 'returner' as UserType,
    badge: 'Career Break Returner',
    city: 'Pune',
    role: 'Ex-Java Dev (4yr Gap)',
    target: 'GenAI Engineer',
    score: 72,
    overlap: '38% Matched',
    nextMove: 'Python & Vector Embeddings',
    color: 'from-blue-600 to-sky-500',
  },
  {
    key: 'ramesh',
    name: 'Ramesh Kumar',
    user_type: 'gig' as UserType,
    badge: 'Gig Platform Worker',
    city: 'Lucknow',
    role: 'Swiggy Delivery (3yr)',
    target: 'Logistics Analyst',
    score: 85,
    overlap: '25% Matched',
    nextMove: 'Excel & SQL Operations',
    color: 'from-amber-500 to-orange-500',
  },
  {
    key: 'arjun',
    name: 'Arjun Mehta',
    user_type: 'laid_off' as UserType,
    badge: 'Laid-Off QA Professional',
    city: 'Bengaluru',
    role: 'Manual QA (6yr)',
    target: 'Automation SDET',
    score: 78,
    overlap: '45% Matched',
    nextMove: 'Selenium & CI/CD Pipelines',
    color: 'from-purple-600 to-indigo-600',
  },
]

interface HeroSectionProps {
  onExplorePersonas: () => void
}

export default function HeroSection({ onExplorePersonas }: HeroSectionProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setProfile = useProfileStore((s) => s.setProfile)
  const [activeIdx, setActiveIdx] = useState(0)
  const [loading, setLoading] = useState(false)

  const activeCandidate = heroPersonas[activeIdx]

  const handleLaunchPersona = async (key: string) => {
    try {
      setLoading(true)
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
        skills_raw: Array.isArray(data.skills_raw) ? (data.skills_raw as string[]) : [],
      })
      setProfile(created)
      navigate('/dashboard')
    } catch {
      // Fallback
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 gradient-mesh">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-6 text-center lg:text-left"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/90 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-xs font-bold text-[#0B4F9C] dark:text-sky-300 shadow-sm">
              <Sparkles size={14} className="text-[#F26B1D]" />
              <span>AI Career Intelligence & Upskilling Engine • Bharat 2.0</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Detect the <span className="text-[#0B4F9C] dark:text-sky-400">Disruption</span>.
              <br />
              Understand the <span className="text-[#F26B1D]">Gap</span>.
              <br />
              Find the Next Move.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              AI-powered career intelligence for career-break returners, gig workers, laid-off professionals, stagnant employees, and graduating students in India.
            </p>

            {/* 3-Step Flow Pill */}
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 text-left">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0B4F9C] dark:text-sky-400 block">
                How Punarshuru Works in 3 Simple Steps:
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="font-extrabold text-slate-900 dark:text-white block">1. Select Role</span>
                  <span className="text-[10px] text-slate-500">Pick your situation</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="font-extrabold text-slate-900 dark:text-white block">2. AI Audit</span>
                  <span className="text-[10px] text-slate-500">Risk & gap score</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="font-extrabold text-slate-900 dark:text-white block">3. Free Roadmap</span>
                  <span className="text-[10px] text-slate-500">Govt NPTEL courses</span>
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#0B4F9C] text-white font-black text-sm hover:bg-[#083b75] shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <LayoutDashboard size={18} />
                <span>Open Live Dashboard</span>
                <ArrowRight size={17} />
              </Link>

              <button
                type="button"
                onClick={onExplorePersonas}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl glass dark:glass-dark border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold text-sm hover:border-[#0B4F9C] transition-all hover:scale-[1.02]"
              >
                <UserCheck size={16} className="text-[#F26B1D]" />
                <span>{t('landing.cta_demo')}</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-500" />
                <span>Deterministic AI Scoring</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp size={15} className="text-[#0B4F9C]" />
                <span>Real City CTC Index</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles size={15} className="text-[#F26B1D]" />
                <span>120+ Free Govt & NPTEL Courses</span>
              </div>
            </div>
          </motion.div>

          {/* Right Live Interactive Candidate Showcase Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6"
          >
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl space-y-5">
              {/* Candidate Switcher Tabs */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <UserCheck size={14} className="text-[#0B4F9C]" /> Candidate Preview:
                </span>
                <span className="text-[10px] font-bold text-slate-400">Click tabs to switch</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {heroPersonas.map((c, i) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setActiveIdx(i)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center truncate ${
                      activeIdx === i
                        ? 'bg-[#0B4F9C] text-white border-[#0B4F9C] shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {c.name.split(' ')[0]} ({c.badge.split(' ')[0]})
                  </button>
                ))}
              </div>

              {/* Active Candidate Card Showcase */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-sky-50/50 dark:from-slate-800/80 dark:to-slate-800/40 border border-slate-200/80 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${activeCandidate.color} text-white flex items-center justify-center font-black text-base shadow-sm`}
                    >
                      {activeCandidate.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {activeCandidate.name}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-2">
                        <span><MapPin size={11} className="inline text-orange-500" /> {activeCandidate.city}</span>
                        <span>•</span>
                        <span><Briefcase size={11} className="inline" /> {activeCandidate.role}</span>
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-blue-100 dark:bg-blue-950 text-[#0B4F9C] dark:text-sky-300 border border-blue-200 dark:border-blue-800">
                    {activeCandidate.badge}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center pt-1">
                  <ScoreRing
                    score={activeCandidate.score}
                    size={120}
                    strokeWidth={10}
                    label="AI Disruption Score"
                    subtitle={`${activeCandidate.score}/100 Risk`}
                    showRiskBadge={false}
                  />

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] text-slate-400">Target Career Move</p>
                      <p className="font-bold text-[#0B4F9C] dark:text-sky-400">{activeCandidate.target}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] text-slate-400">Current Competency Overlap</p>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{activeCandidate.overlap}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Recommended 1st Focus</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{activeCandidate.nextMove}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleLaunchPersona(activeCandidate.key)}
                    disabled={loading}
                    className="px-3.5 py-1.5 rounded-xl bg-[#0B4F9C] text-white font-bold text-xs hover:bg-[#083b75] transition-all flex items-center gap-1 shadow-xs"
                  >
                    <span>{loading ? 'Loading...' : 'Audit Candidate'}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
