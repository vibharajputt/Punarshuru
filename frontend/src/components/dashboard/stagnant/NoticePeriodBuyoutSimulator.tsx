import { useState, useEffect } from 'react'
import {
  IndianRupee,
  Building2,
  ArrowRight,
  Copy,
  Check,
  Clock,
  ShieldCheck,
  Calculator,
  Mail,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useUserProfile } from '@/store/userProfileStore'

interface BuyoutCompany {
  name: string
  logoBadge: string
  badgeBg: string
  category: string
  buyoutPolicy: string
  joiningBuffer: string
  avgOfferCTC: string
  hiringHubs: string
}

const BUYOUT_COMPANIES: BuyoutCompany[] = [
  {
    name: 'Razorpay',
    logoBadge: 'RZP',
    badgeBg: 'bg-blue-600 text-white',
    category: 'Product Unicorn',
    buyoutPolicy: 'Full 60–90 Day Buyout Reimbursed in 1st Payroll',
    joiningBuffer: '30–45 Days Accepted',
    avgOfferCTC: '₹14 – ₹22 LPA',
    hiringHubs: 'Bengaluru / Hybrid',
  },
  {
    name: 'Barclays Global Tech (GCC)',
    logoBadge: 'BARC',
    badgeBg: 'bg-sky-600 text-white',
    category: 'Banking Tech GCC',
    buyoutPolicy: 'Standard Notice Buyout up to 2 Months Gross Salary',
    joiningBuffer: '60 Days Buffer Standard',
    avgOfferCTC: '₹12 – ₹18 LPA',
    hiringHubs: 'Pune / Noida',
  },
  {
    name: "Lowe's India",
    logoBadge: 'LOW',
    badgeBg: 'bg-indigo-600 text-white',
    category: 'Retail GCC',
    buyoutPolicy: 'Joining Bonus Structured to Cover Full 90-Day Buyout',
    joiningBuffer: '45 Days Buffer',
    avgOfferCTC: '₹13 – ₹19 LPA',
    hiringHubs: 'Bengaluru',
  },
  {
    name: 'Swiggy',
    logoBadge: 'SWG',
    badgeBg: 'bg-orange-500 text-white',
    category: 'Product Scaleup',
    buyoutPolicy: 'Fast-Track Joining Sign-on Bonus matching Buyout cost',
    joiningBuffer: '15–30 Days (Fast-Track Preference)',
    avgOfferCTC: '₹15 – ₹24 LPA',
    hiringHubs: 'Bengaluru / Hyderabad',
  },
  {
    name: 'Persistent Systems',
    logoBadge: 'PSYS',
    badgeBg: 'bg-teal-600 text-white',
    category: 'Digital Tech Elevate',
    buyoutPolicy: 'Partial / Full Buyout for Certified Cloud & AI Architects',
    joiningBuffer: '60 Days Standard',
    avgOfferCTC: '₹11 – ₹16 LPA',
    hiringHubs: 'Pune / Hyderabad / Nagpur',
  },
  {
    name: 'InMobi / Glance',
    logoBadge: 'INMB',
    badgeBg: 'bg-rose-600 text-white',
    category: 'AdTech Unicorn',
    buyoutPolicy: 'Direct Buyout Clearance for Critical Lateral Roles',
    joiningBuffer: '30 Days Preferred',
    avgOfferCTC: '₹16 – ₹23 LPA',
    hiringHubs: 'Bengaluru',
  },
]

