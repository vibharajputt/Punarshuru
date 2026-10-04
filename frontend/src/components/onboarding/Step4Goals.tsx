import { Target, MapPin, DollarSign, Calendar } from 'lucide-react'

export interface GoalsFormData {
  target_role: string
  target_salary_lpa: number
  preferred_city: string
  timeframe_months: number
}

interface Step4GoalsProps {
  data: GoalsFormData
  onChange: (data: GoalsFormData) => void
  userType?: string
}

const suggestedRoles = [
  'GenAI Engineer',
  'Logistics Tech Analyst',
  'Automation QA / SDET',
  'AI Chatbot Trainer / Product Analyst',
  'Full Stack Developer (React + Node)',
  'ML Engineer',
  'DevOps / SRE Engineer',
  'Data Analyst',
]

const cities = [
  'Remote / Work from Anywhere',
  'Bengaluru',
  'Pune',
  'Mohali / Chandigarh',
  'Hyderabad',
  'Lucknow',
  'Noida / Delhi NCR',
  'Mumbai',
  'Chennai',
]

export default function Step4Goals({ data, onChange }: Step4GoalsProps) {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Define Your Target Move & Milestones
        </h2>
        <p className="text-xs text-slate-500">
          We use this to tailor your 3 learning paths (Safe, Stretch, Switch) and compute real salary (after rent & travel).
        </p>
      </div>

      {/* Target Role with Quick Suggestions */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Target size={14} className="text-[#0B4F9C]" /> Desired Next Role
        </label>
        <input
          type="text"
          value={data.target_role}
          onChange={(e) => onChange({ ...data, target_role: e.target.value })}
          placeholder="e.g. GenAI Engineer, Logistics Tech Analyst..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-[#0B4F9C]"
        />
        <div className="flex flex-wrap gap-1.5 pt-1">
          {suggestedRoles.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => onChange({ ...data, target_role: role })}
              className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-sky-100 hover:text-[#0B4F9C] dark:hover:bg-sky-950/60 dark:hover:text-sky-300 text-slate-600 dark:text-slate-400 font-medium transition-colors"
            >
              + {role}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Target Salary & Preferred City */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Target Salary */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <DollarSign size={14} className="text-emerald-600" /> Target Salary Expectation (₹ LPA)
          </label>
          <input
            type="number"
            step="0.5"
            min={2}
            max={100}
            value={data.target_salary_lpa || ''}
            onChange={(e) => onChange({ ...data, target_salary_lpa: Number(e.target.value) })}
            placeholder="e.g. 14.0"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-[#0B4F9C]"
          />
        </div>

        {/* Preferred Location */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <MapPin size={14} className="text-[#F26B1D]" /> Preferred Location
          </label>
          <select
            value={data.preferred_city}
            onChange={(e) => onChange({ ...data, preferred_city: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-[#0B4F9C]"
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transition Timeframe */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Calendar size={14} className="text-[#0B4F9C]" /> Desired Transition Timeframe
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { months: 2, label: 'Fast Sprint (1-2 Months)' },
            { months: 4, label: 'Balanced (3-4 Months)' },
            { months: 6, label: 'Comprehensive (6 Months)' },
          ].map((item) => {
            const active = data.timeframe_months === item.months
            return (
              <button
                key={item.months}
                type="button"
                onClick={() => onChange({ ...data, timeframe_months: item.months })}
                className={`p-3 rounded-xl text-xs font-bold border transition-all text-center ${
                  active
                    ? 'bg-[#0B4F9C] text-white border-[#0B4F9C] shadow-sm'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
