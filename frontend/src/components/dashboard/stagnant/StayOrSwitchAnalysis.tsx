import { useState, useMemo } from 'react'
import {
  Scale,
  Sparkles,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Circle,
  Search,
  Zap,
  Building2,
  TrendingUp,
  ShieldCheck,
  Filter,
  X,
  ExternalLink,
  MapPin,
  Clock,
  Send,
  Check,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useProfileStore } from '@/store/profileStore'

interface ActiveJobOpening {
  id: string
  title: string
  experience: string
  ctc: string
  location: string
  workType: 'Hybrid' | 'Remote' | 'On-site'
  keySkills: string[]
  description: string
}

interface SwitchCompany {
  id: string
  name: string
  badge: string
  badgeColor: string
  category: 'Product Unicorn' | 'Global GCC / Banking' | 'AI & Next-Gen' | 'Enterprise Tech'
  targetRole: string
  ctcBracket: string
  avgHikePct: string
  requiredSkills: string[]
  interviewType: string
  hiringDifficulty: 'Fast-Track (2 Rounds)' | 'Standard (3 Rounds)' | 'Hands-on PoC / Take-Home'
  referralStrategy: string
  location: string
  careerPortalUrl: string
  companyOverview: string
  cultureHighlights: string[]
  interviewRounds: string[]
  openings: ActiveJobOpening[]
}

