import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  MapPin,
  SlidersHorizontal,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Briefcase,
  TrendingUp,
  FileText,
  Target,
  Zap,
  GraduationCap,
  Award,
  Activity,
  Flame,
} from 'lucide-react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useProfileStore } from '@/store/profileStore'
import { assessApi, profileApi } from '@/lib/api'

// Existing Core Dashboard Components
import CareerRiskCard from '@/components/home/CareerRiskCard'
import NextStepCard from '@/components/home/NextStepCard'
import HomeShortcutCards from '@/components/home/HomeShortcutCards'

// Universal Tools & Modals
import RoleSelectorModal, { ARCHETYPES } from '@/components/dashboard/RoleSelectorModal'
import AICareerCopilot from '@/components/dashboard/AICareerCopilot'

// Role-specific customized dashboard configuration
const ROLE_DASHBOARD_CONFIG: Record<
  string,
  {
    cockpitBadge: string
    heading: string
    tagline: string
    roadmapCta: string
    pathWeeks: number
    pathName: string
    metaCards: Array<{
      icon: any
      accent: string
      label: string
      getValue: (p: any, targetRole: string) => string
    }>
    milestones: {
      title: string
      activeStage: string
      stages: Array<{
        num: number
        title: string
        desc: string
        status: 'completed' | 'active' | 'upcoming'
      }>
    }
    hiringPulse: {
      title: string
      subtitle: (city: string) => string
      cards: Array<{
        label: string
        value: string
        accent: string
        title: string
        desc: string
      }>
      linkText: string
    }
  }
