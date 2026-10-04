import { useNavigate } from 'react-router-dom'
import { BookOpen, Clock, ArrowRight, ShieldCheck } from 'lucide-react'
import TrendLine from '@/components/charts/TrendLine'
import type { RoleData } from './CompanyCategoriesData'

interface CompanySalaryProjectionProps {
  role: RoleData
  categoryName: string
}

export default function CompanySalaryProjection({
  role,
  categoryName,
}: CompanySalaryProjectionProps) {
  const navigate = useNavigate()
  const baseCtc = role.startingCtcLpa
  const dynamicSalaryData = [
    { period: 'Year 1', salary: baseCtc, value: baseCtc, title: `Associate ${role.title}` },
    { period: 'Year 2', salary: Number((baseCtc * 1.35).toFixed(1)), value: Number((baseCtc * 1.35).toFixed(1)), title: 'Mid-Level' },
    { period: 'Year 3', salary: Number((baseCtc * 1.82).toFixed(1)), value: Number((baseCtc * 1.82).toFixed(1)), title: 'Senior' },
    { period: 'Year 4', salary: Number((baseCtc * 2.38).toFixed(1)), value: Number((baseCtc * 2.38).toFixed(1)), title: 'Lead / Staff' },
    { period: 'Year 5', salary: Number((baseCtc * 3.05).toFixed(1)), value: Number((baseCtc * 3.05).toFixed(1)), title: 'Principal' },
  ]
  const year5Salary = dynamicSalaryData[dynamicSalaryData.length - 1].salary

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-black text-slate-900 dark:text-white">
              5-Year Salary Trajectory: {role.title}
            </h4>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs">
              ₹{year5Salary}L Y5 Target
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Employer benchmark for {categoryName} based on verified market data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Career Longevity: {role.resilienceScore}/100</span>
          </div>
        </div>
      </div>

      {/* Dynamic Compounding Chart */}
      <div className="space-y-3">
        <TrendLine data={dynamicSalaryData} height={180} dataKey="salary" color="#10B981" yUnit=" LPA" />

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {dynamicSalaryData.map((item) => (
            <div key={item.period} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{item.period}</span>
              <p className="text-xs font-black text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">
                ₹{item.salary} LPA
              </p>
              <p className="text-[10px] text-slate-500 truncate">{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Free Public Courses for Required Skills */}
      {role.courses && role.courses.length > 0 && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen size={14} className="text-[#0B4F9C]" />
              <span>Recommended Free Public Courses:</span>
            </span>
            <button
              type="button"
              onClick={() => navigate('/path')}
              className="text-xs font-bold text-[#0B4F9C] dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>See in My Path</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {role.courses.map((crs) => (
              <div
                key={crs.title}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded text-[9px] font-black bg-[#0B4F9C] text-white">
                    {crs.provider}
                  </span>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {crs.title}
                  </p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock size={10} /> {crs.weeks} Weeks • Free Government Certificate
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/path')}
                  className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 text-[#0B4F9C] dark:text-sky-300 border border-slate-200 dark:border-slate-700 font-bold text-xs shrink-0 hover:border-[#0B4F9C]"
                >
                  Start
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
