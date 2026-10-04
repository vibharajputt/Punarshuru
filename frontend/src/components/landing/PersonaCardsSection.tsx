import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Briefcase, MapPin, Users, RefreshCw } from 'lucide-react'
import { demoApi, profileApi } from '@/lib/api'
import { useProfileStore } from '@/store/profileStore'
import { useDemoStore } from '@/store/demoStore'
import { DEMO_PERSONAS, type DemoPersonaItem } from '@/components/demo/DemoModal'
import type { Profile } from '@/types'

export default function PersonaCardsSection() {
  const navigate = useNavigate()
  const setProfile = useProfileStore((s) => s.setProfile)
  const setDemo = useDemoStore((s) => s.setDemo)
  const [loadingKey, setLoadingKey] = useState<string | null>(null)

  const handleSelectPersona = async (p: DemoPersonaItem) => {
    try {
      setLoadingKey(p.key)
      const data = await demoApi.loadPersona(p.key)

      const created = await profileApi.create({
        name: String(data.name || p.name),
        email: `${p.key}@demo.punarshuru.in`,
        user_type: p.user_type,
        city: String(data.city || p.city),
        current_role: String(data.current_role || p.current_role),
        target_role: String(data.target_role || p.target_role),
        experience_years: Number(data.experience_years || 0),
        career_gap_years: Number(data.career_gap_years || 0),
        current_salary_lpa: data.current_salary_lpa ? Number(data.current_salary_lpa) : null,
        skills_raw: Array.isArray(data.skills_raw) ? (data.skills_raw as string[]) : p.skills,
        skills_taxonomy_ids: Array.isArray(data.skills_taxonomy_ids)
          ? (data.skills_taxonomy_ids as number[])
          : [1, 2, 3],
      })

      setProfile(created)
      setDemo(p.key, p.name)
      navigate('/home')
    } catch {
      // Graceful fallback
      const fallbackProfile: Profile = {
        id: `demo-${p.key}`,
        name: p.name,
        user_type: p.user_type,
        city: p.city,
        current_role: p.current_role,
        target_role: p.target_role,
        experience_years: p.user_type === 'student' ? 0 : 4,
        career_gap_years: p.user_type === 'returner' ? 4 : 0,
        skills_raw: p.skills,
        skills_taxonomy_ids: [1, 2, 3],
        disruption_score: p.disruption,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setProfile(fallbackProfile)
      setDemo(p.key, p.name)
      navigate('/home')
    } finally {
      setLoadingKey(null)
    }
  }

  return (
    <section id="who-its-for" className="py-20 bg-slate-50/60 dark:bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-xs font-bold text-[#0B4F9C] dark:text-sky-300 border border-blue-100 dark:border-blue-900">
            <Users size={14} />
            <span>Who It's For</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            5 Indian Career Realities. Tested & Solved.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Click any candidate below to explore their real Career Risk Score, skill gaps, and curated free learning roadmap.
          </p>
        </div>

        {/* 5 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_PERSONAS.map((p, idx) => {
            const isLoading = loadingKey === p.key
            return (
              <motion.div
                key={p.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                onClick={() => !isLoading && handleSelectPersona(p)}
                className="group relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-[#0B4F9C]/50 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top row */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full border ${p.badgeColor}`}>
                      {p.badge}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      Risk {p.disruption}/100
                    </span>
                  </div>

                  {/* Name & Role */}
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-[#0B4F9C] dark:group-hover:text-sky-400 transition-colors">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-[#F26B1D]" />
                        {p.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase size={13} />
                        {p.current_role}
                      </span>
                    </div>
                  </div>

                  {/* Target & Quote */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                    <p className="text-slate-400 font-medium">Target Move:</p>
                    <p className="font-bold text-[#0B4F9C] dark:text-sky-400">
                      {p.target_role}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 italic pt-1 line-clamp-2">
                      "{p.quote}"
                    </p>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-[#0B4F9C] dark:text-sky-400 group-hover:translate-x-1 transition-transform">
                  <span>{isLoading ? 'Loading demo persona…' : 'Try this demo profile'}</span>
                  {isLoading ? (
                    <RefreshCw size={14} className="animate-spin text-[#0B4F9C]" />
                  ) : (
                    <ArrowRight size={15} />
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
