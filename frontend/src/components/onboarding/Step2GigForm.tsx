import { useState } from 'react'
import {
  Truck,
  MapPin,
  Clock,
  DollarSign,
  MessageSquare,
  Navigation,
  Check,
} from 'lucide-react'

export interface GigFormData {
  platform: string
  city: string
  experience_years: number
  monthly_income_inr: number
  daily_hours: number
  skills: string[]
}

interface Step2GigFormProps {
  data: GigFormData
  onChange: (data: GigFormData) => void
}

const platforms = [
  'Swiggy',
  'Zomato',
  'Zepto / Blinkit',
  'Uber / Ola',
  'Urban Company',
  'Porter / Shadowfax',
  'Amazon / Flipkart Flex',
]

const operationalSkills = [
  'Route & Map Navigation',
  'Customer Communication (Hindi)',
  'Customer Communication (English)',
  'Smartphone App Fluency',
  'Real-Time Problem Solving',
  'Cash & Digital Payments',
  'Inventory & Order Handling',
  'Time Management & Punctuality',
]

export default function Step2GigForm({ data, onChange }: Step2GigFormProps) {
  const [selectedPlatform, setSelectedPlatform] = useState(data.platform || 'Swiggy')

  const toggleSkill = (skill: string) => {
    const current = data.skills || []
    const updated = current.includes(skill)
      ? current.filter((s) => s !== skill)
      : [...current, skill]
    onChange({ ...data, skills: updated })
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center space-y-1">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <Truck className="text-[#F26B1D]" size={22} />
          <span>Gig & Logistics Experience Details</span>
        </h3>
        <p className="text-xs text-slate-500">
          We translate daily operational problem-solving into recognized professional tech competencies.
        </p>
      </div>

      {/* Platform Multi-selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Primary Platform / Employer
        </label>
        <div className="flex flex-wrap gap-2">
          {platforms.map((p) => {
            const active = selectedPlatform === p
            return (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setSelectedPlatform(p)
                  onChange({ ...data, platform: p })
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  active
                    ? 'bg-[#0B4F9C] text-white border-[#0B4F9C] shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {p}
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* City */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <MapPin size={13} className="text-[#F26B1D]" /> City of Work
          </label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => onChange({ ...data, city: e.target.value })}
            placeholder="e.g. Lucknow, Pune, Mohali"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-[#0B4F9C]"
          />
        </div>

        {/* Experience */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Clock size={13} /> Years on Platform
          </label>
          <select
            value={data.experience_years}
            onChange={(e) => onChange({ ...data, experience_years: Number(e.target.value) })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-[#0B4F9C]"
          >
            <option value={1}>1 Year</option>
            <option value={2}>2 Years</option>
            <option value={3}>3 Years</option>
            <option value={4}>4+ Years</option>
          </select>
        </div>

        {/* Monthly earnings */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <DollarSign size={13} className="text-emerald-600" /> Approx. Monthly Take-Home (₹)
          </label>
          <input
            type="number"
            value={data.monthly_income_inr || ''}
            onChange={(e) => onChange({ ...data, monthly_income_inr: Number(e.target.value) })}
            placeholder="e.g. 22000"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-[#0B4F9C]"
          />
        </div>

        {/* Daily Shifts */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Navigation size={13} /> Daily Working Hours
          </label>
          <select
            value={data.daily_hours}
            onChange={(e) => onChange({ ...data, daily_hours: Number(e.target.value) })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-[#0B4F9C]"
          >
            <option value={4}>Part Time (4-6 Hours)</option>
            <option value={8}>Full Time (8-10 Hours)</option>
            <option value={12}>Intensive (12+ Hours)</option>
          </select>
        </div>
      </div>

      {/* Operational Competencies multi-select */}
      <div className="space-y-2 pt-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <MessageSquare size={13} className="text-[#0B4F9C]" /> Select Your Operational Strengths
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {operationalSkills.map((sk) => {
            const has = (data.skills || []).includes(sk)
            return (
              <button
                key={sk}
                type="button"
                onClick={() => toggleSkill(sk)}
                className={`p-2.5 rounded-xl text-xs font-semibold text-left border flex items-center justify-between transition-all ${
                  has
                    ? 'bg-sky-50 dark:bg-sky-950/40 border-[#0B4F9C] text-[#0B4F9C] dark:text-sky-300 font-bold'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <span>{sk}</span>
                {has && <Check size={14} className="text-[#0B4F9C] dark:text-sky-400" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
