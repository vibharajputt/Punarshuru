import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { onboardingApi, profileApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { useProfileStore } from '@/store/profileStore'
import type { UserType } from '@/types'
import type { Message } from './types'
import { useSessionRestore } from './useSessionRestore'
import { useResumeUpload } from './useResumeUpload'

export function useOnboardingAgent() {
  const navigate = useNavigate()
  const authUser = useAuthStore((s) => s.user)
  const setProfile = useProfileStore((s) => s.setProfile)

  const [sessionId] = useState<string>(() => `sess-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`)
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isFinalizing, setIsFinalizing] = useState(false)

  const {
    messages,
    setMessages,
    isDone,
    setIsDone,
    showConfirmScreen,
    setShowConfirmScreen,
    profileDraft,
    setProfileDraft,
  } = useSessionRestore({ authUser })

  const { isUploading, uploadError, handleFileUpload } = useResumeUpload({
    sessionId,
    setProfileDraft,
    setMessages,
    setIsDone,
    setShowConfirmScreen,
  })

  const handleSendMessage = async (textToSend: string, action?: string) => {
    const trimmed = textToSend.trim()
    if (!trimmed && !action) return
    if (isTyping || isConfirming) return

    if (action === 'confirm') setIsConfirming(true)
    else {
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: trimmed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, userMsg])
      setInputMessage('')
      setIsTyping(true)
    }

    try {
      const res = await onboardingApi.chat({
        session_id: sessionId,
        message: trimmed,
        action,
      })

      if (res.profile_draft) {
        setProfileDraft((prev) => ({
          ...prev,
          ...res.profile_draft,
          name: prev.name || res.profile_draft.name || authUser?.name || '',
          email: prev.email || res.profile_draft.email || authUser?.email || '',
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
        setShowConfirmScreen(true)
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'assistant',
          text: 'Answers recorded. Use the Live Profile Card on the right to review and confirm.',
          quickReplies: ['Confirm Profile'],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } finally {
      setIsTyping(false)
      setIsConfirming(false)
    }
  }

  const handleConfirmAndFinish = async () => {
    try {
      setIsFinalizing(true)
      const name = profileDraft.name?.trim() || authUser?.name || 'Candidate'
      const email = profileDraft.email?.trim() || authUser?.email || `${name.toLowerCase().replace(/\s+/g, '')}@user.punarshuru.in`
      const created = await profileApi.create({
        name,
        email,
        user_type: (profileDraft.user_type || 'returner') as UserType,
        city: profileDraft.city?.trim() || 'Bengaluru',
        current_role: profileDraft.current_role?.trim() || 'Professional',
        target_role: profileDraft.target_role?.trim() || 'Software Engineer',
        experience_years: Number(profileDraft.experience_years || 0),
        career_gap_years: Number(profileDraft.career_gap_years || 0),
        current_salary_lpa: profileDraft.current_salary_lpa ? Number(profileDraft.current_salary_lpa) : null,
        skills_raw: profileDraft.skills_raw?.length ? profileDraft.skills_raw : ['Problem Solving', 'Communication'],
        skills_taxonomy_ids: [],
      })
      setProfile(created)
      navigate('/home')
    } catch {
      navigate('/home')
    } finally {
      setIsFinalizing(false)
    }
  }

  return {
    messages, inputMessage, setInputMessage, isTyping, isUploading, uploadError,
    isDone, isConfirming, isFinalizing, showConfirmScreen, setShowConfirmScreen,
    profileDraft, setProfileDraft, handleSendMessage, handleFileUpload, handleConfirmAndFinish,
  }
}
