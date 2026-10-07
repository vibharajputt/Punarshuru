import { useState, useMemo } from 'react'
import {
  IndianRupee,
  Scale,
  MapPin,
  Sparkles,
  Zap,
  ArrowRight,
  Wallet,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useUserProfile } from '@/store/userProfileStore'

import { REAL_SALARY_BENCHMARKS, SALARY_BENCHMARK_FOOTNOTE } from '@/data/realSalaryBenchmarks'

interface CityData {
  city: string
  legacySupportMedian: number
  modernAutomationMedian: number
  genAiLeadMedian: number
  avgMonthlyRent: number
  monthlyCommute: number
  taxRatePct: number
  savingsRating: string
  savingsScore: number
}

const CITY_DATA: Record<string, CityData> = Object.fromEntries(
  Object.entries(REAL_SALARY_BENCHMARKS).map(([k, v]) => [
    k,
    {
      city: v.cityName,
      legacySupportMedian: v.legacySupportMedianLPA,
      modernAutomationMedian: v.modernAutomationMedianLPA,
      genAiLeadMedian: v.genAiLeadMedianLPA,
      avgMonthlyRent: v.avgMonthlyRent1BHK,
      monthlyCommute: v.avgMonthlyCommute,
      taxRatePct: v.effectiveTaxRatePct,
      savingsRating: v.savingsRating,
      savingsScore: v.savingsScore,
    },
  ])
)

