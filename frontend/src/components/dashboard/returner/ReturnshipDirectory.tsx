import { useState, useMemo } from 'react'
import {
  Calendar,
  IndianRupee,
  Search,
  ExternalLink,
  GraduationCap,
} from 'lucide-react'

export interface ReturnshipProgram {
  id: string
  company: string
  programName: string
  logoBadge: string
  badgeColor: string
  minGapMonths: number
  targetDomains: string[]
  monthlyStipend: string
  conversionRate: string
  programDuration: string
  locations: string[]
  applicationWindow: string
  keyHighlight: string
  directUrl: string
}

const RETURNSHIP_PROGRAMS: ReturnshipProgram[] = [
  {
    id: 'amazon_rekindle',
    company: 'Amazon India',
    programName: 'Amazon Rekindle Program',
    logoBadge: 'AMZN',
    badgeColor: 'bg-amber-500 text-white',
    minGapMonths: 12,
    targetDomains: ['Software Development (SDE-2)', 'Cloud Support', 'DevOps & Reliability'],
    monthlyStipend: '₹75,000 – ₹95,000/mo',
    conversionRate: '88% Full-Time Absorption',
    programDuration: '16 Weeks (Paid)',
    locations: ['Bengaluru', 'Hyderabad', 'Chennai', 'Pune'],
    applicationWindow: 'Rolling / Year-Round Cohorts',
    keyHighlight: 'Dedicated mentorship buddy + formal 16-week ramp-up project with zero gap discrimination.',
    directUrl: 'https://www.amazon.jobs/en/landing_pages/rekindle',
  },
  {
    id: 'microsoft_springboard',
    company: 'Microsoft India',
    programName: 'Microsoft Springboard Initiative',
    logoBadge: 'MSFT',
    badgeColor: 'bg-blue-600 text-white',
    minGapMonths: 18,
    targetDomains: ['Cloud Solutions (Azure)', 'Applied AI & ML', 'Full-Stack Engineering'],
    monthlyStipend: '₹85,000 – ₹1,10,000/mo',
    conversionRate: '85% Full-Time Absorption',
    programDuration: '16 Weeks',
    locations: ['Bengaluru', 'Hyderabad', 'Noida'],
    applicationWindow: 'Q2 / Q4 Annual Cohorts',
    keyHighlight: 'Complete Azure certification sponsorship + direct conversion into Senior Consultant bands.',
    directUrl: 'https://careers.microsoft.com/v2/global/en/home.html',
  },
  {
    id: 'google_rtw',
    company: 'Google India',
    programName: 'Google Return to Work',
    logoBadge: 'GOOG',
    badgeColor: 'bg-red-500 text-white',
    minGapMonths: 24,
    targetDomains: ['Software SWE-3', 'Cloud Systems Specialist', 'Data Engineering'],
    monthlyStipend: '₹1,00,000 – ₹1,25,000/mo',
    conversionRate: '92% Full-Time Absorption',
    programDuration: '24 Weeks (6 Months)',
    locations: ['Bengaluru', 'Gurugram', 'Hyderabad'],
    applicationWindow: 'Spring Cohort Open',
    keyHighlight: 'Extensive 6-month paid onboarding with focus on distributed systems architecture.',
    directUrl: 'https://careers.google.com',
  },
  {
    id: 'intuit_again',
    company: 'Intuit India',
    programName: 'Intuit Again Returnship',
    logoBadge: 'INTU',
    badgeColor: 'bg-indigo-600 text-white',
    minGapMonths: 12,
    targetDomains: ['Frontend / React', 'Java Backend Microservices', 'Quality Engineering'],
    monthlyStipend: '₹80,000 – ₹1,00,000/mo',
    conversionRate: '82% Full-Time Absorption',
    programDuration: '16 Weeks',
    locations: ['Bengaluru'],
    applicationWindow: 'Active Fall Batch',
    keyHighlight: 'Work on production TurboTax and QuickBooks fintech microservices with structured peer cohort.',
    directUrl: 'https://www.intuit.com/careers/programs/intuit-again/',
  },
  {
    id: 'goldman_returnship',
    company: 'Goldman Sachs',
    programName: 'GS Returnship Program',
    logoBadge: 'GS',
    badgeColor: 'bg-sky-600 text-white',
    minGapMonths: 24,
    targetDomains: ['FinTech Infrastructure', 'Enterprise Java', 'Platform Reliability'],
    monthlyStipend: '₹95,000 – ₹1,20,000/mo',
    conversionRate: '89% Full-Time Absorption',
    programDuration: '24 Weeks',
    locations: ['Bengaluru', 'Hyderabad'],
    applicationWindow: 'Annual Cohort (Applications Open)',
    keyHighlight: 'Pioneer of the Returnship model globally. Excellent track record for women returning after 3–6 year gaps.',
    directUrl: 'https://www.goldmansachs.com/careers/experienced-professionals/returnship/',
  },
  {
    id: 'accenture_reboot',
    company: 'Accenture India',
    programName: 'Accenture Career Reboot',
    logoBadge: 'ACCN',
    badgeColor: 'bg-purple-600 text-white',
    minGapMonths: 12,
    targetDomains: ['Cloud Migration (AWS/Azure)', 'Data Engineering', 'Enterprise Systems'],
    monthlyStipend: '₹60,000 – ₹80,000/mo',
    conversionRate: '94% Full-Time Absorption',
    programDuration: '12 Weeks',
    locations: ['Pan-India / Hybrid / Remote'],
    applicationWindow: 'Year-Round Active',
    keyHighlight: 'Flexible hybrid and remote options across Tier-1 and Tier-2 Indian tech centers.',
    directUrl: 'https://www.accenture.com/in-en/careers/local/career-reboot',
  },
]

