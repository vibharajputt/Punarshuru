import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  GraduationCap,
  Sparkles,
  MessageSquare,
  Calendar,
  Search,
  CheckCircle2,
  Star,
  ShieldCheck,
  Send,
  X,
  Clock,
} from 'lucide-react'

export interface PlacedSenior {
  id: string
  name: string
  avatarInitial: string
  avatarBg: string
  placedCompany: string
  companyLogoBg: string
  role: string
  packageLPA: string
  college: string
  batch: string
  skillsCrackedWith: string[]
  expertise: string[]
  bio: string
  verified: boolean
  rating: number
  reviewsCount: number
  availableSlotsCount: number
  sampleAdvice: string
}

const SENIOR_MENTORS: PlacedSenior[] = [
  {
    id: 's-1',
    name: 'Amanpreet Singh',
    avatarInitial: 'AS',
    avatarBg: 'bg-blue-600 text-white',
    placedCompany: 'Razorpay',
    companyLogoBg: 'bg-blue-700 text-white',
    role: 'Software Development Engineer - 1',
    packageLPA: '₹16.5 LPA',
    college: 'PEC Chandigarh (2024 Batch)',
    batch: '2024 Passed Out',
    skillsCrackedWith: ['Java & Spring Boot', 'AWS ECS', 'PostgreSQL Indexing', 'DSA (Graph & DP)'],
    expertise: ['Product Company Rounds', 'System Design Basics', 'Off-Campus Referral Strategy'],
    bio: 'Cracked Razorpay off-campus with 0 past internships by showcasing 2 production-ready AWS projects and strong DSA fundamentals.',
    verified: true,
    rating: 4.9,
    reviewsCount: 38,
    availableSlotsCount: 3,
    sampleAdvice:
      'In my Razorpay technical round, they asked me to write an idempotent payment webhook handler and profile a slow SQL query. Focus on real API reliability over rote syntax!',
  },
  {
    id: 's-2',
    name: 'Rhea Sharma',
    avatarInitial: 'RS',
    avatarBg: 'bg-emerald-600 text-white',
    placedCompany: 'Amazon',
    companyLogoBg: 'bg-amber-600 text-white',
    role: 'Cloud Support Associate / SDE Intern',
    packageLPA: '₹22.0 LPA',
    college: 'Thapar Institute of Engg. (2025 Batch)',
    batch: '2025 Final Year Placed',
    skillsCrackedWith: ['AWS Cloud Essentials', 'Docker & CI/CD', 'Linux Networking', 'Python APIs'],
    expertise: ['AWS Certification Tips', 'Amazon Leadership Principles', 'Resume ATS Screening'],
    bio: 'Cleared Amazon campus recruitment drive. Love helping juniors crack cloud architectures and behavioral rounds with the STAR method.',
    verified: true,
    rating: 5.0,
    reviewsCount: 52,
    availableSlotsCount: 2,
    sampleAdvice:
      'Amazon interviewers deeply test Leadership Principles (Customer Obsession & Bias for Action). Always structure your project answers using the STAR method!',
  },
  {
    id: 's-3',
    name: 'Vikram Joshi',
    avatarInitial: 'VJ',
    avatarBg: 'bg-purple-600 text-white',
    placedCompany: 'Sarvam AI',
    companyLogoBg: 'bg-emerald-700 text-white',
    role: 'Junior GenAI Engineer',
    packageLPA: '₹18.0 LPA',
    college: 'NIT Jalandhar (2024 Batch)',
    batch: '2024 Passed Out',
    skillsCrackedWith: ['LangChain / LlamaIndex', 'Python', 'Vector DBs (Qdrant)', 'RAG Pipelines'],
    expertise: ['GenAI Portfolio Review', 'AI Startup Interviews', 'FastAPI Microservices'],
    bio: 'Pivoted from Tier-2 CS to India’s top GenAI startup by open-sourcing an Indic RAG document bot on GitHub with 150+ stars.',
    verified: true,
    rating: 4.9,
    reviewsCount: 41,
    availableSlotsCount: 4,
    sampleAdvice:
      'For AI startups, nobody cares about textbook math proofs. Show a working deployed endpoint with evaluation metrics and low latency chunking!',
  },
  {
    id: 's-4',
    name: 'Harshit Gupta',
    avatarInitial: 'HG',
    avatarBg: 'bg-rose-600 text-white',
    placedCompany: 'TCS Digital (Prime)',
    companyLogoBg: 'bg-sky-700 text-white',
    role: 'Digital Software Engineer (Specialist)',
    packageLPA: '₹9.0 LPA',
    college: 'Chitkara University (2024 Batch)',
    batch: '2024 Passed Out',
    skillsCrackedWith: ['Fullstack React + Node', 'Clean SQL', 'DSA Patterns', 'Git & Docker'],
    expertise: ['TCS NQT / Digital Coding', 'Service-to-Product Transition', 'Mass Drive Cracking'],
    bio: 'Upgraded from regular TCS Ninja package (₹3.6 LPA) to TCS Digital Prime (₹9.0 LPA) in the national qualifier test by mastering advanced DSA & cloud.',
    verified: true,
    rating: 4.8,
    reviewsCount: 64,
    availableSlotsCount: 5,
    sampleAdvice:
      'In TCS NQT, clearing the advanced coding section with 100% test cases automatically promotes you to Digital interview round. Focus on sliding window & trees!',
  },
  {
    id: 's-5',
    name: 'Divya Malhotra',
    avatarInitial: 'DM',
    avatarBg: 'bg-indigo-600 text-white',
    placedCompany: 'Swiggy',
    companyLogoBg: 'bg-orange-600 text-white',
    role: 'Associate Platform Engineer',
    packageLPA: '₹17.5 LPA',
    college: 'CCET Chandigarh (2025 Batch)',
    batch: '2025 Final Year Placed',
    skillsCrackedWith: ['TypeScript / Next.js', 'Docker Compose', 'Redis Caching', 'Kafka Basics'],
    expertise: ['Fullstack System Design', 'Clean GitHub Architecture', 'Portfolio Audits'],
    bio: 'Cracked Swiggy early engineering drive. Specialized in microservices dispatch pipelines and asynchronous worker queues.',
    verified: true,
    rating: 5.0,
    reviewsCount: 29,
    availableSlotsCount: 2,
    sampleAdvice:
      'Always have your projects hosted on a live URL with a clear 1-minute video demo in your GitHub README. Recruiters spend 30 seconds scanning your repo!',
  },
]

