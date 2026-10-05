import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, MessageSquare } from 'lucide-react'
import Step1Segment from '@/components/onboarding/Step1Segment'
import Step2Background from '@/components/onboarding/Step2Background'
import type { BackgroundFormData } from '@/components/onboarding/Step2Background'
import Step2GigForm from '@/components/onboarding/Step2GigForm'
import type { GigFormData } from '@/components/onboarding/Step2GigForm'
import Step3Skills from '@/components/onboarding/Step3Skills'
import Step4Goals from '@/components/onboarding/Step4Goals'
import type { GoalsFormData } from '@/components/onboarding/Step4Goals'
import AnalysingScreen from '@/components/onboarding/AnalysingScreen'
import ConversationalOnboarding from '@/components/onboarding/ConversationalOnboarding'
import { profileApi } from '@/lib/api'
import { useProfileStore } from '@/store/profileStore'
import { useAuthStore } from '@/store/authStore'
import type { UserType, Profile } from '@/types'

const stepTitles = [
  'Career Archetype',
  'Experience & Background',
  'Skill Taxonomy',
  'Goals & Target Role',
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const authUser = useAuthStore((s) => s.user)
  const setProfile = useProfileStore((s) => s.setProfile)

  // Default to Conversational Chat Agent
  const [mode, setMode] = useState<'chat' | 'form'>('chat')

  const [step, setStep] = useState<number>(1)
  const [isAnalysing, setIsAnalysing] = useState<boolean>(false)
  const [userType, setUserType] = useState<UserType>('returner')

  // Form starts empty (not hardcoded to demo persona)
  const [bgData, setBgData] = useState<BackgroundFormData>({
    name: authUser?.name || '',
    email: authUser?.email || '',
    city: '',
    current_role: '',
    experience_years: 0,
    career_gap_years: 0,
    current_salary_lpa: 0,
    resume_text: '',
    extracted_skills: [],
  })

  const [gigData, setGigData] = useState<GigFormData>({
    platform: '',
    city: '',
    experience_years: 0,
    monthly_income_inr: 0,
    daily_hours: 0,
    skills: [],
  })

  const [skills, setSkills] = useState<string[]>([])

  const [goals, setGoals] = useState<GoalsFormData>({
    target_role: '',
    target_salary_lpa: 0,
    preferred_city: '',
    timeframe_months: 3,
  })

  const handleArchetypeSelect = (type: UserType) => {
    setUserType(type)
    if (type === 'gig') {
      setSkills(['Route Optimization', 'Customer Service', 'Operations'])
      setGoals({
        target_role: 'Logistics Tech Analyst',
        target_salary_lpa: 6.5,
        preferred_city: 'Bengaluru',
        timeframe_months: 3,
      })
    } else if (type === 'student') {
      setBgData((prev) => ({
        ...prev,
        experience_years: 0,
        career_gap_years: 0,
        current_role: 'Student / Fresher',
      }))
      setSkills(['Python', 'Data Structures', 'SQL'])
      setGoals({
        target_role: 'Software Engineer',
        target_salary_lpa: 8.0,
        preferred_city: 'Bengaluru',
        timeframe_months: 3,
      })
    } else if (type === 'laid_off') {
      setBgData((prev) => ({
        ...prev,
        current_role: 'QA Engineer',
        experience_years: 4,
        career_gap_years: 0.5,
      }))
      setSkills(['Testing', 'JIRA', 'Agile', 'SQL'])
      setGoals({
        target_role: 'Automation QA / SDET',
        target_salary_lpa: 12.0,
        preferred_city: 'Bengaluru',
        timeframe_months: 3,
      })
    }
  }

  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => prev + 1)
    } else {
      setIsAnalysing(true)
    }
  }

  const handlePrev = () => {
    if (step > 1) {
      setStep((prev) => prev - 1)
    }
  }

  const handleAnalysisComplete = async () => {
    try {
      const finalSkills = userType === 'gig' ? gigData.skills : skills
      const finalName = (userType === 'gig' ? gigData.platform : bgData.name) || authUser?.name || 'Candidate'
      const finalCity = userType === 'gig' ? gigData.city : bgData.city
      const finalRole = userType === 'gig' ? `${gigData.platform} Partner` : bgData.current_role
      const finalExp = userType === 'gig' ? gigData.experience_years : bgData.experience_years
      const finalGap = userType === 'gig' ? 0 : bgData.career_gap_years
      const finalSalary = userType === 'gig' ? (gigData.monthly_income_inr * 12) / 100000 : bgData.current_salary_lpa

      const created = await profileApi.create({
        name: finalName,
        email: bgData.email || authUser?.email || `${finalName.toLowerCase().replace(/\s+/g, '')}@user.punarshuru.in`,
        user_type: userType,
        city: finalCity || 'Bengaluru',
        current_role: finalRole || 'Professional',
        target_role: goals.target_role || 'Software Engineer',
        experience_years: finalExp,
        career_gap_years: finalGap,
        current_salary_lpa: finalSalary || null,
        skills_raw: finalSkills.length > 0 ? finalSkills : ['Communication'],
        skills_taxonomy_ids: [],
      })

      setProfile(created)
      // Navigate to /home per ux.md
      navigate('/home')
    } catch {
      // Fallback local profile if offline
      const fallback: Profile = {
        id: `user-${Date.now()}`,
        name: bgData.name || authUser?.name || 'Candidate',
        user_type: userType,
        city: bgData.city || 'Bengaluru',
        current_role: bgData.current_role || 'Professional',
        target_role: goals.target_role || 'Software Engineer',
        experience_years: bgData.experience_years,
        career_gap_years: bgData.career_gap_years,
        current_salary_lpa: bgData.current_salary_lpa || null,
        skills_raw: skills.length > 0 ? skills : ['Communication'],
        skills_taxonomy_ids: [],
        disruption_score: userType === 'returner' ? 72 : 65,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setProfile(fallback)
      navigate('/home')
    }
  }

  if (isAnalysing) {
    return <AnalysingScreen onComplete={handleAnalysisComplete} />
  }

  return (
    <div className="max-w-6xl mx-auto py-2 px-2 sm:px-4">
      {/* Mode 1: Conversational Onboarding Agent (Default, Full Screen Chat + Live Card) */}
      {mode === 'chat' && (
        <ConversationalOnboarding onSwitchToForm={() => setMode('form')} />
      )}

      {/* Mode 2: Standard 4-Step Form Wizard (Fallback, uncluttered) */}
      {mode === 'form' && (
        <div className="space-y-6 max-w-4xl mx-auto py-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Standard Profile Wizard
              </h2>
              <p className="text-xs text-slate-500">Step-by-step career background form</p>
            </div>
            {/* Small text link to return to chat */}
            <button
              type="button"
              onClick={() => setMode('chat')}
              className="text-xs text-[#0B4F9C] dark:text-sky-400 hover:underline flex items-center gap-1 font-bold"
            >
              <MessageSquare size={13} />
              <span>← Back to AI chat agent</span>
            </button>
          </div>

          {/* Step Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2 text-xs font-bold text-slate-500">
              <span>Step {step} of 4: {stepTitles[step - 1]}</span>
              <span className="text-[#0B4F9C] dark:text-sky-400 font-semibold">{step * 25}% Completed</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <motion.div
                className="bg-[#0B4F9C] h-full rounded-full"
                animate={{ width: `${step * 25}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Step Wizard Body */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[440px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Step1Segment selected={userType} onSelect={handleArchetypeSelect} />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {userType === 'gig' ? (
                    <Step2GigForm data={gigData} onChange={setGigData} />
                  ) : (
                    <Step2Background
                      data={bgData}
                      onChange={setBgData}
                      onArchetypeDetected={(t) => setUserType(t as UserType)}
                    />
                  )}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Step3Skills selectedSkills={skills} onChange={setSkills} />
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Step4Goals data={goals} onChange={setGoals} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Wizard Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
              <button
                type="button"
                onClick={handlePrev}
                disabled={step === 1}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#0B4F9C] text-white text-xs font-bold hover:bg-[#083b75] shadow-md shadow-blue-900/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{step === 4 ? 'Calibrate Profile' : 'Next Step'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
