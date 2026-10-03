import { useQuery } from '@tanstack/react-query'
import { healthApi, type HealthResponse } from '@/lib/api'
import { motion } from 'framer-motion'

export default function HealthBadge() {
  const { data, isLoading, isError } = useQuery<HealthResponse>({
    queryKey: ['health'],
    queryFn: healthApi.check,
    retry: 2,
    refetchInterval: 30_000,
    staleTime: 10_000,
  })

  if (isLoading) {
    return (
      <div
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-400"
        title="Checking backend connection..."
      >
        <span className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" />
        <span className="hidden sm:inline">Connecting</span>
      </div>
    )
  }

  const isOk = !isError && data?.status === 'ok'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold cursor-default transition-all ${
        isOk
          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300'
          : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
      }`}
      title={isOk ? `Backend Online (v${data?.version})` : 'Backend API Offline'}
      id="health-badge"
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isOk ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}
      />
      <span className="hidden md:inline">{isOk ? 'Live' : 'Offline'}</span>
    </motion.div>
  )
}
