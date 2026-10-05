import { useState, useMemo } from 'react'
import {
  Scale,
  Sparkles,
  Building,
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
} from 'lucide-react'
import { Link } from 'react-router-dom'

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
  },
  {
    id: 'sarvam',
    name: 'Sarvam AI / High-Growth GenAI Lab',
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
  },
  {
    id: 'fractal',
    name: 'Fractal Analytics',
    badge: 'FRAC',
    badgeColor: 'bg-rose-600 text-white',
    category: 'AI & Next-Gen',
    targetRole: 'AI Solution Engineer (Applied GenAI)',
    ctcBracket: '₹14.5 - ₹19.5 LPA',
    avgHikePct: '+60% to +80%',
    requiredSkills: ['LangChain & GenAI RAG', 'Python & Scripting', 'FastAPI / REST', 'AWS / Cloud Infrastructure'],
    interviewType: 'Hands-on Python Assessment + GenAI Solution Design',
    hiringDifficulty: 'Hands-on PoC / Take-Home',
    referralStrategy: 'Highlight practical experience bridging enterprise databases with vector search and LLMs.',
    location: 'Gurugram / Mumbai / Bengaluru',
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
  },
  {
    id: 'persistent',
    name: 'Persistent Systems (Digital Elevate)',
    badge: 'PSYS',
    badgeColor: 'bg-teal-600 text-white',
    category: 'Enterprise Tech',
    targetRole: 'Cloud & GenAI Modernization Lead',
    ctcBracket: '₹11 - ₹15 LPA',
    avgHikePct: '+40% to +55%',
    requiredSkills: ['AWS / Cloud Infrastructure', 'Python & Scripting', 'LangChain & GenAI RAG', 'Docker & Containers'],
    interviewType: 'Technical Domain + Client Project Readiness',
    hiringDifficulty: 'Fast-Track (2 Rounds)',
    referralStrategy: 'Continuous lateral hiring drives in Pune and Hyderabad for cloud-certified candidates.',
    location: 'Pune / Hyderabad / Nagpur',
  },
  {
    id: 'target_tech',
    name: 'Target Technology Services',
    badge: 'TGT',
    badgeColor: 'bg-red-600 text-white',
    category: 'Global GCC / Banking',
    targetRole: 'Lead Automation Engineer',
    ctcBracket: '₹14 - ₹18.5 LPA',
    avgHikePct: '+50% to +70%',
    requiredSkills: ['Python & Scripting', 'Docker & Containers', 'CI/CD & Jenkins', 'PostgreSQL'],
    interviewType: 'Scripting + Problem Solving + System Health Observability',
    hiringDifficulty: 'Standard (3 Rounds)',
    referralStrategy: 'Target Tech hires heavily from service companies (TCS, Infosys, Wipro) for lateral upgrades.',
    location: 'Bengaluru',
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    badge: 'PP',
    badgeColor: 'bg-purple-600 text-white',
    category: 'Product Unicorn',
    targetRole: 'Site Reliability / Infra Automation Engineer',
    ctcBracket: '₹16 - ₹21 LPA',
    avgHikePct: '+65% to +90%',
    requiredSkills: ['Kubernetes / CI/CD', 'AWS / Cloud Infrastructure', 'Docker & Containers', 'Python & Scripting'],
    interviewType: 'Core Linux/Infra Deep-Dive + Python Scripting',
    hiringDifficulty: 'Hands-on PoC / Take-Home',
    referralStrategy: 'Strong preference for engineers who can showcase automated self-healing scripts.',
    location: 'Bengaluru / Pune',
  },
]

const ALL_AVAILABLE_SKILLS = [
  'Python & Scripting',
  'FastAPI / REST',
  'Docker & Containers',
  'AWS / Cloud Infrastructure',
  'LangChain & GenAI RAG',
  'ChromaDB / Vector Search',
  'Kubernetes / CI/CD',
  'PostgreSQL',
  'ITIL / Incident Mgmt',
]

