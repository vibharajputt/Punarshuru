import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  PlusCircle,
  ArrowRight,
  Target,
  CheckCircle2,
  XCircle,
  RefreshCw,
  UserCheck,
  Briefcase,
  MapPin,
  Sliders,
  FileText,
  Shield,
  Layers,
  Building2,
} from 'lucide-react'
import { useProfileStore } from '@/store/profileStore'
import { assessApi, demoApi, profileApi } from '@/lib/api'
import DisruptionScoreCard from '@/components/dashboard/DisruptionScoreCard'
import RisksStrengthsCard from '@/components/dashboard/RisksStrengthsCard'
import ModuleNavCards from '@/components/dashboard/ModuleNavCards'
import NextActionsChecklist from '@/components/dashboard/NextActionsChecklist'
import CareerSimulatorWidget from '@/components/dashboard/CareerSimulatorWidget'
import QuickResumeParserCard from '@/components/dashboard/QuickResumeParserCard'
import Skeleton from '@/components/common/Skeleton'
import type { UserType } from '@/types'

const demoPersonas = [
  { key: 'priya', name: 'Priya Sharma', role: 'Ex-Java (4yr Gap)', city: 'Pune', tag: 'Returner' },
  { key: 'ramesh', name: 'Ramesh Kumar', role: 'Swiggy Delivery Partner', city: 'Lucknow', tag: 'Gig' },
  { key: 'arjun', name: 'Arjun Mehta', role: 'Manual QA (6yr)', city: 'Bengaluru', tag: 'Laid-Off' },
  { key: 'sneha', name: 'Sneha Patel', role: 'Support Executive', city: 'Noida', tag: 'Stagnant' },
  { key: 'rohit', name: 'Rohit Singh', role: 'Final-Yr BTech', city: 'Mohali', tag: 'Student' },
]

