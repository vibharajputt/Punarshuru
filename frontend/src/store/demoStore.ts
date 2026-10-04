import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DemoState {
  isDemo: boolean
  personaKey: string | null
  personaName: string | null
  setDemo: (key: string, name: string) => void
  clearDemo: () => void
}

export const useDemoStore = create<DemoState>()(
  persist(
    (set) => ({
      isDemo: false,
      personaKey: null,
      personaName: null,

      setDemo: (key: string, name: string) =>
        set({
          isDemo: true,
          personaKey: key,
          personaName: name,
        }),

      clearDemo: () =>
        set({
          isDemo: false,
          personaKey: null,
          personaName: null,
        }),
    }),
    { name: 'punarshuru-demo' },
  ),
)
