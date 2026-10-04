import { useState, useEffect } from 'react'
import { onboardingApi } from '@/lib/api'
import type { Message } from './types'

const INIT_MSG: Message = {
  id: 'init-1',
  sender: 'assistant',
  text: "Namaste! I am your AI Career Intelligence Agent. Let's build your profile \u2014 upload your resume or tell me about your current role.",
  quickReplies: [
    'Software Engineer',
    'Delivery Partner',
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
  const [profileDraft, setProfileDraft] = useState<Record<string, unknown>>({
    name: authUser?.name || '',
    email: authUser?.email || '',
  })

  useEffect(() => {
    let isMounted = true
    async function restoreSession() {
      try {
        const sess = await onboardingApi.getSession()
        if (!isMounted || !sess) return
        if (sess.profile_draft && Object.keys(sess.profile_draft).length > 0) {
          setProfileDraft(sess.profile_draft as Record<string, unknown>)
        }
        if (sess.history && sess.history.length > 0) {
          const restored: Message[] = sess.history.map((h, i) => ({
            id: `restored-${i}`,
            sender: h.role === 'user' ? 'user' : 'assistant',
            text: h.content,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }))
          setMessages([INIT_MSG, ...restored])
        }
        if (sess.done) {
          setIsDone(true)
          setShowConfirmScreen(true)
        }
      } catch {
        // Fallback to fresh session
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
