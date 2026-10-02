import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { CategoryRadar } from '@/types'

interface SkillRadarProps {
  data: CategoryRadar[]
  height?: number
  className?: string
}

export default function SkillRadar({
  data = [],
  height = 280,
  className = '',
}: SkillRadarProps) {
  const chartData = data.length > 0
    ? data.map((d) => ({
        category: d.category,
        havePct: Math.round(d.pct),
        requiredPct: 100,
        haveCount: d.have,
        requiredCount: d.required,
      }))
    : [
        { category: 'AI/ML', havePct: 40, requiredPct: 100, haveCount: 2, requiredCount: 5 },
        { category: 'Backend', havePct: 80, requiredPct: 100, haveCount: 4, requiredCount: 5 },
        { category: 'Frontend', havePct: 60, requiredPct: 100, haveCount: 3, requiredCount: 5 },
        { category: 'Cloud/DevOps', havePct: 30, requiredPct: 100, haveCount: 1, requiredCount: 4 },
        { category: 'Data/SQL', havePct: 75, requiredPct: 100, haveCount: 3, requiredCount: 4 },
      ]

  return (
    <div className={`w-full flex flex-col items-center ${className}`}>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="#E2E8F0" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#94A3B8', fontSize: 9 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const p = payload[0].payload
                  return (
                    <div className="glass px-3 py-2 rounded-xl shadow-lg border border-white/40 text-xs">
                      <p className="font-bold text-slate-800">{p.category}</p>
                      <p className="text-[#0B4F9C] font-semibold">
                        Matched: {p.havePct}%
                      </p>
                      {p.haveCount !== undefined && (
                        <p className="text-slate-500">
                          {p.haveCount} of {p.requiredCount} skills verified
                        </p>
                      )}
                    </div>
                  )
                }
                return null
              }}
            />
            <Radar
              name="Target Role"
              dataKey="requiredPct"
              stroke="#CBD5E1"
              fill="#F1F5F9"
              fillOpacity={0.3}
            />
            <Radar
              name="Your Skills"
              dataKey="havePct"
              stroke="#0B4F9C"
              fill="#0B4F9C"
              fillOpacity={0.45}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-1 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#0B4F9C]" />
          <span>Your Skills</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-300" />
          <span>Target Benchmark</span>
        </div>
      </div>
    </div>
  )
}
