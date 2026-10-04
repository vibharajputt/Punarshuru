import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { onboardingApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import type { Message } from './types'
import { useSessionRestore } from './useSessionRestore'
import { useResumeUpload } from './useResumeUpload'

export function useOnboardingAgent() {
  const navigate = useNavigate()
  const authUser = useAuthStore((s) => s.user)

  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  // canConfirm comes from the backend response — single source of truth
  const [canConfirm, setCanConfirm] = useState(false)

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
        // Profile already upserted server-side; just navigate
        navigate('/home')
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
      setProfileDraft({} as never)
      setCanConfirm(false)
      setIsDone(false)
      setShowConfirmScreen(false)
      setMessages([])
      // Trigger greeting by sending an empty turn
      await handleSendMessage('')
    } catch {
      // ignore
    }
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
