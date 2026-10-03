import { useState } from 'react'
import {
  TrendingUp,
  Shield,
  Rocket,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  Zap,
  Target,
  Award,
  Layers,
  Check,
} from 'lucide-react'
import TrendLine from '@/components/charts/TrendLine'
import type { PathwayOption } from '@/types'

interface PathwayCompareTableProps {
  pathways: PathwayOption[]
  selectedPathway: PathwayOption
  onSelectPathway?: (pathway: PathwayOption) => void
}

export default function PathwayCompareTable({
  pathways = [],
  selectedPathway,
  onSelectPathway,
}: PathwayCompareTableProps) {
  const [activeTab, setActiveTab] = useState<'spotlight' | 'comparison'>('spotlight')

  // Use selected pathway or fallback to first
  const current = selectedPathway || pathways[0]

  const getStrategicMeta = (pw: PathwayOption) => {
    const type = pw.type
    if (type === 'Safe') {
      return {
        tagline: 'Lowest risk, fastest re-entry into active tech workforce.',
        bestFor: 'Candidates needing immediate salary recovery & confident baseline revalidation.',
        growthRate: '25-30% YoY',
        disruptionResilience: 'Moderate (Baseline)',
        advantages: [
          'Shortest timeline (only 2 months to job readiness)',
          'Leverages existing foundations without starting from scratch',
          'Immediate resume break normalization with verified skills',
          'High hiring volume across legacy and enterprise modernization teams',
        ],
        icon: Shield,
        color: '#0B4F9C',
        bgBadge: 'bg-blue-100 dark:bg-blue-950 text-[#0B4F9C] dark:text-sky-300',
        borderColor: 'border-blue-200 dark:border-blue-900',
        chartColor: '#0B4F9C',
        progression: [
          { year: 'Year 1', title: `Junior / Entry ${pw.target_role}`, mult: 1.0 },
          { year: 'Year 2', title: `Software Engineer II`, mult: 1.28 },
          { year: 'Year 3', title: `Senior Software Engineer`, mult: 1.65 },
          { year: 'Year 4', title: `Technical Lead / Module Owner`, mult: 2.10 },
          { year: 'Year 5', title: `Engineering Manager / Principal Engineer`, mult: 2.60 },
        ],
      }
    }
    if (type === 'Stretch') {
      return {
        tagline: 'Maximum compensation leap into frontier GenAI, LLMs & Machine Learning engineering.',
        bestFor: 'Candidates ready to build deep projects for high-growth, high-ceiling salary packages.',
        growthRate: '35-40% YoY (High-Velocity)',
        disruptionResilience: 'Very High (Frontier AI)',
        advantages: [
          'Highest CTC multiplier (up to ₹16-18+ LPA starting packages)',
          'Immense industry demand with acute shortage of verified ML/GenAI talent in India',
          'Hands-on portfolio with live vector databases, RAG pipelines & deployment artifacts',
          'Immunity against entry-level automation by mastering AI architecture',
        ],
        icon: Rocket,
        color: '#F26B1D',
        bgBadge: 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300',
        borderColor: 'border-orange-200 dark:border-orange-900',
        chartColor: '#10B981',
        progression: [
          { year: 'Year 1', title: `Associate / Junior ${pw.target_role}`, mult: 1.0 },
          { year: 'Year 2', title: `Mid-Level ${pw.target_role}`, mult: 1.38 },
          { year: 'Year 3', title: `Senior ${pw.target_role}`, mult: 1.85 },
          { year: 'Year 4', title: `Lead / Staff AI Specialist`, mult: 2.40 },
          { year: 'Year 5', title: `Principal Architect / AI Engineering Lead`, mult: 3.00 },
        ],
      }
    }
    return {
      tagline: 'Cross-functional pivot into recession-proof Cloud, DevOps & Platform infrastructure.',
      bestFor: 'Candidates wanting to transition into mission-critical cloud platform roles.',
      growthRate: '30-35% YoY',
      disruptionResilience: 'High (Cloud & Reliability)',
      advantages: [
        'Balanced 3-month roadmap with massive multi-cloud hiring in India',
        'Strong cross-domain leverage from previous programming experience',
        'Mission-critical systems immunity (reliability & CI/CD cannot be easily automated)',
        'Direct pathway to high-paying Platform & Cloud Architecture roles',
      ],
      icon: RefreshCw,
      color: '#7c3aed',
      bgBadge: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300',
      borderColor: 'border-purple-200 dark:border-purple-900',
      chartColor: '#8B5CF6',
      progression: [
        { year: 'Year 1', title: `Associate ${pw.target_role}`, mult: 1.0 },
        { year: 'Year 2', title: `Site Reliability / Cloud Engineer`, mult: 1.33 },
        { year: 'Year 3', title: `Senior DevOps / Infrastructure Lead`, mult: 1.75 },
        { year: 'Year 4', title: `Platform Systems Architect`, mult: 2.25 },
        { year: 'Year 5', title: `Director of Cloud & Platform Engineering`, mult: 2.80 },
      ],
    }
  }

  const meta = getStrategicMeta(current)
  const baseSalary = current.target_salary_lpa || 12.0

  // Calculate dynamic 5-year salary projection based on selected strategy's starting CTC
  const dynamicProjectionData = meta.progression.map((p) => {
    const salary = Number((baseSalary * p.mult).toFixed(1))
    return {
      period: p.year,
      salary: salary,
      value: salary,
      title: p.title,
    }
  })

  const year5Salary = dynamicProjectionData[dynamicProjectionData.length - 1]?.salary || (baseSalary * 2.8)

  return (
    <div className="space-y-6">
      {/* Top Header & Strategy Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              Strategy Growth & Career Progression Model
            </h3>
            <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${meta.bgBadge}`}>
              {current.type} Focus
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tailored 5-year compensation compounding and role roadmap for <strong className="text-slate-800 dark:text-slate-200">{current.target_role}</strong>.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('spotlight')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'spotlight'
                ? 'bg-white dark:bg-slate-900 text-[#0B4F9C] dark:text-sky-300 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles size={13} />
            <span>Chosen Role Deep-Dive</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('comparison')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'comparison'
                ? 'bg-white dark:bg-slate-900 text-[#0B4F9C] dark:text-sky-300 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers size={13} />
            <span>Compare All 3 Pathways</span>
          </button>
        </div>
      </div>

      {/* Quick Strategy Pills Bar (allows switching between roles right here!) */}
      <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 overflow-x-auto">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 shrink-0">
          Switch Strategy:
        </span>
        {pathways.map((pw) => {
          const isSelected = pw.type === current.type
          return (
            <button
              key={pw.type}
              type="button"
              onClick={() => onSelectPathway && onSelectPathway(pw)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                isSelected
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              {isSelected && <Check size={13} className="text-emerald-500 font-bold" />}
              <span>{pw.type}: {pw.target_role}</span>
              <span className="text-[10px] text-emerald-600 font-mono">₹{pw.target_salary_lpa}L</span>
            </button>
          )
        })}
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: SPOTLIGHT ON SELECTED STRATEGY & DYNAMIC 5-YEAR MODEL */}
      {/* ========================================================================= */}
      {activeTab === 'spotlight' && (
        <div className="space-y-6">
          {/* Main Hero Card for Selected Role */}
          <div className={`p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border-2 ${meta.borderColor} shadow-sm space-y-5`}>
            {/* Top Badge & Target Role */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-xs font-black rounded-full flex items-center gap-1.5 ${meta.bgBadge}`}>
                    <meta.icon size={14} />
                    <span>{current.type} Pathway Selected</span>
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Difficulty: <span className="font-extrabold text-slate-800 dark:text-slate-200">{current.difficulty}</span>
                  </span>
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-1">
                  {current.target_role}
                </h4>
                <p className="text-xs font-semibold text-slate-500">
                  {current.title}
                </p>
              </div>

              {/* Primary Target Metric Badges */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-right">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Starting Target CTC</p>
                  <p className="text-lg font-black text-emerald-700 dark:text-emerald-400 font-mono">₹{current.target_salary_lpa} LPA</p>
                </div>
                <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 text-right">
                  <p className="text-[10px] font-bold text-[#0B4F9C] dark:text-sky-300 uppercase tracking-wider">Preparation Time</p>
                  <p className="text-lg font-black text-[#0B4F9C] dark:text-sky-300">{current.estimated_months} Months</p>
                </div>
              </div>
            </div>

            {/* Strategic Thesis / Value Proposition */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Zap size={13} className="text-amber-500" />
                <span>Strategic Transition Thesis:</span>
              </p>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {current.description} {meta.tagline}
              </p>
            </div>

            {/* Key Advantages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/80 space-y-2.5">
                <p className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-500" />
                  <span>Key Market Advantages for this Role:</span>
                </p>
                <ul className="space-y-2">
                  {meta.advantages.map((adv, idx) => (
                    <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
                      <span className="text-emerald-500 font-bold mt-0.5">•</span>
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 flex flex-col justify-between">
                <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/30 space-y-1.5">
                  <p className="text-xs font-extrabold text-[#0B4F9C] dark:text-sky-300 flex items-center gap-1.5">
                    <Target size={14} />
                    <span>Who this strategy is best suited for:</span>
                  </p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {meta.bestFor}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Growth Velocity</p>
                    <p className="text-xs font-black text-slate-900 dark:text-white mt-0.5">{meta.growthRate}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Automation Resilience</p>
                    <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{meta.disruptionResilience}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic 5-Year Salary Trajectory Chart (Calculated from selected strategy!) */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp size={19} className="text-emerald-600" />
                  <span>5-Year Cumulative Salary Growth for {current.target_role}</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Calculated dynamically from starting CTC of <strong>₹{current.target_salary_lpa} LPA</strong> with verified skill proof milestones.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  ₹{year5Salary} LPA Year 5 Potential
                </span>
              </div>
            </div>

            {/* Dynamic Trend Chart */}
            <TrendLine
              data={dynamicProjectionData}
              height={220}
              dataKey="salary"
              color={meta.chartColor}
              yUnit=" LPA"
            />

            {/* Year-by-Year Title & Compensation Progression Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-2">
              {dynamicProjectionData.map((item) => (
                <div
                  key={item.period}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-1 text-center sm:text-left"
                >
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {item.period}
                  </span>
                  <p className="text-sm font-black text-emerald-700 dark:text-emerald-400 font-mono pt-1">
                    ₹{item.salary} LPA
                  </p>
                  <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 leading-tight">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>

            {/* Growth Insight Banner */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
              <Award size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Growth Insight:</strong> Commencing as <strong>{current.target_role}</strong> at ₹{current.target_salary_lpa} LPA establishes a strong compounding foundation, scaling up to <strong>₹{year5Salary} LPA by Year 5</strong> as you progress into lead and architectural engineering tiers.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: FULL SIDE-BY-SIDE MATRIX COMPARISON OF ALL 3 PATHWAYS */}
      {/* ========================================================================= */}
      {activeTab === 'comparison' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Strategy</th>
                  <th className="py-3 px-4">Target Role</th>
                  <th className="py-3 px-4">Timeline</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Starting CTC</th>
                  <th className="py-3 px-4">Year 5 Target</th>
                  <th className="py-3 px-4 min-w-[280px]">Strategic Value Proposition</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pathways.map((pw) => {
                  const pwMeta = getStrategicMeta(pw)
                  const isCurrent = pw.type === current.type
                  const pwYear5 = (pw.target_salary_lpa * (pw.type === 'Stretch' ? 3.0 : pw.type === 'Pivot' ? 2.8 : 2.6)).toFixed(1)

                  return (
                    <tr
                      key={pw.type}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 align-top ${
                        isCurrent ? 'bg-sky-50/40 dark:bg-sky-950/20' : ''
                      }`}
                    >
                      <td className="py-4 px-4 font-black text-slate-900 dark:text-white whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <pwMeta.icon size={14} className={isCurrent ? 'text-[#0B4F9C]' : 'text-slate-400'} />
                          <span>{pw.type}</span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                              Active
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-[#0B4F9C] dark:text-sky-300 whitespace-nowrap">
                        {pw.target_role}
                      </td>
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-300 font-semibold whitespace-nowrap">
                        {pw.estimated_months} Months
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                            pw.difficulty === 'Low'
                              ? 'bg-blue-100 text-[#0B4F9C]'
                              : pw.difficulty === 'High'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {pw.difficulty}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono font-black text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                        ₹{pw.target_salary_lpa} LPA
                      </td>
                      <td className="py-4 px-4 font-mono font-black text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                        ₹{pwYear5} LPA
                      </td>
                      <td className="py-4 px-4 text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        {pw.description}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {isCurrent ? (
                          <span className="text-xs font-bold text-emerald-600">Selected</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onSelectPathway && onSelectPathway(pw)}
                            className="px-3 py-1 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#0B4F9C] text-slate-700 dark:text-slate-300"
                          >
                            Switch To This
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
