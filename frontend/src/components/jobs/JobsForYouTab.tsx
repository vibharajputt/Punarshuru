import { useQuery } from '@tanstack/react-query'
import { TrendingUp, RefreshCw } from 'lucide-react'
import { marketApi } from '@/lib/api'
import TrendLine, { COMPENSATION_TRAJECTORY_DATA } from '@/components/charts/TrendLine'
import SkillsDemandTrends from '@/components/market/SkillsDemandTrends'
import CitySalaryBenchmarks from '@/components/market/CitySalaryBenchmarks'
import JobRolesTable from '@/components/market/JobRolesTable'
import Skeleton from '@/components/common/Skeleton'

const fallbackCitySalaries = {
  Bengaluru: 24.2,
  Mumbai: 22.5,
  Gurugram: 21.0,
  Hyderabad: 19.8,
  Pune: 18.2,
  Chennai: 17.5,
  Noida: 16.8,
  Ahmedabad: 14.5,
  Jaipur: 13.0,
  Lucknow: 11.5,
  Mohali: 12.0,
}

export default function JobsForYouTab() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['market-trends'],
    queryFn: marketApi.trends,
    staleTime: 60_000,
  })

  const salaryByCity = data?.salary_by_city || fallbackCitySalaries
  const rising = data?.rising || []
  const declining = data?.declining || []

  return (
    <div className="space-y-6 pb-8">
      {/* Velocity Trend Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-[#0B4F9C]" />
              <span>Quarterly GenAI & Full-Stack Compensation Trajectory</span>
            </h3>
            <p className="text-xs text-slate-500">
              Median CTC growth across Tier-1 and Tier-2 Indian tech hubs.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
              +32% YoY Surge
            </span>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-[#0B4F9C]"
            >
              <RefreshCw size={12} className={isFetching ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <TrendLine data={COMPENSATION_TRAJECTORY_DATA} height={220} />
      </div>

      {/* Rising vs Declining Skills */}
      {isLoading && !data ? (
        <Skeleton variant="card" className="h-64" />
      ) : (
        <SkillsDemandTrends rising={rising} declining={declining} />
      )}

      {/* City Salary Benchmarks */}
      <CitySalaryBenchmarks salaryByCity={salaryByCity} />

      {/* Job Roles Table */}
      <JobRolesTable />
    </div>
  )
}
