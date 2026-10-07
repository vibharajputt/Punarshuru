import { useState, useId, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useUserProfile } from '@/store/userProfileStore'
import {
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  UserCheck,
  Copy,
  Check,
  Send,
  Sliders,
  DollarSign,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react'

/* ────────────────────────────────────────────────────────────
   1. PRESET BENCHMARK SCENARIOS (SIMPLE & CLEAR)
──────────────────────────────────────────────────────────── */
interface PresetScenario {
  id: string
  title: string
  tag: string
  managerOpening: string
  options: {
    id: string
    title: string
    text: string
    isBest: boolean
    score: number
    feedback: string
  }[]
  goldScript: string
}

const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'budget_tight',
    title: 'Excuse 1: "Company Budget Freeze (Standard 6.5% Hike)"',
    tag: 'Appraisal Discussion',
    managerOpening:
      '"We appreciate your hard work, but company budget guidelines only allow a 6.5% standard increment this cycle."',
    options: [
      {
        id: 'opt-1-1',
        title: '❌ Emotional / Angry Response',
        text: '"I work 12 hours a day and weekend support too. Other companies are offering 30%. It is very unfair."',
        isBest: false,
        score: 30,
        feedback: 'Emotional arguments without business metrics make managers defensive and rarely increase budget.',
      },
      {
        id: 'opt-1-2',
        title: '⚠️ Passive Acceptance',
        text: '"I understand the budget issue. I will take 6.5% now, hopefully next year you can give a higher hike."',
        isBest: false,
        score: 55,
        feedback: 'You leave money on the table. Managers usually keep extra budget for people who show solid business proof.',
      },
      {
        id: 'opt-1-3',
        title: '⭐ Value-Driven Pivot (PunarSetu Gold)',
        text: '"I understand the team budget cap. However, this quarter I built the automated triage system that saved 650 team hours (₹4.2L value). Based on this direct savings, can we propose an exception approval for ₹12.5 LPA tied to leading our Q3 automation roadmap?"',
        isBest: true,
        score: 95,
        feedback: 'Superb! Shows exact money/hours saved and gives manager a solid reason to ask HR for a special approval.',
      },
    ],
    goldScript:
      'I appreciate the department allocation constraints. Over the past 6 months, beyond standard ticket resolution, I built our automated ticket deflection system that saved ₹4.2 Lakhs in team effort. Given this measurable ROI, I would like to propose a band realignment to ₹12.5 LPA tied to leading our Q3 automation roadmap.',
  },
  {
    id: 'tenure_pushback',
    title: 'Excuse 2: "Promotion ke liye 1 saal aur wait karo"',
    tag: 'Promotion Discussion',
    managerOpening:
      '"Technically you are doing Lead-level work, but policy requires 4+ years experience for the Senior title. Let\'s wait for next year\'s cycle."',
    options: [
      {
        id: 'opt-2-1',
        title: '❌ Wait 1 More Year',
        text: '"Okay, if policy says 4 years I will wait for next year."',
        isBest: false,
        score: 25,
        feedback: 'You lose an entire year of salary growth and title progression by blindly waiting.',
      },
      {
        id: 'opt-2-2',
        title: '⭐ 90-Day Milestone Agreement (PunarSetu Gold)',
        text: '"I respect company policy guidelines. Since my current deliverables already match Senior Lead responsibilities, can we set 3 clear technical milestones for the next 90 days? If achieved, we can fast-track the formal title mid-cycle without waiting 12 months."',
        isBest: true,
        score: 94,
        feedback: 'Masterful! Instead of arguing, you lock the manager into a concrete 90-day review based on performance.',
      },
    ],
    goldScript:
      'Since my current deliverables already align with Senior Lead responsibilities, I propose we establish 3 clear 90-day technical milestones. Upon achieving them, we fast-track the formal promotion mid-cycle rather than waiting an entire year.',
  },
  {
    id: 'extra_work',
    title: 'Excuse 3: "Extra squad sambhalo without promotion"',
    tag: 'Scope Creep',
    managerOpening:
      '"Squad B ka lead chala gaya hai, so we need you to manage their daily standups and client demos alongside your current modules."',
    options: [
      {
        id: 'opt-3-1',
        title: '❌ Accept without title/pay',
        text: '"Sure, I will do all the extra work and work late nights."',
        isBest: false,
        score: 35,
        feedback: 'Burnout risk without getting career credit or compensation revision.',
      },
      {
        id: 'opt-3-2',
        title: '⭐ Step Up with Title Formalization (PunarSetu Gold)',
        text: '"I am excited to stabilize Squad B. Since this expands my scope to managing 8 engineers and client demos, let\'s document this as an Acting Lead assignment with a formal title and compensation review after 60 days."',
        isBest: true,
        score: 96,
        feedback: 'Turns an unexpected workload burden into immediate leverage for promotion and salary growth.',
      },
    ],
    goldScript:
      'I am ready to step up and stabilize Squad B. Given that this expands my responsibilities to dual-squad leadership, let us document this as an Acting Lead assignment with a formal title and compensation review at the end of the 60-day sprint.',
  },
]

