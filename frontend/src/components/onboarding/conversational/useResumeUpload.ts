import { useState } from 'react'
import { onboardingApi, profileApi } from '@/lib/api'
import type { Message } from './types'

interface UseResumeUploadProps {
  setProfileDraft: (draft: Record<string, unknown>) => void
  setCanConfirm: (v: boolean) => void
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  setIsDone: (done: boolean) => void
  setShowConfirmScreen: (show: boolean) => void
}

export function useResumeUpload({
  setProfileDraft,
  setCanConfirm,
  setMessages,
  setIsDone,
  setShowConfirmScreen,
}: UseResumeUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileUpload = async (file: File) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File exceeds 5MB limit.')
      return
    }
    try {
      setIsUploading(true)
      setUploadError(null)

      // 1. Parse the resume to get text + structured data
      const parsed = await profileApi.uploadResume(file)
      const resumeText = parsed.resume_text || parsed.summary || ''

      // 2. Send resume_text (not filename) to the onboarding chat
      const res = await onboardingApi.chat({
        session_id: '',
        message: '',           // never send the filename as a message
        resume_text: resumeText,
      })

      // 3. Backend is the single source of truth
      if (res.profile_draft) setProfileDraft(res.profile_draft as Record<string, unknown>)
      if (typeof res.can_confirm === 'boolean') setCanConfirm(res.can_confirm)

      setMessages((prev) => [
        ...prev,
        {
          id: `user-up-${Date.now()}`,
          sender: 'user',
          text: `📄 Uploaded ${file.name}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: res.reply,
          quickReplies: res.quick_replies,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])

      if (res.done) {
        setIsDone(true)
        setShowConfirmScreen(true)
      }
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Failed to parse resume.')
    } finally {
      setIsUploading(false)
    }
  }

  return { isUploading, uploadError, setUploadError, handleFileUpload }
}
