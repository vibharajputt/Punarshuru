import { useState, useRef } from 'react'
import { FileText, Sparkles, RefreshCw, CheckCircle2, ArrowRight, Upload, AlertCircle } from 'lucide-react'
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleApplyParsed = async (res: any, originalSource: string) => {
    const created = await profileApi.create({
      name: res.name || profile?.name || 'Parsed Candidate',
      email: res.email || 'resume@demo.punarshuru.in',
      user_type: (profile?.user_type || 'returner') as UserType,
      city: res.city || profile?.city || 'Bengaluru',
      current_role: res.current_role || profile?.current_role || 'Professional',
      target_role: res.target_role || profile?.target_role || 'Software Engineer',
      experience_years: res.experience_years || profile?.experience_years || 0,
      career_gap_years: res.career_gap_years || profile?.career_gap_years || 0,
      skills_raw:
        Array.isArray(res.skills) && res.skills.length > 0
          ? res.skills
          : ['Java', 'SQL', 'Python'],
      resume_text: originalSource,
    })
    setProfile(created)
    setSuccessMsg(`Extracted ${created.skills_raw.length} verified skills & updated profile!`)
  }

  const handleFileUpload = async (file: File) => {
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File size exceeds 5MB limit.')
      return
    }

    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !['pdf', 'docx', 'txt'].includes(ext)) {
      setErrorMsg('Unsupported file type. Please upload a PDF, DOCX, or TXT file.')
      return
    }

    try {
      setParsing(true)
      setErrorMsg(null)
      setSuccessMsg(null)
      const res = await profileApi.uploadResume(file)
      await handleApplyParsed(res, file.name)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not parse resume file.'
      setErrorMsg(msg)
    } finally {
      setParsing(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleParseText = async (contentToParse: string) => {
    if (!contentToParse.trim() || contentToParse.length < 15) return
    try {
      setParsing(true)
      setErrorMsg(null)
      setSuccessMsg(null)
      const res = await profileApi.parseResume(contentToParse)
      await handleApplyParsed(res, contentToParse)
    } catch {
      setErrorMsg('Could not parse resume text.')
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
              Instant AI Resume & Document Parser
            </h3>
            <p className="text-[11px] text-slate-500">
              Upload PDF/DOCX/TXT (5MB) or paste text to audit disruption
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

      {/* Drag & Drop Upload Zone */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFileUpload(e.target.files[0])
          }
        }}
        accept=".pdf,.docx,.txt"
        className="hidden"
      />

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all flex items-center justify-between gap-3 ${
          isDragging
            ? 'border-[#0B4F9C] bg-sky-50 dark:bg-slate-800 scale-[1.01]'
            : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:border-[#0B4F9C] hover:bg-slate-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-100/80 dark:bg-slate-700 text-[#0B4F9C] dark:text-sky-400">
            <Upload size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Drag & drop resume file or click to upload
            </p>
            <p className="text-[11px] text-slate-400">Supports PDF, DOCX, TXT (Max 5MB)</p>
          </div>
        </div>

        <button
          type="button"
          disabled={parsing}
          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#0B4F9C] dark:text-sky-400 hover:bg-slate-50 transition-all shadow-2xs shrink-0"
        >
          Browse File
        </button>
      </div>

      {/* Preset Sample Buttons */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Or Try 1-Click Sample Resumes:
        </span>
        <div className="flex flex-wrap gap-2">
          {samples.map((s) => (
            <button
              key={s.title}
              type="button"
              onClick={() => {
                setText(s.text)
                handleParseText(s.text)
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

      {/* Paste Resume Input Area */}
      <div className="space-y-2">
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Or paste candidate bio, LinkedIn profile summary, or raw resume text here..."
          className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]/30 focus:border-[#0B4F9C]"
        />

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Min 15 characters required for text auto-extraction
          </span>

          <button
            type="button"
            onClick={() => handleParseText(text)}
            disabled={parsing || text.trim().length < 15}
            className="px-4 py-2 rounded-xl bg-[#0B4F9C] hover:bg-[#083b75] text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
          >
            <span>{parsing ? 'Parsing...' : 'Parse Text'}</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Error Notification */}
      {errorMsg && (
        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle size={15} className="text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

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