const SWITCH_TARGET_COMPANIES: SwitchCompany[] = [
  {
    id: 'razorpay',
    name: 'Razorpay',
    badge: 'RZP',
    badgeColor: 'bg-blue-600 text-white',
    category: 'Product Unicorn',
    targetRole: 'SDE-2 / Backend Automation Specialist',
    ctcBracket: '₹14 - ₹19 LPA',
    avgHikePct: '+55% to +75%',
    requiredSkills: ['Python & Scripting', 'FastAPI / REST', 'Docker & Containers', 'PostgreSQL'],
    interviewType: 'Live Coding + System Architecture',
    hiringDifficulty: 'Hands-on PoC / Take-Home',
    referralStrategy: 'Share GitHub link of automated microservice or ticket deflection bot with Razorpay engineers on LinkedIn.',
    location: 'Bengaluru / Hybrid',
    careerPortalUrl: 'https://razorpay.com/jobs/',
    companyOverview: 'Leading fintech unicorn powering seamless payments and neo-banking infrastructure for 10M+ businesses across India.',
    cultureHighlights: ['Fast-paced product engineering', 'High ownership & hackathon culture', 'Comprehensive health & ESOP benefits'],
    interviewRounds: [
      'Round 1: Python Scripting, Concurrency & Data Structures',
      'Round 2: System Design (High-volume Webhooks & Payment Idempotency)',
      'Round 3: Engineering Manager & Cultural Alignment',
    ],
    openings: [
      {
        id: 'rzp-1',
        title: 'SDE-2 Backend Automation Specialist',
        experience: '2.5 - 5 Years',
        ctc: '₹14 - ₹19 LPA',
        location: 'Bengaluru',
        workType: 'Hybrid',
        keySkills: ['Python & Scripting', 'FastAPI / REST', 'Docker & Containers', 'PostgreSQL'],
        description: 'Build automated reconciliation pipelines and webhook triage services handling 5,000+ RPS.',
      },
      {
        id: 'rzp-2',
        title: 'Platform Site Reliability Engineer',
        experience: '3 - 6 Years',
        ctc: '₹16 - ₹21 LPA',
        location: 'Bengaluru / Hybrid',
        workType: 'Hybrid',
        keySkills: ['Docker & Containers', 'Kubernetes / CI/CD', 'AWS / Cloud Infrastructure'],
        description: 'Manage 99.99% availability across multi-region Kubernetes clusters and automated canary deployments.',
      },
    ],
  },
  {
    id: 'freshworks',
    name: 'Freshworks',
    badge: 'FRSH',
    badgeColor: 'bg-amber-600 text-white',
    category: 'Product Unicorn',
    targetRole: 'Enterprise Integration & Support Engineer',
    ctcBracket: '₹13 - ₹17.5 LPA',
    avgHikePct: '+45% to +65%',
    requiredSkills: ['Python & Scripting', 'FastAPI / REST', 'PostgreSQL', 'ITIL / Incident Mgmt'],
    interviewType: 'API Integration + Debugging Round + Hiring Manager',
    hiringDifficulty: 'Standard (3 Rounds)',
    referralStrategy: 'Demonstrate experience with customer ticketing and Jira/Zendesk API integrations.',
    location: 'Chennai / Bengaluru / Remote',
    careerPortalUrl: 'https://www.freshworks.com/company/careers/',
    companyOverview: 'NASDAQ-listed enterprise SaaS company providing modern AI-powered customer service and IT service management tools.',
    cultureHighlights: ['People-first work culture', 'Hybrid flexibility across India', 'Upskilling stipends and patent bonuses'],
    interviewRounds: [
      'Round 1: API Debugging & Integration Scenario Test',
      'Round 2: Architectural Troubleshooting & Incident RCA',
      'Round 3: Director Discussion & Communication Skills',
    ],
    openings: [
      {
        id: 'frsh-1',
        title: 'Enterprise Integration Specialist',
        experience: '3 - 5 Years',
        ctc: '₹13 - ₹17.5 LPA',
        location: 'Chennai / Bengaluru',
        workType: 'Hybrid',
        keySkills: ['FastAPI / REST', 'Python & Scripting', 'PostgreSQL'],
        description: 'Design robust CRM integrations and webhook synchronizers for Fortune 500 enterprise clients.',
      },
      {
        id: 'frsh-2',
        title: 'Customer Solutions Architect',
        experience: '3.5 - 6 Years',
        ctc: '₹15 - ₹19 LPA',
        location: 'Remote',
        workType: 'Remote',
        keySkills: ['Python & Scripting', 'ITIL / Incident Mgmt', 'FastAPI / REST'],
        description: 'Lead technical deep-dives and custom API middleware development for high-tier SaaS accounts.',
      },
    ],
  },
  {
    id: 'barclays',
    name: 'Barclays Global Tech (GCC)',
    badge: 'BARC',
    badgeColor: 'bg-sky-600 text-white',
    category: 'Global GCC / Banking',
    targetRole: 'Lead Operations Automation Engineer',
    ctcBracket: '₹12 - ₹16.5 LPA',
    avgHikePct: '+45% to +60%',
    requiredSkills: ['Python & Scripting', 'AWS / Cloud Infrastructure', 'CI/CD & Jenkins', 'ITIL / Incident Mgmt'],
    interviewType: 'Core Python + Cloud Support + Scenario Round',
    hiringDifficulty: 'Standard (3 Rounds)',
    referralStrategy: 'Barclays hires actively for Pune/Noida GCC hubs. High acceptance rate for 3-5 YoE support engineers with Python skills.',
    location: 'Pune / Noida',
    careerPortalUrl: 'https://search.jobs.barclays/',
    companyOverview: 'Tier-1 British multinational bank managing millions of daily financial transactions with cutting-edge cloud infrastructure in Pune and Noida.',
    cultureHighlights: ['Exceptional work-life balance', 'Structured annual compensation revisions', 'Global mobility opportunities'],
    interviewRounds: [
      'Round 1: Python, Shell Scripting & Linux Fundamentals',
      'Round 2: Cloud Infrastructure & Incident Recovery Simulation',
      'Round 3: Values & Stakeholder Management Round',
    ],
    openings: [
      {
        id: 'barc-1',
        title: 'Lead Operations Automation Engineer',
        experience: '3 - 6 Years',
        ctc: '₹12 - ₹16.5 LPA',
        location: 'Pune / Noida',
        workType: 'Hybrid',
        keySkills: ['Python & Scripting', 'AWS / Cloud Infrastructure', 'CI/CD & Jenkins'],
        description: 'Automate legacy banking batch jobs into containerized cloud workflows with zero downtime.',
      },
    ],
  },
  {
    id: 'sarvam',
    name: 'Sarvam AI',
    badge: 'SRV',
    badgeColor: 'bg-emerald-600 text-white',
    category: 'AI & Next-Gen',
    targetRole: 'GenAI Applications Engineer',
    ctcBracket: '₹16 - ₹22 LPA',
    avgHikePct: '+70% to +100%',
    requiredSkills: ['LangChain & GenAI RAG', 'ChromaDB / Vector Search', 'FastAPI / REST', 'Python & Scripting'],
    interviewType: 'RAG PoC Review + LLM Prompt Optimization',
    hiringDifficulty: 'Fast-Track (2 Rounds)',
    referralStrategy: 'Demo your ChromaDB document assistant live during interview. AI startups value working demo apps over DSA grinding.',
    location: 'Bengaluru / Remote',
    careerPortalUrl: 'https://www.sarvam.ai/careers',
    companyOverview: 'Pioneering Indian Generative AI lab developing foundational Indic language models and enterprise agentic systems.',
    cultureHighlights: ['Cutting-edge LLM research & deployment', 'High equity grants', 'Flat startup hierarchy'],
    interviewRounds: [
      'Round 1: Hands-on Vector Search & RAG Architecture Review',
      'Round 2: Founders Discussion & Production Scaling Round',
    ],
    openings: [
      {
        id: 'srv-1',
        title: 'GenAI Solutions Engineer',
        experience: '2 - 5 Years',
        ctc: '₹16 - ₹22 LPA',
        location: 'Bengaluru / Remote',
        workType: 'Remote',
        keySkills: ['LangChain & GenAI RAG', 'ChromaDB / Vector Search', 'FastAPI / REST', 'Python & Scripting'],
        description: 'Build enterprise knowledge retrieval agents using hybrid vector search and local Indic LLMs.',
      },
    ],
  },
  {
    id: 'lowes',
    name: "Lowe's India (Retail GCC)",
    badge: 'LOW',
    badgeColor: 'bg-indigo-600 text-white',
    category: 'Global GCC / Banking',
    targetRole: 'Senior SRE / Platform Automation Engineer',
    ctcBracket: '₹13.5 - ₹18 LPA',
    avgHikePct: '+50% to +65%',
    requiredSkills: ['Docker & Containers', 'Kubernetes / CI/CD', 'AWS / Cloud Infrastructure', 'Python & Scripting'],
    interviewType: 'Cloud Infra + Container Troubleshooting + Culture',
    hiringDifficulty: 'Standard (3 Rounds)',
    referralStrategy: 'Target lateral hiring sprints via Lowe’s careers portal and employee referrals.',
    location: 'Bengaluru / Hybrid',
    careerPortalUrl: 'https://jobs.lowes.com/india',
    companyOverview: 'Global retail giant transforming omni-channel e-commerce supply chain through high-performance engineering in Bengaluru.',
    cultureHighlights: ['Strong engineering culture', 'Great employee healthcare', 'Generous joining & notice buyout budgets'],
    interviewRounds: [
      'Round 1: Kubernetes, Container Networking & Scripting',
      'Round 2: Cloud Production Triage & Observability',
      'Round 3: Behavioral & Architecture Lead Interview',
    ],
    openings: [
      {
        id: 'low-1',
        title: 'Senior SRE / Platform Automation',
        experience: '3.5 - 6 Years',
        ctc: '₹13.5 - ₹18 LPA',
        location: 'Bengaluru',
        workType: 'Hybrid',
        keySkills: ['Docker & Containers', 'Kubernetes / CI/CD', 'AWS / Cloud Infrastructure'],
        description: 'Maintain supply chain platform reliability and automate CI/CD pipelines across 2,000+ stores.',
      },
    ],
  },
  {
    id: 'swiggy',
    name: 'Swiggy',
    badge: 'SWG',
    badgeColor: 'bg-orange-500 text-white',
    category: 'Product Unicorn',
    targetRole: 'Operations Tech Specialist / DevOps Associate',
    ctcBracket: '₹15 - ₹20 LPA',
    avgHikePct: '+60% to +85%',
    requiredSkills: ['Docker & Containers', 'Kubernetes / CI/CD', 'Python & Scripting', 'FastAPI / REST'],
    interviewType: 'Live Production Incident Simulation + Scripting',
    hiringDifficulty: 'Fast-Track (2 Rounds)',
    referralStrategy: 'Apply via tech leads on LinkedIn citing real-time incident automation projects.',
    location: 'Bengaluru / Hyderabad',
    careerPortalUrl: 'https://careers.swiggy.com/',
    companyOverview: 'India leading on-demand convenience platform powering food delivery, Instamart groceries, and hyperlocal logistics.',
    cultureHighlights: ['High-scale distributed systems', 'Remote-first / flexible work policies', 'Rapid meritocratic growth'],
    interviewRounds: [
      'Round 1: Real-time Incident Scripting & Live Troubleshooting',
      'Round 2: Scalability Architecture & Managerial Fit',
    ],
    openings: [
      {
        id: 'swg-1',
        title: 'DevOps & Automation Associate',
        experience: '2.5 - 5 Years',
        ctc: '₹15 - ₹20 LPA',
        location: 'Bengaluru / Remote',
        workType: 'Hybrid',
        keySkills: ['Docker & Containers', 'Kubernetes / CI/CD', 'Python & Scripting'],
        description: 'Ensure 99.99% uptime for order dispatch microservices during peak dinner and festive surges.',
      },
    ],
  },
]

