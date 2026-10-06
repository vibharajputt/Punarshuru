import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface DemoState {
  isDemo: boolean
  personaKey: string | null
  personaName: string | null
  personaRole?: string | null
  personaEmail?: string | null
  personaCity?: string | null
  personaCareerGapYears?: number | null
  setDemo: (
    key: string,
    name: string,
    details?: { role?: string; email?: string; city?: string; career_gap_years?: number }
  ) => void
  clearDemo: () => void
}

// Clean up legacy localStorage demo entry if present
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('punarshuru-demo')
  } catch {
    // ignore
  }
}

export const useDemoStore = create<DemoState>()(
  persist(
    (set) => ({
      isDemo: false,
      personaKey: null,
      personaName: null,
      personaRole: null,
      personaEmail: null,
      personaCity: null,
      personaCareerGapYears: null,

      setDemo: (key: string, name: string, details) =>
        set({
          isDemo: true,
          personaKey: key,
          personaName: name,
          personaRole: details?.role || null,
          personaEmail: details?.email || `${key}@demo.punarshuru.in`,
          personaCity: details?.city || null,
          personaCareerGapYears: details?.career_gap_years !== undefined ? details.career_gap_years : null,
        }),

      clearDemo: () =>
        set({
          isDemo: false,
          personaKey: null,
          personaName: null,
          personaRole: null,
          personaEmail: null,
          personaCity: null,
          personaCareerGapYears: null,
        }),
    }),
    {
      name: 'punarshuru-demo',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
