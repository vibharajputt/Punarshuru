import { useState } from 'react'
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
    } finally {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-500/20 text-[#F26B1D] border border-orange-500/30">
              <Sliders size={18} />
            </span>
            <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">
              Interactive Reskilling & CTC Simulator
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Adjust target role, skills to learn, and career parameters to see live ROI and risk drop in real time.
          </p>
        </div>

        <button
          type="button"
          onClick={applySimulationToProfile}
          disabled={simulating}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0B4F9C] to-blue-600 hover:from-blue-600 hover:to-[#0B4F9C] text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/20 self-start sm:self-auto active:scale-95"
        >
          <Sparkles size={14} />
          <span>{simulating ? 'Applying...' : 'Apply Simulation To My Profile'}</span>
        </button>
      </div>

      {/* Target Role Selector Pills */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Zap size={14} className="text-[#F26B1D]" /> Choose Target Transition Role:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {roles.map((r) => {
            const isSelected = selectedRole.name === r.name
            return (
              <button
                key={r.name}
                type="button"
                onClick={() => {
                  setSelectedRole(r)
                  setSelectedSkills([r.keySkills[0]])
                }}
                className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between space-y-1 ${
                  isSelected
                    ? 'bg-blue-600/30 border-sky-400 text-white shadow-md'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                <span className="text-xs font-bold leading-tight">{r.name}</span>
                <span className="text-[10px] text-emerald-400 font-semibold font-mono">
                  ₹{r.baseSalary}L Base
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Interactive Controls & Live ROI Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sliders & Skill Checkboxes (7 Cols) */}
        <div className="lg:col-span-7 space-y-5 p-5 rounded-2xl bg-slate-800/50 border border-slate-700/80">
          {/* Experience Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Total Prior Experience:</span>
              <span className="font-black text-sky-400">{experienceYears} Years</span>
            </div>
            <input
              type="range"
              min={0}
              max={15}
              step={1}
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              className="w-full accent-[#0B4F9C] cursor-pointer h-2 bg-slate-700 rounded-lg"
            />
          </div>

          {/* Career Gap Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Career Gap / Unemployment Duration:</span>
              <span className="font-black text-orange-400">{careerGapYears} Years</span>
            </div>
            <input
              type="range"
              min={0}
              max={8}
              step={1}
              value={careerGapYears}
              onChange={(e) => setCareerGapYears(Number(e.target.value))}
              className="w-full accent-[#F26B1D] cursor-pointer h-2 bg-slate-700 rounded-lg"
            />
          </div>

          {/* Key Skills Checklist */}
          <div className="space-y-2 pt-2 border-t border-slate-700/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                Mark Skills You Plan to Master:
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                {skillCount}/{maxSkills} Selected
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedRole.keySkills.map((sk) => {
                const checked = selectedSkills.includes(sk)
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => toggleSkill(sk)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      checked
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700 border border-slate-600/60'
                    }`}
                  >
                    <CheckCircle2 size={13} className={checked ? 'text-slate-950 font-bold' : 'text-slate-500'} />
                    <span>{sk}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Live Simulation Output Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Projected Compensation Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/40 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <TrendingUp size={14} /> Projected Post-Reskilling CTC:
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300">
                High ROI
              </span>
            </div>
            <div className="text-3xl font-black text-white font-mono pt-1">
              ₹{projectedSalary} <span className="text-sm font-semibold text-emerald-400">LPA</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Assumes mastery of marked skills and portfolio deployment.
            </p>
          </div>

          {/* Live Risk Score Output Card */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <ShieldCheck size={14} className="text-sky-400" /> Simulated Risk Score:
              </span>
              <span className="text-xs font-bold text-white font-mono">
                {riskStatus.label}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-2xl font-black text-white font-mono">
                {projectedRisk}<span className="text-xs text-slate-400">/100</span>
              </div>
              <div className="flex-1 bg-slate-700 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${riskStatus.bg}`}
                  style={{ width: `${projectedRisk}%` }}
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Estimated reskilling duration: <strong className="text-white">{estimatedWeeks} Weeks</strong> of part-time focus.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