export default function DashboardPage() {
  const profile = useProfileStore((s) => s.profile)
  const setProfile = useProfileStore((s) => s.setProfile)
  const [switching, setSwitching] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'disruption' | 'skills' | 'simulator' | 'resume'>('overview')

  // If no active profile, automatically load Priya Sharma demo by default
  useEffect(() => {
    if (!profile) {
      demoApi.loadPersona('priya').then(async (data) => {
        try {
          const created = await profileApi.create({
            name: String(data.name || 'Priya Sharma'),
            email: 'priya@demo.punarshuru.in',
            user_type: data.user_type as UserType,
            city: String(data.city || 'Pune'),
            current_role: String(data.current_role || 'Java Developer'),
            target_role: String(data.target_role || 'GenAI Engineer'),
            experience_years: Number(data.experience_years || 5),
            career_gap_years: Number(data.career_gap_years || 4),
            skills_raw: Array.isArray(data.skills_raw) ? (data.skills_raw as string[]) : [],
          })
          setProfile(created)
        } catch {
          // fallback
        }
      })
    }
  }, [profile, setProfile])

  const handleSwitchPersona = async (key: string) => {
    try {
      setSwitching(true)
      const data = await demoApi.loadPersona(key)
      const created = await profileApi.create({
        name: String(data.name || 'Demo Candidate'),
        email: `${key}@demo.punarshuru.in`,
        user_type: data.user_type as UserType,
        city: String(data.city || 'Bengaluru'),
        current_role: String(data.current_role || 'Professional'),
        target_role: String(data.target_role || 'Software Engineer'),
        experience_years: Number(data.experience_years || 0),
        career_gap_years: Number(data.career_gap_years || 0),
        current_salary_lpa: data.current_salary_lpa ? Number(data.current_salary_lpa) : null,
        skills_raw: Array.isArray(data.skills_raw) ? (data.skills_raw as string[]) : [],
      })
      setProfile(created)
    } catch {
      // Keep state
    } finally {
      setSwitching(false)
    }
  }

  // Query live disruption
  const { data: disruptionData, isLoading: isDisruptLoading } = useQuery({
    queryKey: ['disruption', profile?.id],
    queryFn: () => (profile?.id ? assessApi.disruption(profile.id) : null),
    enabled: !!profile?.id,
    staleTime: 60_000,
  })

  // Query skill gap for match % preview
  const { data: gapData } = useQuery({
    queryKey: ['gap', profile?.id, profile?.target_role],
    queryFn: () => (profile?.id ? assessApi.gap(profile.id, profile?.target_role || undefined) : null),
    enabled: !!profile?.id,
    staleTime: 60_000,
  })

  const currentScore = profile?.disruption_score || disruptionData?.score || 72
  const targetRole = profile?.target_role || 'GenAI Engineer'
  const matchPct = gapData?.match_pct || 42
  const haveSkills = gapData?.have_skills || profile?.skills_raw || ['Java', 'Spring Boot', 'MySQL', 'REST APIs']
  const missingSkills = gapData?.missing_skills || ['Python', 'LangChain', 'Vector Databases', 'RAG']
  const topMissing = missingSkills[0] || 'Python & Vector Embeddings'

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Layers, desc: 'Summary Cards & Journey' },
    { key: 'disruption', label: 'Disruption Audit', icon: Shield, desc: 'Risk Breakdown' },
    { key: 'skills', label: 'Skill Match', icon: Target, desc: 'Have vs Missing Skills' },
    { key: 'simulator', label: 'Salary Simulator', icon: Sliders, desc: 'Interactive Calculator' },
    { key: 'resume', label: 'AI Resume Parser', icon: FileText, desc: '1-Click Skill Extractor' },
  ] as const

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6 pb-16"
    >
      {/* Super-Clean Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#0B4F9C] to-[#F26B1D] text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
              {profile?.name ? profile.name.slice(0, 2).toUpperCase() : 'PS'}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {profile?.name || 'Priya Sharma'}
                </h1>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-sky-50 dark:bg-sky-950 text-[#0B4F9C] dark:text-sky-300 border border-sky-200 dark:border-sky-800 capitalize">
                  {profile?.user_type ? profile.user_type.replace('_', ' ') : 'Returner'}
                </span>
              </div>

              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 font-medium">
                  <Briefcase size={12} className="text-slate-400" />
                  {profile?.current_role || 'Java Developer'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium">
                  <MapPin size={12} className="text-[#F26B1D]" />
                  {profile?.city || 'Pune'}
                </span>
                <span>•</span>
                <span className="font-bold text-[#0B4F9C] dark:text-sky-400">
                  Target: {targetRole}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/onboarding"
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0B4F9C] text-white hover:bg-[#083b75] shadow-sm transition-all flex items-center gap-1.5"
            >
              <PlusCircle size={14} />
              <span>Audit New Profile</span>
            </Link>
          </div>
        </div>

        {/* 1-Line Persona Switcher */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <UserCheck size={13} className="text-[#F26B1D]" /> Switch Persona:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {demoPersonas.map((p) => {
              const active = profile?.name?.toLowerCase().includes(p.key)
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => handleSwitchPersona(p.key)}
                  disabled={switching}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    active
                      ? 'bg-[#0B4F9C] text-white border-[#0B4F9C] font-bold shadow-2xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#0B4F9C]/50'
                  }`}
                >
                  {p.name.split(' ')[0]} ({p.tag})
                </button>
              )
            })}
            {switching && <RefreshCw size={12} className="animate-spin text-[#0B4F9C]" />}
          </div>
        </div>
      </div>

      {/* 1-Click Target Company Matcher Launch Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-600 via-[#0B4F9C] to-indigo-700 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
            <Building2 size={22} />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-white">
                Match Resume Against Swiggy, Google, Zomato, PhonePe
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-[#F26B1D] text-white uppercase tracking-wider">
                New Feature
              </span>
            </div>
            <p className="text-xs text-blue-100">
              Upload resume, analyze tech gaps, and unlock locked adjacent career roles with missing skills.
            </p>
          </div>
        </div>

        <Link
          to="/company-match"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-[#0B4F9C] font-extrabold text-xs hover:bg-blue-50 shadow-md transition-all shrink-0 hover:scale-[1.02]"
        >
          <span>Launch Company Matcher</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Prominent Feature Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/80 dark:border-slate-800">
        {tabs.map((tab) => {
          const isCurrent = activeTab === tab.key
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex flex-col items-start shrink-0 border ${
                isCurrent
                  ? 'bg-[#0B4F9C] text-white border-[#0B4F9C] shadow-md scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:border-[#0B4F9C]/40'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Icon size={14} className={isCurrent ? 'text-white' : 'text-[#0B4F9C]'} />
                <span className="text-sm font-extrabold">{tab.label}</span>
              </div>
              <span className={`text-[10px] mt-0.5 ${isCurrent ? 'text-sky-200' : 'text-slate-400'}`}>
                {tab.desc}
              </span>
            </button>
          )
        })}
      </div>

      {/* Tab 1: OVERVIEW SUMMARY */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Quick Summary Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Disruption Risk</span>
              <div className="text-2xl font-black text-[#F26B1D] mt-1">{currentScore}/100</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Automation exposure score</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Skill Match</span>
              <div className="text-2xl font-black text-[#0B4F9C] dark:text-sky-400 mt-1">{matchPct}%</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Match for {targetRole}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Top Gap Skill</span>
              <div className="text-sm font-black text-slate-900 dark:text-white mt-1 truncate">{topMissing}</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Priority to learn next</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Free Courses</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">NPTEL / SWAYAM</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Govt accredited roadmap</p>
            </div>
          </div>

          {/* Quick Disruption + Skill Match Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DisruptionScoreCard
              disruption={disruptionData || null}
              score={currentScore}
              userName={profile?.name || 'Priya Sharma'}
              currentRole={profile?.current_role || 'Java Developer'}
            />

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Target size={18} className="text-[#0B4F9C]" />
                    <span>Skill Match Summary</span>
                  </h3>
                  <span className="px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-[#0B4F9C] dark:text-sky-300 font-extrabold text-xs">
                    {matchPct}% Matched
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1 mb-1">
                      <CheckCircle2 size={14} /> Skills You Have ({haveSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {haveSkills.slice(0, 4).map((sk) => (
                        <span key={sk} className="px-2 py-0.5 rounded bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 text-xs font-bold">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40">
                    <span className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1 mb-1">
                      <XCircle size={14} /> Missing Skills ({missingSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {missingSkills.slice(0, 4).map((sk) => (
                        <span key={sk} className="px-2 py-0.5 rounded bg-rose-100/80 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200 text-xs font-bold">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">Want interactive radar & detailed gap?</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('skills')}
                  className="px-3 py-1.5 rounded-xl bg-[#0B4F9C] text-white text-xs font-bold flex items-center gap-1 hover:bg-[#083b75] transition-all"
                >
                  <span>Open Skill Match Tab</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Deep-Dive Modules */}
          <ModuleNavCards targetRole={targetRole} matchPct={matchPct} />

          {/* Next 3 High-Impact Actions Checklist */}
          <NextActionsChecklist targetRole={targetRole} topMissingSkill={topMissing} />
        </motion.div>
      )}

      {/* Tab 2: DISRUPTION AUDIT */}
      {activeTab === 'disruption' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {isDisruptLoading && !disruptionData ? (
            <Skeleton variant="card" className="h-72" />
          ) : (
            <DisruptionScoreCard
              disruption={disruptionData || null}
              score={currentScore}
              userName={profile?.name || 'Priya Sharma'}
              currentRole={profile?.current_role || 'Java Developer'}
            />
          )}

          <RisksStrengthsCard
            risks={disruptionData?.breakdown?.top_risks || profile?.disruption_breakdown?.top_risks || []}
            strengths={disruptionData?.breakdown?.strengths || profile?.disruption_breakdown?.strengths || []}
          />
        </motion.div>
      )}

      {/* Tab 3: SKILL MATCH */}
      {activeTab === 'skills' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Target size={18} className="text-[#0B4F9C]" />
                  <span>Skill Match Breakdown for {targetRole} ({matchPct}% Matched)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Direct comparison of your existing skills vs required role skills.
                </p>
              </div>
              <Link
                to="/skill-gap"
                className="px-3.5 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950 text-[#0B4F9C] dark:text-sky-300 font-bold text-xs hover:bg-sky-100 transition-all flex items-center gap-1 border border-sky-200 dark:border-sky-800"
              >
                <span>View Full Skill Radar Page</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 space-y-2">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle2 size={15} /> Skills You Already Have ({haveSkills.length})
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {haveSkills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2.5 py-1 rounded-lg bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 text-xs font-bold"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-2">
                <span className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <XCircle size={15} /> Key Skills You Need to Learn ({missingSkills.length})
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {missingSkills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2.5 py-1 rounded-lg bg-rose-100/80 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200 text-xs font-bold"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 4: SALARY & CAREER SIMULATOR */}
      {activeTab === 'simulator' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <CareerSimulatorWidget />
        </motion.div>
      )}

      {/* Tab 5: AI RESUME PARSER */}
      {activeTab === 'resume' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <QuickResumeParserCard />
        </motion.div>
      )}
    </motion.div>
  )
}
