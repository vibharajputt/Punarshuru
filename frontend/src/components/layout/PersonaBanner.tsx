import { useNavigate } from 'react-router-dom'
import { Sparkles, User, RefreshCw } from 'lucide-react'
import { useProfileStore } from '@/store/profileStore'
import { useDemoStore } from '@/store/demoStore'
import { useActiveProfile } from '@/hooks/useActiveProfile'
import { demoApi } from '@/lib/api'
import { DEMO_PERSONAS } from '@/components/demo/DemoModal'
import type { UserType, Profile } from '@/types'

const personas = [
  { key: 'priya', name: 'Priya (Returner)' },
  { key: 'ramesh', name: 'Ramesh (Gig Worker)' },
  { key: 'arjun', name: 'Arjun (Laid-off QA)' },
  { key: 'sneha', name: 'Sneha (Stagnant)' },
  { key: 'rohit', name: 'Rohit (Student)' },
]

export default function PersonaBanner() {
  const navigate = useNavigate()
  const { profile } = useActiveProfile()
  const setProfile = useProfileStore((s) => s.setProfile)
  const setDemo = useDemoStore((s) => s.setDemo)
  const isLoading = useProfileStore((s) => s.isLoading)
  const setLoading = useProfileStore((s) => s.setLoading)

  const handleSwitch = async (key: string) => {
    try {
      setLoading(true)
      const personaItem = DEMO_PERSONAS.find((p) => p.key === key)
      if (personaItem) {
        setDemo(personaItem.key, personaItem.name, {
          role: personaItem.current_role,
          city: personaItem.city,
        })
      }
      const data = await demoApi.loadPersona(key)
      if (data) {
        const enriched: Profile = {
          id: `demo-${key}`,
          name: String(data.name || personaItem?.name || 'Demo'),
          email: `${key}@demo.punarshuru.in`,
          user_type: (data.user_type || personaItem?.user_type || 'returner') as UserType,
          city: String(data.city || personaItem?.city || 'Bengaluru'),
          current_role: String(data.current_role || personaItem?.current_role || 'Professional'),
          target_role: String(data.target_role || personaItem?.target_role || 'Software Engineer'),
          experience_years: Number(data.experience_years || 0),
          career_gap_years: Number(data.career_gap_years || 0),
          current_salary_lpa: data.current_salary_lpa ? Number(data.current_salary_lpa) : null,
          skills_raw: Array.isArray(data.skills_raw) ? (data.skills_raw as string[]) : (personaItem?.skills || []),
          skills_taxonomy_ids: [1, 2, 3],
          disruption_score: Number(data.disruption_score || personaItem?.disruption || 70),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setProfile(enriched)
      }
      navigate('/home')
    } catch {
      // Keep existing profile
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-r from-sky-50 via-white to-orange-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-b border-slate-200/60 dark:border-slate-800 py-2 px-4 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Active Profile Info */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#0B4F9C] text-white flex items-center justify-center font-bold text-[10px]">
            {profile?.name ? profile.name.slice(0, 2).toUpperCase() : <User size={12} />}
          </div>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Active: <span className="text-[#0B4F9C] dark:text-sky-400 font-bold">{profile?.name || 'Guest / Demo Profile'}</span>
          </span>
          {profile?.current_role && (
            <span className="hidden sm:inline text-slate-400">({profile.current_role})</span>
          )}
        </div>

        {/* Quick Switch Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-slate-400 text-[11px] font-medium hidden md:inline flex items-center gap-1">
            <Sparkles size={11} className="text-[#F26B1D]" /> Switch Persona:
          </span>
          {personas.map((p) => (
            <button
              key={p.key}
              onClick={() => handleSwitch(p.key)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:border-[#0B4F9C] hover:text-[#0B4F9C] dark:hover:text-sky-300 transition-all whitespace-nowrap shadow-2xs"
            >
              {p.name}
            </button>
          ))}
          {isLoading && <RefreshCw size={12} className="animate-spin text-[#0B4F9C] ml-1" />}
        </div>
      </div>
    </div>
  )
}
