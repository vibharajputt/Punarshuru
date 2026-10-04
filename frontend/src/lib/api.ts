import { useAuthStore } from '@/store/authStore'
import type {
  Profile,
  UserType,
  DisruptionResponse,
  SkillGapResponse,
  PathwayResponse,
  RealCompRequest,
  RealCompResponse,
  CompareRequest,
  CompareResponse,
  PassportResponse,
  PersonaSummary,
  ResumeParseResponse,
} from '@/types'

export interface HealthResponse {
  status: string
  service: string
  version: string
  timestamp: string
  uptime_seconds: number
  active_llm?: string
}

export interface SkillEntry {
  id: number
  name: string
  category: string
  demand_trend?: string
  automation_risk: number
}

export interface TrendsResponse {
  rising: SkillEntry[]
  declining: SkillEntry[]
  stable: SkillEntry[]
  total_skills: number
  top_demanded_skills?: string[]
  salary_by_city?: Record<string, number>
  best_fit_roles?: string[]
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

async function request<T>(endpoint: string, options?: RequestInit, token?: string): Promise<T> {
  const activeToken = token ?? useAuthStore.getState().token
  const url = `${BASE_URL}${endpoint}`
  const isFormData = options?.body instanceof FormData
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
    ...(options?.headers as Record<string, string>),
  }
  const res = await fetch(url, {
    ...options,
    headers,
  })

  if (!res.ok) {
    if (res.status === 401) {
      // If unauthorized, check /api/auth/me unless this was already an auth call
      if (!endpoint.startsWith('/api/auth/')) {
        let isTokenValid = false
        if (activeToken) {
          try {
            const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
              headers: { Authorization: `Bearer ${activeToken}` },
            })
            isTokenValid = meRes.ok
          } catch {
            isTokenValid = false
          }
        }
        if (!isTokenValid) {
          useAuthStore.getState().clearAuth()
          if (typeof window !== 'undefined') {
            const msg = encodeURIComponent('Session expired, please log in again')
            window.location.href = `/login?next=/onboarding&message=${msg}`
          }
          throw new Error('Session expired, please log in again')
        }
      }
    }

    let errorDetail = `HTTP ${res.status}: ${res.statusText}`
    try {
      const errJson = await res.json()
      if (errJson && errJson.detail) {
        errorDetail = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail)
      }
    } catch {
      // ignore json parse error
    }

    // Never show raw "Not authenticated" to the user
    if (res.status === 401 || errorDetail.toLowerCase().includes('not authenticated') || errorDetail.toLowerCase().includes('could not validate')) {
      errorDetail = 'Session expired, please log in again'
    }
    throw new Error(errorDetail)
  }

  return res.json() as Promise<T>
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface MeResponse {
  id: string
  name: string
  email: string
}

export const authApi = {
  signup: (data: { name: string; email: string; password: string }) =>
    request<TokenResponse>('/api/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    request<TokenResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  me: (token: string) => request<MeResponse>('/api/auth/me', {}, token),
}


export const healthApi = {
  check: () => request<HealthResponse>('/api/health'),
}

export const demoApi = {
  listPersonas: () => request<PersonaSummary[]>('/api/demo/personas'),
  loadPersona: (key: string) =>
    request<PersonaSummary & Record<string, unknown>>(`/api/demo/load/${key}`, {
      method: 'POST',
    }),
}

export const profileApi = {
  create: (data: Partial<Profile>) =>
    request<Profile>('/api/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  get: (id: string) => request<Profile>(`/api/profile/${id}`),
  update: (id: string, data: Partial<Profile>) =>
    request<Profile>(`/api/profile/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  parseResume: (resume_text: string) =>
    request<ResumeParseResponse>('/api/profile/parse-resume', {
      method: 'POST',
      body: JSON.stringify({ resume_text }),
    }),
  uploadResume: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return request<ResumeParseResponse>('/api/profile/upload-resume', {
      method: 'POST',
      body: formData,
    })
  },
}

export const assessApi = {
  disruption: (profileId: string) =>
    request<DisruptionResponse>(`/api/assess/${profileId}/disruption`),
  gap: (profileId: string, role?: string) => {
    const query = role ? `?role=${encodeURIComponent(role)}` : ''
    return request<SkillGapResponse>(`/api/assess/${profileId}/gap${query}`)
  },
}

export const marketApi = {
  trends: () => request<TrendsResponse>('/api/market/trends'),
  getRole: (roleId: number) => request<Record<string, unknown>>(`/api/market/roles/${roleId}`),
}

export const pathwayApi = {
  get: (profileId: string) => request<PathwayResponse>(`/api/pathway/${profileId}`),
}

export const compensationApi = {
  real: (data: RealCompRequest) =>
    request<RealCompResponse>('/api/compensation/real', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  compare: (data: CompareRequest) =>
    request<CompareResponse>('/api/compensation/compare', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

export const passportApi = {
  create: (profileId: string, data?: { is_public?: boolean }) =>
    request<PassportResponse>(`/api/passport/${profileId}`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    }),
  getBySlug: (slug: string) => request<PassportResponse>(`/api/passport/${slug}`),
}

export interface OnboardingChatRequest {
  session_id: string
  message: string
  resume_text?: string | null
  action?: string | null
}

export interface OnboardingChatResponse {
  reply: string
  quick_replies: string[]
  profile_draft: Partial<Profile>
  missing_fields: string[]
  segment: UserType
  can_confirm: boolean
  done: boolean
}

export interface OnboardingSessionResponse {
  user_id: string
  profile_draft: Partial<Profile>
  current_slot: string
  segment: UserType
  done: boolean
  history: Array<{ role: string; content: string }>
}

export const onboardingApi = {
  chat: (data: OnboardingChatRequest) =>
    request<OnboardingChatResponse>('/api/onboarding/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getSession: () => request<OnboardingSessionResponse>('/api/onboarding/session'),
  deleteSession: () =>
    request<void>('/api/onboarding/session', { method: 'DELETE' }),
}

export interface TranscriptionResponse {
  text: string
  language?: string | null
}

export const voiceApi = {
  transcribe: (audioBlob: Blob, language?: string) => {
    const formData = new FormData()
    formData.append('file', audioBlob, 'voice_input.webm')
    if (language) {
      formData.append('language', language)
    }
    return request<TranscriptionResponse>('/api/voice/transcribe', {
      method: 'POST',
      body: formData,
    })
  },
}


