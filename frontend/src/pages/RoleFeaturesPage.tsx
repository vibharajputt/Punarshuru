import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  SlidersHorizontal,
} from 'lucide-react'
import { useProfileStore } from '@/store/profileStore'
import { ARCHETYPES } from '@/components/dashboard/RoleSelectorModal'
import RoleSelectorModal from '@/components/dashboard/RoleSelectorModal'

// Returner Components
import CareerGapAnalyzer from '@/components/dashboard/returner/CareerGapAnalyzer'
import ResumeGapRebuilder from '@/components/dashboard/returner/ResumeGapRebuilder'

// Gig Components
import SkillPassportWidget from '@/components/dashboard/gig/SkillPassportWidget'
import EvidenceVault from '@/components/dashboard/gig/EvidenceVault'
import FormalJobTranslator from '@/components/dashboard/gig/FormalJobTranslator'
import PortableCareerProfile from '@/components/dashboard/gig/PortableCareerProfile'

// Laid-off Components
import AdjacentRolesMapper from '@/components/dashboard/laidoff/AdjacentRolesMapper'
import TransferabilityScoreCard from '@/components/dashboard/laidoff/TransferabilityScoreCard'
import LaidOffLearningPath from '@/components/dashboard/laidoff/LaidOffLearningPath'
import JobMarketDirection from '@/components/dashboard/laidoff/JobMarketDirection'

// Stagnant Components
import CareerGrowthDashboard from '@/components/dashboard/stagnant/CareerGrowthDashboard'
import PromotionReadiness from '@/components/dashboard/stagnant/PromotionReadiness'
import SalaryBenchmarkCard from '@/components/dashboard/stagnant/SalaryBenchmarkCard'
import StayOrSwitchAnalysis from '@/components/dashboard/stagnant/StayOrSwitchAnalysis'

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
      key: 'skill-passport',
      title: 'Cryptographic Skill Passport',
      shortTitle: 'Skill Passport',
      badge: 'Credentials',
      description: 'Verifiable proof of high-intensity logistics and delivery competencies.',
      component: () => <SkillPassportWidget />,
    },
    {
      key: 'evidence-vault',
      title: 'Earnings & Performance Evidence Vault',
      shortTitle: 'Evidence Vault',
      badge: 'Proof Storage',
      description: 'Digitize screenshot ratings, kilometers driven, and performance proofs.',
      component: () => <EvidenceVault />,
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
      key: 'adjacent-roles',
      title: 'Adjacent Roles & Industry Reallocation',
      shortTitle: 'Adjacent Roles',
      badge: 'Pivot Tool',
      description: 'Escape shrinking industries by pivoting into high-velocity adjacent tech sectors.',
      component: (p) => <AdjacentRolesMapper currentRole={p?.current_role || 'Manual QA'} />,
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
      key: 'laidoff-path',
      title: 'Laid-Off Fast-Track Sprint Curriculum',
      shortTitle: 'Fast-Track Sprint',
      badge: 'Sprint Plan',
      description: 'Accelerated 4-week learning sprint focusing exclusively on high-ROI delta skills.',
      component: () => <LaidOffLearningPath />,
    },
    {
      key: 'market-direction',
      title: 'Live Hiring Velocity & Market Direction',
      shortTitle: 'Hiring Velocity',
      badge: 'Market Radar',
      description: 'Real-time hiring trends comparing legacy vs emerging role velocities in India.',
      component: () => <JobMarketDirection />,
    },
    UNIVERSAL_PURCHASING_POWER_FEATURE,
  ],
  stagnant: [
    {
      key: 'career-growth',
      title: 'Career Growth & Velocity Scorecard',
      shortTitle: 'Growth Scorecard',
      badge: 'Audit',
      description: 'Diagnose tenure drag, promotion lag, and skill freshness.',
      component: (p) => (
        <CareerGrowthDashboard
          currentRole={p?.current_role || 'Support Engineer'}
          experienceYears={p?.experience_years || 3.2}
          currentSalary={p?.current_salary_lpa || 6.8}
        />
      ),
    },
    {
      key: 'promotion-readiness',
      title: 'Internal Promotion Readiness Matrix',
      shortTitle: 'Promotion Readiness',
      badge: 'Readiness',
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
    {
      key: 'stay-or-switch',
      title: 'Internal Growth vs External Switch Simulator',
      shortTitle: 'Stay or Switch',
      badge: 'Decision Tool',
      description: 'Compare financial and career trajectory between staying vs switching jobs.',
      component: () => <StayOrSwitchAnalysis />,
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
      badge: 'Audit',
      description: 'Diagnostic assessment of campus project portfolio vs top recruiter benchmarks.',
      component: (p) => <CareerReadinessScan collegeCity={p?.city || 'Mohali'} />,
    },
    {
      key: 'curriculum-mapper',
      title: 'Academic Syllabus vs Industry Demand Mapper',
      shortTitle: 'Syllabus Gap',
      badge: 'Curriculum',
      description: 'Identifies university curriculum blindspots (Docker, CI/CD, GenAI, Cloud APIs).',
      component: () => <CurriculumVsIndustryMapper />,
    },
    {
      key: 'what-if',
      title: '"What If I Learn X?" Salary Simulator',
      shortTitle: 'What-If Simulator',
      badge: 'Simulator',
      description: 'Simulate the exact salary uplift from mastering specific in-demand tech stacks.',
      component: () => <WhatIfSimulator />,
    },
    {
      key: 'pathways-explorer',
      title: 'Tier-1 Tech Roles Pathway Navigator',
      shortTitle: 'Pathways Explorer',
      badge: 'Career Maps',
      description: 'Roadmaps to crack Software Engineer, Data Engineer, and DevOps roles from campus.',
      component: () => <PathwaysExplorer />,
    },
    UNIVERSAL_PURCHASING_POWER_FEATURE,
  ],
}