export default function SeniorMentorshipWidget() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [activeChatSenior, setActiveChatSenior] = useState<PlacedSenior | null>(null)
  const [chatMessages, setChatMessages] = useState<{ sender: 'senior' | 'student'; text: string; time: string }[]>([])
  const [inputMsg, setInputMsg] = useState('')
  const [bookedSlotSenior, setBookedSlotSenior] = useState<PlacedSenior | null>(null)
  const [selectedSlotTime, setSelectedSlotTime] = useState<string>('Tomorrow, 6:30 PM')
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false)

  const filteredSeniors = useMemo(() => {
    return SENIOR_MENTORS.filter((s) => {
      const matchCat =
        selectedCategory === 'All' ||
        (selectedCategory === 'Product Unicorns' && ['Razorpay', 'Swiggy'].includes(s.placedCompany)) ||
        (selectedCategory === 'Global Tech & Cloud' && ['Amazon'].includes(s.placedCompany)) ||
        (selectedCategory === 'AI & Startups' && ['Sarvam AI'].includes(s.placedCompany)) ||
        (selectedCategory === 'Specialist Drives' && ['TCS Digital (Prime)'].includes(s.placedCompany))

      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.placedCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.skillsCrackedWith.some((sk) => sk.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchCat && matchSearch
    })
  }, [selectedCategory, searchQuery])

  const openChatWithSenior = (senior: PlacedSenior) => {
    setActiveChatSenior(senior)
    setChatMessages([
      {
        sender: 'senior',
        text: `Hey! 👋 I'm ${senior.name.split(' ')[0]} (placed at ${senior.placedCompany} - ${senior.packageLPA}). Ask me anything about how I cracked the interview, round structures, or resume tips!`,
        time: 'Just now',
      },
    ])
  }

  const handleSendMessage = () => {
    if (!inputMsg.trim() || !activeChatSenior) return
    const newMsg = inputMsg.trim()
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setChatMessages((prev) => [...prev, { sender: 'student', text: newMsg, time: now }])
    setInputMsg('')

    // Simulate smart, authentic senior reply
    setTimeout(() => {
      let replyText = `Great question! When I prepared for ${activeChatSenior.placedCompany}, the most important thing was making sure my ${activeChatSenior.skillsCrackedWith[0]} project had a live deployed URL and clean README. Don't stress too much about memorizing everything — focus on why you chose this architecture and how you handled edge cases.`
      if (newMsg.toLowerCase().includes('resume') || newMsg.toLowerCase().includes('cv')) {
        replyText = `For resumes at ${activeChatSenior.placedCompany}, keep it strictly 1 page, highlight measurable metrics (e.g. "reduced latency by 35%"), and put your live GitHub links right at the top under your name.`
      } else if (newMsg.toLowerCase().includes('referral') || newMsg.toLowerCase().includes('off campus')) {
        replyText = `For off-campus referrals, connect with alumni on LinkedIn and send a 2-line polite note with your GitHub repo demo link instead of a generic message. 80% seniors respond when they see real code!`
      } else if (newMsg.toLowerCase().includes('dsa') || newMsg.toLowerCase().includes('round 1')) {
        replyText = `For Round 1 coding, focus on standard NeetCode 150 patterns (Two Pointers, HashMaps, Sliding Window, Trees). You don't need 1000 problems — 150 well-understood patterns are enough to clear top product rounds.`
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'senior',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    }, 1000)
  }

  const openBookSlot = (senior: PlacedSenior) => {
    setBookedSlotSenior(senior)
    setBookingConfirmed(false)
  }

  const confirmBooking = () => {
    setBookingConfirmed(true)
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-7">
      {/* ── 1. Header & Community Metrics Banner ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/60 dark:to-blue-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-black mb-1.5 border border-emerald-200/50">
            <Users size={13} className="text-emerald-600" />
            <span>Alumni & Senior Guidance Network</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Connect with Recently Placed Seniors (2024-2025 Batches)
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            Talk directly with seniors from your region and colleges who recently cracked Google, Amazon, Razorpay, and TCS Digital. Get free resume audits, referral tips, and interview secrets.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>18 Seniors Active Online</span>
          </span>
        </div>
      </div>

      {/* ── 2. Senior Impact Metrics ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 text-center">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Placed Mentors</div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">42+ Seniors</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 text-center">
          <div className="text-[10px] uppercase font-bold text-slate-400">Top Package Cracked</div>
          <div className="text-xl font-black text-[#F26B1D] mt-0.5">₹32.0 LPA</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 text-center">
          <div className="text-[10px] uppercase font-bold text-slate-400">Student Doubts Solved</div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">520+ Q&As</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 text-center">
          <div className="text-[10px] uppercase font-bold text-slate-400">Guidance Cost</div>
          <div className="text-xl font-black text-[#0B4F9C] dark:text-sky-400 mt-0.5">100% Free Peer Aid</div>
        </div>
      </div>

      {/* ── 3. Filters & Search Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', 'Product Unicorns', 'Global Tech & Cloud', 'AI & Startups', 'Specialist Drives'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0B4F9C] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search senior, company or college..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-[#0B4F9C]"
          />
        </div>
      </div>

      {/* ── 4. Placed Seniors Profile Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSeniors.map((senior) => (
          <div
            key={senior.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:border-[#0B4F9C]/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Senior Top Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-xs ${senior.avatarBg}`}
                  >
                    {senior.avatarInitial}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                        {senior.name}
                      </h4>
                      {senior.verified && (
                        <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                      <GraduationCap size={12} className="text-slate-400" />
                      <span>{senior.college}</span>
                    </p>
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 text-xs font-extrabold shrink-0">
                  <Star size={12} className="fill-amber-500 text-amber-500" />
                  <span>{senior.rating}</span>
                  <span className="text-[10px] text-slate-400">({senior.reviewsCount})</span>
                </div>
              </div>

              {/* Company & Placement Badge */}
              <div className="mt-3.5 p-3 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/50 dark:from-slate-900 dark:to-blue-950/40 border border-blue-100 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-black ${senior.companyLogoBg}`}>
                    {senior.placedCompany}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate">
                      {senior.role}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Package</span>
                  <span className="text-xs font-black text-[#F26B1D]">{senior.packageLPA}</span>
                </div>
              </div>

              {/* Bio / How They Cracked It */}
              <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                {senior.bio}
              </p>

              {/* Skills Cracked With */}
              <div className="mt-3 space-y-1.5">
                <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
                  Key Skills Evaluated in Interview:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {senior.skillsCrackedWith.map((sk, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sample Advice Quote */}
              <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 italic">
                "{senior.sampleAdvice}"
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <button
                type="button"
                onClick={() => openChatWithSenior(senior)}
                className="flex-1 py-2 rounded-xl bg-[#0B4F9C] hover:bg-blue-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <MessageSquare size={13} />
                <span>Chat & Ask Question</span>
              </button>

              <button
                type="button"
                onClick={() => openBookSlot(senior)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#0B4F9C] text-slate-700 dark:text-slate-200 hover:text-[#0B4F9C] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar size={13} className="text-[#F26B1D]" />
                <span>Book 15m Slot ({senior.availableSlotsCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── 5. Golden Rules for Juniors from Placed Seniors ── */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-amber-400" />
          <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
            Top 3 Placement Golden Rules Shared by Placed Seniors
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs space-y-1">
            <span className="text-[10px] font-extrabold text-sky-400">Rule 1: Build 1 Live Deploy</span>
            <p className="text-slate-300 leading-relaxed font-medium">
              Don't create 5 half-baked academic projects. Build 1 robust full-stack / AI app deployed live on AWS/Render with a working domain and README demo.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs space-y-1">
            <span className="text-[10px] font-extrabold text-emerald-400">Rule 2: Master NeetCode 150</span>
            <p className="text-slate-300 leading-relaxed font-medium">
              You don't need 1000 LeetCode problems. 150 well-understood standard DSA patterns (Trees, Two-Pointer, HashMaps, DFS/BFS) clear 90% of product Round 1s.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs space-y-1">
            <span className="text-[10px] font-extrabold text-amber-400">Rule 3: Smart Referral Pitch</span>
            <p className="text-slate-300 leading-relaxed font-medium">
              When reaching out to alumni for referrals, never send a dry resume. Send a 2-line polite intro with your live project link and the specific Job ID.
            </p>
          </div>
        </div>
      </div>

      {/* ── 6. Interactive 1-on-1 Chat Modal / Drawer ── */}
      <AnimatePresence>
        {activeChatSenior && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[520px]"
            >
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${activeChatSenior.avatarBg}`}
                  >
                    {activeChatSenior.avatarInitial}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{activeChatSenior.name}</span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-[#0B4F9C] dark:text-sky-300">
                        {activeChatSenior.placedCompany}
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {activeChatSenior.college} • {activeChatSenior.packageLPA}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveChatSenior(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'student' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed font-medium ${
                        msg.sender === 'student'
                          ? 'bg-[#0B4F9C] text-white rounded-br-xs shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs border border-slate-200/60 dark:border-slate-700'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Smart Quick Prompt Pills */}
              <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap gap-1.5">
                {[
                  'How did you crack Round 2 technical?',
                  'Can you review my GitHub portfolio?',
                  'How to get off-campus referrals for 2025/2026?',
                ].map((pill, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInputMsg(pill)
                    }}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#0B4F9C] transition cursor-pointer"
                  >
                    💡 {pill}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask senior a placement or resume question..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0B4F9C]"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2.5 rounded-xl bg-[#0B4F9C] hover:bg-blue-800 text-white transition shadow-xs cursor-pointer"
                >
                  <Send size={15} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 7. Booking 1-on-1 Slot Modal ── */}
      <AnimatePresence>
        {bookedSlotSenior && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5"
            >
              {!bookingConfirmed ? (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#0B4F9C] dark:text-sky-400">
                        Free 1-on-1 Guidance Slot
                      </span>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white">
                        Book 15-Min with {bookedSlotSenior.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Placed at {bookedSlotSenior.placedCompany} ({bookedSlotSenior.packageLPA})
                      </p>
                    </div>
                    <button
                      onClick={() => setBookedSlotSenior(null)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 transition cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Choose Preferred Free Time Slot:
                    </label>
                    <div className="space-y-2">
                      {[
                        'Today, 8:00 PM (Google Meet)',
                        'Tomorrow, 6:30 PM (Google Meet)',
                        'Saturday, 11:00 AM (Mock Interview & Resume)',
                      ].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlotTime(slot)}
                          className={`w-full p-3 rounded-2xl text-left text-xs font-bold border transition flex items-center justify-between cursor-pointer ${
                            selectedSlotTime === slot
                              ? 'bg-blue-50 dark:bg-blue-950/60 border-[#0B4F9C] text-[#0B4F9C] dark:text-sky-300'
                              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Clock size={14} className="text-[#F26B1D]" />
                            <span>{slot}</span>
                          </span>
                          {selectedSlotTime === slot && <CheckCircle2 size={15} className="text-[#0B4F9C]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                    ✨ <strong>100% Free Peer Aid:</strong> Senior will review your GitHub repository and give 1-on-1 interview feedback over Google Meet.
                  </div>

                  <button
                    type="button"
                    onClick={confirmBooking}
                    className="w-full py-3 rounded-2xl bg-[#0B4F9C] hover:bg-blue-800 text-white text-xs font-black transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Confirm Free 15-Min Slot</span>
                    <CheckCircle2 size={15} />
                  </button>
                </>
              ) : (
                <div className="text-center py-4 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">
                    Slot Booked with {bookedSlotSenior.name}! 🎉
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto">
                    Confirmed for <strong>{selectedSlotTime}</strong>. A calendar invite with the Google Meet link has been prepared for you.
                  </p>
                  <button
                    type="button"
                    onClick={() => setBookedSlotSenior(null)}
                    className="mt-3 px-6 py-2.5 rounded-xl bg-[#0B4F9C] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
