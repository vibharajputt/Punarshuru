import { useState } from 'react'
import {
  Users,
  Briefcase,
  Building2,
  Landmark,
} from 'lucide-react'

export interface ContactItem {
  id: string
  name: string
  company: string
  role: string
  relationship: string
  lastContactDate: string
  referralStatus: 'referral-sent' | 'call-scheduled' | 'waiting-response' | 'lead-closed'
  notes: string
}

export interface ContractGig {
  id: string
  title: string
  clientType: string
  duration: string
  monthlyPay: string
  skills: string[]
  platform: string
}

export default function LaidOffNetworkingCRM() {
  const [contacts] = useState<ContactItem[]>([
    {
      id: 'c-1',
      name: 'Vikram Sethi',
      company: 'Razorpay',
      role: 'Engineering Manager (Payments)',
      relationship: 'Ex-Colleague (Senior Dev)',
      lastContactDate: '02 Oct 2026',
      referralStatus: 'referral-sent',
      notes: 'Submitted internal referral for Senior SDET; HR screening cleared.',
    },
    {
      id: 'c-2',
      name: 'Pooja Iyer',
      company: 'CRED',
      role: 'Staff Quality Engineer',
      relationship: 'Alumni Network (NIT Trichy)',
      lastContactDate: '29 Sep 2026',
      referralStatus: 'call-scheduled',
      notes: 'Coffee chat on Google Meet scheduled for Tuesday 4 PM.',
    },
    {
      id: 'c-3',
      name: 'Ankit Verma',
      company: 'Groww',
      role: 'Director of QA Engineering',
      relationship: 'Previous Tech Lead',
      lastContactDate: '25 Sep 2026',
      referralStatus: 'lead-closed',
      notes: 'Connected with hiring manager; official offer in review!',
    },
    {
      id: 'c-4',
      name: 'Rohan Deshmukh',
      company: 'Amazon Web Services (AWS)',
      role: 'Technical Recruiter',
      relationship: 'Inbound LinkedIn Outreach',
      lastContactDate: '04 Oct 2026',
      referralStatus: 'waiting-response',
      notes: 'Shared tailored resume for Cloud QA Lead role in Bengaluru.',
    },
  ])

  // Short-term contract gigs to bridge cash flow
  const contractGigs: ContractGig[] = [
    {
      id: 'gig-1',
      title: 'Python Automation Test Suite Overhaul',
      clientType: 'US FinTech Startup (Remote)',
      duration: '8 Weeks Contract',
      monthlyPay: '₹1,20,000 / month',
      skills: ['PyTest', 'API Testing', 'Postman'],
      platform: 'Turing / Toptal',
    },
    {
      id: 'gig-2',
      title: 'QA Framework Migration (Selenium to Playwright)',
      clientType: 'Bengaluru E-Commerce Brand',
      duration: '4 Weeks Sprint',
      monthlyPay: '₹85,000 / month',
      skills: ['Playwright', 'TypeScript', 'GitHub Actions'],
      platform: 'Direct Contractor (Punarshuru Network)',
    },
    {
      id: 'gig-3',
      title: 'Mobile App Regression & Load Testing',
      clientType: 'EdTech Unicorn',
      duration: '6 Weeks Contract',
      monthlyPay: '₹75,000 / month',
      skills: ['Appium', 'JMeter', 'Performance Test'],
      platform: 'Upwork Top Rated',
    },
  ]

  return (
    <div className="space-y-6">
      {/* ── 1. Top Header ── */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-slate-900 border border-emerald-200/80 dark:border-emerald-900/60 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-black mb-2">
            <Users size={13} className="text-emerald-600" />
            <span>Pillar 4 • Networking CRM & Interim Cash Flow</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Referral CRM & Contract Gigs Radar
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Track warm referrals from ex-colleagues and take up 4-8 week contract sprints to keep income flowing.
          </p>
        </div>

        <span className="text-xs font-black px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950">
          4 Warm Contacts In Flight
        </span>
      </div>

      {/* ── 2. Networking CRM Table ── */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 size={16} className="text-[#0B4F9C]" />
            <span>Advocate & Referral Tracker (कहाँ किससे बात हुई?)</span>
          </h3>
          <span className="text-xs text-slate-400 font-semibold">Active Pipelines</span>
        </div>

        <div className="space-y-3">
          {contacts.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">{c.name}</h4>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-bold text-[#0B4F9C] dark:text-sky-400">{c.company}</span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.2 rounded-md ${
                      c.referralStatus === 'lead-closed'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : c.referralStatus === 'call-scheduled'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {c.referralStatus.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {c.role} ({c.relationship})
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">{c.notes}</p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <p className="text-[11px] text-slate-400 font-mono">Last Touch: {c.lastContactDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. Interim Contract & Freelance Bridge ── */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase size={16} className="text-emerald-600" />
              <span>Interim Contract Gigs (बीच के दिनों में कमाई चालू रखें)</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Short 4-8 week engineering contracts that preserve your severance savings while you interview for full-time roles.
            </p>
          </div>
          <span className="text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200/60">
            Avg ₹85,000 / month
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contractGigs.map((g) => (
            <div
              key={g.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700 flex flex-col justify-between space-y-3"
            >
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  {g.platform}
                </span>
                <h4 className="text-sm font-black text-slate-900 dark:text-white mt-1 leading-snug">
                  {g.title}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">{g.clientType} • {g.duration}</p>
                <p className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-2">
                  {g.monthlyPay}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-700">
                <div className="flex flex-wrap gap-1">
                  {g.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <button className="w-full py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition cursor-pointer">
                  Apply for Contract Sprint
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Government & Statutory Relief Guide ── */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Landmark size={18} className="text-amber-400" />
          <div>
            <h3 className="text-base font-black text-white">Statutory & Govt Relief Guide (कानूनी व सरकारी अधिकार)</h3>
            <p className="text-xs text-slate-400">Important government provisions for laid-off Indian professionals</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-1.5">
            <h4 className="font-black text-amber-400">1. ESIC Atal Beemit Vyakti Kalyan Yojana</h4>
            <p className="text-slate-300 leading-relaxed">
              If your salary was covered under ESIC, you are eligible for 50% average daily earning as unemployment compensation for up to 90 days after involuntary job loss.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-1.5">
            <h4 className="font-black text-sky-400">2. EPFO Non-Withdrawal Rule</h4>
            <p className="text-slate-300 leading-relaxed">
              Do not withdraw your Employee Provident Fund immediately. Your EPF continues to earn 8.25% sovereign interest for up to 3 years even when you are between jobs.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