export default function RoleFeaturesPage() {
  const { featureKey } = useParams<{ featureKey?: string }>()
  const navigate = useNavigate()
  const profile = useProfileStore((s) => s.profile)
  const [roleModalOpen, setRoleModalOpen] = useState(false)

  const userType = profile?.user_type || 'returner'
  const features = ROLE_FEATURES[userType] || ROLE_FEATURES.returner
  const currentArchetypeInfo = ARCHETYPES.find((a) => a.type === userType) || ARCHETYPES[0]
  const ArchetypeIcon = currentArchetypeInfo.icon

  // Determine active feature
  const activeFeature = features.find((f) => f.key === featureKey) || features[0]

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* 1. Breadcrumbs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/home"
            className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[#0B4F9C] hover:border-[#0B4F9C] transition-all shadow-xs"
            title="Back to Dashboard"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <ArchetypeIcon size={16} className={currentArchetypeInfo.accent} />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {currentArchetypeInfo.title} Toolkit
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {activeFeature.title}
            </h1>
          </div>
        </div>

        <button
          onClick={() => setRoleModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#0B4F9C] text-xs font-bold text-slate-700 dark:text-slate-200 transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <SlidersHorizontal size={13} className="text-[#F26B1D]" />
          <span>Switch Career Role</span>
        </button>
      </div>

      {/* 2. Feature Tabs Sub-Navigation */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 w-full overflow-x-auto">
        {features.map((feat) => {
          const isActive = feat.key === activeFeature.key
          return (
            <button
              key={feat.key}
              type="button"
              onClick={() => navigate(`/features/${feat.key}`)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-[#0B4F9C] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold uppercase bg-slate-200/60 dark:bg-slate-700">
                {feat.badge}
              </span>
              <span>{feat.shortTitle}</span>
            </button>
          )
        })}
      </div>

      {/* 3. Feature Dedicated Full View */}
      <motion.div
        key={activeFeature.key}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
        {activeFeature.component(profile)}
      </motion.div>

      {/* Role Switcher Modal */}
      <RoleSelectorModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
      />
    </div>
  )
}
