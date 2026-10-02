import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile } from '@/types'

interface ProfileState {
  profile: Profile | null
  isLoading: boolean
  error: string | null
  setProfile: (profile: Profile) => void
  clearProfile: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      isLoading: false,
      error: null,
      setProfile: (profile) => set({ profile, error: null }),
      clearProfile: () => set({ profile: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    { name: 'punarshuru-profile' },
  ),
)
