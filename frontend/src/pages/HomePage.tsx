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
  ShieldAlert,
  IndianRupee,
  FileCheck,
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

      {/* ── 2B. GIG WORKER EXCLUSIVE RAPID COCKPIT STRIP ── */}
      {userType === 'gig' && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-slate-900 border border-amber-300/80 dark:border-amber-900/60 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/60 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Gig Partner Live Shift Cockpit</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black">
                  {activeProfile?.city || 'Lucknow'} / Active
                </span>
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/features/suraksha"
                className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm animate-pulse"
              >
                <ShieldAlert size={14} />
                <span>1-Tap SOS Alert</span>
              </Link>

              <Link
                to="/features/earnings"
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:border-amber-500 transition shadow-2xs"
              >
                <span>Open Full Cockpit →</span>
              </Link>
            </div>
          </div>

          {/* Daily Target Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">
                🎯 Aaj Ka Target: <strong className="text-slate-900 dark:text-white">₹1,260</strong> / ₹1,500 (84% Ho Gaya)
              </span>
              <span className="text-orange-600 dark:text-orange-400 font-black flex items-center gap-1">
                <Flame size={13} className="fill-orange-500 text-orange-500" />
                14 Din Streak! (₹240 baki)
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-white dark:bg-slate-800 overflow-hidden p-0.5 border border-amber-200 dark:border-slate-700">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 w-[84%]" />
            </div>
          </div>

          {/* 4 Quick Launch Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <Link
              to="/features/earnings"
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 hover:border-amber-500 transition shadow-2xs group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                  <span>Kamai & Asli Bachat</span>
                  <IndianRupee size={14} className="text-amber-500" />
                </div>
                <p className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-1">₹975 Asli Bachat</p>
                <p className="text-[11px] text-slate-500">Gross ₹1,260 minus petrol & wear</p>
              </div>
              <div className="pt-2 text-[11px] font-bold text-[#0B4F9C] dark:text-sky-400 flex items-center justify-between group-hover:translate-x-0.5 transition-transform">
                <span>View Breakdown</span>
                <ArrowRight size={12} />
              </div>
            </Link>

            <Link
              to="/features/smart-ai"
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 hover:border-orange-500 transition shadow-2xs group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                  <span>AI Demand Radar</span>
                  <Flame size={14} className="text-orange-500 fill-orange-500" />
                </div>
                <p className="text-base font-black text-orange-600 mt-1">1.8x Dinner Surge</p>
                <p className="text-[11px] text-slate-500">Gomti Nagar & Hazratganj hot</p>
              </div>
              <div className="pt-2 text-[11px] font-bold text-orange-600 dark:text-orange-400 flex items-center justify-between group-hover:translate-x-0.5 transition-transform">
                <span>Check Surge Map</span>
                <ArrowRight size={12} />
              </div>
            </Link>

            <Link
              to="/features/suraksha"
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 hover:border-rose-500 transition shadow-2xs group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                  <span>Suraksha & Docs</span>
                  <ShieldAlert size={14} className="text-rose-500" />
                </div>
                <p className="text-base font-black text-amber-600 mt-1">PUC: 6 Din Baki</p>
                <p className="text-[11px] text-slate-500">₹5L accident cover active</p>
              </div>
              <div className="pt-2 text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center justify-between group-hover:translate-x-0.5 transition-transform">
                <span>Manage Vault</span>
                <ArrowRight size={12} />
              </div>
            </Link>

            <Link
              to="/features/work-proof"
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 hover:border-blue-500 transition shadow-2xs group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                  <span>Work/Income Proof</span>
                  <FileCheck size={14} className="text-[#0B4F9C]" />
                </div>
                <p className="text-base font-black text-[#0B4F9C] dark:text-sky-400 mt-1">₹28.5k/mo Cert</p>
                <p className="text-[11px] text-slate-500">Bank loan & Zepto/DL jobs</p>
              </div>
              <div className="pt-2 text-[11px] font-bold text-[#0B4F9C] dark:text-sky-400 flex items-center justify-between group-hover:translate-x-0.5 transition-transform">
                <span>Get Stamped PDF</span>
                <ArrowRight size={12} />
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* ── 2C. LAID-OFF EXCLUSIVE IMMEDIATE RE-EMPLOYMENT STRIP ── */}
      {userType === 'laid_off' && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-emerald-500/10 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-slate-900 border border-blue-300/80 dark:border-blue-900/60 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-200/60 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>0-Day Immediate Joiner Advantage</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-black">
                  Zero Notice Period Priority ⚡
                </span>
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/features/runway"
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:border-[#0B4F9C] transition shadow-2xs"
              >
                <span>Financial Runway: 5.4 Months →</span>
              </Link>
              <Link
                to="/features/job-tracker"
                className="px-3.5 py-1.5 rounded-xl bg-[#0B4F9C] hover:bg-blue-800 text-white text-xs font-black shadow-sm transition"
              >
                <span>Job Pipeline Kanban →</span>
              </Link>
            </div>
          </div>

          {/* Runway & Pipeline Quick Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
              <p className="text-[10px] uppercase font-bold text-slate-400">Survival Runway</p>
              <p className="text-base font-black text-emerald-600 dark:text-emerald-400">5.4 Months (Safe)</p>
              <p className="text-[11px] text-slate-500">₹8.0L Total Liquid Funds</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
              <p className="text-[10px] uppercase font-bold text-slate-400">Active Interview Loops</p>
              <p className="text-base font-black text-[#0B4F9C] dark:text-sky-400">3 Companies</p>
              <p className="text-[11px] text-slate-500">Razorpay, PhonePe & Groww (Offer)</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
              <p className="text-[10px] uppercase font-bold text-slate-400">Weekly Activity Target</p>
              <p className="text-base font-black text-purple-600 dark:text-purple-400">7 / 10 Applied</p>
              <p className="text-[11px] text-slate-500">🔥 8-Day Re-Employment Streak</p>
            </div>
          </div>

          {/* 4 Quick Launch Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <Link
              to="/features/runway"
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 hover:border-blue-500 transition shadow-2xs group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                  <span>Runway & Expenses</span>
                  <IndianRupee size={14} className="text-emerald-500" />
                </div>
                <p className="text-base font-black text-slate-900 dark:text-white mt-1">Expense Cutter</p>
                <p className="text-[11px] text-slate-500">Pause subs to gain +1.8 months</p>
              </div>
              <div className="pt-2 text-[11px] font-bold text-[#0B4F9C] dark:text-sky-400 flex items-center justify-between group-hover:translate-x-0.5 transition-transform">
                <span>View Calculator</span>
                <ArrowRight size={12} />
              </div>
            </Link>

            <Link
              to="/features/job-tracker"
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 hover:border-indigo-500 transition shadow-2xs group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                  <span>Job Pipeline Kanban</span>
                  <Briefcase size={14} className="text-indigo-500" />
                </div>
                <p className="text-base font-black text-slate-900 dark:text-white mt-1">1 Offer In Hand</p>
                <p className="text-[11px] text-slate-500">₹21 LPA Groww offer review</p>
              </div>
              <div className="pt-2 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-between group-hover:translate-x-0.5 transition-transform">
                <span>Manage Pipeline</span>
                <ArrowRight size={12} />
              </div>
            </Link>

            <Link
              to="/features/ai-tailor"
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 hover:border-purple-500 transition shadow-2xs group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                  <span>AI Resume & Pitch</span>
                  <Sparkles size={14} className="text-purple-500" />
                </div>
                <p className="text-base font-black text-slate-900 dark:text-white mt-1">Stigma-Free Narrative</p>
                <p className="text-[11px] text-slate-500">Restructuring interview script</p>
              </div>
              <div className="pt-2 text-[11px] font-bold text-purple-600 dark:text-purple-400 flex items-center justify-between group-hover:translate-x-0.5 transition-transform">
                <span>Generate Bullets</span>
                <ArrowRight size={12} />
              </div>
            </Link>

            <Link
              to="/features/networking"
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 hover:border-teal-500 transition shadow-2xs group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                  <span>Networking & Gigs</span>
                  <Target size={14} className="text-teal-500" />
                </div>
                <p className="text-base font-black text-slate-900 dark:text-white mt-1">4 Warm Referrals</p>
                <p className="text-[11px] text-slate-500">₹85k/mo contract sprints</p>
              </div>
              <div className="pt-2 text-[11px] font-bold text-teal-600 dark:text-teal-400 flex items-center justify-between group-hover:translate-x-0.5 transition-transform">
                <span>View CRM & Gigs</span>
                <ArrowRight size={12} />
              </div>
            </Link>
          </div>
        </div>
      )}

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

        {/* ── 3.5 Persona-Specific Innovation Spotlight ── */}
        {userType === 'returner' && (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-teal-500/10 via-blue-600/10 to-emerald-600/5 dark:from-teal-950/40 dark:via-blue-950/30 dark:to-slate-900 border border-teal-200/80 dark:border-teal-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0 shadow-xs border border-teal-100 dark:border-teal-800">
                <GraduationCap size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-300">
                    Returner Innovation Suite
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200">
                    Amazon, Google & Microsoft
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight mt-0.5">
                  India Tech Returnships Hub & 5-Min Code Muscle Gym
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Explore verified paid returnships (₹60k–₹1.25L/mo stipend) and practice 5-minute daily syntax warm-ups.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/features/returnships"
                className="px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
              >
                <span>View Returnships</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                to="/features/muscle-memory"
                className="px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-bold transition border border-slate-200 dark:border-slate-700 shadow-2xs"
              >
                <span>Code Gym 🔥</span>
              </Link>
            </div>
          </div>
        )}

        {userType === 'stagnant' && (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-blue-600/10 to-purple-600/5 dark:from-amber-950/40 dark:via-blue-950/30 dark:to-slate-900 border border-amber-200/80 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 shadow-xs border border-amber-100 dark:border-amber-800">
                <Clock size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
                    Stagnation Breakout Suite
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                    Notice Trap Breaker
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight mt-0.5">
                  90-Day Notice Buyout Simulator & Manager 1:1 Negotiation
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Calculate buyout ROI (+₹8.4L net profit), view buyout-friendly employers, and practice appraisal counter-offers.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/features/notice-buyout"
                className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
              >
                <span>Notice Buyout ROI</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                to="/features/manager-1on1"
                className="px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-bold transition border border-slate-200 dark:border-slate-700 shadow-2xs"
              >
                <span>Manager 1:1 Roleplay</span>
              </Link>
            </div>
          </div>
        )}

        {userType === 'student' && (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-blue-600/10 to-purple-600/5 dark:from-emerald-950/40 dark:via-blue-950/30 dark:to-slate-900 border border-emerald-200/80 dark:border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-xs border border-emerald-100 dark:border-emerald-800">
                <GraduationCap size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    Senior Mentorship Network
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                    18 Online
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight mt-0.5">
                  Talk Directly with Recently Placed Seniors at Amazon & Razorpay
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Book free 15-minute 1-on-1 resume reviews and simulated placement technical mock rounds.
                </p>
              </div>
            </div>

            <Link
              to="/features/senior-mentorship"
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>Connect with Seniors</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        )}
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

