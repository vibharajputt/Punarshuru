import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { onboardingApi, profileApi } from '@/lib/api'
import { useProfileStore } from '@/store/profileStore'
import { useAuthStore } from '@/store/authStore'
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
  const navigate = useNavigate()
  const authUser = useAuthStore((s) => s.user)
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
        const draft = (res.profile_draft || {}) as Record<string, any>
        const profileObj = {
          id: draft.id || authUser?.id || 'profile-' + Date.now(),
          name: draft.name || authUser?.name || 'Candidate',
          email: draft.email || authUser?.email,
          user_type: draft.user_type || 'stagnant',
          city: draft.city || '',
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
        try {
          const fresh = await profileApi.getMyProfile()
          if (fresh) useProfileStore.getState().setProfile(fresh)
        } catch {
          // initial profile in store
        }
        navigate('/home', { replace: true })
      }
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Failed to parse resume.')
    } finally {
      setIsUploading(false)
    }
  }

  return { isUploading, uploadError, setUploadError, handleFileUpload }
}