/* ────────────────────────────────────────────────────────────
   COMMON MANAGER TYPES
──────────────────────────────────────────────────────────── */
const MANAGER_TYPES = [
  {
    id: 'budget_tight',
    name: 'Budget Cap / Policy Wala Manager',
    tag: '"Budget nahi hai / Company cap hai"',
    advice: 'Inhe exact numbers/savings dikhao taaki ye HR se special exception maang sakein.',
  },
  {
    id: 'delivery_focus',
    name: 'Release / Delivery Focused Manager',
    tag: '"Project deadline miss nahi honi chahiye"',
    advice: 'Inhe dikhao ki aapko retain karne se project safe rahega aur zero downtime hoga.',
  },
  {
    id: 'delay_master',
    name: 'Procrastinator ("Next Year Pakka")',
    tag: '"Is cycle me nahi, next cycle me karenge"',
    advice: 'Inse 90-day performance milestones sign karvao taaki agle saal tak delay na ho.',
  },
]

export default function Manager1on1Simulator() {
  const currentCtcId = useId()
  const targetCtcId = useId()
  const userWinsId = useId()
  const userPracticeId = useId()

  const [activeTab, setActiveTab] = useState<'custom' | 'preset'>('custom')
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1)

  const { t } = useTranslation()
  const { currentSalaryLPA, targetSalaryLPA, setCurrentSalaryLPA, setTargetHikePercent } = useUserProfile()

  // Custom Simulator State
  const [currentCtc, setCurrentCtc] = useState<number>(currentSalaryLPA)
  const [targetCtc, setTargetCtc] = useState<number>(targetSalaryLPA)
  const [managerType, setManagerType] = useState<string>('budget_tight')
  const [userWins, setUserWins] = useState<string>(
    'Automated ticket triage webhook (saved ₹4.2L) & delivered ChromaDB search with 99.9% uptime'
  )

  useEffect(() => {
    setCurrentCtc(currentSalaryLPA)
    setTargetCtc(targetSalaryLPA)
  }, [currentSalaryLPA, targetSalaryLPA])

  // Preset State
  const [selectedPresetIdx, setSelectedPresetIdx] = useState<number>(0)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [copiedScript, setCopiedScript] = useState<boolean>(false)

  // Practice Input
  const [practiceInput, setPracticeInput] = useState<string>('')
  const [practiceScore, setPracticeScore] = useState<{
    score: number
    verdict: string
    tip: string
  } | null>(null)

  // Calculations
  const hikeLakhs = Math.max(0, targetCtc - currentCtc)
  const hikePercent = currentCtc > 0 ? Math.round((hikeLakhs / currentCtc) * 100) : 0
  const replaceCost = Math.round((currentCtc * 0.12 + (currentCtc / 12) * 2.5) * 10) / 10

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedScript(true)
    setTimeout(() => setCopiedScript(false), 2000)
  }

  // Dynamic Preset Scenarios referencing live targetCtc
  const dynamicPresets = useMemo(() => {
    return PRESET_SCENARIOS.map((sc) => {
      if (sc.id === 'budget_tight') {
        return {
          ...sc,
          options: sc.options.map((opt) =>
            opt.isBest
              ? {
                  ...opt,
                  text: `"I understand the team budget cap. However, this quarter I built the automated triage system that saved 650 team hours (₹4.2L value). Based on this direct savings, can we propose an exception approval for ₹${targetCtc} LPA tied to leading our Q3 automation roadmap?"`,
                }
              : opt
          ),
          goldScript: `I appreciate the department allocation constraints. Over the past 6 months, beyond standard ticket resolution, I built our automated ticket deflection system that saved ₹4.2 Lakhs in team effort. Given this measurable ROI, I would like to propose a band realignment to ₹${targetCtc} LPA tied to leading our Q3 automation roadmap.`,
        }
      }
      return sc
    })
  }, [targetCtc])

  // Simple Custom Script Generator
  const customScript = `“I completely respect the department budget constraints. However, over the past months, my deliverables include: ${userWins}. Given market standards for this scope (₹${targetCtc} LPA) and considering external hiring costs reach ~₹${replaceCost}L, I would like to propose a band realignment to ₹${targetCtc} LPA (+${hikePercent}%), or establish a 90-day milestone agreement to fast-track this review.”`

  // Practice Evaluator
  const evaluatePractice = () => {
    if (!practiceInput.trim()) return
    const text = practiceInput.toLowerCase()
    let score = 55
    let tip = 'Apne jawab me project metrics (e.g. ₹ saved, % latency, milestones) mention karein.'

    if (text.includes('₹') || text.includes('lakh') || text.includes('%') || text.includes('saved') || text.includes('hours')) {
      score += 25
      tip = 'Great! Numbers aur savings use karne se manager ke paas reject karne ka reason nahi rehta.'
    }
    if (text.includes('roadmap') || text.includes('milestone') || text.includes('lead') || text.includes('deliver')) {
      score += 15
    }
    if (text.includes('unfair') || text.includes('expenses') || text.includes('inflation')) {
      score -= 15
      tip = 'Personal kharche ya emotional baatein mat karein; business value par focus rakhein.'
    }

    score = Math.min(96, Math.max(30, score))
    setPracticeScore({
      score,
      verdict: score >= 80 ? '⭐ Powerful & Professional' : score >= 60 ? '👍 Decent, but can be stronger' : '⚠️ Too emotional / weak leverage',
      tip,
    })
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
      {/* ── 1. Simple Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0B4F9C] dark:text-sky-300 text-xs font-black mb-1 border border-blue-200/50">
            <MessageSquare size={13} />
            <span>{t('features.manager-1on1.sidebar', 'Appraisal 1:1 Assistant')}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('features.manager-1on1.heading', 'Manager 1:1 Negotiation Coach')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t('features.manager-1on1.subtitle', 'Apni situation choose karein aur 1-click me exact script aur logic paayein jo manager ko convince kare.')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'custom'
                ? 'bg-[#0B4F9C] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Sliders size={13} />
            <span>{t('features.manager-1on1.tab_roleplay', 'My Custom Situation')}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preset')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'preset'
                ? 'bg-[#0B4F9C] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <BookOpen size={13} />
            <span>{t('features.manager-1on1.tab_scripts', 'Ready Examples')} ({PRESET_SCENARIOS.length})</span>
          </button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────
          MODE 1: SIMPLE 3-STEP CUSTOM SIMULATOR
      ──────────────────────────────────────────────────────────── */}
      {activeTab === 'custom' && (
        <div className="space-y-6">
          {/* Step Navigation */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { num: 1, title: '1. Detail', desc: 'Salary & Wins' },
              { num: 2, title: '2. Script', desc: 'Kya Bolna Hai' },
              { num: 3, title: '3. Practice', desc: 'AI Score' },
            ].map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setActiveStep(s.num as 1 | 2 | 3)}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  activeStep === s.num
                    ? 'bg-blue-50/80 dark:bg-blue-950/50 border-[#0B4F9C] ring-2 ring-[#0B4F9C]/20 shadow-xs'
                    : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-black text-slate-900 dark:text-white">
                  {s.title}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {s.desc}
                </div>
              </button>
            ))}
          </div>

          {/* STEP 1: INPUTS */}
          {activeStep === 1 && (
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-5 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={currentCtcId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Current CTC (₹ Lakhs per year)
                  </label>
                  <input
                    id={currentCtcId}
                    type="number"
                    value={currentCtc}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      setCurrentCtc(val)
                      setCurrentSalaryLPA(val)
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0B4F9C] outline-none"
                    placeholder={String(currentSalaryLPA)}
                  />
                </div>

                <div>
                  <label htmlFor={targetCtcId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target CTC (₹ Lakhs per year)
                  </label>
                  <input
                    id={targetCtcId}
                    type="number"
                    value={targetCtc}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      setTargetCtc(val)
                      if (currentCtc > 0) {
                        const hike = Math.round(((val - currentCtc) / currentCtc) * 100)
                        setTargetHikePercent(hike)
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0B4F9C] outline-none"
                    placeholder={String(targetSalaryLPA)}
                  />
                </div>
              </div>

              {/* Manager Pushback Type */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Manager ka typical excuse / reaction kya hota hai?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {MANAGER_TYPES.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setManagerType(m.id)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer space-y-1 ${
                        managerType === m.id
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-[#0B4F9C] ring-2 ring-[#0B4F9C]/20'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                        <span>{m.name}</span>
                        {managerType === m.id && <CheckCircle2 size={13} className="text-[#0B4F9C]" />}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {m.tag}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Key Wins */}
              <div>
                <label htmlFor={userWinsId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Aapka sabse bada project achievement (Short me likhein):
                </label>
                <textarea
                  id={userWinsId}
                  rows={2}
                  value={userWins}
                  onChange={(e) => setUserWins(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0B4F9C] outline-none resize-none"
                  placeholder="e.g. Migration complete kiya, 200 tickets automate kiye, latency 40% kam ki."
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-[#0B4F9C] hover:bg-blue-800 text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Script & Strategy Dekhein</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SCRIPT & HARD FINANCIAL LEVERAGE */}
          {activeStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Quick Math Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-blue-500/10 dark:from-emerald-950/40 dark:to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      Aapka Secret Negotiation Math
                    </div>
                    <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                      Company ka New Hire Cost: <span className="text-emerald-600">₹{replaceCost} Lakhs</span> vs Aapka Hike: <span className="text-amber-600">₹{hikeLakhs.toFixed(1)} Lakhs</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Aapko hike dena company ke liye naya banda hire karne se <strong>sasta aur safe</strong> hai.
                    </div>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center shrink-0">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Target Hike</div>
                  <div className="text-sm font-black text-[#0B4F9C] dark:text-sky-300">
                    +{hikePercent}% (₹{targetCtc} LPA)
                  </div>
                </div>
              </div>

              {/* Exact Verbal Script */}
              <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3 shadow-md border border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                      Manager ke Samne Ye Line Boliye:
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(customScript)}
                    className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
                  >
                    {copiedScript ? (
                      <>
                        <Check size={12} className="text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy Script</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-mono bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  {customScript}
                </p>
              </div>

              {/* Tip Banner */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <Zap size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Golden Rule:</strong> Kabhi bhi "Mere kharche badh gaye hain" mat boliye. Hamesha "Maine project me ye bachat ki hai aur aage ye deliver karunga" boliye.
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  ← Edit Inputs
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="px-5 py-2 rounded-xl bg-[#0B4F9C] hover:bg-blue-800 text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Practice & AI Test</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PRACTICE & SCORE */}
          {activeStep === 3 && (
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in duration-150">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-[#0B4F9C]" />
                  <span>Apna Jawab Type Karke Test Karein</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Aap manager ko kya bolne wale hain yahan likhein, AI check karega ki jawab kitna convincing hai.
                </p>
              </div>

              <textarea
                id={userPracticeId}
                rows={3}
                value={practiceInput}
                onChange={(e) => setPracticeInput(e.target.value)}
                placeholder="e.g. Sir, maine is quarter automated tool banaya jis se team ke 500 ghante bache. Market me is role ka standard ₹13L hai, isliye meri request hai..."
                className="w-full p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0B4F9C] outline-none resize-none font-medium"
              />

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  ← Back to Script
                </button>

                <button
                  type="button"
                  onClick={evaluatePractice}
                  disabled={!practiceInput.trim()}
                  className="px-4 py-2 rounded-xl bg-[#0B4F9C] hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send size={13} />
                  <span>Check Score</span>
                </button>
              </div>

              {practiceScore && (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {practiceScore.verdict}
                    </span>
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        practiceScore.score >= 80
                          ? 'bg-emerald-600 text-white'
                          : practiceScore.score >= 60
                          ? 'bg-amber-600 text-white'
                          : 'bg-rose-600 text-white'
                      }`}
                    >
                      Score: {practiceScore.score}/100
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    💡 <strong>Tip:</strong> {practiceScore.tip}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────
          MODE 2: PRESET BENCHMARK SCENARIOS
      ──────────────────────────────────────────────────────────── */}
      {activeTab === 'preset' && (
        <div className="space-y-5">
          {/* Scenario Selector */}
          <div className="flex flex-wrap gap-2">
            {PRESET_SCENARIOS.map((sc, idx) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  setSelectedPresetIdx(idx)
                  setSelectedOptionId(null)
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition cursor-pointer ${
                  selectedPresetIdx === idx
                    ? 'bg-[#0B4F9C] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {sc.title}
              </button>
            ))}
          </div>

          {/* Manager Opening Dialogue */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white space-y-2 border border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
              <UserCheck size={14} />
              <span>Manager's Statement:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 italic font-mono bg-slate-950 p-3 rounded-xl">
              {dynamicPresets[selectedPresetIdx].managerOpening}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            <div className="text-xs font-black uppercase text-slate-500">
              Aapka Jawab Kya Hona Chahiye? (Select to test):
            </div>
            {dynamicPresets[selectedPresetIdx].options.map((opt) => {
              const isSelected = selectedOptionId === opt.id
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOptionId(opt.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer space-y-1.5 ${
                    isSelected
                      ? opt.isBest
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {opt.title}
                    </span>
                    {isSelected && (
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          opt.isBest ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                        }`}
                      >
                        Score: {opt.score}/100
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    "{opt.text}"
                  </p>
                  {isSelected && (
                    <div className="mt-2 p-2.5 rounded-xl bg-white dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 flex items-start gap-1.5">
                      {opt.isBest ? (
                        <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle size={13} className="text-amber-500 shrink-0 mt-0.5" />
                      )}
                      <span>{opt.feedback}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Gold Script */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-slate-800 dark:to-slate-900 border border-blue-200 dark:border-blue-900/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0B4F9C] dark:text-sky-300 flex items-center gap-1.5">
                <TrendingUp size={14} />
                <span>PunarSetu Best Counter-Script</span>
              </span>
              <button
                type="button"
                onClick={() => handleCopy(dynamicPresets[selectedPresetIdx].goldScript)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer shadow-2xs"
              >
                {copiedScript ? 'Copied!' : 'Copy Script'}
              </button>
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 font-mono bg-white/80 dark:bg-slate-950/80 p-3 rounded-xl">
              "{dynamicPresets[selectedPresetIdx].goldScript}"
            </p>
          </div>
        </div>
      )}

      {/* ── Connected Next Steps Footer ── */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="text-slate-600 dark:text-slate-300 font-medium">
          Need to compare alternative external options?
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/features/notice-buyout"
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition flex items-center gap-1.5 shadow-2xs"
          >
            <span>90-Day Notice Buyout</span>
            <ArrowRight size={13} />
          </Link>
          <Link
            to="/features/stay-or-switch"
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 font-bold transition border border-slate-200 dark:border-slate-700"
          >
            <span>Target Hiring Companies</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
