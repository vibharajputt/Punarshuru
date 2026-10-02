import { useProfileStore } from '@/store/profileStore'
import { demoApi, profileApi } from '@/lib/api'
import { Sparkles, RefreshCw } from 'lucide-react'
import type { UserType } from '@/types'

const personas = [
  { key: 'priya', name: 'Priya Sharma', role: 'Java (4yr Gap)', city: 'Pune', tag: 'Returner' },
  { key: 'ramesh', name: 'Ramesh Kumar', role: 'Delivery Partner', city: 'Lucknow', tag: 'Gig' },
  { key: 'arjun', name: 'Arjun Mehta', role: 'Manual QA (6yr)', city: 'Bengaluru', tag: 'Laid-Off' },
  { key: 'sneha', name: 'Sneha Patel', role: 'Support Executive', city: 'Noida', tag: 'Stagnant' },
  { key: 'rohit', name: 'Rohit Singh', role: 'Final-Yr BTech', city: 'Mohali', tag: 'Student' },
]

export default function PersonaSwitcher() {
  const profile = useProfileStore((s) => s.profile)
  const setProfile = useProfileStore((s) => s.setProfile)
  const isLoading = useProfileStore((s) => s.isLoading)
  const setLoading = useProfileStore((s) => s.setLoading)

  const handleSelect = async (key: string) => {
    try {
      setLoading(true)
      const data = await demoApi.loadPersona(key)
      const created = await profileApi.create({
        name: String(data.name || 'Demo'),
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
    } catch {
      // Keep state
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
      <div className="flex items-center gap-1.5 px-2.5 text-xs font-bold text-slate-500 shrink-0">
        <Sparkles size={13} className="text-[#F26B1D]" />
        <span>Demo Archetypes:</span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
        {personas.map((p) => {
          const isActive = profile?.name?.toLowerCase().includes(p.key)
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => handleSelect(p.key)}
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 shrink-0 ${
                isActive
                  ? 'bg-[#0B4F9C] text-white border-[#0B4F9C] shadow-xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#0B4F9C]/50 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{p.name.split(' ')[0]}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-medium ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}>
                {p.tag}
              </span>
            </button>
          )
        })}
        {isLoading && <RefreshCw size={13} className="animate-spin text-[#0B4F9C] ml-1" />}
      </div>
    </div>
  )
}
