import { useState } from 'react'
import { FileText, Sparkles, RefreshCw, AlertCircle } from 'lucide-react'
import { profileApi } from '@/lib/api'

export interface BackgroundFormData {
  name: string
  email: string
  city: string
  current_role: string
  experience_years: number
  career_gap_years: number
  current_salary_lpa: number | null
  resume_text: string
  extracted_skills: string[]
}

interface Step2BackgroundProps {
  data: BackgroundFormData
  onChange: (data: BackgroundFormData) => void
}

export default function Step2Background({ data, onChange }: Step2BackgroundProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload')
  const [parsing, setParsing] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)
  const [rawText, setRawText] = useState(data.resume_text || '')

  const handleParse = async (textToParse: string) => {
    if (!textToParse.trim() || textToParse.length < 20) {
      setParseError('Please enter at least 20 characters of resume content or experience history.')
      return
    }
    try {
      setParsing(true)
      setParseError(null)
      const res = await profileApi.parseResume(textToParse)
      onChange({
        ...data,
        name: res.name || data.name || 'Candidate',
        email: res.email || data.email || '',
        city: res.city || data.city || 'Bengaluru',
        current_role: res.current_role || data.current_role || 'Software Professional',
        experience_years: res.experience_years || data.experience_years || 0,
        career_gap_years: res.career_gap_years || data.career_gap_years || 0,
        resume_text: textToParse,
        extracted_skills: res.skills.length > 0 ? res.skills : data.extracted_skills,
      })
    } catch {
      setParseError('Could not automatically parse resume text. Please fill in the details below.')
    } finally {
      setParsing(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Tab Switcher */}
      <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 max-w-sm mx-auto">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'upload'
              ? 'bg-white dark:bg-slate-900 text-[#0B4F9C] dark:text-sky-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Resume Text / AI Extract
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('manual')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'manual'
              ? 'bg-white dark:bg-slate-900 text-[#0B4F9C] dark:text-sky-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Quick Manual Entry
        </button>
      </div>

      {activeTab === 'upload' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileText size={14} className="text-[#0B4F9C]" /> Paste Resume / LinkedIn Summary
              </span>
              <button
                type="button"
                onClick={() => handleParse(rawText)}
                disabled={parsing || !rawText.trim()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-[#0B4F9C] text-white hover:bg-[#083b75] transition-all disabled:opacity-50"
              >
                {parsing ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
                <span>Auto-Extract with AI</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste your resume text, job summary, career gap details, and tech stack here..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-[#0B4F9C]"
            />
          </div>

          {parseError && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl">
              <AlertCircle size={14} className="shrink-0" />
              <span>{parseError}</span>
            </div>
          )}
        </div>
      )}

      {/* Manual Input Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Your Full Name</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            placeholder="e.g. Priya Sharma"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-[#0B4F9C]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Current / Last Role</label>
          <input
            type="text"
            value={data.current_role}
            onChange={(e) => onChange({ ...data, current_role: e.target.value })}
            placeholder="e.g. Java Developer, QA Tester"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-[#0B4F9C]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Base City</label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => onChange({ ...data, city: e.target.value })}
            placeholder="e.g. Pune, Bengaluru, Mohali"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-[#0B4F9C]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Work Experience (Years)</label>
          <input
            type="number"
            min={0}
            max={35}
            value={data.experience_years}
            onChange={(e) => onChange({ ...data, experience_years: Number(e.target.value) })}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-[#0B4F9C]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Career Gap / Break (Years)</label>
          <input
            type="number"
            step="0.5"
            min={0}
            max={20}
            value={data.career_gap_years}
            onChange={(e) => onChange({ ...data, career_gap_years: Number(e.target.value) })}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-[#0B4F9C]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Current / Last Salary (₹ LPA)</label>
          <input
            type="number"
            step="0.5"
            value={data.current_salary_lpa || ''}
            onChange={(e) => onChange({ ...data, current_salary_lpa: e.target.value ? Number(e.target.value) : null })}
            placeholder="e.g. 8.5 (Leave blank if fresher)"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-[#0B4F9C]"
          />
        </div>
      </div>
    </div>
  )
}
