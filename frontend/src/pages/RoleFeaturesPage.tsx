import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import { useProfileStore } from '@/store/profileStore'
import { ARCHETYPES } from '@/components/dashboard/RoleSelectorModal'
import RoleSelectorModal from '@/components/dashboard/RoleSelectorModal'

// Returner Components
import CareerGapAnalyzer from '@/components/dashboard/returner/CareerGapAnalyzer'
import ResumeGapRebuilder from '@/components/dashboard/returner/ResumeGapRebuilder'
import ReturnshipDirectory from '@/components/dashboard/returner/ReturnshipDirectory'
import GapToStrengthSimulator from '@/components/dashboard/returner/GapToStrengthSimulator'
import MuscleMemoryGym from '@/components/dashboard/returner/MuscleMemoryGym'

// Gig Components
import SkillPassportWidget from '@/components/dashboard/gig/SkillPassportWidget'
import FormalJobTranslator from '@/components/dashboard/gig/FormalJobTranslator'
import PortableCareerProfile from '@/components/dashboard/gig/PortableCareerProfile'
import GigUnifiedEarnings from '@/components/dashboard/gig/GigUnifiedEarnings'
import GigDemandHeatmap from '@/components/dashboard/gig/GigDemandHeatmap'
import GigSurakshaVault from '@/components/dashboard/gig/GigSurakshaVault'
import GigWorkProofCareer from '@/components/dashboard/gig/GigWorkProofCareer'

// Laid-off Components
import AdjacentRolesMapper from '@/components/dashboard/laidoff/AdjacentRolesMapper'
import TransferabilityScoreCard from '@/components/dashboard/laidoff/TransferabilityScoreCard'
import LaidOffFinancialRunway from '@/components/dashboard/laidoff/LaidOffFinancialRunway'
import LaidOffJobTracker from '@/components/dashboard/laidoff/LaidOffJobTracker'
import LaidOffAICopilot from '@/components/dashboard/laidoff/LaidOffAICopilot'
import LaidOffNetworkingCRM from '@/components/dashboard/laidoff/LaidOffNetworkingCRM'
import LaidOffWellbeingPlanner from '@/components/dashboard/laidoff/LaidOffWellbeingPlanner'

// Stagnant Components
import CareerGrowthDashboard from '@/components/dashboard/stagnant/CareerGrowthDashboard'
import PromotionReadiness from '@/components/dashboard/stagnant/PromotionReadiness'
import SalaryBenchmarkCard from '@/components/dashboard/stagnant/SalaryBenchmarkCard'
import StayOrSwitchAnalysis from '@/components/dashboard/stagnant/StayOrSwitchAnalysis'
import NoticePeriodBuyoutSimulator from '@/components/dashboard/stagnant/NoticePeriodBuyoutSimulator'
import Manager1on1Simulator from '@/components/dashboard/stagnant/Manager1on1Simulator'

import RealCompensationWidget from '@/components/dashboard/RealCompensationWidget'

// Student Components
import CareerReadinessScan from '@/components/dashboard/student/CareerReadinessScan'
import CurriculumVsIndustryMapper from '@/components/dashboard/student/CurriculumVsIndustryMapper'
import WhatIfSimulator from '@/components/dashboard/student/WhatIfSimulator'
import PathwaysExplorer from '@/components/dashboard/student/PathwaysExplorer'
import SeniorMentorshipWidget from '@/components/dashboard/student/SeniorMentorshipWidget'

export interface FeatureDefinition {
  key: string
  title: string
  shortTitle: string
  badge: string
  description: string
  component: (profile: any) => React.ReactNode
}

export const UNIVERSAL_PURCHASING_POWER_FEATURE: FeatureDefinition = {
  key: 'purchasing-power',
  title: 'Purchasing Power & City Parity Calculator',
  shortTitle: 'City Parity',
  badge: 'Universal Tool',
  description: 'Compare in-hand salary, cost of living, and rental parity between Tier-1 and Tier-2 Indian tech hubs.',
  component: (p) => (
    <RealCompensationWidget
      initialSalary={p?.current_salary_lpa || 12.0}
      initialCity={p?.city || 'Bengaluru'}
    />
  ),
}

