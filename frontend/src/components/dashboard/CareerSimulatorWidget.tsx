import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sliders, Sparkles, TrendingUp, ShieldCheck, Zap, CheckCircle2 } from 'lucide-react'
import { useProfileStore } from '@/store/profileStore'
import { profileApi } from '@/lib/api'
import type { UserType } from '@/types'

const roles = [
  { name: 'GenAI Engineer', baseSalary: 18.5, riskFactor: 0.2, keySkills: ['Python', 'LangChain', 'Vector DBs', 'RAG'] },
  { name: 'Automation QA / SDET', baseSalary: 14.0, riskFactor: 0.35, keySkills: ['Selenium', 'Cypress', 'Python', 'CI/CD'] },
  { name: 'DevOps & Platform Engineer', baseSalary: 16.5, riskFactor: 0.25, keySkills: ['Docker', 'Kubernetes', 'AWS', 'Terraform'] },
  { name: 'Logistics & Supply Chain Analyst', baseSalary: 9.5, riskFactor: 0.4, keySkills: ['Excel', 'SQL', 'Route Optimization', 'Python'] },
  { name: 'AI Chatbot Trainer / Product Analyst', baseSalary: 11.0, riskFactor: 0.3, keySkills: ['Prompt Eng', 'Zendesk AI', 'Python', 'Analytics'] },
]

