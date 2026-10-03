import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Target, Sliders, FileText, Shield, Layers } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useProfileStore } from '@/store/profileStore'
import { assessApi, demoApi, profileApi } from '@/lib/api'
import DashboardHeader, { type PersonaOption } from '@/components/dashboard/DashboardHeader'
import DashboardCompanyBanner from '@/components/dashboard/DashboardCompanyBanner'
import DashboardOverviewTab from '@/components/dashboard/DashboardOverviewTab'
import DashboardDisruptionTab from '@/components/dashboard/DashboardDisruptionTab'
import DashboardSkillsTab from '@/components/dashboard/DashboardSkillsTab'
import CareerSimulatorWidget from '@/components/dashboard/CareerSimulatorWidget'
import QuickResumeParserCard from '@/components/dashboard/QuickResumeParserCard'
import type { UserType } from '@/types'

const demoPersonas: PersonaOption[] = [
  { key: 'priya', name: 'Priya Sharma', role: 'Ex-Java (4yr Gap)', city: 'Pune', tag: 'Returner' },
  { key: 'ramesh', name: 'Ramesh Kumar', role: 'Swiggy Delivery Partner', city: 'Lucknow', tag: 'Gig' },
  { key: 'arjun', name: 'Arjun Mehta', role: 'Manual QA (6yr)', city: 'Bengaluru', tag: 'Laid-Off' },
  { key: 'sneha', name: 'Sneha Patel', role: 'Support Executive', city: 'Noida', tag: 'Stagnant' },
  { key: 'rohit', name: 'Rohit Singh', role: 'Final-Yr BTech', city: 'Mohali', tag: 'Student' },
]

export default function DashboardPage() {
  const { t } = useTranslation()
  const profile = useProfileStore((s) => s.profile)
  const setProfile = useProfileStore((s) => s.setProfile)
  const [switching, setSwitching] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'disruption' | 'skills' | 'simulator' | 'resume'>('overview')

  // Automatically load Priya demo by default if no active profile
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

  // Live disruption query
  const { data: disruptionData, isLoading: isDisruptLoading } = useQuery({
    queryKey: ['disruption', profile?.id],
    queryFn: () => (profile?.id ? assessApi.disruption(profile.id) : null),
    enabled: !!profile?.id,
    staleTime: 60_000,
  })

  // Skill gap query
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
    { key: 'overview', label: t('dashboard.tabs.overview'), icon: Layers, desc: t('dashboard.tabs.overview_desc') },
    { key: 'disruption', label: t('dashboard.tabs.disruption'), icon: Shield, desc: t('dashboard.tabs.disruption_desc') },
    { key: 'skills', label: t('dashboard.tabs.skills'), icon: Target, desc: t('dashboard.tabs.skills_desc') },
    { key: 'simulator', label: t('dashboard.tabs.simulator'), icon: Sliders, desc: t('dashboard.tabs.simulator_desc') },
    { key: 'resume', label: t('dashboard.tabs.resume'), icon: FileText, desc: t('dashboard.tabs.resume_desc') },
  ] as const

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6 pb-16"
    >
      <DashboardHeader
        profile={profile}
        targetRole={targetRole}
        demoPersonas={demoPersonas}
        switching={switching}
        onSwitchPersona={handleSwitchPersona}
      />

      <DashboardCompanyBanner />

      {/* Feature Tabs Bar */}
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

      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <DashboardOverviewTab
            profile={profile}
            disruptionData={disruptionData || null}
            currentScore={currentScore}
            targetRole={targetRole}
            matchPct={matchPct}
            haveSkills={haveSkills}
            missingSkills={missingSkills}
            topMissing={topMissing}
            onOpenSkillsTab={() => setActiveTab('skills')}
          />
        </motion.div>
      )}

      {activeTab === 'disruption' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <DashboardDisruptionTab
            profile={profile}
            disruptionData={disruptionData || null}
            isDisruptLoading={isDisruptLoading}
            currentScore={currentScore}
          />
        </motion.div>
      )}

      {activeTab === 'skills' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <DashboardSkillsTab
            targetRole={targetRole}
            matchPct={matchPct}
            haveSkills={haveSkills}
            missingSkills={missingSkills}
          />
        </motion.div>
      )}

      {activeTab === 'simulator' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <CareerSimulatorWidget />
        </motion.div>
      )}

      {activeTab === 'resume' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <QuickResumeParserCard />
        </motion.div>
      )}
    </motion.div>
  )
}
