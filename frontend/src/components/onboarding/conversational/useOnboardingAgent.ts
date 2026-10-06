import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { onboardingApi, profileApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { useProfileStore } from '@/store/profileStore'
import type { Message } from './types'
import { useSessionRestore, createInitMsg } from './useSessionRestore'
import { useResumeUpload } from './useResumeUpload'

const COMMON_ROLE_NOUNS = [
  'engineer', 'developer', 'analyst', 'consultant', 'manager', 'designer', 'tester',
  'lead', 'architect', 'partner', 'executive', 'intern', 'specialist', 'technician',
  'officer', 'scientist', 'administrator', 'associate', 'operator', 'mechanic',
  'driver', 'teacher', 'professor', 'educator', 'rider', 'agent', 'representative',
  'coordinator', 'recruiter', 'accountant', 'auditor', 'writer', 'marketer',
  'freelancer', 'fresher', 'student', 'trainee', 'programmer', 'coder', 'sdet', 'devops',
]

const CITIES = [
  'Bengaluru', 'Bangalore', 'Hyderabad', 'Pune', 'Mumbai', 'Delhi', 'New Delhi', 'Noida',
  'Gurugram', 'Gurgaon', 'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Indore',
  'Kochi', 'Mohali', 'Chandigarh', 'Bhopal', 'Nagpur', 'Patna', 'Surat', 'Remote',
]

const POPULAR_SKILLS = [
  'Python', 'Java', 'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js', 'Node.js',
  'FastAPI', 'Django', 'Spring Boot', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Docker',
  'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'Machine Learning', 'Deep Learning',
  'SolidWorks', 'AutoCAD', 'ANSYS', 'MATLAB', 'Embedded Systems', 'IoT', 'Excel',
  'Selenium', 'Manual Testing', 'Power BI', 'Tableau', 'Linux',
]

function formatRoleTitle(text: string): string {
  const acronyms = new Set(['qa', 'sdet', 'ai', 'ml', 'ui', 'ux', 'devops', 'aws', 'sre', 'dba', 'iot', 'api', 'rpa', 'hr', 'it'])
  return text
    .split(/\s+/)
    .map((w) => {
      const low = w.toLowerCase().replace(/[^a-z0-9]/g, '')
      if (acronyms.has(low)) {
        if (low === 'ui') return 'UI'
        if (low === 'ux') return 'UX'
        if (low === 'ai') return 'AI'
        if (low === 'ml') return 'ML'
        if (low === 'devops') return 'DevOps'
        if (low === 'iot') return 'IoT'
        return low.toUpperCase()
      }
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    })
    .join(' ')
}

function parseFreeTextDraft(text: string): Record<string, any> {
  const patch: Record<string, any> = {}

  // 1. Experience
  const expMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:\+)?\s*(?:years?|yrs?|saal|sal)\s*(?:of\s*)?(?:exp|experience|anubhav|work\s*experience)?/i)
  if (expMatch) {
    patch.experience_years = Number(expMatch[1])
  }

  // 2. Current Role
  const roleDecl = text.match(
    /\b(?:i\s*am\s*(?:currently\s*)?(?:a|an)?|i'm\s*(?:currently\s*)?(?:a|an)?|currently\s*(?:working\s*as\s*(?:a|an)?|a|an)?|(?:i\s*)?work\s*as\s*(?:a|an)?|working\s*as\s*(?:a|an)?|worked\s*as\s*(?:a|an)?|as\s*(?:a|an)?|my\s*(?:current\s*)?(?:role|job|designation|title)\s*(?:is)?(?:\s*(?:a|an))?|main\s*(?:ek)?|mai\s*(?:ek)?|role\s*:|current\s*role\s*:)\s*([a-zA-Z0-9\+\#\.\s\/\-\&]+?)(?=(?:\s+\b(?:with|having|for|at|in|experiencing|holding|possessing|and|\baur\b|\,|\.|\;|\!)|\s*$))/i,
  )
  if (roleDecl) {
    let raw = roleDecl[1].trim()
    raw = raw.replace(/^(?:a|an)\s+/i, '').trim()
    if (raw.length >= 2 && raw.split(/\s+/).length <= 5) {
      patch.current_role = formatRoleTitle(raw)
    }
  } else {
    let cleaned = text
      .split(',')[0]
      .replace(/\s+\b(with|having|for|experiencing)\s+\d+.*$/i, '')
      .replace(/\s+\b(with\s*skills|skilled\s*in|skills|in|tools?)\b.*$/i, '')
      .replace(/^(?:i\s*am\s*(?:currently\s*)?(?:a|an)?|i'm\s*(?:currently\s*)?(?:a|an)?|currently\s*(?:working\s*as\s*(?:a|an)?|a|an)?|(?:i\s*)?work\s*as\s*(?:a|an)?|working\s*as\s*(?:a|an)?|worked\s*as\s*(?:a|an)?|as\s*(?:a|an)?|my\s*(?:current\s*)?(?:role|job|designation|title)\s*(?:is)?(?:\s*(?:a|an))?|main\s*(?:ek)?|mai\s*(?:ek)?|role\s*:|current\s*role\s*:)\s+/i, '')
      .replace(/^(?:a|an)\s+/i, '')
      .trim()
    const words = cleaned.toLowerCase().split(/\s+/)
    if (COMMON_ROLE_NOUNS.some((r) => words.includes(r)) && words.length <= 4) {
      patch.current_role = formatRoleTitle(cleaned)
    }
  }

  // 3. Target Role
  const tgtDecl = text.match(
    /\b(?:i\s*want\s*to\s*(?:be|become)\s*(?:a|an)?|want\s*to\s*be\s*(?:a|an)?|target\s*(?:role|job|position)\s*(?:is)?\s*(?:a|an)?|aiming\s*(?:for|to\s*be)\s*(?:a|an)?|looking\s*for\s*(?:a|an)?|interested\s*in\s*(?:a|an)?|future\s*role\s*(?:is)?\s*(?:a|an)?|dream\s*(?:role|job)\s*(?:is)?\s*(?:a|an)?|banna\s*(?:chahta|chahti|hai)\s*(?:ek)?)\s*([a-zA-Z0-9\+\#\.\s\/\-\&]+?)(?=(?:\s+\b(?:with|having|for|at|in|and|\baur\b|\,|\.|\;|\!)|\s*$))/i,
  )
  if (tgtDecl) {
    let raw = tgtDecl[1].trim()
    raw = raw.replace(/^(?:a|an)\s+/i, '').trim()
    if (raw.length >= 2 && raw.split(/\s+/).length <= 5) {
      patch.target_role = formatRoleTitle(raw)
    }
  }

  // 4. City
  for (const c of CITIES) {
    if (new RegExp(`\\b${c}\\b`, 'i').test(text)) {
      patch.current_city = c === 'Bangalore' ? 'Bengaluru' : c === 'Gurgaon' ? 'Gurugram' : c
      patch.city = patch.current_city
      break
    }
  }

  // 5. Skills
  const foundSkills: string[] = []
  for (const s of POPULAR_SKILLS) {
    if (new RegExp(`\\b${s}\\b`, 'i').test(text)) {
      foundSkills.push(s)
    }
  }
  if (foundSkills.length > 0) {
    patch.skills_raw = foundSkills
  }

  return patch
}

export function useOnboardingAgent() {
  const navigate = useNavigate()
  const authUser = useAuthStore((s) => s.user)

  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  const {
    messages,
    setMessages,
    isDone,
    setIsDone,
    showConfirmScreen,
    setShowConfirmScreen,
    profileDraft,
    setProfileDraft,
    canConfirm,
    setCanConfirm,
  } = useSessionRestore({ authUser })

  const { isUploading, uploadError, handleFileUpload } = useResumeUpload({
    setProfileDraft,
    setCanConfirm,
    setMessages,
    setIsDone,
    setShowConfirmScreen,
  })

  const handleSendMessage = async (textToSend: string, action?: string) => {
    const trimmed = textToSend.trim()
    if (!trimmed && !action) return
    if (isTyping || isConfirming) return

    if (action === 'confirm') {
      setIsConfirming(true)
    } else {
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: trimmed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, userMsg])
      setInputMessage('')
      setIsTyping(true)

      // Optimistic extraction of free text entities
      const patch = parseFreeTextDraft(trimmed)
      if (Object.keys(patch).length > 0) {
        setProfileDraft((prev) => ({ ...prev, ...patch }))
      }
    }

    try {
      const res = await onboardingApi.chat({
        session_id: '',
        message: trimmed,
        action,
      })

      // Backend is the single source of truth
      if (res.profile_draft) setProfileDraft(res.profile_draft as never)
      if (typeof res.can_confirm === 'boolean') setCanConfirm(res.can_confirm)

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
        // Store profile in zustand so HomePage renders cleanly without redirecting back
        const draft = (res.profile_draft || {}) as Record<string, any>
        const profileObj = {
          id: draft.id || authUser?.id || 'profile-' + Date.now(),
          name: draft.name || authUser?.name || 'Candidate',
          email: draft.email || authUser?.email,
          user_type: draft.user_type || 'stagnant',
          city: draft.current_city || draft.city || '',
          current_city: draft.current_city || draft.city || '',
          preferred_city: draft.preferred_city || '',
          gap_reason: draft.gap_reason || null,
          achievements: draft.achievements || [],
          current_role: draft.current_role || '',
          target_role: draft.target_role || '',
          experience_years: Number(draft.experience_years || 0),
          career_gap_years: Number(draft.career_gap_years || 0),
          skills_raw: draft.skills_raw || [],
          skills_taxonomy_ids: [],
          disruption_score: draft.disruption_score ?? 68,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        useProfileStore.getState().setProfile(profileObj as any)

        // Also attempt to sync with backend /api/profile/me in background
        try {
          const fresh = await profileApi.getMyProfile()
          if (fresh) useProfileStore.getState().setProfile(fresh)
        } catch {
          // initial profileObj already in store
        }

        navigate('/home', { replace: true })
        return
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'assistant',
          text: 'Something went wrong. Please try again.',
          quickReplies: [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } finally {
      setIsTyping(false)
      setIsConfirming(false)
    }
  }

  const handleStartOver = async () => {
    try {
      await onboardingApi.deleteSession()
    } catch (err) {
      console.warn('Failed to delete onboarding session:', err)
    }

    // Clear saved profile from store
    useProfileStore.getState().clearProfile()

    // Reset draft fields to empty
    setProfileDraft({
      name: authUser?.name || '',
      email: authUser?.email || '',
      current_role: '',
      target_role: '',
      city: '',
      current_city: '',
      preferred_city: '',
      gap_reason: '',
      achievements: [],
      experience_years: 0,
      career_gap_years: null,
      skills_raw: [],
      user_type: '',
    } as never)

    setCanConfirm(false)
    setIsDone(false)
    setShowConfirmScreen(false)
    setInputMessage('')
    setMessages([createInitMsg()])
  }

  return {
    messages,
    inputMessage,
    setInputMessage,
    isTyping,
    isUploading,
    uploadError,
    isDone,
    isConfirming,
    canConfirm,
    showConfirmScreen,
    setShowConfirmScreen,
    profileDraft,
    setProfileDraft,
    handleSendMessage,
    handleFileUpload,
    handleStartOver,
  }
}