export default function CareerSimulatorWidget() {
  const profile = useProfileStore((s) => s.profile)
  const setProfile = useProfileStore((s) => s.setProfile)

  const [selectedRole, setSelectedRole] = useState(roles[0])
  const [experienceYears, setExperienceYears] = useState(profile?.experience_years || 4)
  const [careerGapYears, setCareerGapYears] = useState(profile?.career_gap_years || 2)
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Python'])
  const [simulating, setSimulating] = useState(false)

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill))
    } else {
      setSelectedSkills([...selectedSkills, skill])
    }
  }

  // Calculate live dynamic simulation values
  const skillCount = selectedSkills.length
  const maxSkills = selectedRole.keySkills.length
  const skillBonus = (skillCount / maxSkills) * 4.5

  // Projected disruption score (0 to 100)
  const projectedRisk = Math.max(
    12,
    Math.min(
      95,
      Math.round(
        65 +
          careerGapYears * 8 -
          experienceYears * 1.5 -
          (skillCount / maxSkills) * 38
      )
    )
  )

  // Projected salary potential (LPA)
  const projectedSalary = (
    selectedRole.baseSalary +
    experienceYears * 0.8 -
    careerGapYears * 0.5 +
    skillBonus
  ).toFixed(1)

  // Reskilling time estimate in weeks
  const estimatedWeeks = Math.max(4, Math.round((maxSkills - skillCount) * 4))

  const applySimulationToProfile = async () => {
    try {
      setSimulating(true)
      const updated = await profileApi.create({
        name: profile?.name || 'Simulator Profile',
        email: profile?.email || 'sim@punarshuru.in',
        user_type: (profile?.user_type || 'returner') as UserType,
        city: profile?.city || 'Bengaluru',
        current_role: profile?.current_role || 'Professional',
        target_role: selectedRole.name,
        experience_years: experienceYears,
        career_gap_years: careerGapYears,
        skills_raw: [...(profile?.skills_raw || []), ...selectedSkills],
      })
      setProfile(updated)
    } catch {
      // Keep state
    } fontinally: {
      setSimulating(false)
    }
  }

  const getRiskColor = (risk: number) => {
    if (risk <= 35) return { bg: 'bg-[#10B981]', text: 'text-emerald-600', label: '🟢 Low Risk (Safe)' }
    if (risk <= 65) return { bg: 'bg-[#F59E0B]', text: 'text-amber-600', label: '🟡 Moderate Risk' }
    return { bg: 'bg-[#EF4444]', text: 'text-rose-600', label: '🔴 High Disruption Risk' }
  }

  const riskStatus = getRiskColor(projectedRisk)

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-[#0B132B] text-white border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Decorative ambient background blur */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Widget Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-r from-[#0B4F9C] to-[#F26B1D] text-white shadow-md">
              <Zap size={18} />
            </div>
            <h3 className="text-lg font-black text-white tracking-tight">
              Interactive AI Career & Salary Simulator
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
              Live Interactive Tool
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Drag sliders and toggle target skills to see your AI Disruption Risk drop and Salary Potential rise in real-time.
          </p>
        </div>

        <button
          type="button"
          onClick={applySimulationToProfile}
          disabled={simulating}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-[#0B4F9C] to-sky-600 text-white hover:brightness-110 shadow-lg shadow-blue-900/30 transition-all self-start sm:self-auto shrink-0"
        >
          {simulating ? <Sparkles size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
          <span>Apply Scenario to My Audit</span>
        </button>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Controls & Sliders */}
        <div className="lg:col-span-7 space-y-5">
          {/* Target Role Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders size={13} className="text-sky-400" /> Choose Target Role:
            </label>
            <div className="flex flex-wrap gap-2">
              {roles.map((r) => {
                const active = selectedRole.name === r.name
                return (
                  <button
                    key={r.name}
                    type="button"
                    onClick={() => {
                      setSelectedRole(r)
                      setSelectedSkills([r.keySkills[0]])
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      active
                        ? 'bg-[#0B4F9C] text-white border-sky-400 shadow-md shadow-blue-900/40'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {r.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Experience Years Slider */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-300">Total Prior Experience:</span>
              <span className="text-sky-400 font-mono font-extrabold">{experienceYears} Years</span>
            </div>
            <input
              type="range"
              min={0}
              max={15}
              step={1}
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0B4F9C]"
            />
          </div>

          {/* Career Gap Slider */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-300">Career Gap / Break Duration:</span>
              <span className="text-orange-400 font-mono font-extrabold">{careerGapYears} Years</span>
            </div>
            <input
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={careerGapYears}
              onChange={(e) => setCareerGapYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#F26B1D]"
            />
          </div>

          {/* Target Skills Toggle Badges */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Toggle Target Skills Acquired:
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedRole.keySkills.map((sk) => {
                const checked = selectedSkills.includes(sk)
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => toggleSkill(sk)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                      checked
                        ? 'bg-emerald-600/90 text-white border-emerald-400 shadow-sm'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 size={13} className={checked ? 'text-white' : 'text-slate-600'} />
                    <span>{sk}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right: Live Simulated Metrics Card */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 shadow-xl space-y-6 text-center lg:text-left">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Live Projected Outcome
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
              Real-Time AI Output
            </span>
          </div>

          {/* Risk Gauge Metric */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">
              Simulated Disruption Risk
            </span>
            <div className="flex items-baseline justify-center lg:justify-start gap-2">
              <motion.span
                key={projectedRisk}
                initial={{ scale: 0.85, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl font-black tracking-tight text-white"
              >
                {projectedRisk}
              </motion.span>
              <span className="text-sm font-bold text-slate-400">/ 100</span>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden my-2">
              <motion.div
                animate={{ width: `${projectedRisk}%` }}
                transition={{ duration: 0.4 }}
                className={`h-full ${riskStatus.bg} rounded-full`}
              />
            </div>
            <p className={`text-xs font-extrabold ${riskStatus.text}`}>{riskStatus.label}</p>
          </div>

          {/* Salary Metric */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center justify-center lg:justify-start gap-1">
              <TrendingUp size={13} className="text-emerald-400" /> Projected Market CTC
            </span>
            <div className="flex items-baseline justify-center lg:justify-start gap-1.5">
              <motion.span
                key={projectedSalary}
                initial={{ y: -5, opacity: 0.5 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl font-black text-emerald-400 font-mono"
              >
                ₹{projectedSalary}
              </motion.span>
              <span className="text-xs font-bold text-slate-300">LPA</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Estimated for Indian tier-1 tech hubs ({selectedRole.name})
            </p>
          </div>

          {/* Upskilling Time */}
          <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-900/40 border border-slate-800">
            <span className="text-slate-400 font-medium">Estimated Time to Bridge Gap:</span>
            <span className="font-bold text-sky-400 font-mono">{estimatedWeeks} Weeks (~{Math.ceil(estimatedWeeks / 4)} Mo)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
