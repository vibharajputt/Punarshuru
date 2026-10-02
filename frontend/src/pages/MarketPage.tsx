import { useQuery } from '@tanstack/react-query'
import { TrendingUp, RefreshCw } from 'lucide-react'
import { marketApi } from '@/lib/api'
import TrendLine from '@/components/charts/TrendLine'
import SkillsDemandTrends from '@/components/market/SkillsDemandTrends'
import CitySalaryBenchmarks from '@/components/market/CitySalaryBenchmarks'
import JobRolesTable from '@/components/market/JobRolesTable'
import Skeleton from '@/components/common/Skeleton'

export default function MarketPage() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['market-trends'],
    queryFn: marketApi.trends,
    staleTime: 60_000,
  })

  const salaryByCity = data?.salary_by_city || {
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

  const rising = data?.rising || []
  const declining = data?.declining || []

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Market Intelligence & Salary Index
            </h1>
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-orange-100 dark:bg-orange-950 text-[#F26B1D] dark:text-orange-300">
              Bharat 2.0 Live Snapshot
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time compensation benchmarks, rising skills velocity, and GenAI automation vulnerability.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-[#0B4F9C] transition-all self-start sm:self-auto"
        >
          <RefreshCw size={13} className={isFetching ? 'animate-spin' : ''} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Salary & Hiring Velocity Trend */}
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
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
            +32% YoY Surge in GenAI / Automation
          </span>
        </div>

        <TrendLine height={250} />
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
