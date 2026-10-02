import { useQuery } from '@tanstack/react-query'
import { healthApi, type HealthResponse } from '@/lib/api'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

export default function HealthBadge() {
  const { t } = useTranslation()
  const { data, isLoading, isError } = useQuery<HealthResponse>({
    queryKey: ['health'],
    queryFn: healthApi.check,
    retry: 2,
    refetchInterval: 30_000,
    staleTime: 10_000,
  })

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-gray-200 text-xs text-gray-500 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" />
        Checking…
      </div>
    )
  }

  const isOk = !isError && data?.status === 'ok'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border shadow-sm text-xs font-medium cursor-default"
      style={{ borderColor: isOk ? '#10B981' : '#EF4444', color: isOk ? '#059669' : '#DC2626' }}
      title={isOk ? `API v${data?.version} · ↑${data?.uptime_seconds}s` : 'Backend offline'}
      id="health-badge"
    >
      <span
        className={`w-2 h-2 rounded-full ${isOk ? 'bg-green-500' : 'bg-red-500'} ${isOk ? 'animate-pulse' : ''}`}
      />
      {isOk ? t('health.status_ok') : t('health.status_error')}
    </motion.div>
  )
}
