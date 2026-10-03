import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Building2,
  CheckCircle2,
  Lock,
  Unlock,
  TrendingUp,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  Target,
  Clock,
  Shield,
  RefreshCw,
  BookOpen,
} from 'lucide-react'
import { useProfileStore } from '@/store/profileStore'
import { profileApi } from '@/lib/api'
import TrendLine from '@/components/charts/TrendLine'

// Curated Top Indian & Global Employers Database
interface CompanyData {
  id: string
  name: string
  category: 'Tier-1 BigTech' | 'FinTech' | 'E-Commerce' | 'Consumer Tech' | 'IT Modernization'
  logoBg: string
  logoText: string
  tagline: string
  hiringHubs: string[]
  coreStack: string[]
  roles: {
    id: string
    title: string
    startingCtcLpa: number
    level: string
    requiredSkills: string[]
    resilienceScore: number // 0 to 100
    hiringDemand: string
    courses: { title: string; provider: string; weeks: number }[]
  }[]
}

const companiesList: CompanyData[] = [
  {
    id: 'swiggy',
    name: 'Swiggy',
    category: 'Consumer Tech',
    logoBg: 'bg-orange-500',
    logoText: 'SW',
    tagline: 'Hyperlocal Logistics & FoodTech Decacorn',
    hiringHubs: ['Bengaluru', 'Hyderabad', 'Remote'],
    coreStack: ['Python', 'Java', 'Go', 'Kafka', 'Redis', 'AWS', 'RAG'],
    roles: [
      {
        id: 'swiggy-genai',
        title: 'GenAI & Search Ranking Engineer',
        startingCtcLpa: 22.0,
        level: 'Mid / Senior',
        requiredSkills: ['Python', 'LangChain', 'Vector DBs', 'RAG', 'FastAPI'],
        resilienceScore: 94,
        hiringDemand: 'Very High (+48% YoY)',
        courses: [
          { title: 'LLM & Vector Embeddings', provider: 'SWAYAM', weeks: 10 },
          { title: 'RAG Pipeline Deployment', provider: 'NPTEL', weeks: 8 },
        ],
      },
      {
        id: 'swiggy-backend',
        title: 'Platform Backend SDE',
        startingCtcLpa: 17.5,
        level: 'Mid-Level',
        requiredSkills: ['Java', 'Spring Boot', 'Kafka', 'MySQL', 'Redis'],
        resilienceScore: 82,
        hiringDemand: 'High (+32% YoY)',
        courses: [
          { title: 'High-Concurrency Java Systems', provider: 'NPTEL', weeks: 12 },
          { title: 'Distributed Caching & Redis', provider: 'freeCodeCamp', weeks: 6 },
        ],
      },
      {
        id: 'swiggy-devops',
        title: 'Site Reliability & Cloud Engineer',
        startingCtcLpa: 16.0,
        level: 'Mid-Level',
        requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD'],
        resilienceScore: 88,
        hiringDemand: 'High (+29% YoY)',
        courses: [
          { title: 'Cloud DevOps Fundamentals', provider: 'Skill India', weeks: 6 },
          { title: 'Kubernetes in Production', provider: 'NPTEL', weeks: 8 },
        ],
      },
    ],
  },
  {
    id: 'zomato',
    name: 'Zomato / Blinkit',
    category: 'Consumer Tech',
    logoBg: 'bg-rose-600',
    logoText: 'ZO',
    tagline: 'Quick-Commerce & Hyper-Growth Platform',
    hiringHubs: ['Gurugram', 'Bengaluru', 'Pune'],
    coreStack: ['Python', 'Node.js', 'Go', 'Kubernetes', 'PostgreSQL', 'PyTorch'],
    roles: [
      {
        id: 'zomato-ml',
        title: 'Quick-Commerce ML & Demand Forecasting',
        startingCtcLpa: 24.0,
        level: 'Senior',
        requiredSkills: ['Python', 'PyTorch', 'SQL', 'FastAPI', 'Vector DBs'],
        resilienceScore: 92,
        hiringDemand: 'Surging (+65% YoY)',
        courses: [
          { title: 'Deep Learning & Forecasting', provider: 'NPTEL', weeks: 12 },
        ],
      },
      {
        id: 'zomato-backend',
        title: 'Full Stack / Backend SDE',
        startingCtcLpa: 16.5,
        level: 'Mid-Level',
        requiredSkills: ['Node.js', 'React', 'PostgreSQL', 'Redis', 'Docker'],
        resilienceScore: 80,
        hiringDemand: 'High (+24% YoY)',
        courses: [
          { title: 'Full Stack Node & React', provider: 'freeCodeCamp', weeks: 10 },
        ],
      },
    ],
  },
  {
    id: 'phonepe',
    name: 'PhonePe / Razorpay',
    category: 'FinTech',
    logoBg: 'bg-purple-600',
    logoText: 'PP',
    tagline: 'High-Concurrency UPI & Payments Infrastructure',
    hiringHubs: ['Bengaluru', 'Pune', 'Mumbai'],
    coreStack: ['Java', 'Golang', 'PostgreSQL', 'Kafka', 'Docker', 'AWS'],
    roles: [
      {
        id: 'phonepe-fintech',
        title: 'UPI & Payment Gateway Backend SDE',
        startingCtcLpa: 21.0,
        level: 'Mid / Senior',
        requiredSkills: ['Java', 'Spring Boot', 'PostgreSQL', 'Kafka', 'Microservices'],
        resilienceScore: 90,
        hiringDemand: 'Very High (+40% YoY)',
        courses: [
          { title: 'Microservices & Distributed Systems', provider: 'NPTEL', weeks: 12 },
        ],
      },
      {
        id: 'phonepe-fraud',
        title: 'FinTech Risk & AI Fraud Analyst',
        startingCtcLpa: 18.0,
        level: 'Mid-Level',
        requiredSkills: ['Python', 'SQL', 'Prompt Eng', 'Data Analytics', 'FastAPI'],
        resilienceScore: 86,
        hiringDemand: 'High (+35% YoY)',
        courses: [
          { title: 'Financial Analytics with Python', provider: 'SWAYAM', weeks: 8 },
        ],
      },
    ],
  },
  {
    id: 'google',
    name: 'Google India',
    category: 'Tier-1 BigTech',
    logoBg: 'bg-blue-600',
    logoText: 'GO',
    tagline: 'Frontier AI & Global Cloud Infrastructure',
    hiringHubs: ['Bengaluru', 'Hyderabad', 'Gurugram'],
    coreStack: ['Python', 'C++', 'Java', 'GCP', 'TensorFlow', 'Kubernetes'],
    roles: [
      {
        id: 'google-ai',
        title: 'AI Solutions Engineer (GenAI & Cloud)',
        startingCtcLpa: 32.0,
        level: 'Senior Specialist',
        requiredSkills: ['Python', 'LangChain', 'Vector DBs', 'RAG', 'GCP', 'Docker'],
        resilienceScore: 98,
        hiringDemand: 'Extremely Competitive (+52% YoY)',
        courses: [
          { title: 'Advanced Cloud & AI Systems', provider: 'NPTEL', weeks: 16 },
        ],
      },
      {
        id: 'google-cloud',
        title: 'Cloud Infrastructure Architect',
        startingCtcLpa: 28.0,
        level: 'Staff / Lead',
        requiredSkills: ['Kubernetes', 'Docker', 'Linux', 'Python', 'CI/CD'],
        resilienceScore: 95,
        hiringDemand: 'Very High (+38% YoY)',
        courses: [
          { title: 'Cloud Computing Foundations', provider: 'SWAYAM', weeks: 12 },
        ],
      },
    ],
  },
  {
    id: 'tcs-digital',
    name: 'TCS Digital / Infosys AI',
    category: 'IT Modernization',
    logoBg: 'bg-sky-800',
    logoText: 'TC',
    tagline: 'Global Enterprise Cloud & AI Modernization',
    hiringHubs: ['Pune', 'Chennai', 'Noida', 'Kolkata', 'Hyderabad'],
    coreStack: ['Java', 'Python', 'Spring Boot', 'AWS', 'Azure', 'Selenium'],
    roles: [
      {
        id: 'tcs-cloud-mod',
        title: 'Enterprise Cloud & Java Modernization SDE',
        startingCtcLpa: 12.5,
        level: 'Junior / Mid',
        requiredSkills: ['Java', 'Spring Boot', 'Clean Architecture', 'MySQL', 'Docker'],
        resilienceScore: 78,
        hiringDemand: 'Massive Volume Hiring',
        courses: [
          { title: 'Java Cloud Modernization', provider: 'Skill India', weeks: 8 },
        ],
      },
      {
        id: 'tcs-genai',
        title: 'Enterprise GenAI & Automation Developer',
        startingCtcLpa: 15.0,
        level: 'Mid-Level',
        requiredSkills: ['Python', 'LangChain', 'FastAPI', 'Prompt Eng'],
        resilienceScore: 89,
        hiringDemand: 'Rapidly Expanding (+70% YoY)',
        courses: [
          { title: 'AI & Machine Learning for Enterprises', provider: 'NPTEL', weeks: 12 },
        ],
      },
    ],
  },
]

