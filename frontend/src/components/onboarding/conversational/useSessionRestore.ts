import { useState, useEffect } from 'react'
import { onboardingApi } from '@/lib/api'
import type { Profile } from '@/types'
import type { Message } from './types'

const INIT_MSG: Message = {
  id: 'init-1',
  sender: 'assistant',
  text: 'Namaste! I am your AI Career Intelligence Agent. Let’s build your profile from scratch. Upload your resume or tell me about your background and target role.',
  quickReplies: [
    'Software Engineer',
    'Operations Executive',
    'Manual QA Tester',
    'Customer Support',
    'Final Year Student',
  ],
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
}

interface UseSessionRestoreProps {
  authUser: { name?: string; email?: string } | null
}

export function useSessionRestore({ authUser }: UseSessionRestoreProps) {
  const [messages, setMessages] = useState<Message[]>([INIT_MSG])
  const [isDone, setIsDone] = useState(false)
  const [showConfirmScreen, setShowConfirmScreen] = useState(false)

  const [profileDraft, setProfileDraft] = useState<Partial<Profile>>({
    name: authUser?.name || '',
    email: authUser?.email || '',
    user_type: undefined,
    city: '',
    current_role: '',
    target_role: '',
    experience_years: 0,
    career_gap_years: 0,
    current_salary_lpa: null,
    skills_raw: [],
  })

  useEffect(() => {
    let isMounted = true
    async function restoreSession() {
      try {
        const sess = await onboardingApi.getSession()
        if (!isMounted || !sess) return
        if (sess.profile_draft && Object.keys(sess.profile_draft).length > 0) {
          setProfileDraft((prev) => ({
            ...prev,
            ...sess.profile_draft,
            name: prev.name || sess.profile_draft.name || authUser?.name || '',
            email: prev.email || sess.profile_draft.email || authUser?.email || '',
          }))
        }
        if (sess.history && sess.history.length > 0) {
          const restored: Message[] = sess.history.map((h, i) => ({
            id: `restored-${i}`,
            sender: h.role === 'user' ? 'user' : 'assistant',
            text: h.content,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }))
          setMessages(restored)
        }
        if (sess.done) {
          setIsDone(true)
          setShowConfirmScreen(true)
        }
      } catch {
        // Fallback to empty session
      }
    }
    restoreSession()
    return () => { isMounted = false }
  }, [authUser])

  return {
    messages,
    setMessages,
    isDone,
    setIsDone,
    showConfirmScreen,
    setShowConfirmScreen,
    profileDraft,
    setProfileDraft,
  }
}