> = {
  student: {
    cockpitBadge: 'Campus-to-Corporate Readiness Cockpit',
    heading: 'Bridge college syllabus to high-paying tech careers',
    tagline:
      'College exams measure theory, but top product & IT companies hire for practical Cloud, CI/CD, and AI integration. Follow your custom sprint to become job-ready before campus placements.',
    roadmapCta: 'View Graduate Roadmap',
    pathWeeks: 14,
    pathName: 'Campus-to-Tech Path',
    metaCards: [
      {
        icon: GraduationCap,
        accent: 'text-purple-600',
        label: 'Academic Status',
        getValue: (p) => (p?.experience_years ? 'Recent Graduate' : 'Final Year / Fresher'),
      },
      {
        icon: Briefcase,
        accent: 'text-[#0B4F9C] dark:text-sky-400',
        label: 'Core Foundation',
        getValue: (p) => p?.current_role || 'B.Tech / CS Fundamentals',
      },
      {
        icon: Target,
        accent: 'text-emerald-600',
        label: 'Placement Target',
        getValue: (_, target) => target || 'Software / ML Engineer',
      },
      {
        icon: TrendingUp,
        accent: 'text-[#F26B1D]',
        label: 'Fresher CTC Range',
        getValue: (p) => (p?.current_salary_lpa ? `₹${p.current_salary_lpa} LPA` : '₹6.5 - ₹10.0 LPA'),
      },
    ],
    milestones: {
      title: 'Campus-to-Corporate Readiness Milestones',
      activeStage: 'Stage 2 of 4 Active',
      stages: [
        { num: 1, title: '1. Academic Gap Scan', desc: 'Syllabus vs Industry Demand', status: 'completed' },
        { num: 2, title: '2. Production PoCs', desc: 'Cloud, CI/CD & GenAI Integration', status: 'active' },
        { num: 3, title: '3. GitHub & Proofs', desc: 'Deployments & Live Demos', status: 'upcoming' },
        { num: 4, title: '4. Placement Drives', desc: 'Campus & Off-Campus Openings', status: 'upcoming' },
      ],
    },
    hiringPulse: {
      title: 'Live Hiring Pulse: Early Career & Fresher Hiring',
      subtitle: (city) => `Updated today for ${city || 'Chandigarh / Mohali / Bengaluru'} Tech Hubs`,
      cards: [
        {
          label: 'Hiring Velocity',
          value: '+26% YoY',
          accent: 'text-emerald-400',
          title: 'Cloud & AI Freshers',
          desc: 'Companies actively seeking freshers with hands-on Git, Docker, and API experience over plain rote theory.',
        },
        {
          label: 'Active Drives',
          value: '18 Drives Open',
          accent: 'text-sky-400',
          title: 'Graduate Tech Drives',
          desc: 'TCS Digital, Cognizant GenC Elevate, Razorpay, and high-growth startups hiring entry talent.',
        },
        {
          label: 'Salary Benchmark',
          value: '₹6 - ₹12 LPA',
          accent: 'text-amber-400',
          title: 'Fresher Package Benchmarks',
          desc: 'Tier-1 startups and modernized tech teams offering premium bands for verified practical skills.',
        },
      ],
      linkText: 'Explore Fresher Jobs & Salary',
    },
  },
  returner: {
    cockpitBadge: 'Career-Break Re-Entry Cockpit',
    heading: 'Reclaim your career with verified GenAI delta skills',
    tagline:
      'Your career break is not lost ground. Your foundational backend engineering is durable. Mastering 4 high-ROI delta skills bridges your market match from 42% to 88%.',
    roadmapCta: 'View Re-Entry Roadmap',
    pathWeeks: 16,
    pathName: 'Stretch Returner Path',
    metaCards: [
      {
        icon: Clock,
        accent: 'text-[#F26B1D]',
        label: 'Career Break',
        getValue: (p) => (p?.career_gap_years ? `${p.career_gap_years} Years Gap` : '3.0 Years Gap'),
      },
      {
        icon: Briefcase,
        accent: 'text-[#0B4F9C] dark:text-sky-400',
        label: 'Foundation',
        getValue: (p) => p?.current_role || 'Java Developer',
      },
      {
        icon: Target,
        accent: 'text-emerald-600',
        label: 'Re-Entry Target',
        getValue: (_, target) => target || 'GenAI Engineer',
      },
      {
        icon: TrendingUp,
        accent: 'text-purple-600',
        label: 'Potential Salary',
        getValue: (p) => `₹${p?.current_salary_lpa ? Number((p.current_salary_lpa * 1.5).toFixed(1)) : 14.5} LPA`,
      },
    ],
    milestones: {
      title: 'Returner Re-Entry Milestone Progress',
      activeStage: 'Stage 2 of 4 Active',
      stages: [
        { num: 1, title: '1. Gap Audit', desc: 'Foundations verified', status: 'completed' },
        { num: 2, title: '2. Delta Upskilling', desc: 'Python & LangChain / GenAI', status: 'active' },
        { num: 3, title: '3. Resume Rebuild', desc: 'Milestone & impact format', status: 'upcoming' },
        { num: 4, title: '4. Re-Entry Drives', desc: 'Corporate Returnships', status: 'upcoming' },
      ],
    },
    hiringPulse: {
      title: 'Live Hiring Pulse: Returner Friendly Tech Roles',
      subtitle: (city) => `Updated today for ${city || 'Bengaluru / Pune'} Region`,
      cards: [
        {
          label: 'Hiring Velocity',
          value: '+38% YoY',
          accent: 'text-emerald-400',
          title: 'GenAI & AI Ops',
          desc: 'Companies actively hiring returners with traditional backend Java + Python RAG skills.',
        },
        {
          label: 'Returnship Programs',
          value: '14 Active',
          accent: 'text-sky-400',
          title: 'Corporate Returnships',
          desc: 'Inclusive hiring pipelines from Wells Fargo, Infosys Springboard, PayPal, and Amazon Reboot.',
        },
        {
          label: 'Salary Benchmark',
          value: '₹12 - ₹18 LPA',
          accent: 'text-amber-400',
          title: 'Full Parity Packages',
          desc: 'Zero salary penalties for career breaks when modern delta skills are validated.',
        },
      ],
      linkText: 'Explore Returner Jobs & Salary',
    },
  },
  laid_off: {
    cockpitBadge: 'Fast-Track Re-Employment Cockpit',
    heading: 'Fast-track your pivot with immediate availability advantage',
    tagline:
      'Zero stigma, maximum hiring speed. Convert your existing engineering grit into high-demand adjacent roles and leverage urgent 0-day notice hiring priorities.',
    roadmapCta: 'View Fast-Track Roadmap',
    pathWeeks: 8,
    pathName: 'Fast-Track Pivot Path',
    metaCards: [
      {
        icon: Zap,
        accent: 'text-amber-500',
        label: 'Notice Period',
        getValue: () => 'Immediate (0 Days)',
      },
      {
        icon: Briefcase,
        accent: 'text-[#0B4F9C] dark:text-sky-400',
        label: 'Prior Expertise',
        getValue: (p) => p?.current_role || 'Manual QA / Dev',
      },
      {
        icon: Target,
        accent: 'text-emerald-600',
        label: 'Pivot Target',
        getValue: (_, target) => target || 'Automation SDET / Cloud',
      },
      {
        icon: TrendingUp,
        accent: 'text-emerald-600',
        label: 'Target Package',
        getValue: (p) => `₹${p?.current_salary_lpa ? Number((p.current_salary_lpa * 1.25).toFixed(1)) : 15.0} LPA`,
      },
    ],
    milestones: {
      title: 'Fast-Track Re-Employment Milestones',
      activeStage: 'Stage 2 of 4 Active',
      stages: [
        { num: 1, title: '1. Transferability Audit', desc: 'Mapped core & adjacent strengths', status: 'completed' },
        { num: 2, title: '2. Rapid Delta Sprint', desc: 'Selenium, PyTest & CI/CD Pipelines', status: 'active' },
        { num: 3, title: '3. Immediate Resume', desc: 'Immediate start & hands-on tooling', status: 'upcoming' },
        { num: 4, title: '4. Direct Hiring Loops', desc: 'Fast-track 2-round interview pools', status: 'upcoming' },
      ],
    },
    hiringPulse: {
      title: 'Live Hiring Pulse: Immediate Joiner & Fast-Track Tech Roles',
      subtitle: (city) => `Updated today for ${city || 'Gurugram / Noida / Bengaluru'}`,
      cards: [
        {
          label: 'Hiring Velocity',
          value: '+45% Priority',
          accent: 'text-emerald-400',
          title: 'Immediate Availability',
          desc: 'High-growth startups & global capability centers give high priority to 0-15 day notice candidates.',
        },
        {
          label: 'Fast-Track Pipelines',
          value: '22 Companies',
          accent: 'text-sky-400',
          title: 'Direct Replacement Hiring',
          desc: 'Product teams actively filling immediate backfill positions in automation and backend.',
        },
        {
          label: 'Salary Benchmark',
          value: '₹14 - ₹20 LPA',
          accent: 'text-amber-400',
          title: 'Market-Rate Compensation',
          desc: 'Zero compensation discounts when pivoting directly into automation, testing, or cloud roles.',
        },
      ],
      linkText: 'Explore Fast-Track Jobs & Salary',
    },
  },
  stagnant: {
    cockpitBadge: 'Promotion & Market Uplift Cockpit',
    heading: 'Break free from maintenance roles into high-impact modern tech',
    tagline:
      'Avoid career stagnation in legacy support or maintenance roles. Build high-visibility AI & Cloud capabilities to secure a 40%+ salary hike or senior promotion.',
    roadmapCta: 'View Growth Roadmap',
    pathWeeks: 12,
    pathName: 'High-Growth Uplift Path',
    metaCards: [
      {
        icon: Activity,
        accent: 'text-rose-500',
        label: 'Current Tenure',
        getValue: (p) => (p?.experience_years ? `${p.experience_years}+ Yrs in Role` : '3.2 Yrs in Same Band'),
      },
      {
        icon: Briefcase,
        accent: 'text-[#0B4F9C] dark:text-sky-400',
        label: 'Current Role',
        getValue: (p) => p?.current_role || 'IT Support / Maintenance',
      },
      {
        icon: Target,
        accent: 'text-emerald-600',
        label: 'Target Elevation',
        getValue: (_, target) => target || 'Cloud & AI Chatbot Lead',
      },
      {
        icon: TrendingUp,
        accent: 'text-emerald-600',
        label: 'Projected Hike',
        getValue: () => '+45% (₹12.5 LPA Target)',
      },
    ],
    milestones: {
      title: 'Career Acceleration & Promotion Milestones',
      activeStage: 'Stage 2 of 4 Active',
      stages: [
        { num: 1, title: '1. Stagnation Audit', desc: 'Identified high-leverage shifts', status: 'completed' },
        { num: 2, title: '2. High-Impact PoCs', desc: 'GenAI & Cloud Automation projects', status: 'active' },
        { num: 3, title: '3. Impact Artifacts', desc: 'Measurable cost-saving proofs', status: 'upcoming' },
        { num: 4, title: '4. Senior Interviews', desc: 'Lead roles & compensation negotiation', status: 'upcoming' },
      ],
    },
    hiringPulse: {
      title: 'Live Hiring Pulse: Lateral Growth & Senior Roles',
      subtitle: (city) => `Updated today for ${city || 'Hyderabad / Bengaluru'} Tech Hubs`,
      cards: [
        {
          label: 'Hiring Velocity',
          value: '+32% YoY',
          accent: 'text-emerald-400',
          title: 'Senior Lateral Demand',
          desc: 'Enterprises actively modernizing internal teams, seeking engineers with AI workflow skills.',
        },
        {
          label: 'Switch Pipelines',
          value: '30+ Openings',
          accent: 'text-sky-400',
          title: 'Modernization Roles',
          desc: 'Target companies open to hiring candidates with demonstrable business impact PoCs.',
        },
        {
          label: 'Hike Benchmark',
          value: '40% - 60% Jump',
          accent: 'text-amber-400',
          title: 'Lateral Market Bands',
          desc: 'Break out of standard internal 7% appraisal bands into competitive market salaries.',
        },
      ],
      linkText: 'Explore High-Growth Jobs & Salary',
    },
  },
  gig: {
    cockpitBadge: 'Formal Career Transition Cockpit',
    heading: 'Convert operational grit into a recognized corporate career',
    tagline:
      'Turn on-the-ground discipline, SLA compliance, and customer management into a formal salaried career with health benefits, stability, and tech operational growth.',
    roadmapCta: 'View Transition Roadmap',
    pathWeeks: 10,
    pathName: 'Corporate Bridge Path',
    metaCards: [
      {
        icon: Flame,
        accent: 'text-[#F26B1D]',
        label: 'Field Experience',
        getValue: (p) => (p?.experience_years ? `${p.experience_years}+ Yrs Field Ops` : 'Delivery & Field Ops'),
      },
      {
        icon: Award,
        accent: 'text-emerald-600',
        label: 'Core Strength',
        getValue: () => 'SLA Discipline & Resilience',
      },
      {
        icon: Target,
        accent: 'text-[#0B4F9C] dark:text-sky-400',
        label: 'Transition Target',
        getValue: (_, target) => target || 'Logistics Ops Specialist',
      },
      {
        icon: TrendingUp,
        accent: 'text-purple-600',
        label: 'Salaried Benchmark',
        getValue: (p) => (p?.current_salary_lpa ? `₹${p.current_salary_lpa} LPA` : '₹4.5 - ₹6.5 LPA'),
      },
    ],
    milestones: {
      title: 'Formal Career Transition Milestones',
      activeStage: 'Stage 2 of 4 Active',
      stages: [
        { num: 1, title: '1. Field Evidence Log', desc: 'On-time rate & dispute resolution', status: 'completed' },
        { num: 2, title: '2. Corporate Tools', desc: 'Excel, Basic SQL & Communication', status: 'active' },
        { num: 3, title: '3. Skill Passport', desc: 'Digitally verified grit credential', status: 'upcoming' },
        { num: 4, title: '4. Corporate Drives', desc: 'Formal salaried ops interviews', status: 'upcoming' },
      ],
    },
    hiringPulse: {
      title: 'Live Hiring Pulse: Operations & Transition Tech Roles',
      subtitle: (city) => `Updated today for ${city || 'Delhi-NCR / Mumbai / Bengaluru'}`,
      cards: [
        {
          label: 'Hiring Velocity',
          value: '+40% YoY',
          accent: 'text-emerald-400',
          title: 'Quick-Commerce & Logistics',
          desc: 'Hyperlocal, logistics, and D2C brands actively recruiting ground operations veterans for team leads.',
        },
        {
          label: 'Corporate Pathways',
          value: '12 Programs',
          accent: 'text-sky-400',
          title: 'Apprenticeship & Salaried',
          desc: 'Formal transition tracks offering steady monthly salary, health benefits, and career ladders.',
        },
        {
          label: 'Salary Benchmark',
          value: '₹4.5 - ₹7.0 LPA',
          accent: 'text-amber-400',
          title: 'Salaried Corporate Pay',
          desc: 'Guaranteed base pay + shift incentives replacing fluctuating gig per-delivery earnings.',
        },
      ],
      linkText: 'Explore Operations Jobs & Salary',
    },
  },
}

