import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  CheckCircle2,
  Send,
  Copy,
  Check,
  ChevronRight,
  X,
  Target,
} from 'lucide-react'

export interface JobCard {
  id: string
  company: string
  role: string
  salaryLPA: number
  location: string
  status: 'applied' | 'interviewing' | 'offer' | 'archived'
  appliedDate: string
  nextActionDate: string
  nextActionNote: string
}

export default function LaidOffJobTracker() {
  const [jobs, setJobs] = useState<JobCard[]>([
    {
      id: 'job-1',
      company: 'Razorpay',
      role: 'Senior Automation SDET (API & Cloud)',
      salaryLPA: 22.0,
      location: 'Bengaluru (Hybrid)',
      status: 'interviewing',
      appliedDate: '26 Sep 2026',
      nextActionDate: '07 Oct 2026 (Round 2 System Design)',
      nextActionNote: 'Review PyTest fixtures & Dockerized Selenium grid architecture.',
    },
    {
      id: 'job-2',
      company: 'PhonePe',
      role: 'Lead QA Engineer (FinTech Core)',
      salaryLPA: 24.5,
      location: 'Bengaluru',
      status: 'interviewing',
      appliedDate: '29 Sep 2026',
      nextActionDate: '09 Oct 2026 (HM Discussion)',
      nextActionNote: 'Highlight 0-day immediate joining date & payment reconciliation tests.',
    },
    {
      id: 'job-3',
      company: 'Groww',
      role: 'Quality Architect (Trading Ops)',
      salaryLPA: 21.0,
      location: 'Bengaluru',
      status: 'offer',
      appliedDate: '22 Sep 2026',
      nextActionDate: '12 Oct 2026 (Offer Review Deadline)',
      nextActionNote: 'Formal CTC letter ₹21L in-hand; negotiating joining bonus.',
    },
    {
      id: 'job-4',
      company: 'Swiggy Tech',
      role: 'SDET-2 (Logistics Platform)',
      salaryLPA: 20.0,
      location: 'Bengaluru / Remote',
      status: 'applied',
      appliedDate: '02 Oct 2026',
      nextActionDate: '08 Oct 2026 (Follow-up Reminder)',
      nextActionNote: 'Sent resume via ex-colleague referral.',
    },
    {
      id: 'job-5',
      company: 'Zepto Engineering',
      role: 'QA Automation Engineer',
      salaryLPA: 19.5,
      location: 'Bengaluru',
      status: 'applied',
      appliedDate: '03 Oct 2026',
      nextActionDate: '10 Oct 2026',
      nextActionNote: 'Recruiter screened on LinkedIn; awaiting test link.',
    },
  ])

  // Weekly goals
  const [weeklyGoal] = useState({
    applicationsTarget: 10,
    applicationsDone: 7,
    networkingTarget: 5,
    networkingDone: 4,
    mockInterviewsTarget: 2,
    mockInterviewsDone: 1,
  })

  // Follow-up generator state
  const [activeTemplate, setActiveTemplate] = useState<'thankyou' | 'followup'>('thankyou')
  const [copiedTemplate, setCopiedTemplate] = useState(false)

  // Add Job Modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCompany, setNewCompany] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newSalary, setNewSalary] = useState(18)
  const [newStatus, setNewStatus] = useState<'applied' | 'interviewing' | 'offer' | 'archived'>('applied')

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCompany || !newRole) return

    const newJob: JobCard = {
      id: `job-${Date.now()}`,
      company: newCompany,
      role: newRole,
      salaryLPA: newSalary,
      location: 'Bengaluru (Hybrid)',
      status: newStatus,
      appliedDate: 'Today',
      nextActionDate: 'Follow-up in 3 days',
      nextActionNote: 'Track application progress on LinkedIn/Email.',
    }

    setJobs([newJob, ...jobs])
    setNewCompany('')
    setNewRole('')
    setShowAddModal(false)
  }

  const moveJob = (id: string, newStatus: JobCard['status']) => {
    setJobs(jobs.map((j) => (j.id === id ? { ...j, status: newStatus } : j)))
  }

  // Templates
  const templates = {
    thankyou: `Hi [Interviewer Name],%0A%0AThank you so much for taking the time to speak with me today about the [Role Title] position at [Company]. I really enjoyed learning about the challenges your team is solving around [Topic discussed].%0A%0AWith my background in test automation frameworks and immediate availability (0-day notice period), I am confident I can contribute from Day 1.%0A%0ALooking forward to the next steps!%0A%0ABest regards,%0AArjun Mehta`,
    followup: `Hi [Recruiter Name],%0A%0AHope you're having a productive week!%0A%0AI am writing to follow up on my interview for the [Role Title] position on [Date]. I remain very excited about the opportunity to join [Company] and hit the ground running immediately.%0A%0ACould you please share any updates on the interview feedback or next steps?%0A%0AThank you!%0AArjun Mehta`,
  }

  const handleCopyTemplate = () => {
    const raw = decodeURIComponent(templates[activeTemplate]).replace(/%0A/g, '\n')
    navigator.clipboard.writeText(raw)
    setCopiedTemplate(true)
    setTimeout(() => setCopiedTemplate(false), 2000)
  }

  // Grouped columns
  const appliedList = jobs.filter((j) => j.status === 'applied')
  const interviewingList = jobs.filter((j) => j.status === 'interviewing')
  const offerList = jobs.filter((j) => j.status === 'offer')

  return (
    <div className="space-y-6">
      {/* ── 1. Top Header ── */}
      <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-slate-900 border border-blue-200/80 dark:border-blue-900/60 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-[#0B4F9C] dark:text-sky-300 text-xs font-black mb-2">
            <Target size={13} />
            <span>Pillar 2 • Job Pipeline Kanban & Weekly Discipline</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Re-Employment Application Pipeline & Goal Tracker
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Track interview rounds, follow-up deadlines, and maintain aggressive weekly outreach discipline.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-[#0B4F9C] hover:bg-blue-800 text-white font-black text-xs flex items-center gap-2 shadow-md cursor-pointer transition hover:scale-105 active:scale-95"
        >
          <Plus size={15} />
          <span>Add New Job Application</span>
        </button>
      </div>

      {/* ── 2. Weekly Goals Ribbon ── */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            Sprint Discipline: This Week's Re-Employment Targets
          </span>
          <span className="text-xs font-bold text-emerald-600">Sprint Week 2 Active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Target Applications:</span>
              <span className="font-black text-[#0B4F9C] dark:text-sky-400">
                {weeklyGoal.applicationsDone} / {weeklyGoal.applicationsTarget}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-[#0B4F9C] rounded-full"
                style={{ width: `${(weeklyGoal.applicationsDone / weeklyGoal.applicationsTarget) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Networking Outreach:</span>
              <span className="font-black text-purple-600 dark:text-purple-400">
                {weeklyGoal.networkingDone} / {weeklyGoal.networkingTarget}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full"
                style={{ width: `${(weeklyGoal.networkingDone / weeklyGoal.networkingTarget) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Mock Technical Rounds:</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400">
                {weeklyGoal.mockInterviewsDone} / {weeklyGoal.mockInterviewsTarget}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full"
                style={{ width: `${(weeklyGoal.mockInterviewsDone / weeklyGoal.mockInterviewsTarget) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Interactive Kanban Board ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Column 1: Applied */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-black text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <span>📋 Applied & Pending Screening</span>
            </span>
            <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px]">
              {appliedList.length}
            </span>
          </div>

          <div className="space-y-3">
            {appliedList.map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">{job.company}</h4>
                    <p className="text-xs text-slate-500 font-medium">{job.role}</p>
                  </div>
                  <span className="text-xs font-black text-emerald-600">₹{job.salaryLPA} LPA</span>
                </div>

                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Action:</span> {job.nextActionNote}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400">{job.appliedDate}</span>
                  <button
                    onClick={() => moveJob(job.id, 'interviewing')}
                    className="font-bold text-[#0B4F9C] dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Move to Interview</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Interviewing */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-100/70 dark:bg-blue-950/60 text-xs font-black text-[#0B4F9C] dark:text-sky-300 border border-blue-200 dark:border-blue-900">
            <span className="flex items-center gap-1.5">
              <span>🎯 In Active Interview Loops</span>
            </span>
            <span className="w-5 h-5 rounded-full bg-blue-200 dark:bg-blue-900 flex items-center justify-center text-[10px]">
              {interviewingList.length}
            </span>
          </div>

          <div className="space-y-3">
            {interviewingList.map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-300/80 dark:border-blue-800 shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">{job.company}</h4>
                    <p className="text-xs text-slate-500 font-medium">{job.role}</p>
                  </div>
                  <span className="text-xs font-black text-emerald-600">₹{job.salaryLPA} LPA</span>
                </div>

                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[11px] text-blue-900 dark:text-blue-200 border border-blue-200/50">
                  <span className="font-bold">Next:</span> {job.nextActionDate}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => moveJob(job.id, 'applied')}
                    className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => moveJob(job.id, 'offer')}
                    className="font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Offer Received! 🏆</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Offer Received */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-100/70 dark:bg-emerald-950/60 text-xs font-black text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
            <span className="flex items-center gap-1.5">
              <span>🏆 Offers & Final Negotiations</span>
            </span>
            <span className="w-5 h-5 rounded-full bg-emerald-200 dark:bg-emerald-900 flex items-center justify-center text-[10px]">
              {offerList.length}
            </span>
          </div>

          <div className="space-y-3">
            {offerList.map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-slate-900 border-2 border-emerald-400 shadow-md space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-300">
                      OFFER IN HAND
                    </span>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">{job.company}</h4>
                    <p className="text-xs text-slate-500 font-medium">{job.role}</p>
                  </div>
                  <span className="text-sm font-black text-emerald-600">₹{job.salaryLPA} LPA</span>
                </div>

                <p className="text-xs text-emerald-900 dark:text-emerald-200 font-medium leading-relaxed">
                  {job.nextActionNote}
                </p>

                <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-900/60 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400">Target joining: Immediate</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 size={13} /> Accepted
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. Smart Follow-Up Generator ── */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Send size={16} className="text-sky-400" />
              <span>Smart Recruiter Follow-Up Mail Generator</span>
            </h3>
            <p className="text-xs text-slate-400">
              High-converting follow-up templates emphasizing your 0-day immediate joining date.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1 rounded-xl bg-slate-800 flex items-center gap-1 border border-slate-700">
              <button
                onClick={() => setActiveTemplate('thankyou')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTemplate === 'thankyou' ? 'bg-sky-500 text-white' : 'text-slate-400'
                }`}
              >
                Post-Interview Thank You (24h)
              </button>
              <button
                onClick={() => setActiveTemplate('followup')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTemplate === 'followup' ? 'bg-sky-500 text-white' : 'text-slate-400'
                }`}
              >
                Status Check (5 Days Silence)
              </button>
            </div>

            <button
              onClick={handleCopyTemplate}
              className="px-3.5 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100 transition cursor-pointer"
            >
              {copiedTemplate ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copiedTemplate ? 'Copied!' : 'Copy Email'}</span>
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
          {decodeURIComponent(templates[activeTemplate]).replace(/%0A/g, '\n')}
        </div>
      </div>

      {/* ── Add Job Modal ── */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white">Track New Job Application</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddJob} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Company Name:</label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. Swiggy, Cred, Zepto"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Role Title:</label>
                  <input
                    type="text"
                    required
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Automation SDET / Cloud QA"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Target CTC (LPA):</label>
                    <input
                      type="number"
                      value={newSalary}
                      onChange={(e) => setNewSalary(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Current Stage:</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="applied">Applied</option>
                      <option value="interviewing">Interviewing</option>
                      <option value="offer">Offer Received</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#0B4F9C] text-white font-black"
                  >
                    Save Application
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
