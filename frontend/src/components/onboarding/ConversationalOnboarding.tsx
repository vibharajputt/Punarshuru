import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Send,
  Upload,
  Mic,
  MicOff,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Sliders,
  FileText,
  AlertCircle,
  Volume2,
  VolumeX,
  Languages,
} from 'lucide-react'
import { onboardingApi, profileApi, voiceApi } from '@/lib/api'
import { useProfileStore } from '@/store/profileStore'
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
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const setProfile = useProfileStore((s) => s.setProfile)

  const [sessionId] = useState<string>(() => `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`)
  const [voiceLang, setVoiceLang] = useState<'hi-IN' | 'en-IN'>('en-IN')
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'Namaste! I am your AI Career Intelligence Agent. You can upload a resume for instant calibration, or tell me about your background and target role.',
      quickReplies: [
        'Ex-Java Developer (4yr Gap)',
        'Swiggy Delivery Partner',
        'Manual QA (Laid Off)',
        'Customer Support (3yr Stagnant)',
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

  const [profileDraft, setProfileDraft] = useState<Partial<Profile>>({
    name: '',
    email: '',
    user_type: 'returner',
    city: 'Bengaluru',
    current_role: '',
    target_role: 'GenAI Engineer',
    experience_years: 0,
    career_gap_years: 0,
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

      recognition.onerror = (err: any) => {
        console.warn('Web Speech API error, switching to audio recorder fallback:', err)
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
        stream.getTracks().forEach((t) => t.stop())
        setIsRecordingFallback(false)
        if (audioBlob.size > 0) {
          setIsTranscribing(true)
          try {
            const langCode = voiceLang.split('-')[0]
            const res = await voiceApi.transcribe(audioBlob, langCode)
            if (res.text) {
              setInputMessage((prev) => (prev ? `${prev} ${res.text}` : res.text))
            }
          } catch (e) {
            console.error('Groq Whisper transcription failed:', e)
          } finally {
            setIsTranscribing(false)
          }
        }
      }

      mediaRecorderRef.current = recorder
      recorder.start()
      setIsRecordingFallback(true)
    } catch (err) {
      console.error('Microphone access denied:', err)
      alert('Microphone access denied or not available. Please type your message.')
    }
  }

  const stopFallbackRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
  }

  const toggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (SpeechRecognition && recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop()
        setIsListening(false)
      } else {
        try {
          recognitionRef.current.lang = voiceLang
          recognitionRef.current.start()
          setIsListening(true)
        } catch {
          // If start fails, fallback to MediaRecorder
          startFallbackRecording()
        }
      }
    } else {
      // Fallback path
      if (isRecordingFallback) {
        stopFallbackRecording()
      } else {
        startFallbackRecording()
      }
    }
  }

  // Text-to-Speech using window.speechSynthesis
  const handleToggleSpeak = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.')
      return
    }

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel()
      setSpeakingMsgId(null)
      return
    }

    window.speechSynthesis.cancel()
    const cleanText = text.replace(/[*_#`]/g, '')
    const utterance = new SpeechSynthesisUtterance(cleanText)

    const isHindiText = /[\u0900-\u097F]/.test(text)
    utterance.lang = isHindiText ? 'hi-IN' : voiceLang

    // Select voice if available
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

    // Stop listening if active
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
        text: "Got it! Let's record these details. You can review your profile summary on the right.",
        quickReplies: ['Confirm & Save Profile', 'Edit Target Role'],
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
        name: parsed.name || prev.name || 'Candidate',
        email: parsed.email || prev.email,
        city: parsed.city || prev.city || 'Bengaluru',
        current_role: parsed.current_role || prev.current_role || 'Professional',
        target_role: parsed.target_role || prev.target_role || 'GenAI Engineer',
        experience_years: parsed.experience_years || prev.experience_years || 0,
        career_gap_years: parsed.career_gap_years || prev.career_gap_years || 0,
        skills_raw: parsed.skills && parsed.skills.length > 0 ? parsed.skills : prev.skills_raw,
      }))

      // Send to onboarding chat
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
          text: `📄 Uploaded ${file.name} (Auto-parsed)`,
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

  const handleFinalizeProfile = async () => {
    try {
      setIsFinalizing(true)
      const created = await profileApi.create({
        name: profileDraft.name || 'Candidate',
        email: profileDraft.email || `${(profileDraft.name || 'user').toLowerCase().replace(/\s+/g, '')}@demo.punarshuru.in`,
        user_type: (profileDraft.user_type || 'returner') as UserType,
        city: profileDraft.city || 'Bengaluru',
        current_role: profileDraft.current_role || 'Professional',
        target_role: profileDraft.target_role || 'Software Engineer',
        experience_years: Number(profileDraft.experience_years || 0),
        career_gap_years: Number(profileDraft.career_gap_years || 0),
        current_salary_lpa: profileDraft.current_salary_lpa ? Number(profileDraft.current_salary_lpa) : null,
        skills_raw: profileDraft.skills_raw && profileDraft.skills_raw.length > 0
          ? profileDraft.skills_raw
          : ['Python', 'SQL', 'Git'],
        skills_taxonomy_ids: [],
      })

      setProfile(created)
      navigate('/dashboard')
    } catch {
      // Local fallback
      const fallback: Profile = {
        id: `user-${Date.now()}`,
        name: profileDraft.name || 'Candidate',
        user_type: (profileDraft.user_type || 'returner') as UserType,
        city: profileDraft.city || 'Bengaluru',
        current_role: profileDraft.current_role || 'Professional',
        target_role: profileDraft.target_role || 'Software Engineer',
        experience_years: Number(profileDraft.experience_years || 0),
        career_gap_years: Number(profileDraft.career_gap_years || 0),
        current_salary_lpa: profileDraft.current_salary_lpa || null,
        skills_raw: profileDraft.skills_raw || ['Java', 'SQL'],
        skills_taxonomy_ids: [],
        disruption_score: 72,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setProfile(fallback)
      navigate('/dashboard')
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

  return (
    <div className="space-y-6">
      {/* Top Banner Switcher & Language Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-gradient-to-br from-[#0B4F9C] to-indigo-600 text-white shadow-sm">
            <Bot size={18} />
          </div>
          <div>
            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block">
              {t('onboarding.chat_agent_title')}
            </span>
            <span className="text-[11px] text-slate-500">
              {t('onboarding.chat_agent_subtitle')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Toggle Button */}
          <button
            type="button"
            onClick={() => {
              const nextLang = voiceLang === 'hi-IN' ? 'en-IN' : 'hi-IN'
              setVoiceLang(nextLang)
              i18n.changeLanguage(nextLang === 'hi-IN' ? 'hi' : 'en')
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-200 dark:border-slate-700 bg-sky-50 dark:bg-slate-800 text-xs font-bold text-[#0B4F9C] dark:text-sky-300 hover:bg-sky-100 transition-all shadow-2xs"
            title="Switch Speech Recognition & Synthesis Language"
          >
            <Languages size={13} />
            <span>{voiceLang === 'hi-IN' ? '🇮🇳 हिन्दी (hi-IN)' : '🇬🇧 English (en-IN)'}</span>
          </button>

          <button
            type="button"
            onClick={onSwitchToForm}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-[#0B4F9C] hover:text-[#0B4F9C] transition-all shadow-2xs"
          >
            <Sliders size={13} />
            <span>{t('onboarding.use_form_instead')}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Chat Thread Container (Left 7 Cols) */}
        <div className="lg:col-span-7 flex flex-col h-[650px] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/50">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Punarshuru AI Talent Assistant
              </span>
            </div>

            <div className="flex items-center gap-2">
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
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-sky-50 dark:bg-slate-800 text-[#0B4F9C] dark:text-sky-400 hover:bg-sky-100 transition-all border border-sky-100 dark:border-slate-700"
              >
                {isUploading ? <RefreshCw size={11} className="animate-spin" /> : <Upload size={11} />}
                <span>{isUploading ? t('onboarding.parsing', 'Parsing...') : t('onboarding.upload_resume')}</span>
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* Quick Resume Drop Zone Banner */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  handleFileUpload(e.dataTransfer.files[0])
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className="p-3.5 rounded-2xl border-2 border-dashed border-sky-200 dark:border-slate-700 bg-sky-50/40 dark:bg-slate-800/40 hover:bg-sky-50 dark:hover:bg-slate-800/70 transition-all cursor-pointer flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <FileText size={16} className="text-[#0B4F9C] shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    {t('onboarding.drag_drop')}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {t('onboarding.drag_drop_sub')}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#0B4F9C] dark:text-sky-400 underline">
                {t('onboarding.upload_resume')}
              </span>
            </div>

            {uploadError && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

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

                <div className={`max-w-[82%] space-y-2`}>
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

                      {/* Speaker Read-Aloud Button for Assistant Messages */}
                      {msg.sender === 'assistant' && (
                        <button
                          type="button"
                          onClick={() => handleToggleSpeak(msg.id, msg.text)}
                          title={speakingMsgId === msg.id ? 'Stop reading' : 'Read aloud (SpeechSynthesis)'}
                          className={`p-1 rounded-md transition-all ${
                            speakingMsgId === msg.id
                              ? 'text-[#F26B1D] bg-orange-100 dark:bg-orange-950/50 animate-pulse'
                              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700'
                          }`}
                        >
                          {speakingMsgId === msg.id ? <VolumeX size={13} /> : <Volume2 size={13} />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Quick-reply chips */}
                  {msg.quickReplies && msg.quickReplies.length > 0 && !isDone && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.quickReplies.map((qr, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendMessage(qr)}
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

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs pl-9">
                <div className="flex gap-1 items-center bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl">
                  <span className="w-1.5 h-1.5 bg-[#0B4F9C] rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-[#0B4F9C] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-[#0B4F9C] rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-[11px]">AI is analyzing & typing...</span>
              </div>
            )}

            {/* Transcribing Whisper Indicator */}
            {isTranscribing && (
              <div className="flex gap-2.5 items-center text-indigo-600 dark:text-indigo-400 text-xs pl-9">
                <RefreshCw size={13} className="animate-spin" />
                <span className="text-[11px] font-semibold">
                  Transcribing voice with Groq Whisper ({voiceLang})...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar with Web Speech & Groq Whisper Voice */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            {isMicActive && (
              <div className="mb-2 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span className="font-bold">
                    {isRecordingFallback
                      ? 'Recording audio (Groq Whisper fallback)... Click mic to finish'
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
                placeholder={
                  isMicActive
                    ? 'Listening... speaking live into transcript'
                    : 'Type or speak in English, हिन्दी, or Hinglish...'
                }
                disabled={isTyping || isDone}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]/30 focus:border-[#0B4F9C]"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping || isDone}
                className="p-2.5 rounded-xl bg-[#0B4F9C] hover:bg-[#083b75] text-white disabled:opacity-40 transition-all shadow-sm shrink-0"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Live Profile Card & Final Confirmation (Right 5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#F26B1D]" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {t('onboarding.live_card_title')}
                </h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${archetypeBadge}`}>
                {profileDraft.user_type?.toUpperCase()}
              </span>
            </div>

            {/* Profile Fields Preview / Edit */}
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {t('onboarding.candidate_name')}
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
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {t('onboarding.current_role')}
                  </span>
                  <input
                    type="text"
                    value={profileDraft.current_role || ''}
                    onChange={(e) => setProfileDraft({ ...profileDraft, current_role: e.target.value })}
                    placeholder="e.g. Java Dev"
                    className="w-full font-bold text-slate-800 dark:text-slate-200 bg-transparent border-none p-0 focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {t('onboarding.target_role')}
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
                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {t('onboarding.city')}
                  </span>
                  <input
                    type="text"
                    value={profileDraft.city || ''}
                    onChange={(e) => setProfileDraft({ ...profileDraft, city: e.target.value })}
                    placeholder="City"
                    className="w-full font-bold text-slate-800 dark:text-slate-200 bg-transparent border-none p-0 focus:outline-none text-xs"
                  />
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {t('onboarding.experience')}
                  </span>
                  <input
                    type="number"
                    value={profileDraft.experience_years ?? 0}
                    onChange={(e) => setProfileDraft({ ...profileDraft, experience_years: Number(e.target.value) })}
                    className="w-full font-bold text-slate-800 dark:text-slate-200 bg-transparent border-none p-0 focus:outline-none text-xs"
                  />
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {t('onboarding.career_gap')}
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
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {t('onboarding.calibrated_skills')} ({profileDraft.skills_raw?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
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
                      {t('onboarding.skills_placeholder')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                type="button"
                onClick={handleFinalizeProfile}
                disabled={isFinalizing || !profileDraft.name}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#0B4F9C] to-[#F26B1D] text-white font-black text-xs sm:text-sm hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isFinalizing ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>{t('onboarding.analyzing_btn')}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>{t('onboarding.generate_audit_btn')}</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>

              <p className="text-[10px] text-slate-400 text-center">
                {t('onboarding.audit_note')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
