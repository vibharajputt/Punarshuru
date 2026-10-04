import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Send,
  Mic,
  MicOff,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  FileText,
  AlertCircle,
  Volume2,
  VolumeX,
  Languages,
} from 'lucide-react'
import { onboardingApi, profileApi, voiceApi } from '@/lib/api'
import { useProfileStore } from '@/store/profileStore'
import { useAuthStore } from '@/store/authStore'
import { useTranslation } from 'react-i18next'
import type { UserType, Profile } from '@/types'

interface Message {
  id: string
  sender: 'assistant' | 'user'
  text: string
  quickReplies?: string[]
  timestamp: string
}

interface ConversationalOnboardingProps {
  onSwitchToForm: () => void
}

export default function ConversationalOnboarding({ onSwitchToForm }: ConversationalOnboardingProps) {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const authUser = useAuthStore((s) => s.user)
  const setProfile = useProfileStore((s) => s.setProfile)
  const clearProfile = useProfileStore((s) => s.clearProfile)

  // Ensure store starts empty for new onboarding per ux.md
  useEffect(() => {
    clearProfile()
  }, [clearProfile])

  const [sessionId] = useState<string>(() => `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`)
  const [voiceLang, setVoiceLang] = useState<'hi-IN' | 'en-IN'>('en-IN')
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null)

  // Initial messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'Namaste! I am your AI Career Intelligence Agent. Let’s build your profile from scratch. Upload your resume for automatic calibration, or tell me about your background and target role.',
      quickReplies: [
        'Ex-Java Developer (Career Break)',
        'Swiggy / Zomato Delivery Partner',
        'Manual QA Tester (Laid Off)',
        'Customer Support (Seeking Growth)',
        'Final Year BTech Student',
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])

  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isRecordingFallback, setIsRecordingFallback] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isDone, setIsDone] = useState(false)
  const [isFinalizing, setIsFinalizing] = useState(false)
  const [showConfirmScreen, setShowConfirmScreen] = useState(false)

  // Starts completely EMPTY per ux.md Onboarding spec
  const [profileDraft, setProfileDraft] = useState<Partial<Profile>>({
    name: authUser?.name || '',
    email: authUser?.email || '',
    user_type: 'returner',
    city: '',
    current_role: '',
    target_role: '',
    experience_years: 0,
    career_gap_years: 0,
    current_salary_lpa: null,
    skills_raw: [],
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, isTranscribing])

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch {
          // ignore
        }
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  // Web Speech API initialization with voiceLang support
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = voiceLang

      recognition.onresult = (event: any) => {
        let currentTranscript = ''
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' '
        }
        setInputMessage(currentTranscript.trim())
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    } else {
      recognitionRef.current = null
    }
  }, [voiceLang])

  // Fallback Audio Recording via MediaRecorder + Groq Whisper
  const startFallbackRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioChunksRef.current = []
      const recorder = new MediaRecorder(stream)

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setIsTranscribing(true)
        try {
          const resp = await voiceApi.transcribe(audioBlob, voiceLang === 'hi-IN' ? 'hi' : 'en')
          if (resp.text) {
            setInputMessage((prev) => (prev ? `${prev} ${resp.text}` : resp.text))
          }
        } catch (err) {
          console.warn('Fallback Whisper error:', err)
        } finally {
          setIsTranscribing(false)
          setIsRecordingFallback(false)
        }
      }

      recorder.start()
      mediaRecorderRef.current = recorder
      setIsRecordingFallback(true)
    } catch {
      setIsRecordingFallback(false)
    }
  }

  const stopFallbackRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
    }
  }

  const toggleVoice = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop()
        setIsListening(false)
      } else {
        try {
          recognitionRef.current.start()
          setIsListening(true)
        } catch {
          startFallbackRecording()
        }
      }
    } else {
      if (isRecordingFallback) {
        stopFallbackRecording()
      } else {
        startFallbackRecording()
      }
    }
  }

  // Text-To-Speech
  const handleToggleSpeak = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel()
      setSpeakingMsgId(null)
      return
    }

    window.speechSynthesis.cancel()
    const cleanText = text.replace(/[*_#`~]/g, '')
    const utterance = new SpeechSynthesisUtterance(cleanText)
    const isHindiText = /[\u0900-\u097F]/.test(text)
    utterance.lang = isHindiText ? 'hi-IN' : voiceLang

    const voices = window.speechSynthesis.getVoices()
    const matchVoice = voices.find((v) =>
      isHindiText ? v.lang.startsWith('hi') : v.lang.startsWith(voiceLang.substring(0, 2))
    )
    if (matchVoice) {
      utterance.voice = matchVoice
    }

    utterance.onend = () => setSpeakingMsgId(null)
    utterance.onerror = () => setSpeakingMsgId(null)

    setSpeakingMsgId(msgId)
    window.speechSynthesis.speak(utterance)
  }

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim()
    if (!trimmed || isTyping) return

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
    if (isRecordingFallback) {
      stopFallbackRecording()
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputMessage('')
    setIsTyping(true)
    setUploadError(null)

    try {
      const res = await onboardingApi.chat({
        session_id: sessionId,
        message: trimmed,
      })

      if (res.profile_draft) {
        setProfileDraft((prev) => ({
          ...prev,
          ...res.profile_draft,
          skills_raw: res.profile_draft.skills_raw || prev.skills_raw,
        }))
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        quickReplies: res.quick_replies,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, botMsg])
      if (res.done) {
        setIsDone(true)
      }
    } catch {
      const botFallback: Message = {
        id: `bot-fallback-${Date.now()}`,
        sender: 'assistant',
        text: "Got it! Your answers are recorded in your live profile card on the right. When ready, click 'Confirm Profile' to review and finish.",
        quickReplies: ['Confirm Profile', 'Add More Skills'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, botFallback])
    } finally {
      setIsTyping(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File exceeds 5MB limit. Please upload a smaller resume.')
      return
    }

    try {
      setIsUploading(true)
      setUploadError(null)

      const parsed = await profileApi.uploadResume(file)

      setProfileDraft((prev) => ({
        ...prev,
        name: parsed.name || prev.name || '',
        email: parsed.email || prev.email || authUser?.email || '',
        city: parsed.city || prev.city || '',
        current_role: parsed.current_role || prev.current_role || '',
        target_role: parsed.target_role || prev.target_role || '',
        experience_years: parsed.experience_years ?? prev.experience_years ?? 0,
        career_gap_years: parsed.career_gap_years ?? prev.career_gap_years ?? 0,
        skills_raw: parsed.skills && parsed.skills.length > 0 ? parsed.skills : prev.skills_raw,
      }))

      const res = await onboardingApi.chat({
        session_id: sessionId,
        message: `Uploaded resume file: ${file.name}`,
        resume_text: parsed.summary || file.name,
      })

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        quickReplies: res.quick_replies,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `user-up-${Date.now()}`,
          sender: 'user',
          text: `📄 Uploaded ${file.name} (Auto-calibrated)`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        botMsg,
      ])

      if (res.done) {
        setIsDone(true)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to parse resume.'
      setUploadError(msg)
    } finally {
      setIsUploading(false)
    }
  }

  // Confirm screen & save to /home
  const handleConfirmAndFinish = async () => {
    try {
      setIsFinalizing(true)
      const candidateName = profileDraft.name?.trim() || authUser?.name || 'Candidate'
      const candidateEmail =
        profileDraft.email?.trim() ||
        authUser?.email ||
        `${candidateName.toLowerCase().replace(/\s+/g, '')}@user.punarshuru.in`

      const created = await profileApi.create({
        name: candidateName,
        email: candidateEmail,
        user_type: (profileDraft.user_type || 'returner') as UserType,
        city: profileDraft.city?.trim() || 'Bengaluru',
        current_role: profileDraft.current_role?.trim() || 'Professional',
        target_role: profileDraft.target_role?.trim() || 'Software Engineer',
        experience_years: Number(profileDraft.experience_years || 0),
        career_gap_years: Number(profileDraft.career_gap_years || 0),
        current_salary_lpa: profileDraft.current_salary_lpa ? Number(profileDraft.current_salary_lpa) : null,
        skills_raw:
          profileDraft.skills_raw && profileDraft.skills_raw.length > 0
            ? profileDraft.skills_raw
            : ['Problem Solving', 'Communication'],
        skills_taxonomy_ids: [],
      })

      setProfile(created)
      navigate('/home')
    } catch {
      // Local fallback in case backend is slow
      const fallback: Profile = {
        id: `user-${Date.now()}`,
        name: profileDraft.name || authUser?.name || 'Candidate',
        user_type: (profileDraft.user_type || 'returner') as UserType,
        city: profileDraft.city || 'Bengaluru',
        current_role: profileDraft.current_role || 'Professional',
        target_role: profileDraft.target_role || 'Software Engineer',
        experience_years: Number(profileDraft.experience_years || 0),
        career_gap_years: Number(profileDraft.career_gap_years || 0),
        current_salary_lpa: profileDraft.current_salary_lpa || null,
        skills_raw: profileDraft.skills_raw || ['Problem Solving', 'Communication'],
        skills_taxonomy_ids: [],
        disruption_score: 65,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setProfile(fallback)
      navigate('/home')
    } finally {
      setIsFinalizing(false)
    }
  }

  const archetypeBadge = {
    returner: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200',
    gig: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200',
    laid_off: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200',
    stagnant: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200',
    student: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200',
  }[profileDraft.user_type || 'returner']

  const isMicActive = isListening || isRecordingFallback

  // ── CONFIRM SCREEN (ux.md: Ends with confirm screen → /home) ──────────────
  if (showConfirmScreen) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-md">
              <CheckCircle2 size={30} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Your Profile is Ready!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              We've calibrated your background and mapped your skills. Ready to see your Career Risk Score and next move?
            </p>
          </div>

          {/* Profile Summary Card */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-3">
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  {profileDraft.name || 'Candidate'}
                </span>
                <span className="text-xs text-slate-400">
                  {profileDraft.city || 'India'}
                </span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${archetypeBadge}`}>
                {profileDraft.user_type?.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-medium text-slate-400 block">Current Role</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {profileDraft.current_role || 'Not specified'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-medium text-slate-400 block">Target Role</span>
                <span className="font-bold text-[#0B4F9C] dark:text-sky-400">
                  {profileDraft.target_role || 'Software Engineer'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-medium text-slate-400 block">Experience</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {profileDraft.experience_years || 0} years
                </span>
              </div>
              <div>
                <span className="text-[10px] font-medium text-slate-400 block">Career Gap</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {profileDraft.career_gap_years ? `${profileDraft.career_gap_years} years` : 'None'}
                </span>
              </div>
            </div>

            {/* Calibrated Skills */}
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Calibrated Skills ({profileDraft.skills_raw?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {profileDraft.skills_raw && profileDraft.skills_raw.length > 0 ? (
                  profileDraft.skills_raw.map((s, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg bg-sky-100/70 dark:bg-slate-700 text-[#0B4F9C] dark:text-sky-300 font-bold text-[11px]"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">Core skills calibrated</span>
                )}
              </div>
            </div>
          </div>

          {/* Primary Action Button (ux.md: One primary button per screen) */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              id="confirm-go-home-btn"
              onClick={handleConfirmAndFinish}
              disabled={isFinalizing}
              className="w-full py-4 px-6 rounded-2xl bg-[#0B4F9C] text-white font-extrabold text-sm hover:bg-[#083b75] transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              {isFinalizing ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Finalizing Profile...</span>
                </>
              ) : (
                <>
                  <span>Go to Home</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>

            {/* Small text link to go back to chat */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowConfirmScreen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline transition-colors"
              >
                ← Back to chat to make changes
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── FULL-SCREEN CHAT + LIVE PROFILE CARD ──────────────────────────────────
  return (
    <div className="h-[calc(100vh-6.5rem)] min-h-[600px] flex flex-col space-y-3">
      {/* Top Header Row (Minimal, uncluttered) */}
      <div className="flex items-center justify-between px-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#0B4F9C] to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Bot size={15} />
          </div>
          <div>
            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block">
              AI Career Intelligence Agent
            </span>
            <span className="text-[10px] text-slate-400">
              Conversational onboarding & calibration
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={() => {
              const nextLang = voiceLang === 'hi-IN' ? 'en-IN' : 'hi-IN'
              setVoiceLang(nextLang)
              i18n.changeLanguage(nextLang === 'hi-IN' ? 'hi' : 'en')
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-[#0B4F9C] transition-all"
            title="Switch Language"
          >
            <Languages size={12} />
            <span>{voiceLang === 'hi-IN' ? 'हिन्दी' : 'EN'}</span>
          </button>

          {/* Small text link replacing clutter (ux.md) */}
          <button
            type="button"
            onClick={onSwitchToForm}
            className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline transition-colors"
          >
            Use form instead
          </button>
        </div>
      </div>

      {/* Main Grid: Full-screen chat (7 cols) + Live Profile Card (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Chat Thread Container (Left 7 Cols) */}
        <div className="lg:col-span-7 flex flex-col h-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          {/* Header & Quick Resume Drop Zone (Sole place for resume upload in app) */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 shrink-0">
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
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  handleFileUpload(e.dataTransfer.files[0])
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-2xl border-2 border-dashed border-sky-200 dark:border-slate-700 bg-sky-50/40 dark:bg-slate-800/40 hover:bg-sky-50 dark:hover:bg-slate-800/70 transition-all cursor-pointer flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <FileText size={16} className="text-[#0B4F9C] shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    Upload Resume for Instant Calibration
                  </span>
                  <span className="text-[10px] text-slate-400">
                    PDF, DOCX, or TXT (Max 5MB)
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#0B4F9C] dark:text-sky-400 underline shrink-0">
                {isUploading ? 'Parsing...' : 'Upload File'}
              </span>
            </div>

            {uploadError && (
              <div className="mt-2 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                <AlertCircle size={13} className="shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-[#0B4F9C] text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    <Bot size={14} />
                  </div>
                )}

                <div className="max-w-[85%] space-y-2">
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed relative group ${
                      msg.sender === 'user'
                        ? 'bg-[#0B4F9C] text-white rounded-br-xs shadow-2xs font-medium'
                        : 'bg-slate-100/90 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-200/60 dark:border-slate-700/60'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <div className="flex items-center justify-between mt-1 pt-1">
                      <span
                        className={`text-[9px] font-mono ${
                          msg.sender === 'user' ? 'text-sky-200' : 'text-slate-400'
                        }`}
                      >
                        {msg.timestamp}
                      </span>

                      {msg.sender === 'assistant' && (
                        <button
                          type="button"
                          onClick={() => handleToggleSpeak(msg.id, msg.text)}
                          title={speakingMsgId === msg.id ? 'Stop reading' : 'Read aloud'}
                          className={`p-1 rounded-md transition-all ${
                            speakingMsgId === msg.id
                              ? 'text-[#F26B1D] bg-orange-100 dark:bg-orange-950/50 animate-pulse'
                              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                          }`}
                        >
                          {speakingMsgId === msg.id ? <VolumeX size={13} /> : <Volume2 size={13} />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Quick replies */}
                  {msg.quickReplies && msg.quickReplies.length > 0 && !isDone && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.quickReplies.map((qr, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (qr === 'Confirm Profile' || qr === 'Confirm & Save Profile') {
                              setShowConfirmScreen(true)
                            } else {
                              handleSendMessage(qr)
                            }
                          }}
                          disabled={isTyping}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#0B4F9C] hover:text-[#0B4F9C] dark:hover:text-sky-400 hover:bg-sky-50/50 transition-all shadow-2xs text-left"
                        >
                          {qr}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs pl-9">
                <div className="flex gap-1 items-center bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl">
                  <span className="w-1.5 h-1.5 bg-[#0B4F9C] rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-[#0B4F9C] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-[#0B4F9C] rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-[11px]">AI is calibrating...</span>
              </div>
            )}

            {isTranscribing && (
              <div className="flex gap-2.5 items-center text-indigo-600 dark:text-indigo-400 text-xs pl-9">
                <RefreshCw size={13} className="animate-spin" />
                <span className="text-[11px] font-semibold">
                  Transcribing voice with Whisper...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
            {isMicActive && (
              <div className="mb-2 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span className="font-bold">
                    {isRecordingFallback
                      ? 'Recording audio... Click mic to finish'
                      : `Listening live (${voiceLang})... Speak now`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleVoice}
                  className="text-[11px] underline font-bold"
                >
                  Stop
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage(inputMessage)
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={toggleVoice}
                title={isMicActive ? 'Stop Listening' : `Voice Input (${voiceLang})`}
                className={`p-2.5 rounded-xl transition-all border shrink-0 ${
                  isMicActive
                    ? 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-300 animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                }`}
              >
                {isMicActive ? <MicOff size={16} /> : <Mic size={16} />}
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type or speak in English, हिन्दी, or Hinglish..."
                disabled={isTyping}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]/30 focus:border-[#0B4F9C]"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="p-2.5 rounded-xl bg-[#0B4F9C] hover:bg-[#083b75] text-white disabled:opacity-40 transition-all shadow-sm shrink-0"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Live Profile Card (Right 5 Cols) */}
        <div className="lg:col-span-5 flex flex-col h-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs p-5 overflow-hidden justify-between">
          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#F26B1D]" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Live Profile Card
                </h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${archetypeBadge}`}>
                {profileDraft.user_type?.toUpperCase()}
              </span>
            </div>

            {/* Editable Fields Preview */}
            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Candidate Name
                </span>
                <input
                  type="text"
                  value={profileDraft.name || ''}
                  onChange={(e) => setProfileDraft({ ...profileDraft, name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full font-bold text-slate-900 dark:text-white bg-transparent border-none p-0 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Current Role
                  </span>
                  <input
                    type="text"
                    value={profileDraft.current_role || ''}
                    onChange={(e) => setProfileDraft({ ...profileDraft, current_role: e.target.value })}
                    placeholder="e.g. Java Dev"
                    className="w-full font-bold text-slate-800 dark:text-slate-200 bg-transparent border-none p-0 focus:outline-none"
                  />
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Target Role
                  </span>
                  <input
                    type="text"
                    value={profileDraft.target_role || ''}
                    onChange={(e) => setProfileDraft({ ...profileDraft, target_role: e.target.value })}
                    placeholder="e.g. GenAI Engineer"
                    className="w-full font-bold text-[#0B4F9C] dark:text-sky-400 bg-transparent border-none p-0 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    City
                  </span>
                  <input
                    type="text"
                    value={profileDraft.city || ''}
                    onChange={(e) => setProfileDraft({ ...profileDraft, city: e.target.value })}
                    placeholder="e.g. Pune"
                    className="w-full font-bold text-slate-800 dark:text-slate-200 bg-transparent border-none p-0 focus:outline-none text-xs"
                  />
                </div>

                <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Exp (yrs)
                  </span>
                  <input
                    type="number"
                    value={profileDraft.experience_years ?? 0}
                    onChange={(e) => setProfileDraft({ ...profileDraft, experience_years: Number(e.target.value) })}
                    className="w-full font-bold text-slate-800 dark:text-slate-200 bg-transparent border-none p-0 focus:outline-none text-xs"
                  />
                </div>

                <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Gap (yrs)
                  </span>
                  <input
                    type="number"
                    step="0.5"
                    value={profileDraft.career_gap_years ?? 0}
                    onChange={(e) => setProfileDraft({ ...profileDraft, career_gap_years: Number(e.target.value) })}
                    className="w-full font-bold text-slate-800 dark:text-slate-200 bg-transparent border-none p-0 focus:outline-none text-xs"
                  />
                </div>
              </div>

              {/* Skills Tags */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Calibrated Skills ({profileDraft.skills_raw?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {profileDraft.skills_raw && profileDraft.skills_raw.length > 0 ? (
                    profileDraft.skills_raw.map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-lg bg-sky-100/70 dark:bg-slate-700 text-[#0B4F9C] dark:text-sky-300 font-bold text-[11px]"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">
                      Skills will appear here as you chat or upload a resume...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Confirm Button leading to Confirm Screen */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 shrink-0 space-y-2">
            <button
              type="button"
              id="confirm-profile-btn"
              onClick={() => setShowConfirmScreen(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#0B4F9C] text-white font-extrabold text-xs sm:text-sm hover:bg-[#083b75] transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              <CheckCircle2 size={16} />
              <span>Confirm & Review Profile</span>
              <ArrowRight size={14} />
            </button>
            <p className="text-[10px] text-slate-400 text-center">
              All details can be updated anytime from your settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