export const ROLE_FEATURES: Record<string, FeatureDefinition[]> = {
  returner: [
    {
      key: 'returnships',
      title: 'India Tech Returnships & Diversity Hub',
      shortTitle: 'Returnships Hub',
      badge: 'Exclusive Hiring',
      description: 'Verified returnee cohorts at Amazon Rekindle, Microsoft Springboard, Google, Goldman Sachs & Intuit.',
      component: () => <ReturnshipDirectory />,
    },
    {
      key: 'gap-to-strength',
      title: 'AI Career Gap-to-Strength Pitch Coach',
      shortTitle: 'Gap Pitch Coach',
      badge: 'AI Simulator',
      description: 'Practice high-stakes interview answers for your career break with instant recruiter psychology scoring.',
      component: () => <GapToStrengthSimulator />,
    },
    {
      key: 'muscle-memory',
      title: '5-Minute Daily Code Muscle Memory Gym',
      shortTitle: 'Code Gym',
      badge: 'Daily Drills',
      description: 'Shake off syntax rustiness with bite-sized daily micro-drills on Java 21, React 19, SQL, and Docker.',
      component: () => <MuscleMemoryGym />,
    },
    {
      key: 'gap-analyzer',
      title: 'Career Gap & Disruption Analyzer',
      shortTitle: 'Gap Analyzer',
      badge: 'Analysis',
      description: 'Audit career breaks and validate durable foundational competencies.',
      component: (p) => (
        <CareerGapAnalyzer
          role={p?.current_role || 'Java Developer'}
          gapYears={p?.career_gap_years || 3}
          skills={p?.skills_raw || ['Java', 'SQL', 'Spring 4']}
        />
      ),
    },
    {
      key: 'resume-rebuilder',
      title: 'AI Resume Gap Rebuilder',
      shortTitle: 'Resume Rebuilder',
      badge: 'AI Tool',
      description: 'Transform gap years into functional, milestone-focused resumes.',
      component: (p) => <ResumeGapRebuilder name={p?.name} />,
    },
    UNIVERSAL_PURCHASING_POWER_FEATURE,
  ],
  gig: [
    {
      key: 'earnings',
      title: 'Unified Multi-Platform Earnings & Asli Bachat Calculator',
      shortTitle: 'Kamai & Asli Bachat',
      badge: 'Earnings',
      description: 'Swiggy, Zomato, Uber aur Zepto ki consolidated kamai, petrol aur maintenance kaat kar net bachat, daily target aur tax helper.',
      component: () => <GigUnifiedEarnings />,
    },
    {
      key: 'smart-ai',
      title: 'AI Demand Heatmap, Peak Hours & Route Fuel-Saver',
      shortTitle: 'AI Demand & Routes',
      badge: 'AI Radar',
      description: 'City corridors me live demand surge zones, hourly peak predictions aur petrol bachane ke cluster routing tips.',
      component: () => <GigDemandHeatmap />,
    },
    {
      key: 'suraksha',
      title: '1-Tap Emergency SOS, Arogya Guard & Document Reminders',
      shortTitle: 'Suraksha & SOS',
      badge: 'Safety',
      description: 'Emergency SOS WhatsApp location sharing, accident/health coverage status, sick-day wage buffer aur Driving Licence/PUC renewal alerts.',
      component: () => <GigSurakshaVault />,
    },
    {
      key: 'work-proof',
      title: 'Bank & Recruiter Verified Work/Income Certificate',
      shortTitle: 'Loan & Job Proof',
      badge: 'Verified Certificate',
      description: 'Official stamped & QR-backed income certificate for SBI/HDFC bank loans and direct applications to permanent salaried corporate roles.',
      component: (p) => <GigWorkProofCareer candidateName={p?.name} city={p?.city || 'Lucknow'} />,
    },
    {
      key: 'skill-passport',
      title: 'Karamveer Cryptographic Skill Passport',
      shortTitle: 'Skill Passport',
      badge: 'Credentials',
      description: 'Verifiable proof of high-intensity logistics, route optimization, customer dispute de-escalation, and SLA delivery competencies.',
      component: () => <SkillPassportWidget />,
    },
    {
      key: 'job-translator',
      title: 'Gig-to-Corporate Formal Job Translator',
      shortTitle: 'Role Translator',
      badge: 'AI Mapping',
      description: 'Translate informal grit and route planning into corporate ops titles.',
      component: () => <FormalJobTranslator />,
    },
    {
      key: 'portable-profile',
      title: 'Portable Career Profile Card',
      shortTitle: 'Portable Profile',
      badge: 'Shareable',
      description: 'Multi-platform verified work profile ready for formal recruiters.',
      component: (p) => <PortableCareerProfile candidateName={p?.name} />,
    },
    UNIVERSAL_PURCHASING_POWER_FEATURE,
  ],
  laid_off: [
    {
      key: 'runway',
      title: 'Financial Runway, Severance & Expense Cutter Engine',
      shortTitle: 'Runway & Expenses',
      badge: 'Finances',
      description: 'Zero-income survival calculator, Aashiyana expense pauses (+1.8 months), FnF settlement checklist, and insurance continuity alerts.',
      component: () => <LaidOffFinancialRunway />,
    },
    {
      key: 'job-tracker',
      title: 'Re-Employment Application Pipeline & Goal Kanban',
      shortTitle: 'Job Pipeline Kanban',
      badge: 'Pipeline',
      description: '4-stage interactive application Kanban (Applied, Interview, Offer) with target salaries and 1-click recruiter follow-up templates.',
      component: () => <LaidOffJobTracker />,
    },
    {
      key: 'ai-tailor',
      title: 'JD-to-Resume Keyword Tailor & Layoff Narrative Pitch',
      shortTitle: 'AI Resume & HR Pitch',
      badge: 'AI Copilot',
      description: 'Paste target JD to extract missing keywords, synthesize quantified ATS bullets, and rehearse confident, stigma-free layoff answers.',
      component: () => <LaidOffAICopilot />,
    },
    {
      key: 'networking',
      title: 'Advocate Referral CRM & Interim Contract Gigs',
      shortTitle: 'Networking CRM',
      badge: 'Referrals',
      description: 'Track warm referrals from ex-colleagues, pick up short 4-8 week engineering contract gigs, and view statutory relief guides.',
      component: () => <LaidOffNetworkingCRM />,
    },
    {
      key: 'wellbeing',
      title: 'Daily Routine Timetable & Mental Resilience Hub',
      shortTitle: 'Daily Routine',
      badge: 'Discipline',
      description: 'Structured daily schedule balancing job applications, upskilling sprints, networking, and weekly resilience check-ins.',
      component: () => <LaidOffWellbeingPlanner />,
    },
    {
      key: 'transferability',
      title: 'Skill Transferability & Overlap Matrix',
      shortTitle: 'Transferability',
      badge: 'Skill Match',
      description: 'Mathematical breakdown of existing vs required skills for target pivot roles.',
      component: () => <TransferabilityScoreCard />,
    },
    {
      key: 'adjacent-roles',
      title: 'Adjacent Roles & Industry Reallocation',
      shortTitle: 'Adjacent Roles',
      badge: 'Pivot Tool',
      description: 'Escape shrinking industries by pivoting into high-velocity adjacent tech sectors.',
      component: (p) => <AdjacentRolesMapper currentRole={p?.current_role || 'Manual QA'} />,
    },
    UNIVERSAL_PURCHASING_POWER_FEATURE,
  ],
  stagnant: [
    {
      key: 'career-growth',
      title: 'Career Growth & Velocity Scorecard',
      shortTitle: 'Stagnation Audit',
      badge: 'Audit',
      description: 'Diagnose tenure drag, promotion lag, and skill freshness with 3-year opportunity cost math.',
      component: (p) => (
        <CareerGrowthDashboard
          currentRole={p?.current_role || 'Support Engineer'}
          experienceYears={p?.experience_years || 3.2}
          currentSalary={p?.current_salary_lpa || 6.8}
        />
      ),
    },
    {
      key: 'stay-or-switch',
      title: 'Internal Growth vs External Switch Simulator',
      shortTitle: 'Stay vs Switch',
      badge: 'Decision',
      description: 'Compare financial trajectory between staying vs switching jobs, plus 10+ target hiring companies.',
      component: () => <StayOrSwitchAnalysis />,
    },
    {
      key: 'manager-1on1',
      title: 'Manager 1:1 Appraisal & Negotiation Coach',
      shortTitle: 'Manager 1:1',
      badge: 'Stay Path',
      description: 'Practice appraisal negotiation with mathematical replacement cost leverage and verbal scripts.',
      component: () => <Manager1on1Simulator />,
    },
    {
      key: 'notice-buyout',
      title: '90-Day Notice Period Buyout & ROI Simulator',
      shortTitle: 'Notice Buyout',
      badge: 'Switch Path',
      description: 'Calculate notice buyout costs, investment breakeven, and explore buyout-friendly tech firms.',
      component: (p) => (
        <NoticePeriodBuyoutSimulator
          defaultCurrentCTC={p?.current_salary_lpa || 6.8}
          defaultTargetCTC={14.5}
        />
      ),
    },
    {
      key: 'promotion-readiness',
      title: 'Internal Promotion Readiness Matrix',
      shortTitle: 'Promotion Readiness',
      badge: 'Checklist',
      description: 'Evaluate leadership signals, project ownership, and appraisal metrics.',
      component: () => <PromotionReadiness />,
    },
    {
      key: 'salary-benchmark',
      title: 'City-Tier Market Salary Benchmark',
      shortTitle: 'Salary Benchmark',
      badge: 'Market Data',
      description: 'Discover your market percentile and real purchasing power across Indian metros.',
      component: (p) => (
        <SalaryBenchmarkCard
          currentSalary={p?.current_salary_lpa || 6.8}
          role={p?.current_role || 'Technical Support'}
          city={p?.city || 'Noida'}
        />
      ),
    },
    UNIVERSAL_PURCHASING_POWER_FEATURE,
  ],
  student: [
    {
      key: 'senior-mentorship',
      title: 'Placed Seniors Mentorship & 1-on-1 Guidance Network',
      shortTitle: 'Senior Mentorship',
      badge: 'Live Mentors',
      description: 'Connect directly with recently placed seniors at Google, Amazon, Razorpay, and TCS Digital for referrals and interview tips.',
      component: () => <SeniorMentorshipWidget />,
    },
    {
      key: 'readiness-scan',
      title: 'Fresher Hiring Readiness & Campus Benchmark',
      shortTitle: 'Readiness Scan',
      badge: 'Diagnostic',
      description: 'Audit DSA speed, CS fundamentals, Git portfolio, and production projects against hiring rubrics.',
      component: () => <CareerReadinessScan />,
    },
    {
      key: 'syllabus-gap',
      title: 'College Curriculum vs Industry Demand Mapper',
      shortTitle: 'Syllabus Gap',
      badge: 'Gap Matrix',
      description: 'Identify outdated college coursework and bridge gaps with industry-demanded tech tools.',
      component: () => <CurriculumVsIndustryMapper />,
    },
    {
      key: 'what-if-simulator',
      title: 'Skill ROI & Target Companies Simulator',
      shortTitle: 'What-If ROI',
      badge: 'Interactive',
      description: 'Simulate learning AWS, GenAI, or Docker and see instant package boosts and target companies unlocked.',
      component: () => <WhatIfSimulator />,
    },
    {
      key: 'pathways-explorer',
      title: 'Placement Pathways & Tier-1 Prep Tracker',
      shortTitle: 'Placement Tracks',
      badge: 'Roadmaps',
      description: 'Customized tracks for Service Companies, Product Unicorns, and High-Growth AI startups.',
      component: () => <PathwaysExplorer />,
    },
    UNIVERSAL_PURCHASING_POWER_FEATURE,
  ],
}

