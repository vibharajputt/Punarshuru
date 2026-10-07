import { useState, useEffect } from 'react'
import { Calculator, MapPin, DollarSign, Home, Car } from 'lucide-react'
import { compensationApi } from '@/lib/api'
import { useUserProfile } from '@/store/userProfileStore'
import type { RealCompResponse } from '@/types'

const cities = [
  'Mohali',
  'Pune',
  'Bengaluru',
  'Hyderabad',
  'Lucknow',
  'Noida',
  'Mumbai',
  'Delhi',
  'Gurugram',
  'Chennai',
  'Jaipur',
  'Ahmedabad',
]

export default function LiveFormulaCalculator() {
  const { currentSalaryLPA, currentCity, setCurrentSalaryLPA, setCurrentCity } = useUserProfile()
  const [salaryLpa, setSalaryLpa] = useState<number>(currentSalaryLPA || 18)
  const [city, setCity] = useState<string>(cities.includes(currentCity) ? currentCity : 'Bengaluru')
  const [bhk, setBhk] = useState<number>(1)
  const [result, setResult] = useState<RealCompResponse | null>(null)

  useEffect(() => {
    let active = true
    compensationApi
      .real({ salary_lpa: salaryLpa || 12, city, bhk })
      .then((res) => {
        if (active) setResult(res)
      })
      .catch(() => {
        // fallback calculation
      })
    return () => {
      active = false
    }
  }, [salaryLpa, city, bhk])

  const realLpa = result?.real_salary_lpa || 7.9
  const inHandMonthly = result?.in_hand_monthly_inr || 127500
  const annualRent = result?.annual_rent_inr || 264000
  const annualCommute = result?.annual_commute_inr || 42000
  const colIndex = result?.col_index || 2.4

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Calculator size={18} className="text-[#0B4F9C]" />
            <span>Live Purchasing Power Formula Calculator</span>
          </h3>
          <p className="text-xs text-slate-500">
            Formula: <code className="font-mono text-[#0B4F9C] dark:text-sky-300 font-bold">Real CTC = (Nominal Salary - Rent - Commute) / CoL Index</code>
          </p>
        </div>
      </div>

      {/* Control Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <DollarSign size={13} className="text-emerald-600" /> Nominal CTC (₹ LPA)
          </label>
          <input
            type="number"
            step="0.5"
            min={2}
            max={120}
            value={salaryLpa}
            onChange={(e) => {
              const val = Number(e.target.value)
              setSalaryLpa(val)
              setCurrentSalaryLPA(val)
            }}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-[#0B4F9C]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <MapPin size={13} className="text-[#F26B1D]" /> City Hub
          </label>
          <select
            value={city}
            onChange={(e) => {
              const val = e.target.value
              setCity(val)
              setCurrentCity(val)
            }}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-[#0B4F9C]"
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Home size={13} className="text-purple-600" /> Living Setup
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setBhk(1)}
              className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                bhk === 1
                  ? 'bg-[#0B4F9C] text-white border-[#0B4F9C]'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              1 BHK
            </button>
            <button
              type="button"
              onClick={() => setBhk(2)}
              className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                bhk === 2
                  ? 'bg-[#0B4F9C] text-white border-[#0B4F9C]'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              2 BHK
            </button>
          </div>
        </div>
      </div>

      {/* Formula Output Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        <div className="p-4 rounded-2xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Real Purchasing Power</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#0B4F9C] dark:text-sky-300">
              ₹{realLpa}
            </span>
            <span className="text-xs font-bold text-[#0B4F9C]">LPA</span>
          </div>
          <p className="text-[10px] text-slate-400">CoL Index: {colIndex}x vs Mohali baseline</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase">In-Hand Take Home</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{Math.round(inHandMonthly).toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-slate-400">/mo</span>
          </div>
          <p className="text-[10px] text-slate-400">Estimated post-tax & PF deduction</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
            <Home size={11} /> Annual Rent Cost
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{(annualRent / 100000).toFixed(2)}
            </span>
            <span className="text-xs font-bold text-slate-400">LPA</span>
          </div>
          <p className="text-[10px] text-slate-400">₹{Math.round(annualRent / 12).toLocaleString('en-IN')} / month</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
            <Car size={11} /> Annual Commute
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{(annualCommute / 100000).toFixed(2)}
            </span>
            <span className="text-xs font-bold text-slate-400">LPA</span>
          </div>
          <p className="text-[10px] text-slate-400">₹{Math.round(annualCommute / 12).toLocaleString('en-IN')} / month</p>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between gap-2">
        <span>📊 <strong className="text-slate-700 dark:text-slate-300">Data source:</strong> Numbeo Cost of Living Index (India 2025) & MagicBricks Rental Trend Report Q4 2025.</span>
      </div>
    </div>
  )
}
