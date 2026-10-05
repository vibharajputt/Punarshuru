import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Plus,
  Check,
  Zap,
  Building2,
  Search,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Layers,
  Code2,
} from 'lucide-react'
import { Link } from 'react-router-dom'

export interface TargetCompany {
  name: string
  logoInitial: string
  logoBg: string
  category: 'Product Unicorn' | 'Global Tech & GCC' | 'AI & Fast-Growth' | 'Enterprise Tech'
  packageLPA: string
  hiringChannel: string
  whyTheyHire: string
  matchingSkill: string
}

export interface SimSkill {
  name: string
  category: string
  hoursToLearn: number
  unlockedRoles: string[]
  salaryBoostLPA: number
  gapReductionPct: number
  keyProject: string
  topCompanies: TargetCompany[]
}

const AVAILABLE_SIM_SKILLS: SimSkill[] = [
  {
    name: 'AWS Cloud Essentials',
    category: 'Cloud Infrastructure',
    hoursToLearn: 25,
    unlockedRoles: ['Cloud Support Associate', 'Junior DevOps Engineer', 'Backend + Cloud SWE'],
    salaryBoostLPA: 2.5,
    gapReductionPct: 18,
    keyProject: 'Deploy containerized FastAPI service on AWS ECS with RDS PostgreSQL',
    topCompanies: [
      {
        name: 'Amazon Web Services (AWS)',
        logoInitial: 'AWS',
        logoBg: 'bg-amber-500 text-white',
        category: 'Global Tech & GCC',
        packageLPA: '₹14 - ₹24 LPA',
        hiringChannel: 'AWS Cloud Associate Drive / Campus',
        whyTheyHire: 'Tests foundational AWS VPC, IAM, S3, and ECS deployment in technical rounds.',
        matchingSkill: 'AWS Cloud Essentials',
      },
      {
        name: 'Razorpay',
        logoInitial: 'RZP',
        logoBg: 'bg-blue-600 text-white',
        category: 'Product Unicorn',
        packageLPA: '₹12 - ₹18 LPA',
        hiringChannel: 'Off-Campus Tech Sprint / Referral',
        whyTheyHire: 'Requires engineers comfortable with scalable AWS infrastructure for payment gateways.',
        matchingSkill: 'AWS Cloud Essentials',
      },
      {
        name: 'PhonePe',
        logoInitial: 'PP',
        logoBg: 'bg-purple-600 text-white',
        category: 'Product Unicorn',
        packageLPA: '₹13 - ₹20 LPA',
        hiringChannel: 'Hackathon & Campus Drives',
        whyTheyHire: 'Evaluates cloud latency tuning and microservices deployed on AWS/GCP.',
        matchingSkill: 'AWS Cloud Essentials',
      },
      {
        name: 'Infosys Cobalt Cloud',
        logoInitial: 'INF',
        logoBg: 'bg-sky-600 text-white',
        category: 'Enterprise Tech',
        packageLPA: '₹7 - ₹10 LPA (Specialist)',
        hiringChannel: 'InfyTQ & HackWithInfy Specialist Track',
        whyTheyHire: 'Dedicated cloud enterprise migration teams hiring freshers with AWS certifications.',
        matchingSkill: 'AWS Cloud Essentials',
      },
    ],
  },
  {
    name: 'Docker & Microservices',
    category: 'DevOps & Architecture',
    hoursToLearn: 20,
    unlockedRoles: ['Junior Fullstack Engineer', 'Platform Engineering Intern', 'Site Reliability Associate'],
    salaryBoostLPA: 1.8,
    gapReductionPct: 14,
    keyProject: 'Multi-service architecture with Redis caching and Docker Compose',
    topCompanies: [
      {
        name: 'Swiggy',
        logoInitial: 'SWG',
        logoBg: 'bg-orange-500 text-white',
        category: 'Product Unicorn',
        packageLPA: '₹12 - ₹18 LPA',
        hiringChannel: 'Early Engineering Drive',
        whyTheyHire: 'Microservices containerization is mandatory across their logistics dispatch engine.',
        matchingSkill: 'Docker & Microservices',
      },
      {
        name: 'Postman',
        logoInitial: 'PST',
        logoBg: 'bg-rose-500 text-white',
        category: 'Product Unicorn',
        packageLPA: '₹16 - ₹26 LPA',
        hiringChannel: 'Open Source Contributions & Off-Campus',
        whyTheyHire: 'Strong emphasis on API lifecycle, containerized testing, and Docker workflows.',
        matchingSkill: 'Docker & Microservices',
      },
      {
        name: 'Zepto',
        logoInitial: 'ZPT',
        logoBg: 'bg-purple-700 text-white',
        category: 'AI & Fast-Growth',
        packageLPA: '₹11 - ₹17 LPA',
        hiringChannel: 'Referrals & Direct Coding Challenges',
        whyTheyHire: 'Fast-paced deployments require containerized local and CI/CD environments.',
        matchingSkill: 'Docker & Microservices',
      },
      {
        name: 'Jio Platforms',
        logoInitial: 'JIO',
        logoBg: 'bg-blue-800 text-white',
        category: 'Enterprise Tech',
        packageLPA: '₹8 - ₹12 LPA',
        hiringChannel: 'Jio Tech Graduate Program',
        whyTheyHire: 'Building sovereign cloud services and telco-scale containerized backends.',
        matchingSkill: 'Docker & Microservices',
      },
    ],
  },
  {
    name: 'GenAI & LangChain / Embeddings',
    category: 'Emerging AI',
    hoursToLearn: 30,
    unlockedRoles: ['Junior AI/ML Engineer', 'Applied GenAI Developer', 'RAG Pipeline Engineer'],
    salaryBoostLPA: 3.8,
    gapReductionPct: 22,
    keyProject: 'Document search bot with Vector DB retrieval & Gemini 1.5 Flash',
    topCompanies: [
      {
        name: 'Sarvam AI',
        logoInitial: 'SRV',
        logoBg: 'bg-emerald-600 text-white',
        category: 'AI & Fast-Growth',
        packageLPA: '₹15 - ₹28 LPA',
        hiringChannel: 'AI Residency & Direct Evaluation',
        whyTheyHire: 'Pioneering Indic foundational LLMs and RAG architectures for Indian languages.',
        matchingSkill: 'GenAI & LangChain / Embeddings',
      },
      {
        name: 'Microsoft India AI Labs',
        logoInitial: 'MSFT',
        logoBg: 'bg-blue-600 text-white',
        category: 'Global Tech & GCC',
        packageLPA: '₹18 - ₹32 LPA',
        hiringChannel: 'Microsoft Engage & Off-Campus AI Sprint',
        whyTheyHire: 'Azure OpenAI enterprise integration and Copilot developer extensions.',
        matchingSkill: 'GenAI & LangChain / Embeddings',
      },
      {
        name: 'Fractal Analytics',
        logoInitial: 'FRC',
        logoBg: 'bg-indigo-600 text-white',
        category: 'AI & Fast-Growth',
        packageLPA: '₹10 - ₹16 LPA',
        hiringChannel: 'Campus AI League & Hackathons',
        whyTheyHire: 'Building production GenAI chatbots and automated data synthesis for Fortune 500.',
        matchingSkill: 'GenAI & LangChain / Embeddings',
      },
      {
        name: 'Krutrim AI',
        logoInitial: 'KRM',
        logoBg: 'bg-teal-600 text-white',
        category: 'AI & Fast-Growth',
        packageLPA: '₹12 - ₹20 LPA',
        hiringChannel: 'Ola Krutrim AI Fellowship',
        whyTheyHire: 'Scaling generative AI services, token inference pipelines, and autonomous agent loops.',
        matchingSkill: 'GenAI & LangChain / Embeddings',
      },
    ],
  },
  {
    name: 'TypeScript & Next.js 15',
    category: 'Frontend & Fullstack',
    hoursToLearn: 25,
    unlockedRoles: ['Frontend Developer', 'Product Engineer (Fullstack)', 'UI Platform Engineer'],
    salaryBoostLPA: 2.0,
    gapReductionPct: 15,
    keyProject: 'Responsive SaaS dashboard with Server Actions, Tailwind UI, and OAuth',
    topCompanies: [
      {
        name: 'CRED',
        logoInitial: 'CRD',
        logoBg: 'bg-black text-white border border-slate-700',
        category: 'Product Unicorn',
        packageLPA: '₹15 - ₹25 LPA',
        hiringChannel: 'CRED Fellowship & Creative Dev Sprint',
        whyTheyHire: 'Obsessed with fluid web performance, high-fidelity UI, and modern React/TS architecture.',
        matchingSkill: 'TypeScript & Next.js 15',
      },
      {
        name: 'Groww',
        logoInitial: 'GRW',
        logoBg: 'bg-teal-500 text-white',
        category: 'Product Unicorn',
        packageLPA: '₹12 - ₹18 LPA',
        hiringChannel: 'Off-Campus Fullstack Drives',
        whyTheyHire: 'High-traffic fintech web portals demand rock-solid TypeScript and server-rendered Next.js.',
        matchingSkill: 'TypeScript & Next.js 15',
      },
      {
        name: 'Zerodha',
        logoInitial: 'ZRD',
        logoBg: 'bg-blue-700 text-white',
        category: 'Product Unicorn',
        packageLPA: '₹14 - ₹22 LPA',
        hiringChannel: 'Open Source Proofs & Direct Challenge',
        whyTheyHire: 'Focus on clean, lightweight, resilient web engineering with zero bloat.',
        matchingSkill: 'TypeScript & Next.js 15',
      },
      {
        name: 'BrowserStack',
        logoInitial: 'BST',
        logoBg: 'bg-sky-500 text-white',
        category: 'Global Tech & GCC',
        packageLPA: '₹14 - ₹20 LPA',
        hiringChannel: 'Product Engineering Drives',
        whyTheyHire: 'Building global developer testing cloud interfaces and dashboard systems.',
        matchingSkill: 'TypeScript & Next.js 15',
      },
    ],
  },
  {
    name: 'FastAPI, SQL & Vector DBs',
    category: 'Backend & Data',
    hoursToLearn: 22,
    unlockedRoles: ['Backend API Specialist', 'Junior Data Engineer', 'Database Platform Associate'],
    salaryBoostLPA: 2.2,
    gapReductionPct: 16,
    keyProject: 'High-throughput semantic search API with PostgreSQL pgvector & FastAPI',
    topCompanies: [
      {
        name: 'Flipkart',
        logoInitial: 'FK',
        logoBg: 'bg-yellow-500 text-blue-950 font-black',
        category: 'Product Unicorn',
        packageLPA: '₹14 - ₹22 LPA',
        hiringChannel: 'Flipkart GRiD Challenge & Campus',
        whyTheyHire: 'Catalog search, inventory indexing, and real-time backend API throughput.',
        matchingSkill: 'FastAPI, SQL & Vector DBs',
      },
      {
        name: 'Juspay',
        logoInitial: 'JSP',
        logoBg: 'bg-indigo-700 text-white',
        category: 'Product Unicorn',
        packageLPA: '₹13 - ₹20 LPA',
        hiringChannel: 'Hiring Challenges / Pure Tech Rounds',
        whyTheyHire: 'High-concurrency payment routing and deep functional programming + SQL knowledge.',
        matchingSkill: 'FastAPI, SQL & Vector DBs',
      },
      {
        name: 'Freshworks',
        logoInitial: 'FRW',
        logoBg: 'bg-orange-600 text-white',
        category: 'Global Tech & GCC',
        packageLPA: '₹11 - ₹17 LPA',
        hiringChannel: 'Off-Campus & Campus Drives',
        whyTheyHire: 'Multi-tenant SaaS backend APIs and enterprise CRM search integrations.',
        matchingSkill: 'FastAPI, SQL & Vector DBs',
      },
    ],
  },
]