export default function RoleFeaturesPage() {
  const { featureKey } = useParams<{ featureKey?: string }>()
  const navigate = useNavigate()
  const profile = useProfileStore((s) => s.profile)
  const [roleModalOpen, setRoleModalOpen] = useState<boolean>(false)

  const userType = profile?.user_type || 'returner'
  const currentArchetype = ARCHETYPES.find((a) => a.type === userType) || ARCHETYPES[0]
  const features = ROLE_FEATURES[userType] || ROLE_FEATURES.returner

  // Determine active feature
  const activeFeature =
    features.find((f) => f.key === featureKey) || features[0]

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* ── 1. Top Header with Active Persona Badge ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 transition"
              title="Back to Dashboard"
            >
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {currentArchetype.title} Diagnostic Suite
            </h1>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-[#0B4F9C] dark:text-sky-300 border border-blue-200/60">
              Role Focused
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 pl-8">
            Tailored analytics and decision tools for <strong className="text-slate-700 dark:text-slate-300">{currentArchetype.tagline}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 pl-8 sm:pl-0">
          <button
            type="button"
            onClick={() => setRoleModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#0B4F9C] transition cursor-pointer shadow-2xs"
          >
            <SlidersHorizontal size={13} className="text-[#0B4F9C]" />
            <span>Switch Persona</span>
          </button>
        </div>
      </div>

      {/* ── Stagnant Persona Step-by-Step Pathway Navigator ── */}
      {userType === 'stagnant' && (
        <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 via-amber-50 to-emerald-50 dark:from-slate-800/80 dark:via-blue-950/40 dark:to-slate-900 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
            <Sparkles size={14} className="text-[#0B4F9C]" />
            <span>Stagnation Breakout Blueprint:</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2.5 text-[11px] font-bold text-slate-600 dark:text-slate-300">
            <span className={activeFeature.key === 'career-growth' ? 'text-[#0B4F9C] font-black underline' : ''}>Audit</span>
            <span className="text-slate-300 dark:text-slate-600">→</span>
            <span className={activeFeature.key === 'stay-or-switch' ? 'text-[#0B4F9C] font-black underline' : ''}>Stay vs Switch</span>
            <span className="text-slate-300 dark:text-slate-600">→</span>
            <span className={activeFeature.key === 'manager-1on1' || activeFeature.key === 'notice-buyout' ? 'text-[#0B4F9C] font-black underline' : ''}>Execution (Manager 1:1 / Buyout)</span>
          </div>
        </div>
      )}

      {/* ── 2. Active Feature Container ── */}
      <motion.div
        key={activeFeature.key}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-4"
      >
        {activeFeature.component(profile)}
      </motion.div>

      {/* Role Selector Modal */}
      <RoleSelectorModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
      />
    </div>
  )
}