export default function NoticePeriodBuyoutSimulator({
  defaultCurrentCTC,
  defaultTargetCTC,
}: {
  defaultCurrentCTC?: number
  defaultTargetCTC?: number
}) {
  const { t } = useTranslation()
  const { currentSalaryLPA, targetSalaryLPA, setCurrentSalaryLPA, setTargetHikePercent } = useUserProfile()

  const [currentCTC, setCurrentCTC] = useState<number>(defaultCurrentCTC ?? currentSalaryLPA)
  const [noticeDays, setNoticeDays] = useState<number>(90)
  const [targetCTC, setTargetCTC] = useState<number>(defaultTargetCTC ?? targetSalaryLPA)
  const [negotiatedEarlyDays, setNegotiatedEarlyDays] = useState<number>(30)
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null)

  useEffect(() => {
    if (defaultCurrentCTC === undefined) {
      setCurrentCTC(currentSalaryLPA)
    }
    if (defaultTargetCTC === undefined) {
      setTargetCTC(targetSalaryLPA)
    }
  }, [defaultCurrentCTC, defaultTargetCTC, currentSalaryLPA, targetSalaryLPA])

  // Calculations
  const monthlyCurrentGross = Math.round((currentCTC * 100000) / 12)
  const monthlyTargetGross = Math.round((targetCTC * 100000) / 12)

  const buyoutDaysCount = Math.max(0, noticeDays - negotiatedEarlyDays)
  const buyoutCost = Math.round((monthlyCurrentGross * buyoutDaysCount) / 30)

  const annualHikeGain = (targetCTC - currentCTC) * 100000
  const netYear1Profit = annualHikeGain - buyoutCost
  const breakEvenDays = Math.ceil((buyoutCost / (monthlyTargetGross - monthlyCurrentGross)) * 30)

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedTemplate(id)
    setTimeout(() => setCopiedTemplate(null), 2500)
  }

  const emailTemplateEarlyRelease = `Subject: Formal Request for Early Relieving against Accumulated Earned Leaves - [Your Name] (Emp ID: [ID])

Dear [Manager Name],

As per my formal resignation submitted on [Date], my standard notice period is scheduled to conclude on [End Date].

To ensure a seamless transition without impacting sprint deliverables:
1. I have prepared a comprehensive Knowledge Transfer (KT) document covering all system workflows, credentials, and recurring SOPs.
2. I have 18 days of accrued Earned Leaves (EL) and request permission to adjust them towards my notice period.
3. I am prepared to conduct daily 1-hour shadow sessions with [Colleague Name] to ensure complete handover by [Proposed Early Date].

I kindly request your approval for early relieving effective [Proposed Early Date]. I remain deeply grateful for the mentorship and growth during my tenure at [Company].

Best regards,
[Your Name]
[Designation]`

  const emailTemplateBuyout = `Subject: Request for Official Notice Period Shortfall Buyout Settlement - [Your Name]

Dear [HR / Manager Name],

Further to my resignation dated [Date], I am writing to formally request an early release on [Proposed Date], representing a shortfall of ${buyoutDaysCount} days against the standard ${noticeDays}-day policy.

I am prepared to settle the gross salary equivalent of the ${buyoutDaysCount}-day shortfall as a notice buyout deduction in my Full & Final (F&F) settlement. All project documentation and KT milestones will be completed and signed off prior to this date.

Kindly confirm the buyout calculation so we can proceed with the formal clearance formalities.

Warm regards,
[Your Name]`

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-7">
      {/* ── 1. Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-50 to-rose-50 dark:from-amber-950/60 dark:to-rose-950/60 text-amber-700 dark:text-amber-300 text-xs font-black mb-1.5 border border-amber-200/50">
            <Clock size={13} className="text-amber-600" />
            <span>{t('features.notice-buyout.sidebar', '90-Day Notice Period Trap Breaker & Buyout ROI')}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('features.notice-buyout.heading', 'Notice Period Buyout & Early Release Financial Simulator')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            {t('features.notice-buyout.subtitle', 'Don\'t lose high-paying product offers due to rigid 90-day policies. Calculate exact buyout cost, break-even days, and explore buyout-friendly employers.')}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-right shrink-0">
          <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">{t('features.notice-buyout.year1_profit', 'Year-1 Net Gain Post-Buyout')}</div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
            +₹{(netYear1Profit / 100000).toFixed(1)} Lakhs
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Recovers in ~{breakEvenDays} Days</div>
        </div>
      </div>

      {/* ── 2. Interactive Calculator Sliders ── */}
      <div className="p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-5">
        <div className="flex items-center gap-2">
          <Calculator size={16} className="text-[#0B4F9C]" />
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Interactive Financial Parameters
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Current CTC */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-500">Current Salary</span>
              <span className="text-slate-900 dark:text-white font-black">₹{currentCTC} LPA</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="30.0"
              step="0.2"
              value={currentCTC}
              onChange={(e) => {
                const val = parseFloat(e.target.value)
                setCurrentCTC(val)
                setCurrentSalaryLPA(val)
              }}
              className="w-full accent-slate-600 cursor-pointer"
            />
            <div className="text-[10px] text-slate-400">Gross: ₹{monthlyCurrentGross.toLocaleString('en-IN')}/mo</div>
          </div>

          {/* Current Notice Period */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-500">Official Notice</span>
              <span className="text-rose-600 font-black">{noticeDays} Days</span>
            </div>
            <div className="flex gap-1 pt-1">
              {[30, 60, 90].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setNoticeDays(d)}
                  className={`flex-1 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    noticeDays === d
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

          {/* Target Offer CTC */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-500">Target Offer CTC</span>
              <span className="text-emerald-600 font-black">₹{targetCTC} LPA</span>
            </div>
            <input
              type="range"
              min="3.0"
              max="50.0"
              step="0.5"
              value={targetCTC}
              onChange={(e) => {
                const val = parseFloat(e.target.value)
                setTargetCTC(val)
                if (currentCTC > 0) {
                  const hike = Math.round(((val - currentCTC) / currentCTC) * 100)
                  setTargetHikePercent(hike)
                }
              }}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="text-[10px] text-emerald-600 font-bold">
              +{Math.round(((targetCTC - currentCTC) / currentCTC) * 100)}% Compensation Leap
            </div>
          </div>

          {/* Target Early Relieving Goal */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-500">Target Joining Window</span>
              <span className="text-[#0B4F9C] dark:text-sky-400 font-black">{negotiatedEarlyDays} Days</span>
            </div>
            <div className="flex gap-1 pt-1">
              {[0, 15, 30, 45].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setNegotiatedEarlyDays(d)}
                  className={`flex-1 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    negotiatedEarlyDays === d
                      ? 'bg-[#0B4F9C] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Strategic Financial Outcome Card ── */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-blue-600/10 to-purple-600/5 dark:from-slate-800 dark:via-emerald-950/30 dark:to-slate-900 border-2 border-emerald-500/30 dark:border-emerald-800/60 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-700/80 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Mathematical Verdict
            </span>
            <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
              Buyout Investment: ₹{buyoutCost.toLocaleString('en-IN')} for {buyoutDaysCount} Days Shortfall
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
              You invest ₹{(buyoutCost / 1000).toFixed(0)}k upfront to unlock an additional ₹{(annualHikeGain / 100000).toFixed(1)} Lakhs gross compensation in Year 1.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/90 dark:bg-slate-900/90 p-3 rounded-2xl border border-slate-200/70 dark:border-slate-700/80 shadow-xs shrink-0">
            <div className="text-center px-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">Monthly Surplus</div>
              <div className="text-base font-black text-emerald-600">
                +₹{(monthlyTargetGross - monthlyCurrentGross).toLocaleString('en-IN')}/mo
              </div>
            </div>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700" />
            <div className="text-center px-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">Break-Even</div>
              <div className="text-base font-black text-[#0B4F9C] dark:text-sky-400">
                {breakEvenDays} Working Days
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar of Payback */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-600 dark:text-slate-300">Investment Payback Timeline</span>
            <span className="text-emerald-600 dark:text-emerald-400">
              Recovered by Day {breakEvenDays} of Employment
            </span>
          </div>
          <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-[#0B4F9C] to-emerald-500 rounded-full"
              style={{ width: `${Math.min(100, Math.round((breakEvenDays / 365) * 100 * 3))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold pt-0.5">
            <span>Day 1 (Buyout Settled)</span>
            <span>Month 2 (100% Breakeven)</span>
            <span>Month 12 (+₹{(netYear1Profit / 100000).toFixed(1)}L Net Pure Profit)</span>
          </div>
        </div>
      </div>

      {/* ── 4. Buyout-Friendly Tech Employers Directory ── */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-amber-400" />
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
                Indian Tech Employers with Verified Buyout & Notice Buffer Policies
              </h4>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              These companies actively provide signing bonuses or reimburse 60–90 day notice buyouts for verified lateral candidates.
            </p>
          </div>

          <Link
            to="/jobs"
            className="text-xs font-bold text-sky-400 hover:text-white flex items-center gap-1 shrink-0"
          >
            <span>Explore Jobs</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {BUYOUT_COMPANIES.map((comp) => (
            <div
              key={comp.name}
              className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg ${comp.badgeBg} flex items-center justify-center font-black text-[10px]`}
                  >
                    {comp.logoBadge}
                  </div>
                  <div>
                    <h5 className="font-black text-xs text-white">{comp.name}</h5>
                    <div className="text-[10px] text-slate-400">{comp.category}</div>
                  </div>
                </div>

                <span className="text-xs font-extrabold text-emerald-400">
                  {comp.avgOfferCTC}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-[11px] text-slate-300 space-y-1">
                <div className="text-amber-300 font-bold flex items-center gap-1">
                  <ShieldCheck size={12} /> {comp.buyoutPolicy}
                </div>
                <div className="text-slate-400 flex items-center justify-between">
                  <span>Buffer: {comp.joiningBuffer}</span>
                  <span>📍 {comp.hiringHubs}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. Copy-Ready HR & Manager Negotiation Email Scripts ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Template A: Earned Leave Adjustment */}
        <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail size={15} className="text-[#0B4F9C]" />
              <h5 className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Script 1: Early Release via Earned Leave Adjustment
              </h5>
            </div>
            <button
              type="button"
              onClick={() => handleCopy('el', emailTemplateEarlyRelease)}
              className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition"
            >
              {copiedTemplate === 'el' ? (
                <>
                  <Check size={12} className="text-emerald-500" />
                  <span className="text-emerald-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Use when you have 15–25 accrued leave days in your portal to legally shorten notice duration without financial deductions.
          </p>
          <pre className="text-[11px] font-mono bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed">
            {emailTemplateEarlyRelease}
          </pre>
        </div>

        {/* Template B: Formal Buyout Settlement */}
        <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IndianRupee size={15} className="text-emerald-600" />
              <h5 className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Script 2: Formal Buyout F&F Settlement Request
              </h5>
            </div>
            <button
              type="button"
              onClick={() => handleCopy('bo', emailTemplateBuyout)}
              className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition"
            >
              {copiedTemplate === 'bo' ? (
                <>
                  <Check size={12} className="text-emerald-500" />
                  <span className="text-emerald-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Use when new employer offers signing bonus or when immediate joining unlocks a +40% salary leap.
          </p>
          <pre className="text-[11px] font-mono bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed">
            {emailTemplateBuyout}
          </pre>
        </div>
      </div>

      {/* ── 6. Connected Next Steps ── */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="text-slate-600 dark:text-slate-300 font-medium">
          Prefer to negotiate an internal increment before resigning?
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/features/manager-1on1"
            className="px-3.5 py-1.5 rounded-xl bg-[#0B4F9C] hover:bg-blue-800 text-white font-bold transition flex items-center gap-1.5 shadow-2xs"
          >
            <span>Manager 1:1 Coach</span>
            <ArrowRight size={13} />
          </Link>
          <Link
            to="/features/career-growth"
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 font-bold transition border border-slate-200 dark:border-slate-700"
          >
            <span>Stagnation Scorecard</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
