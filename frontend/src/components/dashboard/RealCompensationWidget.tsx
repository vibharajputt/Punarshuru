import { useState } from 'react'
import {
  Calculator,
  MapPin,
  TrendingUp,
  Clock,
  Home,
  Sparkles,
  Zap,
} from 'lucide-react'

export interface CityCostData {
  city: string
  tier: 'Tier 1' | 'Tier 2' | 'Emerging Tech Hub'
  colIndex: number // Base Mohali/Lucknow = 1.0
  avgRentK: number
  avgCommuteMin: number
  metroTag: string
}

const INDIAN_CITIES: CityCostData[] = [
  { city: 'Bengaluru', tier: 'Tier 1', colIndex: 1.85, avgRentK: 28, avgCommuteMin: 75, metroTag: 'Silicon Valley of India' },
  { city: 'Mumbai', tier: 'Tier 1', colIndex: 2.10, avgRentK: 36, avgCommuteMin: 85, metroTag: 'Financial Capital' },
  { city: 'Delhi-NCR / Gurgaon', tier: 'Tier 1', colIndex: 1.70, avgRentK: 24, avgCommuteMin: 65, metroTag: 'Corporate & Tech Hub' },
  { city: 'Hyderabad', tier: 'Tier 1', colIndex: 1.45, avgRentK: 19, avgCommuteMin: 45, metroTag: 'HITEC City & Pharma' },
  { city: 'Pune', tier: 'Tier 2', colIndex: 1.40, avgRentK: 18, avgCommuteMin: 40, metroTag: 'Automotive & IT Hub' },
  { city: 'Noida', tier: 'Tier 2', colIndex: 1.35, avgRentK: 16, avgCommuteMin: 35, metroTag: 'NCR Tech Corridor' },
  { city: 'Chennai', tier: 'Tier 1', colIndex: 1.35, avgRentK: 17, avgCommuteMin: 40, metroTag: 'SaaS & Auto Capital' },
  { city: 'Mohali / Chandigarh', tier: 'Emerging Tech Hub', colIndex: 1.00, avgRentK: 12, avgCommuteMin: 20, metroTag: 'Smart Tech City' },
  { city: 'Lucknow', tier: 'Emerging Tech Hub', colIndex: 0.95, avgRentK: 11, avgCommuteMin: 20, metroTag: 'IT City & Ops' },
  { city: 'Jaipur', tier: 'Emerging Tech Hub', colIndex: 1.05, avgRentK: 13, avgCommuteMin: 25, metroTag: 'Fintech & Tech Startups' },
  { city: 'Kochi', tier: 'Emerging Tech Hub', colIndex: 1.15, avgRentK: 14, avgCommuteMin: 30, metroTag: 'Infopark Tech' },
  { city: 'Coimbatore', tier: 'Emerging Tech Hub', colIndex: 1.00, avgRentK: 12, avgCommuteMin: 25, metroTag: 'TIDEL Park IT' },
]

