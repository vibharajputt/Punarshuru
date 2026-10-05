import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { onboardingApi, profileApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { useProfileStore } from '@/store/profileStore'
import type { Message } from './types'
import { useSessionRestore, createInitMsg } from './useSessionRestore'
import { useResumeUpload } from './useResumeUpload'

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