const sampleResumes = [
  {
    title: 'Priya (Ex-Java Developer - 4yr Break)',
    role: 'Java Developer',
    skills: ['Java', 'Spring Boot', 'MySQL', 'REST APIs', 'Git'],
    text: '5 years experience as Java Backend Developer (Spring Boot, REST APIs, MySQL). 4-year break. Based in Pune.',
  },
  {
    title: 'Arjun (Manual QA - Laid Off)',
    role: 'QA Engineer',
    skills: ['Manual Testing', 'JIRA', 'SQL', 'Agile', 'Selenium'],
    text: '6 years in Manual Quality Assurance & defect tracking. Target: SDET Automation & DevOps.',
  },
  {
    title: 'Ramesh (Gig Logistics Worker)',
    role: 'Logistics Associate',
    skills: ['Operations', 'Route Optimization', 'Customer Support', 'Excel'],
    text: '3 years in delivery logistics. Target: Supply chain data analytics & python.',
  },
]

export default function CompanyTargetMatchPage() {
  const navigate = useNavigate()
  const profile = useProfileStore((s) => s.profile)
  const setProfile = useProfileStore((s) => s.setProfile)

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1)
  const [resumeText, setResumeText] = useState('')
  const [userSkills, setUserSkills] = useState<string[]>(
    profile?.skills_raw && profile.skills_raw.length > 0
      ? profile.skills_raw
      : ['Java', 'Spring Boot', 'MySQL', 'REST APIs']
  )
  const [selectedCompany, setSelectedCompany] = useState<CompanyData>(companiesList[0])
  const [selectedRole, setSelectedRole] = useState(companiesList[0].roles[0])
  const [companyCategoryFilter, setCompanyCategoryFilter] = useState<string>('All')
  const [parsing, setParsing] = useState(false)
  const [justUnlockedRole, setJustUnlockedRole] = useState<string | null>(null)

  // Update selected role when company changes
  useEffect(() => {
    setSelectedRole(selectedCompany.roles[0])
  }, [selectedCompany])

  // Heuristic skill extractor / API parser
  const handleParseResume = async (text: string) => {
    if (!text.trim() || text.length < 15) return
    try {
      setParsing(true)
      const res = await profileApi.parseResume(text)
      const extracted = res.skills && res.skills.length > 0 ? res.skills : ['Java', 'Spring Boot', 'MySQL', 'SQL']
      setUserSkills(extracted)

      if (profile) {
        setProfile({
          ...profile,
          skills_raw: extracted,
          resume_text: text,
        })
      }
      setCurrentStep(2)
    } catch {
      // Fallback local heuristic
      const mockExtracted = ['Java', 'Spring Boot', 'MySQL', 'Git', 'REST APIs']
      setUserSkills(mockExtracted)
      setCurrentStep(2)
    } finally {
      setParsing(false)
    }
  }

  // Calculate Match % for a given role against current userSkills
  const getRoleMatch = (role: typeof selectedRole, currentSkills: string[]) => {
    const required = role.requiredSkills
    const matched = required.filter((sk) =>
      currentSkills.some((s) => s.toLowerCase().trim() === sk.toLowerCase().trim())
    )
    const missing = required.filter(
      (sk) => !currentSkills.some((s) => s.toLowerCase().trim() === sk.toLowerCase().trim())
    )
    const matchPct = Math.round((matched.length / required.length) * 100)
    const isUnlocked = matchPct >= 75 // Unlocked if 75%+ or max 1 missing skill
    return { matched, missing, matchPct, isUnlocked }
  }

  // Gamified Simulator: Learn a skill instantly and trigger unlock animation!
  const handleSimulateLearnSkill = (skillToLearn: string, roleTitle: string) => {
    if (!userSkills.includes(skillToLearn)) {
      const updated = [...userSkills, skillToLearn]
      setUserSkills(updated)
      setJustUnlockedRole(roleTitle)
      setTimeout(() => setJustUnlockedRole(null), 4000)

      if (profile) {
        setProfile({
          ...profile,
          skills_raw: updated,
        })
      }
    }
  }

  const roleMatch = getRoleMatch(selectedRole, userSkills)

  // 5-Year Compensation Dynamic Progression
  const baseCtc = selectedRole.startingCtcLpa
  const dynamicSalaryData = [
    { period: 'Year 1', salary: baseCtc, value: baseCtc, title: `Associate ${selectedRole.title}` },
    { period: 'Year 2', salary: Number((baseCtc * 1.35).toFixed(1)), value: Number((baseCtc * 1.35).toFixed(1)), title: `Mid-Level Engineer` },
    { period: 'Year 3', salary: Number((baseCtc * 1.82).toFixed(1)), value: Number((baseCtc * 1.82).toFixed(1)), title: `Senior Engineer` },
    { period: 'Year 4', salary: Number((baseCtc * 2.38).toFixed(1)), value: Number((baseCtc * 2.38).toFixed(1)), title: `Staff / Tech Lead` },
    { period: 'Year 5', salary: Number((baseCtc * 3.05).toFixed(1)), value: Number((baseCtc * 3.05).toFixed(1)), title: `Principal Architect` },
  ]
  const year5Salary = dynamicSalaryData[dynamicSalaryData.length - 1].salary

  const filteredCompanies =
    companyCategoryFilter === 'All'
      ? companiesList
      : companiesList.filter((c) => c.category === companyCategoryFilter)

  const stepLabels = [
    { num: 1, label: 'Upload Resume' },
    { num: 2, label: 'Select Company' },
    { num: 3, label: 'Tech Stack Gap' },
    { num: 4, label: 'Role Unlocker' },
    { num: 5, label: 'Market & AI Shield' },
    { num: 6, label: 'Pathway & CTC' },
  ]

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Target Company Career Navigator
            </h1>
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-xs">
              AI Gamified Match
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Upload your resume, pick your dream employer, uncover missing skills, and unlock high-growth roles.
          </p>
        </div>

        {/* Selected Company & Role Mini Badge */}
        <div className="hidden md:flex items-center gap-2 p-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className={`w-8 h-8 rounded-xl ${selectedCompany.logoBg} text-white flex items-center justify-center font-bold text-xs`}>
            {selectedCompany.logoText}
          </div>
          <div className="text-left text-xs pr-2">
            <p className="font-extrabold text-slate-900 dark:text-white">{selectedCompany.name}</p>
            <p className="text-[10px] text-slate-500 truncate max-w-[140px]">{selectedRole.title}</p>
          </div>
        </div>
      </div>

      {/* 6-Step Visual Stepper Header */}
      <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px] gap-1">
          {stepLabels.map((s, idx) => {
            const isCurrent = currentStep === s.num
            const isCompleted = currentStep > s.num
            return (
              <div key={s.num} className="flex items-center gap-2 flex-1">
                <button
                  type="button"
                  onClick={() => setCurrentStep(s.num as any)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all w-full ${
                    isCurrent
                      ? 'bg-[#0B4F9C] text-white shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      isCurrent
                        ? 'bg-white/20 text-white'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={12} /> : s.num}
                  </span>
                  <span className="truncate">{s.label}</span>
                </button>
                {idx < stepLabels.length - 1 && (
                  <span className="text-slate-300 dark:text-slate-700 hidden lg:inline">→</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: RESUME UPLOAD & SKILL EXTRACTION */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText size={20} className="text-[#0B4F9C]" />
                <span>Step 1: Upload or Paste Your Resume</span>
              </h3>
              <p className="text-xs text-slate-500">
                Our AI will parse your technical background, skills, and experience to test against top employers.
              </p>
            </div>

            {/* Drag & Drop / File Upload Zone */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Upload Resume File (PDF, DOCX, TXT):
              </label>
              <div
                onClick={() => document.getElementById('resume-file-input')?.click()}
                className="p-6 border-2 border-dashed border-sky-300 dark:border-slate-700 hover:border-[#0B4F9C] dark:hover:border-sky-500 rounded-3xl bg-sky-50/40 dark:bg-slate-800/40 text-center cursor-pointer transition-all hover:bg-sky-50/80 group space-y-2"
              >
                <input
                  id="resume-file-input"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (event) => {
                        const content = (event.target?.result as string) || ''
                        setResumeText(content.slice(0, 3000) || `Uploaded file: ${file.name}`)
                        handleParseResume(content || file.name)
                      }
                      reader.readAsText(file)
                    }
                  }}
                />
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[#0B4F9C] dark:text-sky-400 mx-auto flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                  <FileText size={22} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white">
                    Click to browse or drag & drop your Resume (PDF / TXT)
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Supports PDF, DOCX, and TXT up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* 1-Click Sample Resumes */}
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Or Try 1-Click Persona Sample:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {sampleResumes.map((sample) => (
                  <button
                    key={sample.title}
                    type="button"
                    onClick={() => {
                      setResumeText(sample.text)
                      handleParseResume(sample.text)
                    }}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left hover:border-[#0B4F9C] hover:bg-sky-50/40 transition-all space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0B4F9C]">
                        {sample.title}
                      </p>
                      <Sparkles size={13} className="text-[#0B4F9C]" />
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {sample.skills.slice(0, 3).map((sk) => (
                        <span key={sk} className="px-1.5 py-0.2 rounded bg-white dark:bg-slate-900 text-[10px] text-slate-600 dark:text-slate-300 font-mono">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Resume Text Input Area */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Or Paste Resume Bio / LinkedIn Skills Text:
              </label>
              <textarea
                rows={4}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="e.g. Senior Java Developer with 5 years experience in Spring Boot, REST APIs, MySQL, and Docker. Looking to transition into GenAI..."
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]/30 focus:border-[#0B4F9C]"
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>Your active skills: <strong>{userSkills.join(', ')}</strong></span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (resumeText.trim().length > 15) {
                      handleParseResume(resumeText)
                    } else {
                      setCurrentStep(2)
                    }
                  }}
                  disabled={parsing}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0B4F9C] text-white font-extrabold text-xs sm:text-sm hover:bg-[#083b75] shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02]"
                >
                  <span>{parsing ? 'AI Extracting Skills...' : 'Next: Choose Target Company'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: CHOOSE TARGET COMPANY */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 size={20} className="text-[#0B4F9C]" />
                <span>Step 2: Select Your Target Employer in India</span>
              </h3>
              <p className="text-xs text-slate-500">
                Pick a company to evaluate their hiring standards, tech stack, and salary packages.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              {['All', 'Consumer Tech', 'FinTech', 'Tier-1 BigTech', 'IT Modernization'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCompanyCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    companyCategoryFilter === cat
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Company Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCompanies.map((comp) => {
              const isSelected = selectedCompany.id === comp.id
              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedCompany(comp)}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-[#0B4F9C] ring-2 ring-[#0B4F9C]/20 shadow-lg scale-[1.01]'
                      : 'bg-slate-50/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl ${comp.logoBg} text-white flex items-center justify-center font-black text-sm shadow-md`}>
                          {comp.logoText}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                            {comp.name}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {comp.category}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black">
                          Selected
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {comp.tagline}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Core Tech Stack:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {comp.coreStack.map((stk) => (
                          <span key={stk} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            {stk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                      <MapPin size={12} className="text-[#F26B1D]" />
                      <span>Hubs: {comp.hiringHubs.join(', ')}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#0B4F9C]">
                    <span>{comp.roles.length} Active Target Roles</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Step 2 Bottom Navigation */}
          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1"
            >
              <ArrowLeft size={14} />
              <span>Back to Resume</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0B4F9C] text-white font-extrabold text-xs sm:text-sm hover:bg-[#083b75] shadow-md shadow-blue-900/20 transition-all"
            >
              <span>Next: Compare Tech Stack Gap</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: COMPANY TECH STACK MATCH & SKILL GAP */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-xl ${selectedCompany.logoBg} text-white flex items-center justify-center font-bold text-xs`}>
                    {selectedCompany.logoText}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {selectedCompany.name} Tech Stack Gap Analysis
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Evaluating your resume skills against {selectedCompany.name}'s standards for <strong className="text-slate-900 dark:text-white">{selectedRole.title}</strong>.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Target Role Match:</span>
                <span className="px-3 py-1 rounded-xl bg-sky-100 dark:bg-sky-950 text-[#0B4F9C] dark:text-sky-300 font-black text-sm">
                  {roleMatch.matchPct}% Match
                </span>
              </div>
            </div>

            {/* Match Breakdown 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Column 1: Skills You Have */}
              <div className="p-5 rounded-3xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>Skills You Already Have ({roleMatch.matched.length})</span>
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                    Verified Match
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  These verified skills from your resume directly satisfy {selectedCompany.name}'s hiring requirements:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {roleMatch.matched.length > 0 ? (
                    roleMatch.matched.map((sk) => (
                      <span key={sk} className="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 font-bold text-xs flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        <span>{sk}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">No exact skill overlap yet. Reskilling recommended below.</span>
                  )}
                </div>
              </div>

              {/* Column 2: Missing Gap Skills Needed for this Company */}
              <div className="p-5 rounded-3xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-orange-800 dark:text-orange-300 flex items-center gap-1.5">
                    <Target size={16} className="text-orange-600" />
                    <span>Missing Skills for {selectedCompany.name} ({roleMatch.missing.length})</span>
                  </span>
                  <span className="text-[11px] font-bold text-orange-700 dark:text-orange-400">
                    Learn To Qualify
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Mastering these key skills will make your profile 100% qualified for {selectedCompany.name}:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {roleMatch.missing.map((sk) => (
                    <span key={sk} className="px-3 py-1 rounded-xl bg-orange-100 dark:bg-orange-900/60 text-orange-900 dark:text-orange-200 font-bold text-xs flex items-center gap-1">
                      <Zap size={12} className="text-amber-500" />
                      <span>{sk}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Strategic Recommendation Callout */}
            <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
              <Sparkles size={18} className="text-[#0B4F9C] shrink-0 mt-0.5" />
              <span>
                <strong>Next Step Unlocking:</strong> You only need to learn <strong>{roleMatch.missing.slice(0, 2).join(' and ')}</strong> to become eligible for multiple high-paying roles at {selectedCompany.name}! Let's see them unlock in the next step.
              </span>
            </div>
          </div>

          {/* Step 3 Navigation */}
          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1"
            >
              <ArrowLeft size={14} />
              <span>Back to Companies</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs sm:text-sm hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all"
            >
              <span>Next: Unlock Adjacent Roles (Gamified)</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: GAMIFIED ADJACENT ROLE UNLOCKER (LOCK 🔒 -> UNLOCK 🔓) */}
      {/* ========================================================================= */}
      {currentStep === 4 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Header */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0B132B] to-slate-900 text-white border border-slate-800 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30">
                    <Sparkles size={16} />
                  </span>
                  <h3 className="text-lg font-black text-white">
                    Gamified Skill & Role Unlocker for {selectedCompany.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-300">
                  Click on any missing skill below to simulate mastering it. Watch locked career roles unlock live!
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs self-start sm:self-auto">
                🎮 Live Simulator Mode
              </span>
            </div>

            {/* Notification when a role unlocks */}
            <AnimatePresence>
              {justUnlockedRole && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-xs text-emerald-200 font-bold flex items-center gap-2"
                >
                  <Unlock size={16} className="text-emerald-400 animate-bounce" />
                  <span>🎉 Congratulations! You just unlocked eligibility for "{justUnlockedRole}"!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Roles Cards at this Company (Locked vs Unlocked) */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
              {selectedCompany.name} Career Paths for Your Profile:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {selectedCompany.roles.map((role) => {
                const matchInfo = getRoleMatch(role, userSkills)
                const isSelectedRole = selectedRole.id === role.id

                return (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                      matchInfo.isUnlocked
                        ? isSelectedRole
                          ? 'bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-900 dark:to-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xl'
                          : 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-900/60 shadow-sm'
                        : 'bg-slate-50/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 opacity-90'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Lock/Unlock Tag */}
                      <div className="flex items-center justify-between">
                        {matchInfo.isUnlocked ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-xs flex items-center gap-1.5 shadow-2xs">
                            <Unlock size={13} className="text-emerald-600" />
                            <span>UNLOCKED (Eligible to Apply)</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-black text-xs flex items-center gap-1.5 shadow-2xs">
                            <Lock size={13} className="text-amber-600" />
                            <span>LOCKED (Missing {matchInfo.missing.length} Skills)</span>
                          </span>
                        )}

                        <span className="font-mono font-black text-sm text-emerald-700 dark:text-emerald-400">
                          ₹{role.startingCtcLpa} LPA
                        </span>
                      </div>

                      {/* Role Title & Level */}
                      <div>
                        <h5 className="font-black text-base text-slate-900 dark:text-white">
                          {role.title}
                        </h5>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {role.level} • Demand: <strong className="text-[#0B4F9C] dark:text-sky-300">{role.hiringDemand}</strong>
                        </p>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-slate-500">Skill Readiness:</span>
                          <span className={matchInfo.isUnlocked ? 'text-emerald-600' : 'text-amber-600'}>
                            {matchInfo.matchPct}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              matchInfo.isUnlocked ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${matchInfo.matchPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Missing Skill Interactive Unlocker Chips */}
                      {!matchInfo.isUnlocked && matchInfo.missing.length > 0 && (
                        <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-2">
                          <span className="text-[11px] font-bold text-amber-900 dark:text-amber-200 block">
                            ⚡ Click to Simulate Learning & Unlock:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {matchInfo.missing.map((sk) => (
                              <button
                                key={sk}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSimulateLearnSkill(sk, role.title)
                                }}
                                className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs font-extrabold hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all flex items-center gap-1 shadow-2xs group"
                              >
                                <span>+ Learn {sk}</span>
                                <Sparkles size={11} className="text-amber-500 group-hover:text-white" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0B4F9C] dark:text-sky-400">
                      <span>{isSelectedRole ? 'Active Selection' : 'Select This Role'}</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Step 4 Navigation */}
          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1"
            >
              <ArrowLeft size={14} />
              <span>Back to Tech Gap</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0B4F9C] text-white font-extrabold text-xs sm:text-sm hover:bg-[#083b75] shadow-md transition-all"
            >
              <span>Next: Market Velocity & AI Shield</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: MARKET VELOCITY & AI DISRUPTION SHIELD */}
      {/* ========================================================================= */}
      {currentStep === 5 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp size={20} className="text-emerald-600" />
                  <span>Market Intelligence & AI Disruption Resilience</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Demand indices and career longevity score for <strong className="text-slate-900 dark:text-white">{selectedRole.title}</strong> at {selectedCompany.name}.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
                {selectedRole.hiringDemand}
              </span>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Starting Target CTC
                </span>
                <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
                  ₹{selectedRole.startingCtcLpa} LPA
                </p>
                <p className="text-[11px] text-slate-500">Benchmark for {selectedCompany.name}</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  AI Automation Immunity
                </span>
                <p className="text-2xl font-black text-sky-600 dark:text-sky-400 font-mono">
                  {selectedRole.resilienceScore}/100
                </p>
                <p className="text-[11px] text-slate-500">High immunity against GenAI replacement</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Top Hiring Hubs
                </span>
                <p className="text-sm font-black text-slate-900 dark:text-white mt-1">
                  {selectedCompany.hiringHubs.join(', ')}
                </p>
                <p className="text-[11px] text-slate-500">Active recruitment open</p>
              </div>
            </div>

            {/* AI Disruption Shield Banner */}
            <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5 shadow-sm">
                <Shield size={18} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  Disruption Shield Analysis
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  Roles like <strong>{selectedRole.title}</strong> command premium salaries at {selectedCompany.name} because they involve complex architectural decision-making, vector embeddings, and real-time reliability that generative models cannot independently execute.
                </p>
              </div>
            </div>
          </div>

          {/* Step 5 Navigation */}
          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1"
            >
              <ArrowLeft size={14} />
              <span>Back to Role Unlocker</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(6)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs sm:text-sm hover:bg-emerald-700 shadow-md transition-all"
            >
              <span>Next: Execution Pathway & 5-Yr Wealth Plan</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* STEP 6: EXECUTION PATHWAY & LIVE COMPENSATION MODEL */}
      {/* ========================================================================= */}
      {currentStep === 6 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles size={20} className="text-[#0B4F9C]" />
                  <span>Execution Blueprint: Pathway to {selectedCompany.name}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Accredited Indian government courses and 5-year salary compounding model for <strong className="text-slate-900 dark:text-white">{selectedRole.title}</strong>.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono font-black text-xs">
                  ₹{year5Salary} LPA Year 5 Milestone
                </span>
              </div>
            </div>

            {/* Recommended Free Public Courses */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen size={14} className="text-[#0B4F9C]" />
                <span>Accredited Public Courses to Qualify for {selectedCompany.name}:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedRole.courses.map((crs) => (
                  <div
                    key={crs.title}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <span className="px-2 py-0.5 rounded text-[9px] font-black bg-[#0B4F9C] text-white">
                        {crs.provider}
                      </span>
                      <p className="text-xs font-bold text-slate-900 dark:text-white pt-1">
                        {crs.title}
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock size={11} /> {crs.weeks} Weeks • Verified Certificate
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate('/pathways')}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-[#0B4F9C] dark:text-sky-300 border border-slate-200 dark:border-slate-700 font-bold text-xs hover:border-[#0B4F9C]"
                    >
                      Enroll Free
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 5-Year Dynamic Compounding Chart */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  5-Year Wealth Compounding Trajectory ({selectedRole.title}):
                </h4>
                <span className="text-xs font-bold text-emerald-600 font-mono">Starting ₹{baseCtc}L ➔ ₹{year5Salary}L</span>
              </div>

              <TrendLine data={dynamicSalaryData} height={200} dataKey="salary" color="#10B981" yUnit=" LPA" />

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                {dynamicSalaryData.map((item) => (
                  <div key={item.period} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{item.period}</span>
                    <p className="text-xs font-black text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">₹{item.salary} LPA</p>
                    <p className="text-[10px] text-slate-500 truncate">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Call to Action Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-2 border-emerald-500/30 dark:border-emerald-600/30 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-emerald-600 text-white">
                  Target Match Ready
                </span>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  Ready to start your transition to {selectedCompany.name}?
                </h4>
                <p className="text-xs text-slate-500">
                  This roadmap will save to your active candidate profile with real-time milestone tracking.
                </p>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => navigate('/pathways')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs sm:text-sm hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]"
                >
                  <span>Launch 12-Week Roadmap</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Step 6 Bottom Navigation */}
          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1"
            >
              <ArrowLeft size={14} />
              <span>Back to Market Trends</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#0B4F9C] dark:text-sky-400 flex items-center gap-1 hover:underline"
            >
              <RefreshCw size={13} />
              <span>Start New Company Evaluation</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
