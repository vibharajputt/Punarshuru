import { useState } from 'react'
import { FileText, Sparkles, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react'
import { profileApi } from '@/lib/api'
import { useProfileStore } from '@/store/profileStore'
import type { UserType } from '@/types'

const samples = [
  {
    title: 'Ex-Java Developer (4yr Gap)',
    text: 'Experienced Java Developer with 5 years experience in Core Java, Spring Boot, Microservices, REST APIs, MySQL, and Git. Took a 4-year career break for maternity and family care. Looking to reskill into GenAI and Python development in Pune.',
  },
  {
    title: 'Swiggy Delivery Partner',
    text: 'Working as a Swiggy delivery partner in Lucknow for 3 years. Expert in route optimization, customer communication, and gig logistics operations. Fluent in Hindi and English. Seeking to transition into logistics tech and supply chain analytics.',
  },
  {
    title: 'Manual QA (Laid Off)',
    text: 'Manual QA Tester with 6 years experience in manual test execution, test case creation, JIRA bug tracking, Agile methodology, SQL queries, and basic Selenium automation. Recently laid off in Bengaluru, targeting SDET automation role.',
  },
]

export default function QuickResumeParserCard() {
  const profile = useProfileStore((s) => s.profile)
  const setProfile = useProfileStore((s) => s.setProfile)

  const [text, setText] = useState('')
  const [parsing, setParsing] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleParse = async (contentToParse: string) => {
    if (!contentToParse.trim() || contentToParse.length < 15) return
    try {
      setParsing(true)
      setSuccessMsg(null)
      const res = await profileApi.parseResume(contentToParse)
      const created = await profileApi.create({
        name: res.name || profile?.name || 'Parsed Candidate',
        email: res.email || 'resume@demo.punarshuru.in',
        user_type: (profile?.user_type || 'returner') as UserType,
        city: res.city || profile?.city || 'Bengaluru',
        current_role: res.current_role || profile?.current_role || 'Professional',
        target_role: res.target_role || profile?.target_role || 'Software Engineer',
        experience_years: res.experience_years || profile?.experience_years || 0,
        career_gap_years: res.career_gap_years || profile?.career_gap_years || 0,
        skills_raw: Array.isArray(res.skills) && res.skills.length > 0
          ? res.skills
          : ['Java', 'SQL', 'Python'],
        resume_text: contentToParse,
      })
      setProfile(created)
      setSuccessMsg(`Successfully extracted ${created.skills_raw.length} skills & updated profile!`)
    } catch {
      // Fallback
    } finally {
      setParsing(false)
    }
  }

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-sm">
            <FileText size={16} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Instant AI Resume & Skill Extractor
            </h3>
            <p className="text-[11px] text-slate-500">
              Paste your resume or click a sample to instantly audit skills
            </p>
          </div>
        </div>

        {parsing && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B4F9C]">
            <RefreshCw size={13} className="animate-spin" />
            <span>AI Extracting...</span>
          </div>
        )}
      </div>

      {/* Preset Sample Buttons */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Try 1-Click Sample Resumes:
        </span>
        <div className="flex flex-wrap gap-2">
          {samples.map((s) => (
            <button
              key={s.title}
              type="button"
              onClick={() => {
                setText(s.text)
                handleParse(s.text)
              }}
              disabled={parsing}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#0B4F9C] transition-all flex items-center gap-1.5"
            >
              <Sparkles size={12} className="text-[#0B4F9C]" />
              <span>{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Resume Input Area */}
      <div className="space-y-2">
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste candidate bio, LinkedIn profile summary, or raw resume text here..."
          className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]/30 focus:border-[#0B4F9C]"
        />

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Min 15 characters required for AI heuristic extraction
          </span>

          <button
            type="button"
            onClick={() => handleParse(text)}
            disabled={parsing || text.trim().length < 15}
            className="px-4 py-2 rounded-xl bg-[#0B4F9C] hover:bg-[#083b75] text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
          >
            <span>{parsing ? 'Parsing Resume...' : 'Parse & Update Profile'}</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  )
}