export default function WhatIfSimulator() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'AWS Cloud Essentials',
    'GenAI & LangChain / Embeddings',
  ])
  const [companyCategoryFilter, setCompanyCategoryFilter] = useState<string>('All')
  const [searchCompany, setSearchCompany] = useState<string>('')

  const toggleSkill = (skillName: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skillName)
        ? prev.length > 1
          ? prev.filter((s) => s !== skillName)
          : prev // Keep at least one skill selected for meaningful comparison
        : [...prev, skillName]
    )
  }

  // Calculate simulated boosts
  const activeSimObjects = AVAILABLE_SIM_SKILLS.filter((s) => selectedSkills.includes(s.name))
  const totalBoostLPA = activeSimObjects.reduce((acc, s) => acc + s.salaryBoostLPA, 0)
  const totalGapReduction = Math.min(65, activeSimObjects.reduce((acc, s) => acc + s.gapReductionPct, 0))
  const unlockedRolesList = Array.from(new Set(activeSimObjects.flatMap((s) => s.unlockedRoles)))
  const baseSalary = 4.5
  const simulatedSalary = (baseSalary + totalBoostLPA).toFixed(1)
  const baseReadiness = 52
  const simulatedReadiness = Math.min(96, baseReadiness + totalGapReduction)

  // Aggregate and deduplicate companies unlocked by currently selected skills
  const allUnlockedCompanies = useMemo(() => {
    const map = new Map<string, TargetCompany>()
    activeSimObjects.forEach((s) => {
      s.topCompanies.forEach((comp) => {
        if (!map.has(comp.name)) {
          map.set(comp.name, comp)
        }
      })
    })
    return Array.from(map.values())
  }, [activeSimObjects])

  // Filter companies based on category & search term
  const filteredCompanies = useMemo(() => {
    return allUnlockedCompanies.filter((comp) => {
      const matchesCategory =
        companyCategoryFilter === 'All' || comp.category === companyCategoryFilter
      const matchesSearch =
        comp.name.toLowerCase().includes(searchCompany.toLowerCase()) ||
        comp.matchingSkill.toLowerCase().includes(searchCompany.toLowerCase()) ||
        comp.hiringChannel.toLowerCase().includes(searchCompany.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [allUnlockedCompanies, companyCategoryFilter, searchCompany])

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-950/60 dark:to-orange-950/60 text-[#0B4F9C] dark:text-sky-300 text-xs font-black mb-1.5 border border-blue-200/50">
            <Zap size={13} className="text-[#F26B1D]" />
            <span>Interactive Simulator • "What If I Learn X?"</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Simulate Your Skills, Unlocked Companies & Salary
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            Select high-demand skills to instantly see which top tech companies unlock for you, their exact fresher package ranges, and recommended proof projects.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70">
            Live Market Intelligence
          </span>
        </div>
      </div>

      {/* ── 1. Interactive Skill Chips Selector ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Code2 size={14} className="text-[#0B4F9C]" />
            <span>Select Skills to Simulate (Click to Toggle):</span>
          </div>
          <span className="text-xs font-bold text-[#0B4F9C] dark:text-sky-400">
            {selectedSkills.length} Selected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {AVAILABLE_SIM_SKILLS.map((skill) => {
            const isSelected = selectedSkills.includes(skill.name)
            return (
              <button
                key={skill.name}
                type="button"
                onClick={() => toggleSkill(skill.name)}
                className={`p-4 rounded-2xl text-left transition-all border cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-blue-50/90 to-indigo-50/70 dark:from-slate-800 dark:to-blue-950/40 border-[#0B4F9C] dark:border-sky-500 shadow-md ring-2 ring-[#0B4F9C]/20'
                    : 'bg-white dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700 hover:border-slate-300 hover:bg-slate-50/80 dark:hover:bg-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {skill.category}
                    </span>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#0B4F9C] text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                      }`}
                    >
                      {isSelected ? <Check size={13} strokeWidth={3} /> : <Plus size={13} />}
                    </div>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                    {skill.name}
                  </h4>

                  {/* Top company tags preview */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-bold">Hiring:</span>
                    {skill.topCompanies.slice(0, 3).map((c, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/80 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                      >
                        {c.name.split(' ')[0]}
                      </span>
                    ))}
                    {skill.topCompanies.length > 3 && (
                      <span className="text-[10px] font-bold text-[#F26B1D]">
                        +{skill.topCompanies.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    +{skill.salaryBoostLPA} LPA Boost
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">
                    ~{skill.hoursToLearn}h sprint
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── 2. Real-Time Simulation Projection Scorecard ── */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0B4F9C]/10 via-orange-500/10 to-blue-600/5 dark:from-slate-800 dark:via-blue-950/30 dark:to-slate-900 border-2 border-[#0B4F9C]/30 dark:border-blue-800/60 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-slate-200/80 dark:border-slate-700/80 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#F26B1D] animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0B4F9C] dark:text-sky-400">
                Combined Impact Forecast
              </span>
            </div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {selectedSkills.length} Selected Skills Unlocking High-Value Tech Tracks
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Based on {allUnlockedCompanies.length} verified hiring pipelines actively recruiting college freshers.
            </p>
          </div>

          {/* Metrics Spotlight */}
          <div className="flex flex-wrap items-center gap-4 bg-white/90 dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700/80 shadow-xs">
            <div className="text-center px-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">Campus Readiness</div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                <span>{simulatedReadiness}%</span>
                <span className="text-xs font-bold text-slate-400 font-normal">(+{totalGapReduction}%)</span>
              </div>
            </div>

            <div className="text-center border-l border-slate-200 dark:border-slate-700 px-3">
              <div className="text-[10px] uppercase font-bold text-slate-400">Projected Fresher CTC</div>
              <div className="text-2xl font-black text-[#F26B1D]">
                ₹{simulatedSalary} LPA
              </div>
            </div>

            <div className="text-center border-l border-slate-200 dark:border-slate-700 px-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">Companies Unlocked</div>
              <div className="text-2xl font-black text-[#0B4F9C] dark:text-sky-400">
                {allUnlockedCompanies.length}
              </div>
            </div>
          </div>
        </div>

        {/* Roles Unlocked */}
        <div className="space-y-2">
          <div className="text-xs font-black uppercase tracking-wide text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <Briefcase size={14} className="text-[#0B4F9C]" />
            <span>Target Roles Unlocked ({unlockedRolesList.length} Categories):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {unlockedRolesList.map((role, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#0B4F9C] dark:text-sky-300 shadow-2xs flex items-center gap-1.5"
              >
                <Sparkles size={12} className="text-[#F26B1D]" />
                <span>{role}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. DETAILED COMPANIES UNLOCKED BY THESE SKILLS (THE REQUESTED FEATURE) ── */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Building2 size={18} className="text-[#0B4F9C] dark:text-sky-400" />
              <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Companies You Can Target With This Stack ({filteredCompanies.length})
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified tech giants, high-growth startups, and GCCs evaluating these exact skills for entry-level roles.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search company or skill..."
              value={searchCompany}
              onChange={(e) => setSearchCompany(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-[#0B4F9C]"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
          {['All', 'Product Unicorn', 'Global Tech & GCC', 'AI & Fast-Growth', 'Enterprise Tech'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCompanyCategoryFilter(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                companyCategoryFilter === cat
                  ? 'bg-[#0B4F9C] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'All' ? `All Categories (${allUnlockedCompanies.length})` : cat}
            </button>
          ))}
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <AnimatePresence>
            {filteredCompanies.map((comp) => (
              <motion.div
                key={comp.name}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:border-[#0B4F9C]/50 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 shadow-xs ${comp.logoBg}`}
                      >
                        {comp.logoInitial}
                      </div>
                      <div>
                        <h5 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                          {comp.name}
                        </h5>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                            {comp.category}
                          </span>
                          <span className="text-[10px] text-slate-300 dark:text-slate-600">•</span>
                          <span className="text-[10px] font-extrabold text-[#F26B1D]">
                            {comp.packageLPA}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-[#0B4F9C] dark:text-sky-300 border border-blue-200/60 shrink-0">
                      via {comp.matchingSkill.split(' ')[0]}
                    </span>
                  </div>

                  {/* Why They Hire Note */}
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    <strong className="text-slate-800 dark:text-slate-200">Recruiter Focus: </strong>
                    {comp.whyTheyHire}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                    <ShieldCheck size={12} className="text-emerald-500" />
                    <span>{comp.hiringChannel}</span>
                  </span>

                  <Link
                    to="/jobs"
                    className="font-bold text-[#0B4F9C] dark:text-sky-400 hover:text-blue-800 flex items-center gap-1 transition text-[11px]"
                  >
                    <span>View Openings</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredCompanies.length === 0 && (
          <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center space-y-2 border border-dashed border-slate-300 dark:border-slate-700">
            <Building2 size={28} className="mx-auto text-slate-400" />
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              No companies match your search filter.
            </p>
            <button
              onClick={() => {
                setCompanyCategoryFilter('All')
                setSearchCompany('')
              }}
              className="text-xs font-bold text-[#0B4F9C] underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* ── 4. Recommended Proof Projects to Build ── */}
      {activeSimObjects.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="text-xs font-black uppercase tracking-wide text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <Layers size={14} className="text-[#F26B1D]" />
            <span>Recommended Proof Projects to Build for Interviews:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {activeSimObjects.map((s, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/80 text-xs shadow-2xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 dark:text-white">{s.name}</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-[#0B4F9C] dark:text-sky-300">
                    ~{s.hoursToLearn}h sprint
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  {s.keyProject}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