export default function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const profile = useProfileStore((s) => s.profile)
  const setProfile = useProfileStore((s) => s.setProfile)
  const [roleModalOpen, setRoleModalOpen] = useState(false)

  const { data: serverProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: async () => {
      try {
        const p = await profileApi.getMyProfile()
        if (p) {
          setProfile(p)
          return p
        }
      } catch {
        return null
      }
      return null
    },
    enabled: !profile,
    retry: 1,
  })

  const activeProfile = profile || serverProfile

  if (!activeProfile && isProfileLoading) {
    return (
      <div className="max-w-6xl mx-auto py-24 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#0B4F9C] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading your career intelligence...</p>
      </div>
    )
  }

  // No profile in store or server → send to onboarding
  if (!activeProfile && !isProfileLoading) {
    return <Navigate to="/onboarding" replace />
  }

  const profileId = activeProfile?.id || 'demo-priya'
  const userType = (activeProfile?.user_type || 'returner') as keyof typeof ROLE_DASHBOARD_CONFIG

  const { data: disruptionData } = useQuery({
    queryKey: ['disruption', profileId],
    queryFn: () => assessApi.disruption(profileId),
    enabled: !!profileId,
  })

  const { data: gapData } = useQuery({
    queryKey: ['skill-gap', profileId],
    queryFn: () => assessApi.gap(profileId),
    enabled: !!profileId,
  })

  const currentScore = activeProfile?.disruption_score || disruptionData?.score || 72
  const targetRole = activeProfile?.target_role || 'GenAI Engineer'
  const matchPct = gapData?.match_pct || 42
  const missingSkills = gapData?.missing_skills || ['Python & Vector Embeddings', 'LangChain', 'RAG']
  const topMissing = missingSkills[0] || 'Python & Vector Embeddings'
  const firstName = activeProfile?.name ? activeProfile.name.split(' ')[0] : 'Candidate'

  const currentArchetypeInfo = ARCHETYPES.find((a) => a.type === userType) || ARCHETYPES[0]
  const ArchetypeIcon = currentArchetypeInfo.icon

  // Select dynamic config based on active persona
  const roleConfig = ROLE_DASHBOARD_CONFIG[userType] || ROLE_DASHBOARD_CONFIG.returner

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto space-y-8 pb-16 px-2 sm:px-0"
    >
      {/* ── 1. Header Greeting & Situation Switcher ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('dashboard.greeting', `Welcome back, ${firstName} 👋`, { name: firstName })}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active Intelligence
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Personalized career continuity roadmap & AI disruption defense.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeProfile?.city && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/60 shadow-2xs">
              <MapPin size={13} className="text-[#F26B1D]" />
              <span>{activeProfile.city}</span>
            </span>
          )}

          <button
            onClick={() => setRoleModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 to-orange-50 dark:from-slate-800 dark:to-slate-800/90 border border-blue-200/80 dark:border-slate-700 hover:border-[#0B4F9C] text-xs font-bold text-slate-800 dark:text-slate-200 transition-all shadow-2xs cursor-pointer hover:shadow-xs"
          >
            <ArchetypeIcon size={14} className={currentArchetypeInfo.accent} />
            <span>{currentArchetypeInfo.title}</span>
            <span className="text-[10px] text-[#F26B1D] font-extrabold ml-0.5">Switch ▾</span>
          </button>
        </div>
      </div>

      {/* ── 2. HERO COCKPIT BANNER (100% Dynamically Customized For Active Persona) ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B4F9C]/10 via-orange-500/10 to-blue-600/5 dark:from-blue-950/40 dark:via-orange-950/20 dark:to-slate-900 border border-blue-200/80 dark:border-blue-900/60 shadow-xs p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-md flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700 text-[#0B4F9C] dark:text-sky-400">
              <ArchetypeIcon size={28} className={currentArchetypeInfo.accent} />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#0B4F9C] dark:text-sky-400">
                  {roleConfig.cockpitBadge}
                </span>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0B4F9C] dark:text-sky-300 border border-blue-200/50">
                  Target: {targetRole}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {roleConfig.heading}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl font-medium leading-relaxed">
                {roleConfig.tagline}
              </p>
            </div>
          </div>

          <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2 shrink-0 self-stretch lg:self-auto justify-between border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-200/60 dark:border-slate-800">
            <button
              onClick={() => navigate('/path')}
              className="px-5 py-2.5 rounded-2xl bg-[#0B4F9C] hover:bg-blue-800 text-white text-xs font-black transition-all shadow-md flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>{roleConfig.roadmapCta}</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => setRoleModalOpen(true)}
              className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-[#0B4F9C] dark:hover:text-white flex items-center gap-1 cursor-pointer transition"
            >
              <SlidersHorizontal size={11} />
              <span>Change Career Persona</span>
            </button>
          </div>
        </div>

        {/* Dynamic Persona Meta Badges & Key Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-slate-200/70 dark:border-slate-800">
          {roleConfig.metaCards.map((card, idx) => {
            const Icon = card.icon
            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2.5 shadow-2xs"
              >
                <Icon size={16} className={`${card.accent} shrink-0`} />
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold text-slate-400">{card.label}</p>
                  <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">
                    {card.getValue(activeProfile, targetRole)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── 3. Core Career Risk & Immediate Next Step Cards ── */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <CareerRiskCard
            score={currentScore}
            breakdown={disruptionData?.breakdown}
          />
          <NextStepCard
            targetRole={targetRole}
            topMissingSkill={topMissing}
          />
        </div>

        {/* 3 High-Impact Shortcut Cards */}
        <HomeShortcutCards
          matchPct={matchPct}
          targetRole={targetRole}
          haveCount={gapData?.have_skills?.length || 4}
          missingCount={missingSkills.length}
          pathName={roleConfig.pathName}
          pathWeeks={roleConfig.pathWeeks}
          estimatedSalaryLPA={
            activeProfile?.current_salary_lpa
              ? Number((activeProfile.current_salary_lpa * (userType === 'stagnant' ? 1.45 : userType === 'returner' ? 1.5 : 1.2)).toFixed(1))
              : userType === 'gig'
              ? 5.5
              : userType === 'student'
              ? 8.0
              : 14.5
          }
          city={activeProfile?.city || 'Bengaluru'}
        />
      </div>

      {/* ── 4. Dynamic Milestone Progress Strip for ALL 5 Personas ── */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              {roleConfig.milestones.title}
            </h3>
          </div>
          <span className="text-xs font-bold text-[#0B4F9C] dark:text-sky-400">
            {roleConfig.milestones.activeStage}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
          {roleConfig.milestones.stages.map((stg) => {
            if (stg.status === 'completed') {
              return (
                <div
                  key={stg.num}
                  className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 flex items-start gap-3"
                >
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">{stg.title}</p>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">{stg.desc}</p>
                  </div>
                </div>
              )
            }

            if (stg.status === 'active') {
              return (
                <div
                  key={stg.num}
                  className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border-2 border-blue-400/60 dark:border-blue-700 flex items-start gap-3 shadow-xs"
                >
                  <Sparkles size={18} className="text-[#0B4F9C] dark:text-sky-400 shrink-0 mt-0.5 animate-bounce" />
                  <div>
                    <p className="text-xs font-black text-blue-900 dark:text-blue-100">{stg.title}</p>
                    <p className="text-[11px] text-blue-700 dark:text-blue-300 font-medium">{stg.desc}</p>
                  </div>
                </div>
              )
            }

            return (
              <div
                key={stg.num}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3"
              >
                <FileText size={18} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{stg.title}</p>
                  <p className="text-[11px] text-slate-500 font-medium">{stg.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── 5. Market Hiring Pulse & Live Opportunities (Dynamically Customized) ── */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-amber-400" />
            <h3 className="text-sm font-black uppercase tracking-wider text-amber-400">
              {roleConfig.hiringPulse.title}
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {roleConfig.hiringPulse.subtitle(activeProfile?.city || '')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {roleConfig.hiringPulse.cards.map((c, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{c.label}</span>
                <span className={`${c.accent} font-bold`}>{c.value}</span>
              </div>
              <p className="text-base font-black text-white">{c.title}</p>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {c.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-2 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Explore live opportunities, verified market parity, and role roadmaps in Jobs & Salary.
          </span>
          <Link
            to="/jobs"
            className="font-bold text-sky-400 hover:text-white flex items-center gap-1 transition"
          >
            <span>{roleConfig.hiringPulse.linkText}</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Role Switcher Modal */}
      <RoleSelectorModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
      />

      {/* Persistent AI Career Copilot */}
      <AICareerCopilot />
    </motion.div>
  )
}

