import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import {
  FileText,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Briefcase,
  Award,
  Sparkles,
  ShieldCheck,
  Star,
  ChevronRight,
  MapPin,
  Check,
} from 'lucide-react'

export interface SalariedJobRole {
  id: string
  company: string
  logoText: string
  color: string
  roleTitle: string
  salaryMonthly: string
  salaryLPA: string
  location: string
  benefits: string[]
  matchScore: number
  skillsNeeded: string[]
  type: 'Permanent Salaried' | 'On-Roll Corporate'
}

export default function GigWorkProofCareer({
  candidateName = 'Ramesh Kumar',
  city = 'Lucknow',
}: {
  candidateName?: string
  city?: string
}) {
  const [showCertificateModal, setShowCertificateModal] = useState(false)
  const [copiedCertificate, setCopiedCertificate] = useState(false)
  const [appliedJob, setAppliedJob] = useState<string | null>(null)

  const certNumber = 'PNR-GIG-2026-UP32-8819'
  const certUrl = `https://punarshuru.in/verify/${certNumber}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(certUrl)
    setCopiedCertificate(true)
    setTimeout(() => setCopiedCertificate(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  // Recommended Permanent Jobs for Gig Veterans
  const corporateRoles: SalariedJobRole[] = [
    {
      id: 'job-1',
      company: 'Zepto Quick Commerce',
      logoText: 'ZP',
      color: 'bg-purple-600 text-white',
      roleTitle: 'Dark Store Shift Operations Lead',
      salaryMonthly: '₹34,000 / month',
      salaryLPA: '₹4.2 - ₹4.8 LPA',
      location: `${city} (Gomti Nagar Hub)`,
      benefits: ['Provident Fund (PF)', 'ESI Health Card', 'Fixed 8-Hour Shift', 'Quarterly Bonus'],
      matchScore: 92,
      skillsNeeded: ['Inventory Batch Inwarding', 'Rider SLA Dispatch', 'Team Handling'],
      type: 'On-Roll Corporate',
    },
    {
      id: 'job-2',
      company: 'Delhivery Supply Chain',
      logoText: 'DL',
      color: 'bg-red-600 text-white',
      roleTitle: 'Last-Mile Hub Supervisor',
      salaryMonthly: '₹38,000 / month',
      salaryLPA: '₹4.6 - ₹5.4 LPA',
      location: `${city} (Transport Nagar)`,
      benefits: ['Medical Insurance for Family', 'Fuel Allowance', 'Annual Increment', 'Paid Leaves'],
      matchScore: 88,
      skillsNeeded: ['Route Geographic Clustering', 'Cash Reconciliation', 'Dispatch Audit'],
      type: 'Permanent Salaried',
    },
    {
      id: 'job-3',
      company: 'Shadowfax Technologies',
      logoText: 'SF',
      color: 'bg-amber-600 text-white',
      roleTitle: 'City Fleet Operations Coordinator',
      salaryMonthly: '₹42,000 / month',
      salaryLPA: '₹5.0 - ₹5.8 LPA',
      location: `${city} / Regional Hub`,
      benefits: ['Corporate Laptop', 'Mobile Allowance', 'Employee Provident Fund', 'Appraisal'],
      matchScore: 84,
      skillsNeeded: ['Partner Onboarding', 'SLA Escalations', 'Basic Excel Reporting'],
      type: 'Permanent Salaried',
    },
    {
      id: 'job-4',
      company: 'Amazon Logistics (ATS)',
      logoText: 'AZ',
      color: 'bg-slate-900 text-white',
      roleTitle: 'Sortation Center Quality Specialist',
      salaryMonthly: '₹36,500 / month',
      salaryLPA: '₹4.4 - ₹5.0 LPA',
      location: `${city} Outskirts Hub`,
      benefits: ['Night Shift Allowance', 'Insurance & Health', 'Permanent Staff ID', 'PF Match'],
      matchScore: 80,
      skillsNeeded: ['Barcode Handheld Scanner', 'Damage Goods Audit', 'SOP Compliance'],
      type: 'On-Roll Corporate',
    },
  ]

  return (
    <div className="space-y-6">
      {/* ── 1. Top Bar ── */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-slate-900 border border-emerald-200/80 dark:border-emerald-900/60 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-black mb-2">
            <Award size={13} className="text-emerald-600" />
            <span>Pillar 4 • Career Growth, Loan Certificate & Salaried Jobs</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Official Work Proof Certificate & Corporate Transitions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Bank loan (SBI/HDFC) ke liye verified income certificate aur delivery se permanent salaried job me transition.
          </p>
        </div>

        <button
          onClick={() => setShowCertificateModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-[#0B4F9C] hover:bg-blue-800 text-white font-black text-xs flex items-center gap-2 shadow-md cursor-pointer transition hover:scale-105 active:scale-95"
        >
          <FileText size={15} />
          <span>View Stamped Income Certificate</span>
        </button>
      </div>

      {/* ── 2. Official Income & Work Proof Certificate Preview Card ── */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-300/80 dark:border-emerald-800/80 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black">
              <ShieldCheck size={26} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                BANK & RECRUITER VERIFIED DOCUMENT
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Punarshuru Official Gig Work & Income Proof
              </h3>
              <p className="text-xs text-slate-500 font-mono">Certificate ID: {certNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              {copiedCertificate ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
              <span>{copiedCertificate ? 'Link Copied!' : 'Copy Share Link'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition cursor-pointer"
            >
              <Download size={14} />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Certificate Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400">Verified Trips/Orders</p>
            <p className="text-lg font-black text-slate-900 dark:text-white">4,540+ Orders</p>
            <p className="text-[10px] text-emerald-600 font-bold">100% Audit Passed</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400">Monthly Average Income</p>
            <p className="text-lg font-black text-emerald-600">₹28,500 / month</p>
            <p className="text-[10px] text-slate-400">Past 12-Month Net Avg</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400">Customer Rating</p>
            <p className="text-lg font-black text-amber-500 flex items-center justify-center gap-1">
              <Star size={14} className="fill-amber-500" /> 4.88 / 5.0
            </p>
            <p className="text-[10px] text-slate-400">Top 5% in {city}</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400">Loan Eligibility Index</p>
            <p className="text-lg font-black text-[#0B4F9C] dark:text-sky-400">High (CIBIL 740+)</p>
            <p className="text-[10px] text-slate-400">Pre-Qualified for ₹2.5L</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex items-start gap-3 text-xs text-blue-900 dark:text-blue-200">
          <Sparkles size={18} className="text-[#0B4F9C] dark:text-sky-400 shrink-0 mt-0.5" />
          <p>
            <strong>Bank Loan & Formal Job Acceptance Guarantee:</strong> Yeh certificate SBI, HDFC, TVS Credit aur Hero FinCorp ke personal/two-wheeler loan desk par valid income proof ke taur par accepted hai. Saath hi corporate HR ise verified proof-of-experience manti hai.
          </p>
        </div>
      </div>

      {/* ── 3. Permanent Salaried Job Recommendations ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase size={18} className="text-[#0B4F9C]" />
              <span>Permanent Salaried Job Opportunities in {city}</span>
            </h3>
            <p className="text-xs text-slate-500">
              Delivery chhodkar formal corporate career me switch karein — Fixed salary, PF, ESI aur 8 ghante ki duty.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200/60">
            4 Corporate Openings Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {corporateRoles.map((role) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 hover:border-[#0B4F9C] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm ${role.color}`}
                    >
                      {role.logoText}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{role.company}</p>
                      <h4 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                        {role.roleTitle}
                      </h4>
                    </div>
                  </div>

                  <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200/60">
                    {role.matchScore}% Match
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="font-black text-slate-900 dark:text-white text-sm">{role.salaryMonthly}</span>
                  <span className="text-slate-400">({role.salaryLPA})</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <MapPin size={13} className="text-[#F26B1D]" />
                    {role.location}
                  </span>
                </div>

                {/* Benefits */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {role.benefits.map((b, bIdx) => (
                    <span
                      key={bIdx}
                      className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      ✓ {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  {role.type}
                </span>

                <button
                  onClick={() => setAppliedJob(role.id)}
                  disabled={appliedJob === role.id}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    appliedJob === role.id
                      ? 'bg-emerald-600 text-white font-black'
                      : 'bg-[#0B4F9C] hover:bg-blue-800 text-white font-black'
                  }`}
                >
                  {appliedJob === role.id ? (
                    <>
                      <CheckCircle2 size={14} />
                      <span>Applied With Certificate!</span>
                    </>
                  ) : (
                    <>
                      <span>Apply With Work Proof</span>
                      <ChevronRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── 4. Full Certificate Modal View ── */}
      <AnimatePresence>
        {showCertificateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border-4 border-[#0B4F9C]/30 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative"
            >
              <button
                onClick={() => setShowCertificateModal(false)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer"
              >
                ✕
              </button>

              {/* Certificate Inner Frame */}
              <div className="border-2 border-dashed border-[#0B4F9C]/40 rounded-2xl p-6 space-y-5 bg-gradient-to-b from-blue-50/20 to-orange-50/20 dark:from-slate-800/40 dark:to-slate-900">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                  <div>
                    <h2 className="text-xl font-black text-[#0B4F9C] tracking-tight">PUNARSHURU BHARAT</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      National Gig Worker Skill & Income Verification Authority
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400">ID: {certNumber}</span>
                  </div>
                </div>

                <div className="text-center space-y-2 py-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    CERTIFICATE OF VERIFIED WORK & INCOME RECORD
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    {candidateName}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                    This document certifies that the individual above has completed over <strong>4,540 verified on-demand logistics deliveries</strong> across Swiggy, Zomato, and Uber with a certified <strong>99.1% On-Time SLA</strong> and an active track record of zero cash discrepancies.
                  </p>
                </div>

                {/* Key Certified Numbers */}
                <div className="grid grid-cols-3 gap-3 text-center border-y border-slate-200 dark:border-slate-700 py-3">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Certified Income</p>
                    <p className="text-base font-black text-emerald-600">₹28,500 / mo</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Safety & SLA</p>
                    <p className="text-base font-black text-[#0B4F9C] dark:text-sky-400">99.1% On-Time</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Dispute Rate</p>
                    <p className="text-base font-black text-slate-900 dark:text-white">0.02% (Exemplary)</p>
                  </div>
                </div>

                {/* QR and Verification Stamp */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-xl bg-white border border-slate-200">
                      <QRCodeSVG value={certUrl} size={64} />
                    </div>
                    <div className="text-left text-[11px] text-slate-500">
                      <p className="font-bold text-slate-700 dark:text-slate-300">Scan to Verify Official Record</p>
                      <p className="font-mono text-[10px]">{certUrl}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="w-16 h-16 rounded-full border-2 border-emerald-500/80 text-emerald-600 flex items-center justify-center font-black text-[10px] uppercase text-center rotate-[-12deg]">
                      VERIFIED OFFICIAL
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowCertificateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handlePrint}
                  className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer size={14} />
                  <span>Print Certificate</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