export default function StayOrSwitchAnalysis() {
  const [currentCTC, setCurrentCTC] = useState<number>(6.8)
  const [internalHikePct, setInternalHikePct] = useState<number>(8)
  const [switchHikePct, setSwitchHikePct] = useState<number>(45)

  // Skill selection state (preloaded with baseline skills)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'Python & Scripting',
    'FastAPI / REST',
    'Docker & Containers',
    'ITIL / Incident Mgmt',
  ])

  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Calculations
  const internalNewCTC = Number((currentCTC * (1 + internalHikePct / 100)).toFixed(1))
  const switchNewCTC = Number((currentCTC * (1 + switchHikePct / 100)).toFixed(1))
  const inHandMonthlyDiff = Math.round(((switchNewCTC - internalNewCTC) * 100000) / 12 * 0.85)

  // Toggle a skill
  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  // Calculate matching companies
  const companyMatches = useMemo(() => {
    return SWITCH_TARGET_COMPANIES.map((company) => {
      const matched = company.requiredSkills.filter((s) => selectedSkills.includes(s))
      const matchPct = Math.round((matched.length / company.requiredSkills.length) * 100)
      const missingSkills = company.requiredSkills.filter((s) => !selectedSkills.includes(s))

      return {
        ...company,
        matchedCount: matched.length,
        matchPct,
        missingSkills,
      }
    }).sort((a, b) => b.matchPct - a.matchPct)
  }, [selectedSkills])

  // Filtered companies based on category & search
  const filteredCompanies = useMemo(() => {
    return companyMatches.filter((c) => {
      const matchesCategory =
        categoryFilter === 'all' ||
        (categoryFilter === 'high_match' && c.matchPct >= 60) ||
        (categoryFilter === 'product' && c.category === 'Product Unicorn') ||
        (categoryFilter === 'gcc' && c.category === 'Global GCC / Banking') ||
        (categoryFilter === 'ai' && c.category === 'AI & Next-Gen')

      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.targetRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesCategory && matchesSearch
    })
  }, [companyMatches, categoryFilter, searchQuery])

  const highMatchCount = companyMatches.filter((c) => c.matchPct >= 60).length

  const stayFactors = [
    { label: 'Domain Familiarity & Psychological Safety', score: 'High (0 ramp-up stress)', status: 'positive' },
    { label: 'Internal Promotion Timeline', score: '8–12 Months cycle', status: 'neutral' },
    { label: 'Expected Internal Increment', score: `${internalHikePct}% (₹${internalNewCTC} LPA)`, status: 'negative' },
    { label: 'New AI/Cloud Tech Stack Adoption', score: 'Slow / Legacy Maintenance', status: 'negative' },
  ]

  const switchFactors = [
    { label: 'External Market Demand', score: 'High for Automation & Cloud Tech', status: 'positive' },
    { label: 'Expected Switch Compensation', score: `+${switchHikePct}% (₹${switchNewCTC} LPA)`, status: 'positive' },
    { label: 'Learning Velocity & Modern Stack', score: 'Rapid in Tech-First Co.', status: 'positive' },
    { label: 'Probation Risk & Domain Ramp-up', score: 'Moderate (60–90 Days)', status: 'neutral' },
  ]

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-7">
      {/* ── 1. Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/60 dark:to-blue-950/60 text-purple-700 dark:text-purple-300 text-xs font-black mb-1.5 border border-purple-200/50">
            <Scale size={13} className="text-purple-600" />
            <span>"Stay or Switch?" Objective Career & Hiring Matrix</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Internal Promotion vs External Switch Financial & Company Match
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            Evaluate internal appraisal growth vs external lateral switch upside, and see which companies are actively hiring for your exact skill profile.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-right shrink-0">
          <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">Monthly In-Hand Upside</div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
            +₹{inHandMonthlyDiff.toLocaleString('en-IN')}/mo
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">₹{(switchNewCTC - internalNewCTC).toFixed(1)}L Extra Annual Value</div>
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

      {/* ── 3. 2-Column Comparison ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Option A: Stay */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Building size={16} className="text-slate-500" />
              <span>Option A: Stay & Seek Internal Promotion</span>
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              Low Risk / Slower Compounding
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {stayFactors.map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs"
              >
                <span className="text-slate-600 dark:text-slate-300 font-medium">{f.label}</span>
                <span
                  className={`font-bold ${
                    f.status === 'positive'
                      ? 'text-emerald-600'
                      : f.status === 'negative'
                      ? 'text-rose-500'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {f.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Option B: Switch */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-50/50 to-emerald-50/50 dark:from-slate-900 dark:to-blue-950/30 border-2 border-emerald-300 dark:border-emerald-800 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase size={16} className="text-[#0B4F9C] dark:text-sky-400" />
              <span>Option B: Target External Lateral Switch</span>
            </h4>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Recommended (8–12 Wks)
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {switchFactors.map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200/60 dark:border-slate-800 text-xs"
              >
                <span className="text-slate-600 dark:text-slate-300 font-medium">{f.label}</span>
                <span
                  className={`font-bold ${
                    f.status === 'positive'
                      ? 'text-emerald-600'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {f.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. BRAND NEW: Skill-to-Company Matching Radar ── */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white space-y-6 shadow-md border border-blue-900/40">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 size={18} className="text-amber-400" />
              <h4 className="text-sm font-black uppercase tracking-wider text-amber-400">
                Target Companies Matching Your Skills for Lateral Switch
              </h4>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl font-medium">
              Select your current & learned skills below to see which top GCCs, Unicorns, and AI companies are actively hiring with ₹12–22 LPA packages.
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
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 transition"
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
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
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
                  className={`p-4 sm:p-5 rounded-2xl transition border space-y-3.5 relative overflow-hidden ${
                    isHighMatch
                      ? 'bg-slate-800/90 border-emerald-500/50 shadow-xs'
                      : 'bg-slate-800/50 border-slate-700/60 opacity-90'
                  }`}
                >
                  {/* Top Bar: Company Badge & Match Pill */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${comp.badgeColor} flex items-center justify-center font-black text-xs shadow-xs shrink-0`}
                      >
                        {comp.badge}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-black text-sm text-white">{comp.name}</h5>
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
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/70 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <TrendingUp size={13} />
                      <span>{comp.ctcBracket}</span>
                    </div>
                    <div className="font-extrabold text-amber-300">
                      {comp.avgHikePct} Hike
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      📍 {comp.location}
                    </div>
                  </div>

                  {/* Skills Matching Breakdown */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      Skill Compatibility:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {comp.requiredSkills.map((s) => {
                        const hasSkill = selectedSkills.includes(s)
                        return (
                          <span
                            key={s}
                            className={`text-[11px] px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 ${
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

                  {/* Referral / Interview Strategy */}
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                      <span className="flex items-center gap-1 text-sky-400">
                        <ShieldCheck size={12} /> {comp.hiringDifficulty}
                      </span>
                      <span>{comp.interviewType}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                      💡 <span className="text-amber-200">Referral Tip:</span> {comp.referralStrategy}
                    </p>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="col-span-2 p-8 text-center bg-slate-800/40 rounded-2xl border border-slate-700 text-slate-400 space-y-2">
              <p className="text-sm font-bold">No companies found matching the filter criteria.</p>
              <p className="text-xs">Try selecting more skills above or clearing the search query.</p>
            </div>
          )}
        </div>
      </div>

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
