import { useState, useRef } from 'react'
import { FileText, Sparkles, RefreshCw, AlertCircle, Upload, CheckCircle2 } from 'lucide-react'
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
  onArchetypeDetected?: (type: string) => void
}

export default function Step2Background({ data, onChange, onArchetypeDetected }: Step2BackgroundProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'manual'>('upload')
  const [parsing, setParsing] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [detectedInfo, setDetectedInfo] = useState<{ userType: string; gapYears: number; skillsCount: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [rawText, setRawText] = useState(data.resume_text || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    if (!file) return

    // 5MB limit check
    if (file.size > 5 * 1024 * 1024) {
      setParseError('File size exceeds 5MB limit. Please upload a smaller file.')
      return
    }

    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !['pdf', 'docx', 'txt'].includes(ext)) {
      setParseError('Unsupported file type. Please upload a PDF, DOCX, or TXT file.')
      return
    }

    try {
      setParsing(true)
      setParseError(null)
      setUploadedFileName(file.name)
      const res = await profileApi.uploadResume(file)
      if (res.user_type) {
        onArchetypeDetected?.(res.user_type)
        setDetectedInfo({
          userType: res.user_type,
          gapYears: res.career_gap_years || 0,
          skillsCount: res.skills?.length || 0,
        })
      }
      onChange({
        ...data,
        name: res.name || data.name || 'Candidate',
        email: res.email || data.email || '',
        city: res.city || data.city || '',
        current_role: res.current_role || data.current_role || '',
        experience_years: res.experience_years || data.experience_years || 0,
        career_gap_years: res.career_gap_years || data.career_gap_years || 0,
        resume_text: res.summary || file.name,
        extracted_skills: res.skills && res.skills.length > 0 ? res.skills : data.extracted_skills,
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not parse resume file.'
      setParseError(msg)
      setUploadedFileName(null)
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

  const handleParseText = async (textToParse: string) => {
    if (!textToParse.trim() || textToParse.length < 20) {
      setParseError('Please enter at least 20 characters of resume content or experience history.')
      return
    }
    try {
      setParsing(true)
      setParseError(null)
      const res = await profileApi.parseResume(textToParse)
      if (res.user_type) {
        onArchetypeDetected?.(res.user_type)
        setDetectedInfo({
          userType: res.user_type,
          gapYears: res.career_gap_years || 0,
          skillsCount: res.skills?.length || 0,
        })
      }
      onChange({
        ...data,
        name: res.name || data.name || 'Candidate',
        email: res.email || data.email || '',
        city: res.city || data.city || '',
        current_role: res.current_role || data.current_role || '',
        experience_years: res.experience_years || data.experience_years || 0,
        career_gap_years: res.career_gap_years || data.career_gap_years || 0,
        resume_text: textToParse,
        extracted_skills: res.skills && res.skills.length > 0 ? res.skills : data.extracted_skills,
      })
    } catch {
      setParseError('Could not automatically parse resume text. Please fill in the details below.')
    } finally {
      setParsing(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Mode Selector Tabs */}
      <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'upload'
              ? 'bg-white dark:bg-slate-900 text-[#0B4F9C] dark:text-sky-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Upload size={13} />
          <span>Upload File</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('paste')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'paste'
              ? 'bg-white dark:bg-slate-900 text-[#0B4F9C] dark:text-sky-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <FileText size={13} />
          <span>Paste Text</span>
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
          Manual Entry
        </button>
      </div>

      {/* Drag & Drop File Upload Zone */}
      {activeTab === 'upload' && (
        <div className="space-y-3">
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
            className={`p-8 rounded-3xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center text-center space-y-3 ${
              isDragging
                ? 'border-[#0B4F9C] bg-sky-50/70 dark:bg-slate-800/80 scale-[1.01]'
                : 'border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 hover:border-[#0B4F9C] hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            <div className="p-3.5 rounded-2xl bg-sky-100/80 dark:bg-slate-800 text-[#0B4F9C] dark:text-sky-400 shadow-2xs">
              {parsing ? (
                <RefreshCw size={26} className="animate-spin text-[#0B4F9C]" />
              ) : uploadedFileName ? (
                <CheckCircle2 size={26} className="text-emerald-600" />
              ) : (
                <Upload size={26} />
              )}
            </div>

            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {parsing
                  ? 'Parsing Resume & Extracting Intelligence...'
                  : uploadedFileName
                  ? `Uploaded: ${uploadedFileName}`
                  : 'Drag & Drop your Resume here, or Click to browse'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Supports <strong>PDF, DOCX, TXT</strong> (Max 5MB)
              </p>
            </div>

            {uploadedFileName && !parsing && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                <CheckCircle2 size={13} /> Parsed & Pre-filled below
              </span>
            )}
          </div>
        </div>
      )}

      {/* Paste Resume Option */}
      {activeTab === 'paste' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileText size={14} className="text-[#0B4F9C]" /> Paste Resume / LinkedIn Summary
              </span>
              <button
                type="button"
                onClick={() => handleParseText(rawText)}
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
        </div>
      )}

      {detectedInfo && (
        <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-start gap-3">
          <Sparkles className="text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" size={16} />
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                AI Resume Intelligence
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-200 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                {detectedInfo.userType} Persona
              </span>
              {detectedInfo.gapYears > 0 && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                  {detectedInfo.gapYears} Yrs Gap Detected
                </span>
              )}
            </div>
            <p className="text-[11px] text-indigo-700 dark:text-indigo-300">
              {detectedInfo.gapYears > 0
                ? `Dynamic analysis relative to current year detected a ${detectedInfo.gapYears}-year break. Categorized as Returner to bridge your skills gap.`
                : `Profile categorized as ${detectedInfo.userType} archetype. Extracted ${detectedInfo.skillsCount} skills.`}
            </p>
          </div>
        </div>
      )}

      {parseError && (
        <div className="flex items-center gap-2 p-3 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl">
          <AlertCircle size={14} className="shrink-0" />
          <span>{parseError}</span>
        </div>
      )}

      {/* Extracted Details / Manual Inputs */}
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
            onChange={(e) =>
              onChange({ ...data, current_salary_lpa: e.target.value ? Number(e.target.value) : null })
            }
            placeholder="e.g. 8.5 (Leave blank if fresher)"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-[#0B4F9C]"
          />
        </div>
      </div>
    </div>
  )
}
