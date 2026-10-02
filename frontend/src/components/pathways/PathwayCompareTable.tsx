import { TrendingUp, Layers } from 'lucide-react'
import TrendLine from '@/components/charts/TrendLine'
import type { PathwayOption } from '@/types'

interface PathwayCompareTableProps {
  pathways: PathwayOption[]
}

export default function PathwayCompareTable({
  pathways = [],
}: PathwayCompareTableProps) {
  const projectionData = [
    { period: 'Year 1', salary: 10.5, value: 10.5 },
    { period: 'Year 2', salary: 14.0, value: 14.0 },
    { period: 'Year 3', salary: 18.5, value: 18.5 },
    { period: 'Year 4', salary: 24.0, value: 24.0 },
    { period: 'Year 5', salary: 32.0, value: 32.0 },
  ]

  return (
    <div className="space-y-6">
      {/* Comparison Table */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers size={18} className="text-[#0B4F9C]" />
          <span>Side-by-Side Strategy Comparison</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Pathway</th>
                <th className="py-2.5 px-3">Target Role</th>
                <th className="py-2.5 px-3">Timeline</th>
                <th className="py-2.5 px-3">Difficulty</th>
                <th className="py-2.5 px-3">Expected CTC</th>
                <th className="py-2.5 px-3">Strategic Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {pathways.map((pw) => (
                <tr key={pw.type} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                    {pw.type}
                  </td>
                  <td className="py-3 px-3 font-semibold text-[#0B4F9C] dark:text-sky-300">
                    {pw.target_role}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {pw.estimated_months} Months
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        pw.difficulty === 'Low'
                          ? 'bg-blue-100 text-[#0B4F9C]'
                          : pw.difficulty === 'High'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {pw.difficulty}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    ₹{pw.target_salary_lpa} LPA
                  </td>
                  <td className="py-3 px-3 text-slate-500 max-w-xs truncate">
                    {pw.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5-Year Salary Trajectory Chart */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-[#0B4F9C]" />
              <span>5-Year Cumulative Career & Compensation Growth Model</span>
            </h3>
            <p className="text-xs text-slate-500">
              Projected salary compounding assuming completion of stretch milestones and verified project proofs.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">
            ₹32 LPA Milestone Potential
          </span>
        </div>

        <TrendLine data={projectionData} height={230} dataKey="salary" color="#10B981" />
      </div>
    </div>
  )
}
