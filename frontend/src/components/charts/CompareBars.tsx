import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { CityCompareItem } from '@/types'

interface CompareBarsProps {
  data?: CityCompareItem[]
  height?: number
  className?: string
}

export default function CompareBars({
  data,
  height = 280,
  className = '',
}: CompareBarsProps) {
  const defaultData = [
    {
      city: 'Mohali (Punjab)',
      nominal_salary_lpa: 14.0,
      real_salary_lpa: 12.8,
    },
    {
      city: 'Pune',
      nominal_salary_lpa: 18.0,
      real_salary_lpa: 8.4,
    },
    {
      city: 'Hyderabad',
      nominal_salary_lpa: 19.0,
      real_salary_lpa: 8.3,
    },
    {
      city: 'Bengaluru',
      nominal_salary_lpa: 22.0,
      real_salary_lpa: 7.9,
    },
    {
      city: 'Mumbai',
      nominal_salary_lpa: 24.0,
      real_salary_lpa: 7.2,
    },
  ]

  const chartData = data && data.length > 0
    ? data.map((d) => ({
        city: d.offer_name ? `${d.offer_name} (${d.city})` : d.city,
        nominal_salary_lpa: d.nominal_salary_lpa,
        real_salary_lpa: d.real_salary_lpa,
      }))
    : defaultData

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          barGap={6}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="city"
            tick={{ fill: '#64748B', fontSize: 11, fontWeight: 500 }}
            axisLine={{ stroke: '#E2E8F0' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            unit="L"
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="glass px-3.5 py-2.5 rounded-xl shadow-lg border border-white/40 text-xs space-y-1">
                    <p className="font-bold text-slate-800">{label}</p>
                    <p className="text-slate-500 flex justify-between gap-4">
                      <span>Nominal CTC:</span>
                      <span className="font-semibold text-slate-700">
                        ₹{payload[0]?.value} LPA
                      </span>
                    </p>
                    <p className="text-[#0B4F9C] flex justify-between gap-4">
                      <span>Real Purchasing Power:</span>
                      <span className="font-bold text-[#0B4F9C]">
                        ₹{payload[1]?.value} LPA
                      </span>
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }}
          />
          <Bar
            name="Nominal CTC"
            dataKey="nominal_salary_lpa"
            fill="#CBD5E1"
            radius={[6, 6, 0, 0]}
            maxBarSize={32}
          />
          <Bar
            name="Real Disposable Income"
            dataKey="real_salary_lpa"
            fill="#0B4F9C"
            radius={[6, 6, 0, 0]}
            maxBarSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
