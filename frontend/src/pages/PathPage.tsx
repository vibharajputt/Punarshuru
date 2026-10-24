import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Map,
  Zap,
  Sparkles,
  CheckCircle2,
  Check,
  Target,
  ShieldCheck,
  BookOpen,
  Trophy,
  Layers,
  MessageSquareCode,
  QrCode,
  Flame,
  Briefcase,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useActiveProfile } from '@/hooks/useActiveProfile'
import { useSkillGap } from '@/hooks/useSkillGap'
import { pathwayApi } from '@/lib/api'
import PathCardsGrid from '@/components/pathways/PathCardsGrid'
import RoadmapTimeline from '@/components/pathways/RoadmapTimeline'
import ReentryRoadmap from '@/components/dashboard/returner/ReentryRoadmap'
import Skeleton from '@/components/common/Skeleton'
import { getRolePathways } from '@/components/pathways/defaultPathways'
import type { PathwayOption } from '@/types'

export default function PathPage() {
  const { t, i18n } = useTranslation()
  const isHi = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('hi')

  const { profile } = useActiveProfile()
  const userType = profile?.user_type || 'returner'

  const isStudent = userType === 'student'
  const isStagnant = userType === 'stagnant'
  const isLaidOff = userType === 'laid_off'
  const isGig = userType === 'gig'
  const isReturner = !isStudent && !isStagnant && !isLaidOff && !isGig

  const [searchParams, setSearchParams] = useSearchParams()

  // 4 Guided Steps:
  // 1: Choose Strategy (Safe / Stretch / Switch)
  // 2: Skill Gap & Curriculum Audit
  // 3: Step-by-Step Learning Milestones
  // 4: Verification & Job Launchpad
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [activeTab, setActiveTab] = useState<'pathways' | 'sprint'>('pathways')
  const [selectedIndex, setSelectedIndex] = useState<number>(1) // Default to Stretch

  useEffect(() => {
    const stepParam = parseInt(searchParams.get('step') || '1', 10)
    if (stepParam >= 1 && stepParam <= 4) {
      setCurrentStep(stepParam)
    }
    const tabParam = searchParams.get('tab')
    if (tabParam === 'sprint') {
      setActiveTab('sprint')
    } else {
      setActiveTab('pathways')
    }
  }, [searchParams])

  const goToStep = (step: number) => {
    setCurrentStep(step)
    const newParams = new URLSearchParams(searchParams)
    newParams.set('step', String(step))
    setSearchParams(newParams)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleTabChange = (tab: 'pathways' | 'sprint') => {
    setActiveTab(tab)
    const newParams = new URLSearchParams(searchParams)
    if (tab === 'sprint') {
      newParams.set('tab', 'sprint')
    } else {
      newParams.delete('tab')
    }
    setSearchParams(newParams)
  }

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['pathway', profile?.id, userType],
    queryFn: () => (profile?.id ? pathwayApi.get(profile.id) : null),
    enabled: !!profile?.id,
    staleTime: 60_000,
  })

  const fallbackPathways = getRolePathways(userType)
  const pathways: PathwayOption[] =
    data?.pathways && data.pathways.length >= 3 && isReturner ? data.pathways : fallbackPathways
  const selectedPathway = pathways[selectedIndex] || pathways[0]

  // Dynamic Skill Gap computation for the selected pathway's target role
  const {
    matchPct,
    haveSkills,
    missingSkills,
    partialSkills,
  } = useSkillGap(selectedPathway?.target_role)

  const stepsMeta = [
    {
      step: 1,
      title: isHi ? 'रणनीति चुनें' : 'Choose Strategy',
      subtitle: isHi ? 'सेफ, स्ट्रेच या स्विच' : 'Safe, Stretch or Switch',
      icon: Target,
    },
    {
      step: 2,
      title: isHi ? 'स्किल गैप ऑडिट' : 'Skill Gap Audit',
      subtitle: isHi ? 'तैयार vs सीखने योग्य स्किल्स' : 'Have vs Missing Skills',
      icon: Layers,
    },
    {
      step: 3,
      title: isHi ? 'कदम-दर-कदम रोडमैप' : 'Action Roadmap',
      subtitle: isHi ? 'माइलस्टोन्स व फ्री कोर्सेज' : 'Milestones & Free Courses',
      icon: BookOpen,
    },
    {
      step: 4,
      title: isHi ? 'वेरिफिकेशन व जॉब्स' : 'Verify & Launch',
      subtitle: isHi ? 'AI इंटरव्यू व पासपोर्ट' : 'AI Interview & Passport',
      icon: ShieldCheck,
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* ── 1. Header with Title & Recalculate ──────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {isStudent
                ? 'Campus-to-Corporate Placement Roadmaps'
                : isStagnant
                ? 'Career Acceleration & 40%+ Hike Roadmaps'
                : isLaidOff
                ? 'Rapid Re-Employment & Immediate Joiner Roadmaps'
                : isGig
                ? 'Freelancer-to-Fulltime Enterprise Roadmaps'
                : t('pathways.title', 'Career Re-entry & Confidence Reboot Roadmaps')}
            </h1>
            {isStudent ? (
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60">
                Fresher & Campus Track
              </span>
            ) : isStagnant ? (
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-[#0B4F9C] dark:text-sky-300 border border-blue-200/60">
                Promotion & Lateral Leap Track
              </span>
            ) : isLaidOff ? (
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200/60">
                0-Day Notice Immediate Track
              </span>
            ) : isGig ? (
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200/60">
                Enterprise Stability Track
              </span>
            ) : (
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border border-teal-200/60">
                Returner Reboot Track
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isHi
              ? 'चरणबद्ध मार्गदर्शन: अपनी रणनीति चुनें, स्किल गैप देखें, माइलस्टोन्स पूरे करें और वेरिफाइड टैलेंट पासपोर्ट के साथ जॉब्स क्रैक करें।'
              : 'Step-by-step career navigation: Choose strategy, audit skill gaps, complete free accredited milestones, and unlock job parity.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-[#0B4F9C] transition-all cursor-pointer shadow-2xs"
            title="Recalculate pathways"
          >
            <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
          </button>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold bg-[#0B4F9C] text-white hover:bg-[#083b75] shadow-md transition-all"
          >
            <span>{t('pathways.check_jobs_btn', 'Check Jobs & Salary')}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* ── 2. Interactive Step-by-Step Stepper Bar ───────────────────── */}
      <div className="p-3 sm:p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {stepsMeta.map((s) => {
            const Icon = s.icon
            const isActive = currentStep === s.step
            const isCompleted = currentStep > s.step

            return (
              <button
                key={s.step}
                type="button"
                onClick={() => goToStep(s.step)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative flex items-center gap-3 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50/90 to-indigo-50/80 dark:from-blue-950/50 dark:to-indigo-950/40 border-[#0B4F9C] dark:border-sky-500 shadow-sm ring-2 ring-[#0B4F9C]/20'
                    : isCompleted
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 hover:bg-emerald-50/80'
                    : 'bg-slate-50/60 dark:bg-slate-850/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-black text-xs transition-colors ${
                    isActive
                      ? 'bg-[#0B4F9C] text-white shadow-md shadow-[#0B4F9C]/25'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check size={16} className="stroke-[3]" /> : <Icon size={16} />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider ${
                        isActive
                          ? 'text-[#0B4F9C] dark:text-sky-300'
                          : isCompleted
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-slate-400'
                      }`}
                    >
                      Step {s.step}
                    </span>
                    {isCompleted && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200">
                        Done
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs font-bold truncate ${
                      isActive
                        ? 'text-slate-900 dark:text-white'
                        : isCompleted
                        ? 'text-slate-800 dark:text-slate-200'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {s.title}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate hidden sm:block">
                    {s.subtitle}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── 3. Step Content Routing with Animation ─────────────────────── */}
      <AnimatePresence mode="wait">
        {/* ── STEP 1: CHOOSE CAREER TRANSITION STRATEGY ─────────────────── */}
        {currentStep === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Step 1 Introduction Banner */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/5 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-slate-900 border border-blue-200/80 dark:border-blue-800/60 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#0B4F9C] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#0B4F9C]/30">
                    <Target size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#0B4F9C] dark:text-sky-300">
                      Step 1 of 4 • Strategic Decision
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight mt-0.5">
                      {isHi ? 'अपनी करियर संक्रमण रणनीति चुनें' : 'Select Your Career Transition Strategy'}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      {isHi
                        ? '3 व्यक्तिगत विकल्प: सेफ (कम जोखिम, तीव्र), स्ट्रेच (40%+ हाई ग्रोथ लीप), या स्विच (नया रोल पिवट)।'
                        : 'Choose between low-risk rapid re-employment (Safe), high-hike modern leap (Stretch), or complete domain pivot (Switch).'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Target Role:
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 font-extrabold text-xs text-[#0B4F9C] dark:text-sky-300 border border-slate-200 dark:border-slate-700 shadow-2xs">
                    {selectedPathway?.target_role}
                  </span>
                </div>
              </div>
            </div>

            {/* Loading Skeleton if query pending */}
            {isLoading && !data && isReturner ? (
              <Skeleton variant="card" className="h-64" />
            ) : (
              /* 3 Strategy Cards Grid */
              <PathCardsGrid
                pathways={pathways}
                selectedIndex={selectedIndex}
                onSelectIndex={setSelectedIndex}
              />
            )}

            {/* Selected Strategy Confirmation & Next Action Box */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-[#0B4F9C]/30 dark:border-sky-500/30 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0B4F9C] dark:text-sky-300 text-xs font-black">
                    Selected: {selectedPathway.type} Strategy
                  </span>
                  <span className="text-xs font-bold text-slate-400">•</span>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    ₹{selectedPathway.target_salary_lpa} LPA Target
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {selectedPathway.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
                  {selectedPathway.description} • Timeline: {selectedPathway.estimated_months} Months • Difficulty: {selectedPathway.difficulty}
                </p>
              </div>

              <button
                type="button"
                onClick={() => goToStep(2)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm bg-[#0B4F9C] text-white hover:bg-[#083b75] shadow-lg shadow-[#0B4F9C]/25 transition-all cursor-pointer shrink-0"
              >
                <span>{isHi ? 'रणनीति लॉक करें और स्टेप 2 पर जाएं' : 'Confirm Strategy & Proceed to Step 2'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 2: SKILL GAP & CURRICULUM AUDIT ─────────────────────── */}
        {currentStep === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Step 2 Introduction Banner */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-blue-600/5 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-slate-900 border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/30">
                    <Layers size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                      Step 2 of 4 • Skill Bridge Audit
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight mt-0.5">
                      {isHi
                        ? `${selectedPathway.target_role} के लिए आपकी स्किल्स का लाइव मिलान`
                        : `Live Skill Match & Bridging Audit for ${selectedPathway.target_role}`}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      {isHi
                        ? 'जानें कि आपके पिछले बैकग्राउंड से क्या पहले से तैयार है और इस रोडमैप में कौन सी नई स्किल्स सिखाई जाएंगी।'
                        : 'Review ready competencies you already bring vs specific delta capabilities covered in your curriculum.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Match Score</span>
                    <span className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                      {matchPct}% Match
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shadow-xs">
                    <Trophy size={20} className="text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Ready vs Delta Skills Two-Column Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Ready Skills Column */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      {isHi ? 'सत्यापित स्किल्स जो आपके पास हैं' : 'Verified Skills You Bring'}
                    </h4>
                  </div>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    {haveSkills.length} Ready
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {isHi
                    ? 'ये स्किल्स आपके रेज़्यूमे/प्रोफाइल से जांची गई हैं और आपको मार्केट में बढ़त देती हैं।'
                    : 'Validated from your background. These strengths give you an unfair hiring advantage and require 0 retraining.'}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {haveSkills.length > 0 ? (
                    haveSkills.map((sk) => (
                      <span
                        key={sk}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200/60"
                      >
                        <Check size={13} className="text-emerald-600 stroke-[3]" />
                        <span>{sk}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No exact matches yet. Roadmap will build core foundations.</span>
                  )}
                </div>
              </div>

              {/* Missing Delta Skills Column */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-800/60 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-amber-500" />
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      {isHi ? 'रोडमैप में शामिल की जाने वाली स्किल्स' : 'Delta Skills You Will Master'}
                    </h4>
                  </div>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    {missingSkills.length + partialSkills.length} To Build
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {isHi
                    ? 'ये वो महत्वपूर्ण स्किल्स हैं जिन्हें 100% फ्री कोर्सेज और प्रोजेक्ट्स के जरिए कवर किया जाएगा।'
                    : 'High-demand industry competencies that our step-by-step roadmap will teach you via free Govt/NPTEL courses.'}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {missingSkills.slice(0, 8).map((sk) => (
                    <span
                      key={sk}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-xs font-bold border border-amber-200/60"
                    >
                      <BookOpen size={13} className="text-amber-600" />
                      <span>{sk}</span>
                    </span>
                  ))}
                  {partialSkills.map((ps) => (
                    <span
                      key={ps.skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-300 text-xs font-bold border border-purple-200/60"
                    >
                      <Zap size={13} className="text-purple-600" />
                      <span>{ps.skill}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Projected Career Risk Score Drop & Effort Banner */}
            <div className="p-5 rounded-3xl bg-slate-100/90 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-[#0B4F9C] dark:text-sky-300 flex items-center justify-center font-black">
                  <Flame size={20} className="text-[#F26B1D]" />
                </div>
                <div>
                  <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {isHi ? 'करियर रिस्क में अपेक्षित सुधार' : 'Projected Career Risk Score Reduction'}
                  </h5>
                  <p className="text-xs text-slate-500">
                    {isHi
                      ? 'इस रोडमैप के माइलस्टोन्स पूरे करने पर आपका करियर रिस्क स्कोर 72 से घटकर 28 (-44 अंक) हो जाएगा।'
                      : 'Completing these milestones dynamically lowers your Career Risk Score from 72 to 28 (-44 points)!'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                  Est. 8-10 hrs/week
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs">
                  -44 Risk Points
                </span>
              </div>
            </div>

            {/* Step 2 Bottom Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => goToStep(1)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <ArrowLeft size={15} />
                <span>{isHi ? 'वापस स्टेप 1 पर जाएं' : 'Back to Step 1: Change Strategy'}</span>
              </button>

              <button
                type="button"
                onClick={() => goToStep(3)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm bg-[#0B4F9C] text-white hover:bg-[#083b75] shadow-lg shadow-[#0B4F9C]/25 transition cursor-pointer"
              >
                <span>{isHi ? 'करिकुलम पक्का करें और स्टेप 3 पर जाएं' : 'Lock In Curriculum & Proceed to Step 3: Action Roadmap'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 3: STEP-BY-STEP LEARNING ROADMAP & MILESTONES ────────── */}
        {currentStep === 3 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Step 3 Mode Tabs (Phased Roadmap vs 30-Day Sprint) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-teal-600/5 dark:from-slate-900 dark:to-slate-900 border border-blue-200/80 dark:border-slate-800 shadow-2xs">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#0B4F9C] dark:text-sky-300">
                  Step 3 of 4 • Practical Execution
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight mt-0.5">
                  {selectedPathway.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isHi
                    ? '100% फ्री कोर्सेज से सीखें, माइलस्टोन टास्क पूरे करें और प्रूफ-ऑफ-वर्क सत्यापित करें।'
                    : 'Follow weekly milestone phases, access verified free courses, and verify proofs to drop your risk score.'}
                </p>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0">
                <button
                  type="button"
                  onClick={() => handleTabChange('pathways')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'pathways'
                      ? 'bg-[#0B4F9C] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Map size={13} />
                  <span>{isHi ? 'पूर्ण चरणबद्ध रोडमैप' : 'Full Phased Roadmap'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange('sprint')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'sprint'
                      ? 'bg-[#0B4F9C] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Zap size={13} className="text-[#F26B1D]" />
                  <span>{isHi ? '30-दिन एग्जीक्यूशन स्प्रिंट' : '30-Day Action Sprint'}</span>
                </button>
              </div>
            </div>

            {/* Active Content: Roadmap Timeline or Reentry Roadmap */}
            {activeTab === 'pathways' ? (
              <RoadmapTimeline pathway={selectedPathway} />
            ) : (
              <ReentryRoadmap />
            )}

            {/* Step 3 Bottom Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => goToStep(2)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <ArrowLeft size={15} />
                <span>{isHi ? 'वापस स्टेप 2 पर जाएं' : 'Back to Step 2: Skill Audit'}</span>
              </button>

              <button
                type="button"
                onClick={() => goToStep(4)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 transition cursor-pointer"
              >
                <span>{isHi ? 'प्रोग्रेस सेव करें और स्टेप 4: वेरिफिकेशन पर जाएं' : 'Save Progress & Proceed to Step 4: Verify & Job Launch'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 4: VERIFY, INTERVIEW & JOB LAUNCHPAD ────────────────── */}
        {currentStep === 4 && (
          <motion.div
            key="step-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Step 4 Introduction Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600/10 via-teal-600/15 to-blue-600/10 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-slate-900 border border-emerald-300 dark:border-emerald-800/70 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/30">
                    <ShieldCheck size={26} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                      Step 4 of 4 • Verification & Launch
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight mt-0.5">
                      {isHi ? 'करियर लॉन्चपैड: इंटरव्यू, पासपोर्ट व लाइव जॉब्स' : 'Career Launchpad: AI Interview, Passport & Live Jobs'}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      {isHi
                        ? 'अपनी तैयारी को परखे: AI इंटरव्यू लें, SHA-256 वेरिफाइड पासपोर्ट मिंट करें और सीधे हायरिंग कंपनियों में अप्लाई करें।'
                        : 'Validate your competencies with rubric AI mock drills, mint your QR Talent Passport, and apply for verified salary jobs.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <span className="px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-black border border-emerald-300/60">
                    🎯 Target: {selectedPathway.target_role}
                  </span>
                </div>
              </div>
            </div>

            {/* 3 High-Impact Action Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Tile 1: AI Mock Interview */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-400 transition-all">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950 text-[#0B4F9C] dark:text-sky-300 flex items-center justify-center">
                    <MessageSquareCode size={22} />
                  </div>
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {isHi ? '1. रोल-बाउंड AI मॉक इंटरव्यू' : '1. Role-Bounded AI Mock Interview'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {isHi
                      ? `${selectedPathway.target_role} के लिए निर्धारित तकनीकी व स्थितिपरक सवालों का अभ्यास करें और 1-5 रुब्रिक स्कोरिंग पाएं।`
                      : `Practice questions dynamically tailored to ${selectedPathway.target_role} with instant 1-to-5 rubric evaluations.`}
                  </p>
                </div>

                <Link
                  to="/features"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-xs bg-[#0B4F9C] text-white hover:bg-[#083b75] shadow-sm transition"
                >
                  <span>{isHi ? 'AI इंटरव्यू शुरू करें' : 'Start AI Mock Interview'}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Tile 2: Cryptographic QR Talent Passport */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-400 transition-all">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
                    <QrCode size={22} />
                  </div>
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {isHi ? '2. वेरिफाइड टैलेंट पासपोर्ट व QR' : '2. Verified Skill Passport & QR'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {isHi
                      ? 'रिक्रूटर्स को दिखाने के लिए SHA-256 हैश से सुरक्षित पब्लिक प्रोफाइल और मोबाइल स्कैनेबल QR कोड जेनरेट करें।'
                      : 'Mint tamper-proof public credentials with verified competencies, GitHub artifacts, and scannable QR code.'}
                  </p>
                </div>

                <Link
                  to="/passport"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
                >
                  <span>{isHi ? 'मेरा पासपोर्ट देखें' : 'View My Skill Passport'}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Tile 3: Live Jobs & Salary Benchmark */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-400 transition-all">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                    <Briefcase size={22} />
                  </div>
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {isHi ? '3. मैचिंग जॉब्स व सैलरी पैरिटी' : '3. Matching Jobs & Salary Parity'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {isHi
                      ? `भारतीय टेक हब्स में ₹${selectedPathway.target_salary_lpa} LPA वाली वास्तविक वेकेंसीज देखें और इन-हैंड सैलरी जांचें।`
                      : `Explore 15,800+ real job vacancies matching ${selectedPathway.target_role} and benchmark in-hand earnings after expenses.`}
                  </p>
                </div>

                <Link
                  to="/jobs"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-xs bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition"
                >
                  <span>{isHi ? 'मैचिंग जॉब्स देखें' : 'Explore Matching Jobs'}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Step 4 Bottom Navigation & Reset */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => goToStep(3)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <ArrowLeft size={15} />
                <span>{isHi ? 'वापस स्टेप 3: रोडमैप पर जाएं' : 'Back to Step 3: Roadmap Milestones'}</span>
              </button>

              <button
                type="button"
                onClick={() => goToStep(1)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>{isHi ? 'शुरुआत से शुरू करें (नई रणनीति)' : 'Start Over with Another Strategy'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
