import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Briefcase, MapPin, UserCheck } from 'lucide-react'
import { demoApi, profileApi } from '@/lib/api'
import { useProfileStore } from '@/store/profileStore'
import type { Profile, UserType } from '@/types'

const personasMeta = [
  {
    key: 'priya',
    name: 'Priya Sharma',
    user_type: 'returner' as UserType,
    badge: 'Career Break Returner',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300',
    city: 'Pune',
    current_role: 'Ex-Java Developer (4yr Gap)',
    target_role: 'GenAI Engineer',
    disruption: 72,
    quote: 'Returning to tech post-maternity break; need to bridge the GenAI and modern cloud gap.',
    skills: ['Java', 'Spring Boot', 'MySQL', 'REST APIs'],
  },
  {
    key: 'ramesh',
    name: 'Ramesh Kumar',
    user_type: 'gig' as UserType,
    badge: 'Gig Platform Worker',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300',
    city: 'Lucknow',
    current_role: 'Swiggy Delivery Partner (3yr)',
    target_role: 'Logistics Tech Analyst',
    disruption: 85,
    quote: 'Algorithms cap delivery earnings; transitioning high-grit logistics intuition into tech ops.',
    skills: ['Operations', 'Route Optimization', 'Customer Service'],
  },
  {
    key: 'arjun',
    name: 'Arjun Mehta',
    user_type: 'laid_off' as UserType,
    badge: 'Laid-Off Professional',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300',
    city: 'Bengaluru',
    current_role: 'Manual QA Engineer (6yr)',
    target_role: 'Automation QA / SDET',
    disruption: 78,
    quote: 'Manual QA roles shrinking fast; urgent need to master Playwright, Python & CI/CD automation.',
    skills: ['Manual QA', 'JIRA', 'Agile', 'SQL Basics'],
  },
  {
    key: 'sneha',
    name: 'Sneha Patel',
    user_type: 'stagnant' as UserType,
    badge: 'Stagnant Employee',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300',
    city: 'Noida',
    current_role: 'Customer Support Executive (5yr)',
    target_role: 'AI Chatbot Trainer / Product Analyst',
    disruption: 68,
    quote: '3 years in the same support band; moving into prompt evaluation and product ops.',
    skills: ['Support Ops', 'CRM', 'Zendesk', 'Bilingual EN/HI'],
  },
  {
    key: 'rohit',
    name: 'Rohit Singh',
    user_type: 'student' as UserType,
    badge: 'Final-Year Student',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300',
    city: 'Mohali',
    current_role: 'BTech CSE Final Year',
    target_role: 'Software / ML Engineer',
    disruption: 22,
    quote: 'Fresher targeting high-ROI Tier-2/Tier-1 software roles with verified GitHub proofs.',
    skills: ['Python', 'C++', 'Data Structures', 'SQL'],
  },
]

export default function PersonaCardsSection() {
  const navigate = useNavigate()
  const setProfile = useProfileStore((s) => s.setProfile)
  const [loadingKey, setLoadingKey] = useState<string | null>(null)

  const handleSelectPersona = async (key: string) => {
    try {
      setLoadingKey(key)
      const data = await demoApi.loadPersona(key)

      // Post to backend profile endpoint to create active DB record with disruption score
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
        skills_taxonomy_ids: Array.isArray(data.skills_taxonomy_ids)
          ? (data.skills_taxonomy_ids as number[])
          : [],
      })

      setProfile(created)
      navigate('/dashboard')
    } catch {
      // Fallback local state if network issue
      const meta = personasMeta.find((p) => p.key === key)
      if (meta) {
        const fallbackProfile: Profile = {
          id: `demo-${key}`,
          name: meta.name,
          user_type: meta.user_type,
          city: meta.city,
          current_role: meta.current_role,
          target_role: meta.target_role,
          experience_years: 4,
          career_gap_years: meta.user_type === 'returner' ? 4 : 0,
          skills_raw: meta.skills,
          skills_taxonomy_ids: [1, 2, 3],
          disruption_score: meta.disruption,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setProfile(fallbackProfile)
        navigate('/dashboard')
      }
    } finally {
      setLoadingKey(null)
    }
  }

  return (
    <section id="demo-personas" className="py-20 bg-slate-50/60 dark:bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-xs font-bold text-[#0B4F9C] dark:text-sky-300 border border-blue-100 dark:border-blue-900">
            <UserCheck size={14} />
            <span>Interactive Demo Archetypes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            5 Indian Career Realities. Tested & Solved.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Click any persona to load their full career profile, real-time disruption audit, skill radar, and curated free learning pathway.
          </p>
        </div>

        {/* 5 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personasMeta.map((p, idx) => {
            const isLoading = loadingKey === p.key
            return (
              <motion.div
                key={p.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                onClick={() => !isLoading && handleSelectPersona(p.key)}
                className="group relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-[#0B4F9C]/50 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top row */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full border ${p.badgeColor}`}>
                      {p.badge}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      Disruption {p.disruption}/100
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
                  <span>{isLoading ? 'Simulating Assessment...' : 'Launch Live Persona Audit'}</span>
                  <ArrowRight size={15} />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
