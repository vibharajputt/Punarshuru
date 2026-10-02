import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface TrendItem {
  period: string
  demand?: number
  salary?: number
  value?: number
}

interface TrendLineProps {
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
  gradientId = 'trendGradient',
  yUnit = ' LPA',
  className = '',
}: TrendLineProps) {
  const defaultData: TrendItem[] = [
    { period: '2024 Q1', salary: 14.5, demand: 65 },
    { period: '2024 Q2', salary: 16.0, demand: 72 },
    { period: '2024 Q3', salary: 17.8, demand: 80 },
    { period: '2024 Q4', salary: 19.5, demand: 88 },
    { period: '2025 Q1', salary: 22.0, demand: 95 },
    { period: '2026 Q1', salary: 26.5, demand: 110 },
  ]

  const chartData = data && data.length > 0 ? data : defaultData

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="period"
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            axisLine={{ stroke: '#E2E8F0' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            unit={yUnit}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const val = payload[0].value
                return (
                  <div className="glass px-3 py-2 rounded-xl shadow-lg border border-white/40 text-xs">
                    <p className="font-semibold text-slate-700">{label}</p>
                    <p className="font-bold text-[#0B4F9C]">
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
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