export default function RealCompensationWidget({
  initialSalary = 12.0,
  initialCity = 'Bengaluru',
}: {
  initialSalary?: number
  initialCity?: string
}) {
  const [nominalSalaryLPA, setNominalSalaryLPA] = useState<number>(initialSalary)
  const [selectedCityA, setSelectedCityA] = useState<string>(initialCity)
  const [selectedCityB, setSelectedCityB] = useState<string>('Pune')
  const [rentType, setRentType] = useState<'1bhk' | '2bhk' | 'shared'>('1bhk')

  const cityDataA = INDIAN_CITIES.find((c) => c.city === selectedCityA) || INDIAN_CITIES[0]
  const cityDataB = INDIAN_CITIES.find((c) => c.city === selectedCityB) || INDIAN_CITIES[4]

  const rentMultiplier = rentType === '2bhk' ? 1.4 : rentType === 'shared' ? 0.6 : 1.0
  const rentA = Math.round(cityDataA.avgRentK * rentMultiplier * 1000)
  const rentB = Math.round(cityDataB.avgRentK * rentMultiplier * 1000)

  // Monthly nominal in INR (approx 8.5% standard tax/PF deduction)
  const grossMonthlyInr = (nominalSalaryLPA * 100000) / 12
  const taxMonthlyInr = Math.round(grossMonthlyInr * 0.08)
  const inHandMonthlyA = grossMonthlyInr - taxMonthlyInr

  // City A Expense
  const commuteCostA = Math.round(cityDataA.avgCommuteMin * 60)
  const livingCostA = Math.round(18000 * (cityDataA.colIndex / 1.0))
  const totalExpenseA = rentA + commuteCostA + livingCostA
  const netSavingsA = Math.max(0, inHandMonthlyA - totalExpenseA)

  // City B Equivalent Calculation
  const commuteCostB = Math.round(cityDataB.avgCommuteMin * 60)
  const livingCostB = Math.round(18000 * (cityDataB.colIndex / 1.0))
  const totalExpenseB = rentB + commuteCostB + livingCostB
  const equivalentMonthlyInrB = netSavingsA + totalExpenseB + taxMonthlyInr
  const equivalentSalaryLPAB = Number(((equivalentMonthlyInrB * 12) / 100000).toFixed(1))

  // Time and Savings Metrics
  const monthlyCommuteHoursA = Math.round((cityDataA.avgCommuteMin * 2 * 22) / 60)
  const monthlyCommuteHoursB = Math.round((cityDataB.avgCommuteMin * 2 * 22) / 60)
  const hoursSavedPerYear = Math.max(0, (monthlyCommuteHoursA - monthlyCommuteHoursB) * 12)
  const purchasingPowerMultiplier = (cityDataA.colIndex / cityDataB.colIndex).toFixed(2)

  const applyPreset = (cityA: string, cityB: string, salary: number) => {
    setSelectedCityA(cityA)
    setSelectedCityB(cityB)
    setNominalSalaryLPA(salary)
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0B4F9C]/15 via-orange-500/10 to-emerald-500/10 dark:from-blue-950/50 dark:via-orange-950/30 dark:to-slate-900 border border-blue-200/80 dark:border-blue-900/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0B4F9C] dark:text-sky-300 text-xs font-black mb-2">
            <Calculator size={13} />
            <span>AI Real Compensation & City Parity Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Nominal CTC vs Real In-Hand Purchasing Power
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl font-medium mt-1">
            A high CTC in Tier-1 metros often evaporates under ₹30,000+ rent and 2-hour daily traffic. Discover your true disposable savings across Indian tech cities.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => applyPreset('Bengaluru', 'Pune', 16)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:border-[#0B4F9C] transition shadow-2xs cursor-pointer"
          >
            Bengaluru vs Pune
          </button>
          <button
            onClick={() => applyPreset('Mumbai', 'Mohali / Chandigarh', 18)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:border-[#0B4F9C] transition shadow-2xs cursor-pointer"
          >
            Mumbai vs Mohali
          </button>
          <button
            onClick={() => applyPreset('Delhi-NCR / Gurgaon', 'Jaipur', 14)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:border-[#0B4F9C] transition shadow-2xs cursor-pointer"
          >
            NCR vs Jaipur
          </button>
        </div>
      </div>

      {/* 2. Interactive Input Controls */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
          Step 1: Set Your Compensation Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Salary Slider & Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Nominal CTC Offer (LPA)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
              <input
                type="number"
                step="0.5"
                min="2"
                max="80"
                value={nominalSalaryLPA}
                onChange={(e) => setNominalSalaryLPA(Number(e.target.value) || 2)}
                className="w-full pl-7 pr-12 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-extrabold text-sm text-slate-900 dark:text-white"
              />
              <span className="absolute right-3 top-2.5 text-slate-400 font-bold text-xs">LPA</span>
            </div>
            <input
              type="range"
              min="3"
              max="50"
              step="0.5"
              value={nominalSalaryLPA}
              onChange={(e) => setNominalSalaryLPA(Number(e.target.value))}
              className="w-full accent-[#0B4F9C] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Offer City A */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              City A (Current / Baseline Offer)
            </label>
            <select
              value={selectedCityA}
              onChange={(e) => setSelectedCityA(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs text-slate-900 dark:text-white"
            >
              {INDIAN_CITIES.map((c) => (
                <option key={c.city} value={c.city}>
                  {c.city} ({c.tier})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-400 truncate">{cityDataA.metroTag}</p>
          </div>

          {/* Comparison City B */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              City B (Target Comparison City)
            </label>
            <select
              value={selectedCityB}
              onChange={(e) => setSelectedCityB(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs text-slate-900 dark:text-white"
            >
              {INDIAN_CITIES.map((c) => (
                <option key={c.city} value={c.city}>
                  {c.city} ({c.tier})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-400 truncate">{cityDataB.metroTag}</p>
          </div>

          {/* Housing Style */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Housing Preference
            </label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              {[
                { id: '1bhk', label: '1 BHK' },
                { id: '2bhk', label: '2 BHK' },
                { id: 'shared', label: 'Shared' },
              ].map((h) => (
                <button
                  key={h.id}
                  onClick={() => setRentType(h.id as any)}
                  className={`py-1.5 rounded-lg text-center text-[10px] font-bold transition cursor-pointer ${
                    rentType === h.id
                      ? 'bg-white dark:bg-slate-900 text-[#0B4F9C] dark:text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400">Affects rent expense calculations</p>
          </div>
        </div>
      </div>

      {/* 3. Side-by-Side Financial Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* City A Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#0B4F9C]" />
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Offer A: {selectedCityA}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold">Cost of Living: {cityDataA.colIndex}x</span>
                </div>
              </div>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                ₹{nominalSalaryLPA} LPA
              </span>
            </div>

            {/* Expenses List */}
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between py-1">
                <span>Gross Monthly Take-Home:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">₹{Math.round(grossMonthlyInr).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-500">
                <span>Estimated Tax & PF (8%):</span>
                <span>- ₹{taxMonthlyInr.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-rose-500 bg-rose-50/50 dark:bg-rose-950/30 px-2 rounded-lg">
                <span className="flex items-center gap-1.5"><Home size={12} /> Rent ({rentType.toUpperCase()}):</span>
                <span className="font-bold">- ₹{rentA.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-rose-500 bg-rose-50/50 dark:bg-rose-950/30 px-2 rounded-lg">
                <span className="flex items-center gap-1.5"><Clock size={12} /> Commute ({cityDataA.avgCommuteMin} min/day):</span>
                <span className="font-bold">- ₹{commuteCostA.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-rose-500 bg-rose-50/50 dark:bg-rose-950/30 px-2 rounded-lg">
                <span className="flex items-center gap-1.5"><TrendingUp size={12} /> Food, Utilities & Misc:</span>
                <span className="font-bold">- ₹{livingCostA.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Net Monthly Savings</p>
              <p className="text-base font-black text-emerald-600 dark:text-emerald-400">
                ₹{Math.round(netSavingsA).toLocaleString()} / Month
              </p>
            </div>
            <span className="text-[11px] font-bold text-slate-500">
              {Math.round((netSavingsA / inHandMonthlyA) * 100)}% of In-Hand
            </span>
          </div>
        </div>

        {/* City B Equivalent Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50/70 via-white to-blue-50/50 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 border-2 border-emerald-500/40 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-emerald-600" />
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Parity Equivalent in {selectedCityB}
                  </h3>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold">
                    Cost of Living: {cityDataB.colIndex}x
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  ₹{equivalentSalaryLPAB} LPA
                </span>
                <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">Matching Offer</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              An offer of just <strong className="text-slate-900 dark:text-white font-black">₹{equivalentSalaryLPAB} LPA in {selectedCityB}</strong> gives you the <em>exact same in-pocket bank savings</em> as ₹{nominalSalaryLPA} LPA in {selectedCityA}, because you save ₹{(rentA - rentB).toLocaleString()} on rent and ₹{(commuteCostA - commuteCostB).toLocaleString()} on transit every month!
            </p>

            {/* Highlighted Differences */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Rent Savings</p>
                <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                  + ₹{Math.max(0, (rentA - rentB) * 12).toLocaleString()} / Yr
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Transit Time Saved</p>
                <p className="text-xs font-black text-[#0B4F9C] dark:text-sky-400">
                  ~{hoursSavedPerYear} Hrs / Yr
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-100/70 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-700 dark:text-emerald-300" />
              <div>
                <p className="text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-200">Purchasing Power Multiplier</p>
                <p className="text-xs font-black text-emerald-900 dark:text-white">
                  {purchasingPowerMultiplier}x Higher Value in {selectedCityB}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
              {Number(purchasingPowerMultiplier) > 1 ? '💰 High Savings' : '⚖️ Equal'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Strategic Career Decision Insights */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-lg space-y-3">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
          <Zap size={14} />
          <span>AI Relocation & CTC Negotiation Insight</span>
        </div>
        <h4 className="text-base font-bold">
          Should you relocate for a higher nominal package?
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          When negotiating job offers across Indian metros, always calculate your <strong>Quality of Life Multiplier (QLM)</strong>. If a Bangalore or Gurgaon company offers you ₹{nominalSalaryLPA} LPA, but you have a ₹{equivalentSalaryLPAB} LPA offer in Pune, Chandigarh, or Hyderabad, you preserve greater in-hand savings, gain back hundreds of commute hours, and enjoy lower cost-per-square-foot living.
        </p>
      </div>
    </div>
  )
}