export default function SalaryBenchmarkCard({
  currentSalary: propCurrentSalary,
  role: propRole,
  city: propCity,
}: {
  currentSalary?: number
  role?: string
  city?: string
}) {
  const { t } = useTranslation()
  const { currentSalaryLPA, currentRole, currentCity, setCurrentCity } = useUserProfile()

  const currentSalary = propCurrentSalary !== undefined ? propCurrentSalary : currentSalaryLPA
  const role = propRole || currentRole
  const initialCity = propCity || currentCity || 'Noida'

  const [selectedCityKey, setSelectedCityKey] = useState<string>(
    CITY_DATA[initialCity] ? initialCity : (Object.keys(CITY_DATA).find(c => initialCity.includes(c)) || 'Noida')
  )
  const [selectedStack, setSelectedStack] = useState<'legacy' | 'automation' | 'genai'>('genai')

  const activeCity = CITY_DATA[selectedCityKey] || CITY_DATA.Noida

  // Calculate target salary for active selection
  const targetSalary =
    selectedStack === 'legacy'
      ? activeCity.legacySupportMedian
      : selectedStack === 'automation'
      ? activeCity.modernAutomationMedian
      : activeCity.genAiLeadMedian

  const hikePct = Math.round(((targetSalary - currentSalary) / currentSalary) * 100)
  const currentPercentile = Math.min(95, Math.round((currentSalary / 18.5) * 60))
  const targetPercentile = Math.min(98, Math.round((targetSalary / 18.5) * 100))

  // Financial Breakdown calculations
  const grossMonthly = Math.round((targetSalary * 100000) / 12)
  const monthlyTax = Math.round(grossMonthly * (activeCity.taxRatePct / 100))
  const inHandMonthly = grossMonthly - monthlyTax
  const netSavingsMonthly = inHandMonthly - activeCity.avgMonthlyRent - activeCity.monthlyCommute

  const currentGrossMonthly = Math.round((currentSalary * 100000) / 12)
  const currentInHandMonthly = Math.round(currentGrossMonthly * 0.92)
  const currentNetSavings = currentInHandMonthly - activeCity.avgMonthlyRent - activeCity.monthlyCommute

  // Dynamic descriptive sentences derived from actual state
  const currentSavingsText = useMemo(() => {
    const savings = Math.max(0, currentNetSavings)
    const formattedSavings = `₹${savings.toLocaleString('en-IN')}`
    const nationalAvg = 25000

    let comparison = ''
    if (savings <= 0) {
      comparison = 'essential rent and commute costs fully consume your in-hand salary'
    } else if (savings < nationalAvg) {
      const deficit = nationalAvg - savings
      comparison = `₹${deficit.toLocaleString('en-IN')}/mo below the national urban tech baseline of ₹25,000/month`
    } else if (savings === nationalAvg) {
      comparison = 'matching the national urban tech baseline of ₹25,000/month'
    } else {
      const multiplier = (savings / nationalAvg).toFixed(1)
      comparison = `${multiplier}x above the national urban tech baseline of ₹25,000/month`
    }

    return `After rent and daily expenses in ${activeCity.city}, you're saving ${formattedSavings}/month — ${comparison}.`
  }, [currentNetSavings, activeCity.city])

  const targetSavingsText = useMemo(() => {
    const surplusGain = netSavingsMonthly - Math.max(0, currentNetSavings)
    if (surplusGain > 0) {
      return `Delivers +₹${surplusGain.toLocaleString('en-IN')}/mo in extra disposable bank surplus to accelerate personal wealth and investments in ${activeCity.city}.`
    }
    return `Provides ₹${netSavingsMonthly.toLocaleString('en-IN')}/month in disposable cash surplus to invest in personal wealth while executing modern high-impact engineering.`
  }, [netSavingsMonthly, currentNetSavings, activeCity.city])

  // Chart Data across all cities
  const comparisonChartData = useMemo(() => {
    return Object.keys(CITY_DATA).map((key) => {
      const c = CITY_DATA[key]
      const gross =
        selectedStack === 'legacy'
          ? c.legacySupportMedian
          : selectedStack === 'automation'
          ? c.modernAutomationMedian
          : c.genAiLeadMedian

      const inHand = Math.round((gross * (1 - c.taxRatePct / 100) * 10) / 10)
      const annualLivingExpenses = ((c.avgMonthlyRent + c.monthlyCommute) * 12) / 100000
      const realSurplus = Number((inHand - annualLivingExpenses).toFixed(1))

      return {
        city: c.city.split(' (')[0],
        'Nominal CTC': gross,
        'Net In-Hand': inHand,
        'Real Net Savings': Math.max(0, realSurplus),
      }
    })
  }, [selectedStack])

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-7">
      {/* ── 1. Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/60 dark:to-blue-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-black mb-1.5 border border-emerald-200/50">
            <IndianRupee size={13} className="text-emerald-600" />
            <span>{t('features.salary-benchmark.sidebar', 'Interactive Compensation & Purchasing Power Benchmark')}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('features.salary-benchmark.heading', 'Market Salary & Net Savings Diagnostic')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            {t('features.salary-benchmark.subtitle', 'Compare gross CTC vs real in-hand savings across Indian tech hubs after adjusting for rent, commute, and modernization tech stacks.')}
          </p>
        </div>

        <div className="text-right p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
          <div className="text-[10px] font-bold text-slate-400 uppercase">{t('features.salary-benchmark.percentile_title', 'Your Current Position')}</div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            ₹{currentSalary} LPA <span className="text-xs font-semibold text-rose-500">(P{currentPercentile})</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{role || 'Current Role'} Baseline</div>
        </div>
      </div>

      {/* ── 2. Interactive Selectors: Tech Stack & City ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700/60">
        {/* Stack Selector */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Zap size={13} className="text-[#F26B1D]" />
            <span>Select Tech Stack Elevation:</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'legacy', name: t('features.salary-benchmark.legacy_median', 'Legacy IT Support'), median: activeCity.legacySupportMedian },
              { id: 'automation', name: t('features.salary-benchmark.modern_median', 'Python & Automation'), median: activeCity.modernAutomationMedian },
              { id: 'genai', name: t('features.salary-benchmark.genai_median', 'GenAI & Cloud Lead'), median: activeCity.genAiLeadMedian },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedStack(st.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedStack === st.id
                    ? 'bg-[#0B4F9C] text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200/70 dark:border-slate-700'
                }`}
              >
                {st.name} (₹{st.median}L)
              </button>
            ))}
          </div>
        </div>

        {/* City Selector */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <MapPin size={13} className="text-[#0B4F9C]" />
            <span>Target Benchmark Location:</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(CITY_DATA).map((cKey) => (
              <button
                key={cKey}
                type="button"
                onClick={() => {
                  setSelectedCityKey(cKey)
                  setCurrentCity(cKey)
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedCityKey === cKey
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200/70 dark:border-slate-700'
                }`}
              >
                {cKey}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. Elevation Spotlight Scorecard ── */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0B4F9C]/10 via-emerald-500/10 to-blue-600/5 dark:from-slate-800 dark:via-blue-950/30 dark:to-slate-900 border-2 border-[#0B4F9C]/30 dark:border-blue-800/60 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-slate-200/80 dark:border-slate-700/80 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#F26B1D] animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0B4F9C] dark:text-sky-400">
                Market Parity Projection
              </span>
            </div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {activeCity.city} Target: ₹{targetSalary} LPA ({hikePct > 0 ? `+${hikePct}% Hike` : 'Current Baseline'})
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
              Elevates your standing from the {currentPercentile}th percentile (P{currentPercentile}) to the top {100 - targetPercentile}% of tech leads in India (P{targetPercentile}).
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3 bg-white/90 dark:bg-slate-900/90 p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-700/80 shadow-xs shrink-0">
            <div className="text-center px-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">Gross Monthly</div>
              <div className="text-lg font-black text-slate-900 dark:text-white">
                ₹{grossMonthly.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="text-center border-l border-slate-200 dark:border-slate-700 px-3">
              <div className="text-[10px] uppercase font-bold text-slate-400">Net In-Hand</div>
              <div className="text-lg font-black text-[#0B4F9C] dark:text-sky-400">
                ₹{inHandMonthly.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="text-center border-l border-slate-200 dark:border-slate-700 px-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">Net Surplus / Mo</div>
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                ₹{netSavingsMonthly.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Visual Percentile Progress Gauge */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-600 dark:text-slate-300">Market Percentile Progression</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-black">
              P{currentPercentile} → P{targetPercentile} (+{targetPercentile - currentPercentile} Percentile Points)
            </span>
          </div>
          <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-slate-400 absolute left-0"
              style={{ width: `${currentPercentile}%` }}
            />
            <div
              className="h-full bg-gradient-to-r from-[#0B4F9C] via-emerald-500 to-emerald-400 rounded-full absolute left-0"
              style={{ width: `${targetPercentile}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-bold pt-0.5">
            <span>P0 (Underpaid)</span>
            <span>P50 (Median Market)</span>
            <span>P75 (Top Tier GCC)</span>
            <span>P95 (Top Product Tech)</span>
          </div>
        </div>
      </div>

      {/* ── 4. Interactive Graphical Comparison Across Indian Metros ── */}
      <div className="p-5 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Scale size={16} className="text-[#0B4F9C]" />
              <span>Gross CTC vs Real In-Hand Savings Across Tech Hubs (₹ LPA)</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Notice how local living costs in {activeCity.city} (rent: ₹{activeCity.avgMonthlyRent.toLocaleString('en-IN')}/mo) impact actual bank savings compared to lower-cost hubs.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-400" />
              <span>Nominal CTC</span>
            </span>
            <span className="flex items-center gap-1 text-[#0B4F9C]">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#0B4F9C]" />
              <span>In-Hand</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-600">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span>Real Net Savings</span>
            </span>
          </div>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonChartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="city" tick={{ fill: '#64748B', fontSize: 11, fontWeight: 700 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} unit="L" />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
                        <p className="font-black text-amber-400">{label}</p>
                        <p className="text-slate-300 flex justify-between gap-4">
                          <span>Nominal Package:</span>
                          <span className="font-bold">₹{payload[0]?.value} LPA</span>
                        </p>
                        <p className="text-sky-300 flex justify-between gap-4">
                          <span>Post-Tax In-Hand:</span>
                          <span className="font-bold">₹{payload[1]?.value} LPA</span>
                        </p>
                        <p className="text-emerald-400 flex justify-between gap-4">
                          <span>Real Net Savings (Post-Rent):</span>
                          <span className="font-bold">₹{payload[2]?.value} LPA</span>
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="Nominal CTC" fill="#94A3B8" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="Net In-Hand" fill="#0B4F9C" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="Real Net Savings" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── 5. Real Monthly Budget Breakdown (Current vs Target in Selected City) ── */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet size={16} className="text-amber-400" />
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
              Monthly Cashflow Breakdown in {activeCity.city}
            </h4>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Rent: ₹{activeCity.avgMonthlyRent.toLocaleString('en-IN')}/mo • Commute: ₹{activeCity.monthlyCommute.toLocaleString('en-IN')}/mo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-400">
              <span>Current Cashflow (₹{currentSalary} LPA)</span>
              <span>In-Hand: ₹{currentInHandMonthly.toLocaleString('en-IN')}/mo</span>
            </div>
            <div className="text-lg font-black text-slate-300">
              Monthly Bank Savings: ₹{Math.max(0, currentNetSavings).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              {currentSavingsText}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800 to-emerald-950/60 border border-emerald-500/50 space-y-2">
            <div className="flex justify-between text-xs font-bold text-emerald-400">
              <span>Target Modernized Cashflow (₹{targetSalary} LPA)</span>
              <span>In-Hand: ₹{inHandMonthly.toLocaleString('en-IN')}/mo</span>
            </div>
            <div className="text-lg font-black text-emerald-400">
              Monthly Bank Savings: ₹{netSavingsMonthly.toLocaleString('en-IN')}{' '}
              {netSavingsMonthly - Math.max(0, currentNetSavings) >= 0 ? (
                <span className="text-xs font-semibold text-emerald-300">
                  (+₹{(netSavingsMonthly - Math.max(0, currentNetSavings)).toLocaleString('en-IN')}/mo)
                </span>
              ) : (
                <span className="text-xs font-semibold text-amber-300">
                  (-₹{Math.abs(netSavingsMonthly - Math.max(0, currentNetSavings)).toLocaleString('en-IN')}/mo)
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              {targetSavingsText}
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800">
          <span className="text-slate-400">Ready to secure this compensation band? View open jobs matching this exact bracket.</span>
          <Link
            to="/jobs"
            className="font-bold text-sky-400 hover:text-white flex items-center gap-1 transition"
          >
            <span>Explore Matching Jobs</span>
            <ArrowRight size={13} />
          </Link>
        </div>
        <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <span>📊 <strong className="text-slate-300">Data source:</strong> {SALARY_BENCHMARK_FOOTNOTE}</span>
        </div>
      </div>
    </div>
  )
}
