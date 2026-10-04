import { useState } from 'react'
import { onboardingApi, profileApi } from '@/lib/api'
import type { Profile } from '@/types'
import type { Message } from './types'

interface UseResumeUploadProps {
  sessionId: string
  setProfileDraft: React.Dispatch<React.SetStateAction<Partial<Profile>>>
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  setIsDone: (done: boolean) => void
  setShowConfirmScreen: (show: boolean) => void
}

export function useResumeUpload({
  sessionId,
  setProfileDraft,
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
      const parsed = await profileApi.uploadResume(file)
      setProfileDraft((prev) => ({
        ...prev,
        city: parsed.city || prev.city || '',
        current_role: parsed.current_role || prev.current_role || '',
        target_role: parsed.target_role || prev.target_role || '',
        experience_years: parsed.experience_years ?? prev.experience_years ?? 0,
        career_gap_years: parsed.career_gap_years ?? prev.career_gap_years ?? 0,
        skills_raw: parsed.skills?.length ? parsed.skills : prev.skills_raw,
      }))
      const res = await onboardingApi.chat({
        session_id: sessionId,
        message: `Uploaded resume: ${file.name}`,
        resume_text: parsed.summary || file.name,
      })
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
