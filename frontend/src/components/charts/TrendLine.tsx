import { useId } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export interface TrendItem {
  period: string
  demand?: number
  salary?: number
  value?: number
}

export const COMPENSATION_TRAJECTORY_DATA: TrendItem[] = [
  { period: '2024 Q1', salary: 14.5, demand: 65, value: 14.5 },
  { period: '2024 Q2', salary: 16.0, demand: 72, value: 16.0 },
  { period: '2024 Q3', salary: 17.6, demand: 79, value: 17.6 },
  { period: '2024 Q4', salary: 19.4, demand: 86, value: 19.4 },
  { period: '2025 Q1', salary: 21.2, demand: 93, value: 21.2 },
  { period: '2025 Q2', salary: 23.0, demand: 100, value: 23.0 },
  { period: '2025 Q3', salary: 24.8, demand: 107, value: 24.8 },
  { period: '2025 Q4', salary: 26.6, demand: 115, value: 26.6 },
  { period: '2026 Q1', salary: 28.5, demand: 122, value: 28.5 },
]

export interface TrendLineProps {
  data?: TrendItem[]
  height?: number
  dataKey?: string
  color?: string
  gradientId?: string
  yUnit?: string
  className?: string
}

export default function TrendLine({
  data,
  height = 240,
  dataKey = 'salary',
  color = '#0B4F9C',
  gradientId,
  yUnit = ' LPA',
  className = '',
}: TrendLineProps) {
  const autoId = useId()
  const activeGradientId = gradientId || `trendGrad-${autoId.replace(/:/g, '')}`
  const chartData = data && data.length > 0 ? data : COMPENSATION_TRAJECTORY_DATA

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 12, right: 25, left: 25, bottom: 8 }}
        >
          <defs>
            <linearGradient id={activeGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.45} />
              <stop offset="95%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} vertical={false} />
          <XAxis
            dataKey="period"
            tick={{ fill: '#64748B', fontSize: 11, fontWeight: 500 }}
            axisLine={{ stroke: '#CBD5E1' }}
            tickLine={false}
          />
          <YAxis
            width={72}
            tickMargin={8}
            tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            unit={yUnit}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const val = payload[0].value
                return (
                  <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 text-xs">
                    <p className="font-semibold text-slate-500 dark:text-slate-400">{label}</p>
                    <p className="font-extrabold text-[#0B4F9C] dark:text-sky-400 text-sm mt-0.5">
                      ₹{val}
                      {yUnit}
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={3}
            fillOpacity={1}
            fill={`url(#${activeGradientId})`}
            isAnimationActive={false}
            connectNulls={true}
            dot={{ r: 3.5, fill: color, stroke: '#FFFFFF', strokeWidth: 2 }}
            activeDot={{ r: 5.5, fill: color, stroke: '#FFFFFF', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
