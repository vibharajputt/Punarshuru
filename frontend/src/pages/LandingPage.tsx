import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, ShieldCheck, TrendingUp, RotateCcw, Truck, TrendingDown, Clock, GraduationCap, LogIn } from 'lucide-react'
import Footer from '@/components/landing/Footer'
import { useProfileStore } from '@/store/profileStore'

const targetGroups = [
  {
    type: 'returner',
    title: 'Career Break Returner',
    tagline: 'Maternity, eldercare, or sabbatical gap',
    description: 'Modernize legacy skills and re-enter tech with verifiable AI project proofs.',
    icon: RotateCcw,
    color: 'from-[#0B4F9C] to-sky-600',
    borderColor: 'border-blue-200 hover:border-[#0B4F9C]',
    badgeBg: 'bg-[#E8F3FF] text-[#0B4F9C]',
  },
  {
    type: 'gig',
    title: 'Gig Platform Worker',
    tagline: 'Swiggy, Zomato, or field services',
    description: 'Turn operational grit into tech ops, logistics analytics, and data roles.',
    icon: Truck,
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-orange-200 hover:border-orange-500',
    badgeBg: 'bg-orange-50 text-orange-700',
  },
  {
    type: 'laid_off',
    title: 'Laid-off Professional',
    tagline: 'Company downsizing or role phase-out',
    description: 'Pivot from manual functions (e.g. manual QA) into automation SDET & GenAI.',
    icon: TrendingDown,
    color: 'from-orange-500 to-rose-600',
    borderColor: 'border-rose-200 hover:border-rose-500',
    badgeBg: 'bg-rose-50 text-rose-700',
  },
  {
    type: 'stagnant',
    title: 'Stagnant Employee',
    tagline: '3+ years in identical salary band',
    description: 'Break free from role stagnation with modern AI toolchains and salary arbitrage.',
    icon: Clock,
    color: 'from-purple-600 to-indigo-600',
    borderColor: 'border-purple-200 hover:border-purple-500',
    badgeBg: 'bg-purple-50 text-purple-700',
  },
  {
    type: 'student',
    title: 'Final-Year Student / Fresher',
    tagline: 'Graduating BTech / BCA / MCA student',
    description: 'Build high-ROI market-fit skills and certified GitHub proofs for placement.',
    icon: GraduationCap,
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-200 hover:border-emerald-500',
    badgeBg: 'bg-emerald-50 text-emerald-700',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const profile = useProfileStore((s) => s.profile)
  const personasRef = useRef<HTMLDivElement>(null)

  const handleSelectGroup = (type: string) => {
    navigate(`/onboarding?type=${type}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#080F1A] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Clean Light Home Header */}
      <header className="w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B4F9C] to-[#F26B1D] flex items-center justify-center text-white shadow-md">
              <Sparkles size={18} />
            </div>
            <span className="font-black text-xl tracking-tight text-[#0B4F9C] dark:text-sky-400">
              Punar<span className="text-[#F26B1D]">shuru</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to={profile ? "/dashboard" : "/onboarding"}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#0B4F9C] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 transition-all shadow-2xs"
            >
              <LogIn size={14} />
              <span>{profile ? `Dashboard (${profile.name.split(' ')[0]})` : 'Log In'}</span>
            </Link>

            <Link
              to="/onboarding"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-[#0B4F9C] hover:bg-[#083b75] text-white shadow-md shadow-blue-900/15 transition-all hover:scale-[1.02]"
            >
              <span>Sign Up & Audit (Free)</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-16 pb-20">
        {/* Simple & Clean Light Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-12 bg-gradient-to-b from-sky-50/80 via-white to-orange-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F3FF] dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-xs font-bold text-[#0B4F9C] dark:text-sky-300 shadow-2xs">
              <Sparkles size={14} className="text-[#F26B1D]" />
              <span>AI Career Intelligence & Upskilling Engine • Bharat 2.0</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Detect the <span className="text-[#0B4F9C] dark:text-sky-400">Disruption</span>.
              <br />
              Understand the <span className="text-[#F26B1D]">Gap</span>.
              <br />
              Find the Next Move.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              AI-powered career audit & roadmap designed specifically for career-break returners, gig workers, laid-off professionals, stagnant employees, and students in India.
            </p>

            {/* Main Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
              <Link
                to="/onboarding"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#0B4F9C] hover:bg-[#083b75] text-white font-black text-sm shadow-xl shadow-blue-900/20 transition-all hover:scale-105"
              >
                <span>Get Started — Choose Your Career Situation</span>
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Trust Points */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>Deterministic AI Scoring</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp size={16} className="text-[#0B4F9C]" />
                <span>Real City Purchasing Power Index</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles size={16} className="text-[#F26B1D]" />
                <span>120+ Free Govt NPTEL Courses</span>
              </div>
            </div>
          </div>
        </section>

        {/* Target Archetype Selection Cards Section */}
        <section ref={personasRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full bg-[#E8F3FF] text-[#0B4F9C] dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs font-bold uppercase tracking-wider">
              Who Is Punarshuru Built For?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Select Your Situation to Sign Up & Start Audit
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Click your career background below to enter details and generate your personalized AI disruption audit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {targetGroups.map((group, idx) => {
              const Icon = group.icon
              return (
                <motion.div
                  key={group.type}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.06 }}
                  onClick={() => handleSelectGroup(group.type)}
                  className={`group p-6 rounded-3xl bg-white dark:bg-slate-900 border ${group.borderColor} dark:border-slate-800 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-6`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${group.color} text-white flex items-center justify-center shadow-md`}>
                        <Icon size={24} />
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${group.badgeBg}`}>
                        Target Category
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-[#0B4F9C] dark:group-hover:text-sky-400 transition-colors">
                        {group.title}
                      </h3>
                      <p className="text-xs font-semibold text-[#0B4F9C] dark:text-sky-400 mt-0.5">
                        {group.tagline}
                      </p>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {group.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#0B4F9C] dark:text-sky-400 group-hover:translate-x-1 transition-transform">
                    <span>Select & Enter Details</span>
                    <ArrowRight size={15} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
