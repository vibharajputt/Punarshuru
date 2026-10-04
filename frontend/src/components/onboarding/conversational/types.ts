import type { Profile } from '@/types'

export interface Message {
  id: string
  sender: 'assistant' | 'user'
  text: string
  quickReplies?: string[]
  timestamp: string
}

export const ARCHETYPE_BADGES: Record<string, string> = {
  returner: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200',
  gig: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200',
  laid_off: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200',
  stagnant: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200',
  student: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200',
}

export function hasRequiredSlots(draft: Partial<Profile>): boolean {
  return Boolean(
    draft.current_role?.trim() &&
    draft.target_role?.trim() &&
    draft.city?.trim() &&
    draft.skills_raw &&
    draft.skills_raw.length >= 3
  )
}