export default function ReturnshipDirectory() {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [gapFilter, setGapFilter] = useState<string>('all')
  const [selectedLocation, setSelectedLocation] = useState<string>('all')

  const filteredPrograms = useMemo(() => {
    return RETURNSHIP_PROGRAMS.filter((p) => {
      const matchesSearch =
        p.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.targetDomains.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesGap =
        gapFilter === 'all' ||
        (gapFilter === '12m' && p.minGapMonths <= 12) ||
        (gapFilter === '18m' && p.minGapMonths <= 18) ||
        (gapFilter === '24m' && p.minGapMonths >= 24)

      const matchesLocation =
        selectedLocation === 'all' ||
        p.locations.some((l) => l.toLowerCase().includes(selectedLocation.toLowerCase()))

      return matchesSearch && matchesGap && matchesLocation
    })
  }, [searchQuery, gapFilter, selectedLocation])

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-7">
      {/* ── 1. Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/60 dark:to-emerald-950/60 text-teal-700 dark:text-teal-300 text-xs font-black mb-1.5 border border-teal-200/50">
            <GraduationCap size={13} className="text-teal-600" />
            <span>Exclusive Returnee Programs Directory (India Hubs)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Verified Tech Returnships & Diversity Hiring Cohorts
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            MNCs run dedicated returnship tracks with paid stipends (₹60k–₹1.25L/mo), mentorship buddies, and 85%+ full-time conversion rates without resume gap bias.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-right shrink-0">
          <div className="text-[10px] font-bold text-teal-700 dark:text-teal-300 uppercase">Average Full-Time Conversion</div>
          <div className="text-xl font-black text-teal-600 dark:text-teal-400">
            87.5% Absorption
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Paid 12–24 Wk Ramp-ups</div>
        </div>
      </div>

      {/* ── 2. Filters & Search Bar ── */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Box */}
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search companies, programs, domains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-teal-500 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Min Career Gap Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">Min Gap:</span>
            <div className="flex items-center gap-1">
              {[
                { id: 'all', label: 'All' },
                { id: '12m', label: '12+ Mo' },
                { id: '18m', label: '18+ Mo' },
                { id: '24m', label: '24+ Mo' },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGapFilter(g.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    gapFilter === g.id
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div className="flex items-center gap-1.5 min-w-[190px] shrink-0">
            <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">City:</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-500 font-bold"
            >
              <option value="all">All Tech Hubs (Pan-India)</option>
              <option value="bengaluru">Bengaluru</option>
              <option value="hyderabad">Hyderabad</option>
              <option value="pune">Pune</option>
              <option value="noida">Noida / Gurugram</option>
              <option value="remote">Remote / Hybrid</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 3. Returnship Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPrograms.map((prog) => (
          <div
            key={prog.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 hover:border-teal-500/50 transition-all shadow-xs space-y-4"
          >
            {/* Top Bar: Company Badge & Name */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className={`w-11 h-11 rounded-2xl ${prog.badgeColor} flex items-center justify-center font-black text-xs shadow-xs shrink-0`}
                >
                  {prog.logoBadge}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <h4 className="font-black text-base text-slate-900 dark:text-white truncate">
                      {prog.company}
                    </h4>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800 whitespace-nowrap shrink-0">
                      {prog.minGapMonths}+ Mo Gap
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {prog.programName}
                  </div>
                </div>
              </div>

              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800 shrink-0 whitespace-nowrap">
                {prog.conversionRate}
              </span>
            </div>

            {/* Compensation & Timeline Banner */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <IndianRupee size={13} className="text-emerald-600" />
                <span>{prog.monthlyStipend}</span>
              </div>
              <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Calendar size={12} />
                <span>{prog.programDuration}</span>
              </div>
            </div>

            {/* Target Domains */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Hiring Tracks & Domains:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {prog.targetDomains.map((d, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Highlight & Location */}
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium bg-teal-50/40 dark:bg-teal-950/20 p-3 rounded-2xl border border-teal-100 dark:border-teal-900/40">
              💡 {prog.keyHighlight}
            </p>

            {/* Bottom Footer: Locations & Direct Link */}
            <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 text-[11px]">
                📍 {prog.locations.join(', ')}
              </span>

              <a
                href={prog.directUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 flex items-center gap-1 transition"
              >
                <span>Program Details</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
