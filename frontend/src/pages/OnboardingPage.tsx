import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Sparkles, MessageSquare } from 'lucide-react'
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
import type { UserType, Profile } from '@/types'

const stepTitles = [
  'Career Archetype',
  'Experience & Background',
  'Skill Taxonomy',
  'Goals & Target Role',
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const setProfile = useProfileStore((s) => s.setProfile)

  // Default to Conversational Chat Agent per Addendum v2
  const [mode, setMode] = useState<'chat' | 'form'>('chat')

  const [step, setStep] = useState<number>(1)
  const [isAnalysing, setIsAnalysing] = useState<boolean>(false)
  const [userType, setUserType] = useState<UserType>('returner')

  const [bgData, setBgData] = useState<BackgroundFormData>({
    name: 'Priya Sharma',
    email: '',
    city: 'Pune',
    current_role: 'Java Developer',
    experience_years: 5,
    career_gap_years: 4.0,
    current_salary_lpa: 8.5,
    resume_text: '',
    extracted_skills: ['Java', 'Spring Boot', 'MySQL', 'REST APIs'],
  })

  const [gigData, setGigData] = useState<GigFormData>({
    platform: 'Swiggy',
    city: 'Lucknow',
    experience_years: 3,
    monthly_income_inr: 22000,
    daily_hours: 8,
    skills: ['Route & Map Navigation', 'Customer Communication (Hindi)', 'Real-Time Problem Solving'],
  })

  const [skills, setSkills] = useState<string[]>([
    'Java',
    'Spring Boot',
    'MySQL',
    'REST APIs',
    'Git',
  ])

  const [goals, setGoals] = useState<GoalsFormData>({
    target_role: 'GenAI Engineer',
    target_salary_lpa: 16.0,
    preferred_city: 'Pune',
    timeframe_months: 4,
  })

  const handleArchetypeSelect = (type: UserType) => {
    setUserType(type)
    if (type === 'gig') {
      setSkills(['Route Optimization', 'Customer Service', 'Operations', 'Hindi'])
      setGoals({
        target_role: 'Logistics Tech Analyst',
        target_salary_lpa: 6.5,
        preferred_city: 'Lucknow',
        timeframe_months: 3,
      })
    } else if (type === 'student') {
      setBgData((prev) => ({
        ...prev,
        experience_years: 0,
        career_gap_years: 0,
        current_role: 'Final Year BTech CSE',
      }))
      setSkills(['Python', 'C++', 'Data Structures', 'SQL', 'Git'])
      setGoals({
        target_role: 'Software Engineer',
        target_salary_lpa: 10.0,
        preferred_city: 'Mohali / Chandigarh',
        timeframe_months: 2,
      })
    } else if (type === 'laid_off') {
      setBgData((prev) => ({
        ...prev,
        current_role: 'Manual QA Engineer',
        experience_years: 6,
        career_gap_years: 0.5,
      }))
      setSkills(['Manual Testing', 'JIRA', 'Agile', 'SQL', 'Selenium (basic)'])
      setGoals({
        target_role: 'Automation QA / SDET',
        target_salary_lpa: 14.0,
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
      const finalName = userType === 'gig' ? 'Ramesh Kumar' : bgData.name
      const finalCity = userType === 'gig' ? gigData.city : bgData.city
      const finalRole = userType === 'gig' ? `${gigData.platform} Delivery Partner` : bgData.current_role
      const finalExp = userType === 'gig' ? gigData.experience_years : bgData.experience_years
      const finalGap = userType === 'gig' ? 0 : bgData.career_gap_years
      const finalSalary = userType === 'gig' ? (gigData.monthly_income_inr * 12) / 100000 : bgData.current_salary_lpa

      const created = await profileApi.create({
        name: finalName || 'Candidate',
        email: `${finalName.toLowerCase().replace(/\s+/g, '')}@demo.punarshuru.in`,
        user_type: userType,
        city: finalCity || 'Bengaluru',
        current_role: finalRole,
        target_role: goals.target_role || 'Software Engineer',
        experience_years: finalExp,
        career_gap_years: finalGap,
        current_salary_lpa: finalSalary,
        skills_raw: finalSkills,
        skills_taxonomy_ids: [],
      })

      setProfile(created)
      navigate('/dashboard')
    } catch {
      // Fallback local profile if offline
      const fallback: Profile = {
        id: `user-${Date.now()}`,
        name: bgData.name || 'Candidate',
        user_type: userType,
        city: bgData.city || 'Pune',
        current_role: bgData.current_role,
        target_role: goals.target_role,
        experience_years: bgData.experience_years,
        career_gap_years: bgData.career_gap_years,
        current_salary_lpa: bgData.current_salary_lpa,
        skills_raw: skills,
        skills_taxonomy_ids: [],
        disruption_score: userType === 'returner' ? 72 : 65,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setProfile(fallback)
      navigate('/dashboard')
    }
  }

  if (isAnalysing) {
    return <AnalysingScreen onComplete={handleAnalysisComplete} />
  }

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Mode 1: Conversational Onboarding Agent (Default) */}
      {mode === 'chat' && (
        <ConversationalOnboarding onSwitchToForm={() => setMode('form')} />
      )}

      {/* Mode 2: Standard 4-Step Form Wizard (Fallback) */}
      {mode === 'form' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Standard Profile Wizard
              </h2>
              <p className="text-xs text-slate-500">Step-by-step career background form</p>
            </div>
            <button
              type="button"
              onClick={() => setMode('chat')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B4F9C] text-white text-xs font-bold hover:bg-[#083b75] transition-all shadow-sm"
            >
              <MessageSquare size={13} />
              <span>Switch to AI Chat Agent</span>
            </button>
          </div>

          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-500">
              <span>Step {step} of 4: {stepTitles[step - 1]}</span>
              <span className="text-[#0B4F9C] font-semibold">{step * 25}% Completed</span>
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
                    <Step2Background data={bgData} onChange={setBgData} />
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
                  <Step3Skills
                    selectedSkills={userType === 'gig' ? gigData.skills : skills}
                    onChange={userType === 'gig' ? (s) => setGigData({ ...gigData, skills: s }) : setSkills}
                    userType={userType}
                  />
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Step4Goals data={goals} onChange={setGoals} userType={userType} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Wizard Controls */}
            <div className="pt-8 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrev}
                disabled={step === 1}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              >
                <ArrowLeft size={14} />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#0B4F9C] text-white hover:bg-[#083b75] shadow-md shadow-blue-900/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{step === 4 ? 'Run Career Disruption Audit' : 'Continue'}</span>
                {step === 4 ? <Sparkles size={14} /> : <ArrowRight size={14} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