const ALL_AVAILABLE_SKILLS = [
  'Python & Scripting',
  'FastAPI / REST',
  'LangChain & GenAI RAG',
  'ChromaDB / Vector Search',
  'Docker & Containers',
  'Kubernetes / CI/CD',
  'AWS / Cloud Infrastructure',
  'PostgreSQL',
  'ITIL / Incident Mgmt',
  'CI/CD & Jenkins',
]

export default function StayOrSwitchAnalysis() {
  const profile = useProfileStore((s) => s.profile)

  const [currentCTC, setCurrentCTC] = useState<number>(profile?.current_salary_lpa || 6.8)
  const [internalHikePct, setInternalHikePct] = useState<number>(8)
  const [switchHikePct, setSwitchHikePct] = useState<number>(45)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'Python & Scripting',
    'FastAPI / REST',
    'Docker & Containers',
  ])
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Modal State
  const [selectedCompany, setSelectedCompany] = useState<SwitchCompany | null>(null)
  const [applyingJob, setApplyingJob] = useState<ActiveJobOpening | null>(null)
  const [applicationSubmitted, setApplicationSubmitted] = useState<boolean>(false)

  // Fast-track form state
  const [formName, setFormName] = useState<string>(profile?.name || 'Vibha Rajput')
  const [formEmail, setFormEmail] = useState<string>(profile?.email || 'vibha@example.com')
  const [formPhone, setFormPhone] = useState<string>('+91 98765 43210')
  const [formNotice, setFormNotice] = useState<string>('30 Days (Buyout Negotiable)')
  const [formGithub, setFormGithub] = useState<string>('https://github.com/vibharajputt/rag-triage-poc')
  const [formNote, setFormNote] = useState<string>(
    'Experienced in Python automation, FastAPI microservices, and Docker. Looking for immediate lateral elevation.'
  )
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Calculations
  const internalNewCTC = Number((currentCTC * (1 + internalHikePct / 100)).toFixed(1))
  const switchNewCTC = Number((currentCTC * (1 + switchHikePct / 100)).toFixed(1))
  const threeYearInternal = Number(
    (currentCTC * (1 + internalHikePct / 100 + Math.pow(1 + internalHikePct / 100, 2) + Math.pow(1 + internalHikePct / 100, 3))).toFixed(1)
  )
  const threeYearSwitch = Number(
    (switchNewCTC * (1 + 0.12 + Math.pow(1.12, 2) + Math.pow(1.12, 3))).toFixed(1)
  )
  const differenceWealth = Number((threeYearSwitch - threeYearInternal).toFixed(1))

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  // Filtered Companies
  const filteredCompanies = useMemo(() => {
    return SWITCH_TARGET_COMPANIES.map((comp) => {
      const matched = comp.requiredSkills.filter((s) => selectedSkills.includes(s))
      const matchPct = Math.round((matched.length / comp.requiredSkills.length) * 100)
      return { ...comp, matchPct, matchedSkills: matched }
    })
      .filter((comp) => {
        if (categoryFilter === 'all') return true
        if (categoryFilter === 'high_match') return comp.matchPct >= 60
        if (categoryFilter === 'product') return comp.category === 'Product Unicorn'
        if (categoryFilter === 'gcc') return comp.category === 'Global GCC / Banking'
        if (categoryFilter === 'ai') return comp.category === 'AI & Next-Gen'
        return true
      })
      .filter((comp) => {
        if (!searchQuery.trim()) return true
        const q = searchQuery.toLowerCase()
        return (
          comp.name.toLowerCase().includes(q) ||
          comp.targetRole.toLowerCase().includes(q) ||
          comp.location.toLowerCase().includes(q) ||
          comp.requiredSkills.some((s) => s.toLowerCase().includes(q))
        )
      })
      .sort((a, b) => b.matchPct - a.matchPct)
  }, [selectedSkills, categoryFilter, searchQuery])

  const highMatchCount = filteredCompanies.filter((c) => c.matchPct >= 60).length

  // Submit Application Handler
  const handleFastTrackApply = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setApplicationSubmitted(true)
    }, 800)
  }

  const openCompanyModal = (comp: SwitchCompany) => {
    setSelectedCompany(comp)
    setApplyingJob(null)
    setApplicationSubmitted(false)
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xs space-y-7">
      {/* ── 1. Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/60 dark:to-emerald-950/60 text-[#0B4F9C] dark:text-sky-300 text-xs font-black mb-1.5 border border-blue-200/50">
            <Scale size={13} className="text-[#0B4F9C]" />
            <span>Stay vs Switch Strategic Decision Suite</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Internal Growth vs External Lateral Switch Simulator
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            Compare 3-year compounding earnings between staying in your current band vs targeting an external lateral switch (+45% to +85% hike). Click any company below to view active verified openings and apply directly.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/40 dark:to-slate-800 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800 shrink-0">
          <div className="text-right px-2">
            <div className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300">
              3-Year Wealth Upside
            </div>
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              +₹{differenceWealth} Lakhs
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Interactive Calculator Sliders ── */}
      <div className="p-5 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
          Interactive Scenario Parameters:
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-600 dark:text-slate-300">Current Salary</span>
              <span className="text-slate-900 dark:text-white font-black">₹{currentCTC} LPA</span>
            </div>
            <input
              type="range"
              min="4.0"
              max="15.0"
              step="0.2"
              value={currentCTC}
              onChange={(e) => setCurrentCTC(parseFloat(e.target.value))}
              className="w-full accent-[#0B4F9C] cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-600 dark:text-slate-300">Internal Annual Hike</span>
              <span className="text-slate-700 dark:text-slate-300 font-bold">{internalHikePct}% (₹{internalNewCTC} LPA)</span>
            </div>
            <input
              type="range"
              min="5"
              max="15"
              step="1"
              value={internalHikePct}
              onChange={(e) => setInternalHikePct(parseInt(e.target.value))}
              className="w-full accent-slate-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-600 dark:text-slate-300">External Switch Hike</span>
              <span className="text-emerald-600 font-black">+{switchHikePct}% (₹{switchNewCTC} LPA)</span>
            </div>
            <input
              type="range"
              min="20"
              max="80"
              step="5"
              value={switchHikePct}
              onChange={(e) => setSwitchHikePct(parseInt(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* ── 3. Target Companies Radar Section ── */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white space-y-6 shadow-md border border-blue-900/40">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 size={18} className="text-amber-400" />
              <h4 className="text-sm font-black uppercase tracking-wider text-amber-400">
                Target Companies Matching Your Skills (Click Any Card to Open Details & Apply)
              </h4>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl font-medium">
              Select verified skills below to unlock high-match companies. Click any company card to inspect culture, interview rounds, active openings, and submit a direct application form.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700 shrink-0">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Unlocked Targets</div>
              <div className="text-base font-black text-emerald-400">
                {highMatchCount} Companies Ready
              </div>
            </div>
            <div className="h-8 w-[1px] bg-slate-700" />
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Salary Bracket</div>
              <div className="text-base font-black text-amber-300">
                ₹12 – ₹22 LPA
              </div>
            </div>
          </div>
        </div>

        {/* Skill Selector Tags */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Zap size={14} className="text-amber-400" />
              <span>Tap to Toggle Your Verified / In-Progress Skills:</span>
            </span>
            <span className="text-[11px] text-slate-400 font-semibold">
              {selectedSkills.length} of {ALL_AVAILABLE_SKILLS.length} Skills Active
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {ALL_AVAILABLE_SKILLS.map((skill) => {
              const isSelected = selectedSkills.includes(skill)
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xs scale-[1.02]'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
                  }`}
                >
                  {isSelected ? (
                    <CheckCircle2 size={13} className="text-white shrink-0" />
                  ) : (
                    <Circle size={13} className="text-slate-500 shrink-0" />
                  )}
                  <span>{skill}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search companies, roles, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mr-1 shrink-0">
              <Filter size={11} /> Filter:
            </span>
            {[
              { id: 'all', label: 'All Targets' },
              { id: 'high_match', label: 'High Match (≥60%)' },
              { id: 'product', label: 'Product Unicorns' },
              { id: 'gcc', label: 'Global GCCs' },
              { id: 'ai', label: 'GenAI & Next-Gen' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setCategoryFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  categoryFilter === f.id
                    ? 'bg-amber-400 text-slate-900 shadow-xs'
                    : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Company Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((comp) => {
              const isHighMatch = comp.matchPct >= 60

              return (
                <div
                  key={comp.id}
                  onClick={() => openCompanyModal(comp)}
                  className={`p-5 rounded-3xl transition-all border cursor-pointer space-y-4 relative overflow-hidden group hover:scale-[1.01] hover:shadow-lg ${
                    isHighMatch
                      ? 'bg-slate-800/90 border-emerald-500/50 hover:border-emerald-400'
                      : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-500'
                  }`}
                >
                  {/* Top Bar: Company Badge & Match Pill */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-2xl ${comp.badgeColor} flex items-center justify-center font-black text-sm shadow-md shrink-0`}
                      >
                        {comp.badge}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-black text-base text-white group-hover:text-amber-300 transition">
                            {comp.name}
                          </h5>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-700/90 text-slate-300">
                            {comp.category}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 font-semibold mt-0.5">
                          {comp.targetRole}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-xs font-black px-2.5 py-1 rounded-full ${
                          comp.matchPct >= 75
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : comp.matchPct >= 50
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {comp.matchPct}% Match
                      </span>
                    </div>
                  </div>

                  {/* Compensation & Switch Hike Banner */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/90 border border-slate-700/70 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <TrendingUp size={14} />
                      <span>{comp.ctcBracket}</span>
                    </div>
                    <div className="font-extrabold text-amber-300">
                      {comp.avgHikePct} Hike
                    </div>
                    <div className="text-slate-400 text-[11px] flex items-center gap-1">
                      <MapPin size={12} />
                      <span>{comp.location}</span>
                    </div>
                  </div>

                  {/* Skills Matching Breakdown */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      Skill Compatibility:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {comp.requiredSkills.map((s) => {
                        const hasSkill = selectedSkills.includes(s)
                        return (
                          <span
                            key={s}
                            className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 ${
                              hasSkill
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/50'
                                : 'bg-slate-900/90 text-rose-300/80 border border-rose-800/40'
                            }`}
                          >
                            {hasSkill ? '✓' : '⚠️ Need:'} {s}
                          </span>
                        )
                      })}
                    </div>
                  </div>

                  {/* Action CTA Bar */}
                  <div className="pt-1 flex items-center justify-between border-t border-slate-700/60 text-xs">
                    <span className="text-[11px] text-amber-300 font-bold flex items-center gap-1">
                      <Briefcase size={12} />
                      <span>{comp.openings.length} Active Verified Roles</span>
                    </span>

                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
                    >
                      <span>View & Apply</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="col-span-2 p-8 text-center bg-slate-800/40 rounded-3xl border border-slate-700 text-slate-400 space-y-2">
              <p className="text-sm font-bold">No companies found matching the filter criteria.</p>
              <p className="text-xs">Try selecting more skills above or clearing the search query.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── 4. POPUP MODAL: Interactive Company Openings & Direct Application ── */}
      <AnimatePresence>
        {selectedCompany && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/80 dark:bg-slate-850">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl ${selectedCompany.badgeColor} flex items-center justify-center font-black text-base shadow-md shrink-0`}
                  >
                    {selectedCompany.badge}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                        {selectedCompany.name}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-[#0B4F9C] dark:text-sky-300">
                        {selectedCompany.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      📍 {selectedCompany.location} • Typical Package: <strong className="text-emerald-600 dark:text-emerald-400">{selectedCompany.ctcBracket}</strong>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCompany(null)}
                  className="p-2 rounded-xl bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 transition cursor-pointer shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-900 dark:text-white">
                {/* 1. Overview & Perks */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#0B4F9C] dark:text-sky-400">
                    Company Overview & Culture:
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {selectedCompany.companyOverview}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedCompany.cultureHighlights.map((c, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-semibold flex items-center gap-1"
                      >
                        <Sparkles size={11} className="text-amber-500" />
                        <span>{c}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* 2. Interview Process */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>Hiring Process ({selectedCompany.hiringDifficulty}):</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {selectedCompany.interviewRounds.map((round, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium space-y-1"
                      >
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block uppercase">
                          Stage {idx + 1}
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 leading-tight">
                          {round}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Active Openings */}
                {!applyingJob && !applicationSubmitted && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Briefcase size={14} className="text-[#0B4F9C]" />
                        <span>Active Verified Openings at {selectedCompany.name}:</span>
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200">
                        {selectedCompany.openings.length} Positions Available
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {selectedCompany.openings.map((job) => (
                        <div
                          key={job.id}
                          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-3 hover:border-[#0B4F9C] transition shadow-xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <h5 className="font-black text-sm text-slate-900 dark:text-white">
                                {job.title}
                              </h5>
                              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                <span className="flex items-center gap-1">
                                  <Clock size={12} /> {job.experience}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <MapPin size={12} /> {job.location} ({job.workType})
                                </span>
                              </div>
                            </div>

                            <div className="text-left sm:text-right">
                              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 block">
                                {job.ctc}
                              </span>
                              <span className="text-[10px] text-slate-400 font-semibold">
                                Lateral Target Band
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                            {job.description}
                          </p>

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex flex-wrap gap-1">
                              {job.keySkills.map((sk) => (
                                <span
                                  key={sk}
                                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                                >
                                  {sk}
                                </span>
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setApplyingJob(job)
                                setApplicationSubmitted(false)
                              }}
                              className="px-4 py-2 rounded-xl bg-[#0B4F9C] hover:bg-blue-800 text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Send size={12} />
                              <span>Apply Directly Now</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Direct Application Form */}
                {applyingJob && !applicationSubmitted && (
                  <form
                    onSubmit={handleFastTrackApply}
                    className="p-5 rounded-3xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-200 dark:border-blue-900/60 space-y-4 animate-in fade-in duration-150"
                  >
                    <div className="flex items-center justify-between border-b border-blue-200/80 dark:border-slate-700 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#0B4F9C] dark:text-sky-400">
                          Fast-Track Application
                        </span>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          Applying for: {applyingJob.title}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setApplyingJob(null)}
                        className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      >
                        ← Back to Openings
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0B4F9C] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={formEmail}
                          onChange={(e) => setFormEmail(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0B4F9C] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          required
                          value={formPhone}
                          onChange={(e) => setFormPhone(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0B4F9C] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Notice Period & Availability
                        </label>
                        <input
                          type="text"
                          required
                          value={formNotice}
                          onChange={(e) => setFormNotice(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0B4F9C] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        GitHub / Project Proof URL (Automated Microservice / ChromaDB PoC)
                      </label>
                      <input
                        type="url"
                        value={formGithub}
                        onChange={(e) => setFormGithub(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0B4F9C] outline-none"
                        placeholder="https://github.com/your-username/poc"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        1-Liner Executive Impact Pitch (Why you are ideal for this role):
                      </label>
                      <textarea
                        rows={2}
                        value={formNote}
                        onChange={(e) => setFormNote(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0B4F9C] outline-none resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setApplyingJob(null)}
                        className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-5 py-2.5 rounded-xl bg-[#0B4F9C] hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        {isSubmitting ? (
                          <span>Submitting...</span>
                        ) : (
                          <>
                            <Send size={13} />
                            <span>Submit Fast-Track Application</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* 5. Success Confirmation Screen */}
                {applicationSubmitted && (
                  <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-4 animate-in zoom-in-95 duration-200">
                    <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                      <Check size={28} />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base sm:text-lg font-black text-emerald-900 dark:text-emerald-200">
                        Application Successfully Forwarded to Referral Pipeline!
                      </h4>
                      <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto font-medium">
                        Your profile and project proof have been registered for <strong>{applyingJob?.title || 'Selected Role'}</strong> at <strong>{selectedCompany.name}</strong>.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-xs text-slate-700 dark:text-slate-300 max-w-md mx-auto space-y-1">
                      <div className="font-bold flex items-center justify-center gap-1.5 text-slate-900 dark:text-white">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span>Next Recommended Step:</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        {selectedCompany.referralStrategy}
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                      <a
                        href={selectedCompany.careerPortalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                      >
                        <span>Visit {selectedCompany.name} Career Portal</span>
                        <ExternalLink size={12} />
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          setApplyingJob(null)
                          setApplicationSubmitted(false)
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition"
                      >
                        View Other Roles
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850 text-xs">
                <a
                  href={selectedCompany.careerPortalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-[#0B4F9C] dark:text-sky-400 hover:underline flex items-center gap-1"
                >
                  <span>Official Careers Portal</span>
                  <ExternalLink size={12} />
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedCompany(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 5. Strategic Execution Playbook ── */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-amber-400" />
          <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
            The Optimal Strategy: Parallel Upskilling with Zero Career Downtime
          </h4>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          Do not quit your job prematurely. Spend 4 weeks executing the <strong>30-Day Stagnation Sprint</strong> (building 1 ticket deflection bot + 1 internal ChromaDB search tool). Once your proof projects are deployed on GitHub, apply laterally to 8 target tech firms listed above. If you receive an offer of ₹{switchNewCTC} LPA, you can either negotiate internally with leverage or make the transition with complete financial security.
        </p>

        <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800">
          <span className="text-slate-400">Check open lateral roles in Jobs & Salary.</span>
          <Link
            to="/jobs"
            className="font-bold text-sky-400 hover:text-white flex items-center gap-1 transition"
          >
            <span>Explore High-Growth Lateral Jobs</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}
