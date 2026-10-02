import React from 'react'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  variant?: 'text' | 'rect' | 'circle' | 'card' | 'chart'
  lines?: number
}

export default function Skeleton({
  className = '',
  variant = 'rect',
  lines = 3,
  ...props
}: SkeletonProps) {
  const baseClasses =
    'animate-pulse bg-slate-200/80 dark:bg-slate-800/80 rounded-lg'

  if (variant === 'circle') {
    return (
      <div
        className={`rounded-full ${baseClasses} ${className || 'w-12 h-12'}`}
        {...props}
      />
    )
  }

  if (variant === 'text') {
    return (
      <div className="space-y-2 w-full">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-4 ${baseClasses} ${
              i === lines - 1 ? 'w-2/3' : 'w-full'
            } ${className}`}
          />
        ))}
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div
        className={`p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 space-y-4 ${className}`}
        {...props}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${baseClasses}`} />
          <div className="space-y-1.5 flex-1">
            <div className={`h-4 w-1/2 ${baseClasses}`} />
            <div className={`h-3 w-1/3 ${baseClasses}`} />
          </div>
        </div>
        <div className={`h-24 w-full rounded-xl ${baseClasses}`} />
        <div className="flex gap-2">
          <div className={`h-6 w-16 rounded-full ${baseClasses}`} />
          <div className={`h-6 w-20 rounded-full ${baseClasses}`} />
        </div>
      </div>
    )
  }

  if (variant === 'chart') {
    return (
      <div
        className={`p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 flex flex-col items-center justify-center min-h-[260px] gap-4 ${className}`}
        {...props}
      >
        <div className={`w-36 h-36 rounded-full ${baseClasses}`} />
        <div className={`h-4 w-40 ${baseClasses}`} />
      </div>
    )
  }

  return <div className={`${baseClasses} ${className}`} {...props} />
}
