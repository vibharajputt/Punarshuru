import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile } from '@/types'

export interface VerificationArtifact {
  method: 'github' | 'certificate' | 'quiz'
  title: string
  verifiedAt: string
  githubUrl?: string
  repoFullName?: string
  stars?: number
  language?: string
  fileName?: string
  fileSize?: number
  filePreview?: string
  quizScore?: string
  summary?: string
}

interface ProfileState {
  profile: Profile | null
  isLoading: boolean
  error: string | null
  completedMilestones: string[]
  milestoneArtifacts: Record<string, VerificationArtifact>
  completedCourses: number[]
  baselineDisruptionScore: number | null
  setProfile: (profile: Profile | null) => void
  clearProfile: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  toggleMilestone: (stepKey: string, skillsCovered?: string[], artifact?: VerificationArtifact) => void
  setMilestoneArtifact: (stepKey: string, artifact: VerificationArtifact) => void
  toggleCourse: (courseId: number) => void
  resetMilestones: () => void
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,
      error: null,
      completedMilestones: [],
      milestoneArtifacts: {},
      completedCourses: [],
      baselineDisruptionScore: null,

      setProfile: (profile) => {
        const currentBaseline = get().baselineDisruptionScore
        const newScore = profile?.disruption_score ?? 70
        set({
          profile,
          error: null,
          baselineDisruptionScore: currentBaseline ?? newScore,
        })
      },

      clearProfile: () =>
        set({
          profile: null,
          completedMilestones: [],
          completedCourses: [],
          baselineDisruptionScore: null,
        }),

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      toggleMilestone: (stepKey: string, skillsCovered: string[] = [], artifact?: VerificationArtifact) => {
        const state = get()
        const isCompleted = state.completedMilestones.includes(stepKey)
        const newMilestones = isCompleted
          ? state.completedMilestones.filter((k) => k !== stepKey)
          : [...state.completedMilestones, stepKey]

        const currentArtifacts = { ...(state.milestoneArtifacts || {}) }
        if (isCompleted) {
          delete currentArtifacts[stepKey]
        } else if (artifact) {
          currentArtifacts[stepKey] = artifact
        }

        const profile = state.profile
        if (!profile) {
          set({
            completedMilestones: newMilestones,
            milestoneArtifacts: currentArtifacts,
          })
          return
        }

        const baseline = state.baselineDisruptionScore ?? profile.disruption_score ?? 72
        // Each milestone reduces disruption by 8 points (minimum score 15)
        const scoreReduction = newMilestones.length * 8
        const updatedDisruptionScore = Math.max(15, baseline - scoreReduction)

        // Add newly acquired skills to profile skills_raw if checking as completed
        let updatedSkills = [...(profile.skills_raw || [])]
        if (!isCompleted && skillsCovered.length > 0) {
          skillsCovered.forEach((skill) => {
            if (!updatedSkills.includes(skill)) {
              updatedSkills.push(skill)
            }
          })
        }

        set({
          completedMilestones: newMilestones,
          milestoneArtifacts: currentArtifacts,
          baselineDisruptionScore: baseline,
          profile: {
            ...profile,
            disruption_score: updatedDisruptionScore,
            skills_raw: updatedSkills,
          },
        })
      },

      setMilestoneArtifact: (stepKey: string, artifact: VerificationArtifact) => {
        const state = get()
        set({
          milestoneArtifacts: {
            ...(state.milestoneArtifacts || {}),
            [stepKey]: artifact,
          },
        })
      },

      toggleCourse: (courseId: number) => {
        const state = get()
        const isCompleted = state.completedCourses.includes(courseId)
        const newCourses = isCompleted
          ? state.completedCourses.filter((id) => id !== courseId)
          : [...state.completedCourses, courseId]
        set({ completedCourses: newCourses })
      },

      resetMilestones: () => {
        const state = get()
        const baseline = state.baselineDisruptionScore
        set({
          completedMilestones: [],
          milestoneArtifacts: {},
          completedCourses: [],
          profile: state.profile
            ? {
                ...state.profile,
                disruption_score: baseline ?? state.profile.disruption_score ?? 72,
              }
            : null,
        })
      },
    }),
    { name: 'punarshuru-profile' },
  ),
)
