import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Sparkles, MapPin } from 'lucide-react'
import { useProfileStore } from '@/store/profileStore'
import { assessApi, demoApi, profileApi } from '@/lib/api'
import CareerRiskCard from '@/components/home/CareerRiskCard'
import NextStepCard from '@/components/home/NextStepCard'
import HomeShortcutCards from '@/components/home/HomeShortcutCards'
import type { UserType } from '@/types'

export default function HomePage() {
  const profile = useProfileStore((s) => s.profile)
  const setProfile = useProfileStore((s) => s.setProfile)

  // Default to Priya demo profile if none active so preview is never blank
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
            current_salary_lpa: 8.5,
            skills_raw: ['Java', 'Spring Boot', 'MySQL', 'REST APIs'],
            skills_taxonomy_ids: [1, 2, 3],
          })
          setProfile(created)
        } catch {
          // ignore
        }
      })
    }
  }, [profile, setProfile])

  const profileId = profile?.id || 'demo-priya'

  const { data: disruptionData } = useQuery({
    queryKey: ['disruption', profileId],
    queryFn: () => assessApi.disruption(profileId),
    enabled: !!profileId,
  })

  const { data: gapData } = useQuery({
    queryKey: ['skill-gap', profileId],
    queryFn: () => assessApi.gap(profileId),
    enabled: !!profileId,
  })

  const currentScore = profile?.disruption_score || disruptionData?.score || 72
  const targetRole = profile?.target_role || 'GenAI Engineer'
  const matchPct = gapData?.match_pct || 42
  const missingSkills = gapData?.missing_skills || ['Python & Vector Embeddings', 'LangChain', 'RAG']
  const topMissing = missingSkills[0] || 'Python & Vector Embeddings'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto space-y-6 pb-12"
    >
      {/* 1. Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome, {profile?.name ? profile.name.split(' ')[0] : 'Candidate'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Here is your AI career intelligence summary and priority next move.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {profile?.city && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <MapPin size={12} className="text-[#F26B1D]" />
              <span>{profile.city}</span>
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#0B4F9C] dark:text-sky-300 border border-blue-100 dark:border-blue-900">
            <Sparkles size={12} className="text-[#F26B1D]" />
            <span>Target: {targetRole}</span>
          </span>
        </div>
      </div>

      {/* 2. Top Row: Career Risk Score Card + Your Next Step Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <CareerRiskCard
          score={currentScore}
          breakdown={disruptionData?.breakdown}
        />
        <NextStepCard
          targetRole={targetRole}
          topMissingSkill={topMissing}
        />
      </div>

      {/* 3. Bottom Row: 3 Shortcut Cards (Skills match %, Best path, Real salary) */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Career Intelligence Shortcuts
        </h2>
        <HomeShortcutCards
          matchPct={matchPct}
          targetRole={targetRole}
          haveCount={gapData?.have_skills?.length || 4}
          missingCount={missingSkills.length}
          pathName="Stretch Path"
          pathWeeks={16}
          estimatedSalaryLPA={profile?.current_salary_lpa ? Number((profile.current_salary_lpa * 1.5).toFixed(1)) : 14.5}
          city={profile?.city || 'Bengaluru'}
        />
      </div>
    </motion.div>
  )
}
