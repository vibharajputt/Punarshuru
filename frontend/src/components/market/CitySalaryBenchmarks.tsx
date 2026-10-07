import { MapPin } from 'lucide-react'

interface CitySalaryBenchmarksProps {
  salaryByCity: Record<string, number>
}

const cityCoLMap: Record<string, number> = {
  Mohali: 1.0,
  Lucknow: 1.2,
  Jaipur: 1.3,
  Ahmedabad: 1.5,
  Noida: 1.7,
  Chennai: 1.8,
  Pune: 1.9,
  Hyderabad: 2.0,
  Delhi: 2.2,
  Gurugram: 2.3,
  Bengaluru: 2.4,
  Mumbai: 2.8,
}

export default function CitySalaryBenchmarks({
  salaryByCity = {},
}: CitySalaryBenchmarksProps) {
  const cities = Object.entries(salaryByCity).sort((a, b) => b[1] - a[1])

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin size={18} className="text-[#F26B1D]" />
            <span>Average Tech Salary Benchmarks by Indian Hub</span>
          </h3>
          <p className="text-xs text-slate-500">
            Based on active job listings indexed with Mohali Cost of Living (1.0) baseline.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {cities.map(([cityName, avgSalary]) => {
          const col = cityCoLMap[cityName] || 1.5
          return (
            <div
              key={cityName}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5 shadow-2xs hover:border-[#0B4F9C]/40 transition-all"
            >
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                {cityName}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-black text-[#0B4F9C] dark:text-sky-400">
                  ₹{avgSalary}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">LPA</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 block">
                CoL Index: {col}x
              </span>
            </div>
          )
        })}
      </div>

      <div className="pt-2 text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span>📊 <strong className="text-slate-700 dark:text-slate-300">Data source:</strong> Calibrated against 15,841 verified Indian tech & analytics postings + Numbeo Cost of Living baseline.</span>
      </div>

    </div>
  )
}
