import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Share2, Check, ShieldCheck, Star, QrCode } from 'lucide-react'

export default function PortableCareerProfile({
  candidateName = 'Ramesh Kumar',
  verifiedSkillsCount = 12,
  completedTasks = 4540,
  rating = 4.85,
  experience = 2.5,
}: {
  candidateName?: string
  verifiedSkillsCount?: number
  completedTasks?: number
  rating?: number
  experience?: number
}) {
  const [copied, setCopied] = useState(false)
  const passportUrl = `https://punarshuru.in/p/ramesh-kumar-passport`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(passportUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const topSkills = [
    'Customer Service & Dispute Resolution',
    'Route Optimization & Navigation',
    'Supply Chain SLA Management',
    'Digital POS & Cash Reconciliation',
    'Field Operations',
  ]

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0B4F9C] dark:text-sky-300 text-xs font-bold mb-1">
            <QrCode size={12} />
            <span>Feature 4 • Portable Career Passport Profile</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Verifiable Skill Passport for Employers
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Shareable digital credential that gives recruiters instant cryptographic trust.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
            <span>{copied ? 'Link Copied!' : 'Share Passport'}</span>
          </button>
        </div>
      </div>

      {/* Verifiable Card Layout */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0B4F9C]/5 via-orange-50/20 to-blue-50/30 dark:from-slate-800/80 dark:via-slate-800/40 dark:to-slate-900 border-2 border-[#0B4F9C]/20 dark:border-blue-900/60 shadow-lg relative overflow-hidden">
        {/* Hologram aesthetic accent */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-orange-400/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          {/* Left Info */}
          <div className="space-y-4 text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0B4F9C] to-[#F26B1D] text-white font-black text-xl flex items-center justify-center shadow-md mx-auto md:mx-0">
                {candidateName.charAt(0)}
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-1.5">
                  <span>{candidateName}</span>
                  <ShieldCheck size={18} className="text-emerald-500" />
                </h4>
                <p className="text-xs text-slate-500 font-semibold">
                  Punarshuru Verified Field & Logistics Specialist
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Verified Skills</div>
                <div className="text-base font-black text-slate-900 dark:text-white">{verifiedSkillsCount} Skills</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Field Tasks</div>
                <div className="text-base font-black text-[#0B4F9C] dark:text-sky-400">{completedTasks.toLocaleString()}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Avg. Rating</div>
                <div className="text-base font-black text-amber-500 flex items-center gap-0.5">
                  <Star size={12} className="fill-amber-500" /> {rating}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Experience</div>
                <div className="text-base font-black text-emerald-600">{experience} Yrs</div>
              </div>
            </div>

            {/* Top Skills Tag list */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                Top Endorsed Skills:
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                {topSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right QR Code */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md text-center shrink-0 space-y-2">
            <div className="p-2 bg-white rounded-xl inline-block">
              <QRCodeSVG value={passportUrl} size={110} level="M" />
            </div>
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
              Scan to Verify
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
