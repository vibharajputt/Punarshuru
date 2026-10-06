import { useState, useId } from 'react'
import {
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  Send,
  BookOpen,
  Volume2,
  Flame,
  Award,
} from 'lucide-react'

interface InterviewDilemma {
  id: string
  title: string
  question: string
  interviewerTone: string
  context: string
  hiddenConcern: string
  options: {
    id: string
    title: string
    script: string
    verdict: 'flawed' | 'average' | 'gold'
    score: number
    critique: string
  }[]
  goldScript: string
  proofAnchor: string
}

const PRESET_DILEMMAS: InterviewDilemma[] = [
  {
    id: 'why_gap',
    title: 'The "Why the 3-Year Gap?" Question',
    question: '"I see a 3-year gap on your resume after 2021. Why did you take this break, and what have you been doing since?"',
    interviewerTone: 'Skeptical / Assessing Tech Currency',
    context: 'The classic opening interview question designed to test if you feel defensive or apologetic about your career break.',
    hiddenConcern: 'Did they lose motivation or technical touch during time away?',
    options: [
      {
        id: 'opt-1-1',
        title: '❌ Apologetic & Defensive (Trap)',
        script:
          '"I had family and childcare responsibilities so I had to quit my job. It was hard to keep up with tech during that time, but now my kids are older so I want to try working again."',
        verdict: 'flawed',
        score: 30,
        critique:
          'Sounds apologetic and explicitly admits losing touch with technology, triggering concerns about long ramp-up time.',
      },
      {
        id: 'opt-1-2',
        title: '⚠️ Brief & Minimalist',
        script:
          '"I took time off for personal family reasons. Now I am back and ready to work full-time again."',
        verdict: 'average',
        score: 60,
        critique:
          'Answers the personal question politely, but fails to showcase proactive learning or modernized technical skills.',
      },
      {
        id: 'opt-1-3',
        title: '⭐ The PunarSetu "Pivot-to-Currency" Gold Pitch',
        script:
          '"I deliberately stepped back for 2 years for dedicated family caregiving — a milestone I am deeply proud of that strengthened my prioritization and time management. In parallel over the past 4 months, I executed an intensive returnee upskilling sprint: modernizing my Java foundation into Spring Boot 3, building a live LangChain RAG document search microservice deployed with Docker on AWS, and completing NPTEL cloud certifications. I am entering this role with refreshed technical energy and zero legacy inertia."',
        verdict: 'gold',
        score: 98,
        critique:
          'Masterclass! Owns the break with pride in 1 sentence, immediately pivots to recent modern proof of work (Spring Boot 3, RAG, Docker), and frames fresh mindset as an asset.',
      },
    ],
    goldScript:
      'I took a planned career break for dedicated family caregiving. Over the past 4 months, I executed an intensive modernization sprint: refreshing my Java foundations into Spring Boot 3, containerizing services with Docker, and deploying a live LangChain RAG search microservice on AWS. I bring deep architectural maturity combined with modern full-stack skills and complete readiness to deliver from Day 1.',
    proofAnchor: 'Point interviewer to your live Docker container and Swagger API docs on GitHub.',
  },
  {
    id: 'tech_pace',
    title: 'The "Tech Stacks Change Fast" Agility Challenge',
    question: '"Tech stacks change every 6 months. How do we know you will not struggle to ramp up on our modern cloud pipelines?"',
    interviewerTone: 'Challenging / Assessing Agility',
    context: 'Assessing whether you have hands-on practical muscle memory vs just theoretical book knowledge.',
    hiddenConcern: 'Will our senior engineers spend months training this candidate from scratch?',
    options: [
      {
        id: 'opt-2-1',
        title: '❌ Relying Solely on Past Experience',
        script:
          '"I have 5 years of experience before my break, so I am very smart and will learn your tools quickly once you train me."',
        verdict: 'flawed',
        score: 40,
        critique:
          'Companies hire to solve problems immediately; asking for extensive on-job training raises hiring hesitation.',
      },
      {
        id: 'opt-2-2',
        title: '⭐ Showcasing Verifiable Proof-of-Work (Gold Standard)',
        script:
          '"That is a very fair question. To ensure zero ramp-up delay, I did not just watch tutorials — I built and deployed an end-to-end cloud microservice on GitHub with CI/CD GitHub Actions, PostgreSQL indexing, and Docker Compose. My prior 5 years gave me deep system design intuition, while my recent sprint proved I can master modern frameworks in under 3 weeks. You can inspect my live Swagger API docs today."',
        verdict: 'gold',
        score: 96,
        critique:
          'Unbeatable! Directly points interviewer to verifiable live code artifacts (Docker, CI/CD, Swagger), proving rapid learning velocity.',
      },
    ],
    goldScript:
      'That is an understandable concern. To eliminate any ramp-up friction, I built and deployed a production-ready microservice on GitHub featuring Docker Compose, GitHub Actions CI/CD, and PostgreSQL indexing. My core engineering intuition remains sharp, and my recent builds prove I adapt to modern cloud tooling in days, not months.',
    proofAnchor: 'Demo your GitHub Actions CI/CD automated build badges.',
  },
  {
    id: 'salary_lowball',
    title: 'The "Will You Accept a Junior Title / Pay Cut?" Trap',
    question: '"Since you have been out of the market for 3 years, are you willing to join at a lower compensation band or associate title to re-prove yourself?"',
    interviewerTone: 'Negotiation Anchor / Cost Cutting',
    context: 'Recruiter testing if you lack confidence and will accept a below-market lowball offer.',
    hiddenConcern: 'Testing candidate self-worth and market awareness.',
    options: [
      {
        id: 'opt-3-1',
        title: '❌ Desperate Acceptance',
        script:
          '"Yes, since I took a break I am willing to take any salary or junior designation just to get my foot back in the door."',
        verdict: 'flawed',
        score: 30,
        critique: 'Sets you up for years of compounded underpayment and career demotion.',
      },
      {
        id: 'opt-3-2',
        title: '⭐ Parity Defense with 90-Day Review (Gold Standard)',
        script:
          '"I appreciate the need to ensure performance consistency. However, my foundational engineering experience combined with my recent deployment of cloud-native GenAI microservices matches standard Mid-Senior Band competencies today. I am targeting fair market parity for this technical scope (₹14-16 LPA), and I welcome tying formal retention milestones to my first 90-day delivery review."',
        verdict: 'gold',
        score: 95,
        critique: 'Polite, firm, and replaces a permanent salary penalty with an objective 90-day review agreement.',
      },
    ],
    goldScript:
      'I appreciate the need for performance consistency. Given that my core systems background and recent cloud implementations match full Mid-Senior competencies, I am targeting standard market parity of ₹14–16 LPA. I am confident in my Day-1 delivery and welcome setting objective 90-day milestone deliverables.',
    proofAnchor: 'Cite current market compensation parity for modern cloud developers.',
  },
  {
    id: 'workload_reliability',
    title: 'The "Can You Handle Long Hours & Sprints?" Question',
    question: '"Our team works on fast-paced sprint release cycles with occasional evening support. How will you manage this with personal responsibilities?"',
    interviewerTone: 'Operational / Assessing Reliability',
    context: 'Recruiter subtly probing for absenteeism or lack of commitment due to family duties.',
    hiddenConcern: 'Will this candidate log off abruptly during production incidents or sprint crunches?',
    options: [
      {
        id: 'opt-4-1',
        title: '❌ Over-promising 24/7 Availability',
        script:
          '"I have zero responsibilities now. I will work 14 hours every single day and on weekends whenever you ask."',
        verdict: 'flawed',
        score: 45,
        critique: 'Sounds unrealistic and raises long-term burnout or reliability flags.',
      },
      {
        id: 'opt-4-2',
        title: '⭐ Structured Reliability & Time-Blocking (Gold Standard)',
        script:
          '"I have established complete, dedicated family support systems precisely so I can focus 100% on professional delivery. In my previous roles, I managed on-call rotations and critical release sprints with 99.8% SLA adherence. My career break actually reinforced my asynchronous communication, strict prioritization, and deep-focus discipline."',
        verdict: 'gold',
        score: 97,
        critique: 'Demonstrates professional maturity, dedicated support infrastructure, and past track record of sprint delivery.',
      },
    ],
    goldScript:
      'I have established dedicated support systems specifically to ensure full focus on professional deliverables. In my prior 5 years, I consistently managed high-stakes on-call rotations and sprint deadlines. My time away further honed my prioritization, async communication, and focus under pressure.',
    proofAnchor: 'Mention your prior experience with on-call P1/P2 production support rotations.',
  },
  {
    id: 'legacy_vs_fresher',
    title: 'The "Why Hire You Over Fresh College Grads?" Question',
    question: '"Your older background was in monolithic systems. Why should we hire a returner instead of fresh CS graduates who learned modern Python and AI in college?"',
    interviewerTone: 'Competitive / Assessing ROI',
    context: 'Assessing what seasoned value you bring that freshers cannot provide.',
    hiddenConcern: 'Is a returner more expensive than a fresher for the same technical output?',
    options: [
      {
        id: 'opt-5-1',
        title: '❌ Dismissing Freshers Emotionally',
        script:
          '"Freshers know nothing about real life. I have more life experience so I am naturally better."',
        verdict: 'flawed',
        score: 35,
        critique: 'Arrogant tone without addressing the technical comparison constructively.',
      },
      {
        id: 'opt-5-2',
        title: '⭐ Architectural Maturity + Modern Agility (Gold Standard)',
        script:
          '"Fresh graduates bring great enthusiasm, but what I bring is high-stakes production judgment: understanding edge cases, debugging complex concurrency race conditions, designing resilient database schemas, and stakeholder communication developed over years of real client deliveries. Combined with my modern Spring Boot 3 and LangChain RAG certifications, you get zero-drama architectural maturity from Day 1."',
        verdict: 'gold',
        score: 99,
        critique: 'Unbeatable value proposition! Highlights production battle scars, debugging intuition, and reliability that freshers take 3+ years to develop.',
      },
    ],
    goldScript:
      'Fresh graduates have enthusiasm, but I offer seasoned production judgment: debugging complex concurrency, designing scalable databases, and managing client expectations under pressure. Combined with my modern GenAI and cloud skills, you receive architectural maturity with zero ramp-up drama.',
    proofAnchor: 'Highlight complex real-world outages or database deadlocks you resolved in past roles.',
  },
]

export default function GapToStrengthSimulator() {
  const customQuestionInputId = useId()
  const customContextInputId = useId()
  const userPracticeInputId = useId()
  const elevatorGapYearsId = useId()
  const elevatorPastStackId = useId()
  const elevatorTargetRoleId = useId()

  const [activeTab, setActiveTab] = useState<'custom_ai' | 'preset_library' | 'elevator_pitch'>('custom_ai')

  // Preset State
  const [activeDilemmaIdx, setActiveDilemmaIdx] = useState<number>(0)
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null)
  const [copiedScript, setCopiedScript] = useState<boolean>(false)

  // Custom AI Reframer State
  const [customQuestion, setCustomQuestion] = useState<string>(
    'Why should we offer you a full market package when you have not worked for the past 3 years?'
  )
  const [customGapReason, setCustomGapReason] = useState<string>('Family caregiving & maternity')
  const [customGeneratedPitch, setCustomGeneratedPitch] = useState<{
    hiddenConcern: string
    trapAvoid: string
    goldScript: string
    proofAnchor: string
  } | null>({
    hiddenConcern: 'Recruiter is testing if candidate lacks market awareness and will accept an underpaid lowball offer.',
    trapAvoid: 'Never say: "I am willing to work for low salary because I have a gap." This cements permanent underpayment.',
    goldScript:
      '“I understand compensation guidelines exist to reflect active market recency. However, over the past 4 months, I refreshed my backend architecture into modern Spring Boot 3, deployed a containerized ChromaDB search microservice on AWS, and completed advanced cloud certifications. My prior 5 years give me seasoned system design maturity, while my recent PoCs prove Day-1 currency. Therefore, I am targeting fair market parity for this technical scope (₹14–16 LPA).”',
    proofAnchor: 'Show live Swagger API docs and GitHub commit history during interview.',
  })

  // 30-Sec Elevator Pitch Generator State
  const [gapYears, setGapYears] = useState<number>(3)
  const [pastStack, setPastStack] = useState<string>('Java & SQL Backend')
  const [targetRole, setTargetRole] = useState<string>('GenAI & Spring Boot 3 Engineer')
  const [copiedElevator, setCopiedElevator] = useState<boolean>(false)

  // Interactive Practice State
  const [userPracticeText, setUserPracticeText] = useState<string>('')
  const [practiceResult, setPracticeResult] = useState<{
    score: number
    feedback: string
    tone: string
    keyTip: string
  } | null>(null)

  const handleCopy = (text: string, isElevator = false) => {
    navigator.clipboard.writeText(text)
    if (isElevator) {
      setCopiedElevator(true)
      setTimeout(() => setCopiedElevator(false), 2000)
    } else {
      setCopiedScript(true)
      setTimeout(() => setCopiedScript(false), 2000)
    }
  }

  // Custom AI Generator Function
  const generateCustomAnswer = () => {
    if (!customQuestion.trim()) return

    const q = customQuestion.toLowerCase()
    let concern = 'Assessing candidate technical agility, ramp-up time, and self-confidence.'
    let trap = 'Never sound apologetic or overly defensive about your break.'
    let proof = 'Point directly to your deployed GitHub microservices or Docker containers.'

    if (q.includes('salary') || q.includes('cut') || q.includes('package') || q.includes('lpa')) {
      concern = 'Recruiter testing if you will accept a lowball offer due to perceived career break weakness.'
      trap = 'Do not accept junior titles or pay cuts immediately without demanding an objective 90-day review.'
      proof = 'Cite current metro market standards for your target role.'
    } else if (q.includes('kid') || q.includes('child') || q.includes('hours') || q.includes('overtime') || q.includes('family')) {
      concern = 'Recruiter assessing operational reliability and risk of sudden unplanned absences.'
      trap = 'Do not get emotional or overpromise 16-hour workdays. Focus on structured time-blocking and support systems.'
      proof = 'Cite past P1 on-call rotation track record and async communication discipline.'
    } else if (q.includes('freelance') || q.includes('idle') || q.includes('doing nothing')) {
      concern = 'Assessing whether you were actively self-learning or disconnected entirely.'
      trap = 'Do not claim you were coding 8 hours every day during caregiving if you were not.'
      proof = 'Emphasize your dedicated 3-4 month intensive sprint before re-entering the market.'
    }

    const script = `“I deliberately took time for ${customGapReason || 'planned personal caregiving'}—a milestone that strengthened my prioritization and focus. Over the past 4 months, I executed a dedicated returnee modernization sprint, refreshing my core engineering foundation into modern cloud frameworks, building live containerized PoCs on GitHub, and earning industry certifications. Combined with my prior engineering depth, I bring proven architectural judgment and refreshed technical passion with zero ramp-up delay.”`

    setCustomGeneratedPitch({
      hiddenConcern: concern,
      trapAvoid: trap,
      goldScript: script,
      proofAnchor: proof,
    })
  }

  // Evaluate Practice Response
  const evaluateUserPractice = () => {
    if (!userPracticeText.trim()) return
    const text = userPracticeText.toLowerCase()
    let score = 55
    const tips: string[] = []

    if (text.includes('docker') || text.includes('spring') || text.includes('github') || text.includes('poc') || text.includes('rag') || text.includes('certif')) {
      score += 25
      tips.push('Excellent! Citing verifiable modern projects destroys ramp-up skepticism.')
    } else {
      score -= 10
      tips.push('Include names of your recent projects or modern frameworks (e.g. Spring Boot 3, Docker, GenAI PoC).')
    }

    if (text.includes('sorry') || text.includes('unfortunate') || text.includes('lost touch') || text.includes('forgot')) {
      score -= 20
      tips.push('Remove apologetic words like "sorry" or "lost touch". Frame your break with confidence.')
    }

    if (text.includes('prioritization') || text.includes('maturity') || text.includes('system design') || text.includes('reliability')) {
      score += 15
      tips.push('Great framing linking past experience to seasoned judgment!')
    }

    score = Math.min(98, Math.max(30, score))

    setPracticeResult({
      score,
      tone: score >= 80 ? '⭐ Gold Standard / High Confidence' : score >= 60 ? '👍 Good, but needs project proofs' : '⚠️ Too apologetic / defensive',
      feedback:
        score >= 80
          ? 'Exceptional framing! You owned the break with confidence and seamlessly pivoted to recent modern technical currency.'
          : 'Decent attempt. Strengthen your answer by mentioning recent deployed code artifacts and avoiding self-doubt.',
      keyTip: tips.join(' '),
    })
  }

  // 30-Sec Elevator Pitch Formula
  const generatedElevatorScript = `“I am a Senior Engineer with a strong foundation in ${pastStack}. Following a planned ${gapYears}-year career break for family milestones, I recently completed an intensive returnee modernization sprint—building and deploying live cloud microservices with Docker, CI/CD, and GenAI workflows. I combine the battle-tested system design judgment of an experienced engineer with the energized, modern agility required for your ${targetRole} opening.”`

  const activeDilemma = PRESET_DILEMMAS[activeDilemmaIdx]

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
      {/* ── 1. Top Header & Mode Selector ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950/60 dark:to-blue-950/60 text-teal-700 dark:text-teal-300 text-xs font-black mb-1.5 border border-teal-200/50">
            <MessageSquare size={13} className="text-teal-600" />
            <span>AI Interview Confidence Coach</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Career Gap-to-Strength AI Reframing Coach
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            Transform any tricky recruiter question into proof of resilience, agility, and modern technical currency. Ask any custom question or practice real-world recruiter traps.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('custom_ai')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'custom_ai'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Sparkles size={13} />
            <span>Ask Any Custom Question</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preset_library')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'preset_library'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <BookOpen size={13} />
            <span>5 Recruiter Dilemmas</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('elevator_pitch')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'elevator_pitch'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Volume2 size={13} />
            <span>30-Sec Elevator Intro</span>
          </button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────
          MODE 1: ASK ANY CUSTOM QUESTION / SCENARIO
      ──────────────────────────────────────────────────────────── */}
      {activeTab === 'custom_ai' && (
        <div className="space-y-5">
          {/* Custom Question Builder */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-teal-600 dark:text-teal-400" />
              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Type Any Difficult Recruiter Question or Trap:
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label htmlFor={customQuestionInputId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Recruiter's Question / Doubt:
                </label>
                <input
                  id={customQuestionInputId}
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder="e.g. Will you take a 20% pay cut because of your break? Or how will you manage late shifts?"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-600 outline-none"
                />
              </div>

              <div>
                <label htmlFor={customContextInputId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Primary Break Reason:
                </label>
                <input
                  id={customContextInputId}
                  type="text"
                  value={customGapReason}
                  onChange={(e) => setCustomGapReason(e.target.value)}
                  placeholder="e.g. Maternity / Family Care / Health"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-600 outline-none"
                />
              </div>
            </div>

            {/* Quick Inspiration Pills */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400">Quick Test Questions:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Why did you not freelance or work part-time during your gap?',
                  'How do we know you will not quit again after 6 months?',
                  'Why should we hire you over young freshers who know Python?',
                  'Are you comfortable reporting to a tech lead 5 years younger than you?',
                ].map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCustomQuestion(q)
                      setTimeout(generateCustomAnswer, 50)
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={generateCustomAnswer}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Sparkles size={13} />
                <span>Generate Gold Reframe Script</span>
              </button>
            </div>
          </div>

          {/* Generated Result Card */}
          {customGeneratedPitch && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Recruiter Psychology Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                    <AlertCircle size={14} />
                    <span>Recruiter's Hidden Concern:</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {customGeneratedPitch.hiddenConcern}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-300">
                    <Flame size={14} />
                    <span>Fatal Trap to Avoid:</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {customGeneratedPitch.trapAvoid}
                  </p>
                </div>
              </div>

              {/* Gold Script Box */}
              <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3 shadow-md border border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-teal-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-teal-400">
                      PunarSetu Gold "Pivot-to-Currency" Verbal Script
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(customGeneratedPitch.goldScript)}
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
                  {customGeneratedPitch.goldScript}
                </p>

                <div className="p-2.5 rounded-xl bg-teal-950/50 border border-teal-800/60 text-xs text-teal-200 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-teal-400 shrink-0" />
                  <span><strong>Proof Anchor:</strong> {customGeneratedPitch.proofAnchor}</span>
                </div>
              </div>

              {/* Practice Response Box */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-dashed border-teal-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                    <MessageSquare size={13} className="text-teal-600" />
                    <span>Practice Speaking / Typing Your Response:</span>
                  </h5>
                  <span className="text-[10px] text-slate-400 font-medium">AI Feedback Engine</span>
                </div>

                <textarea
                  id={userPracticeInputId}
                  rows={2}
                  value={userPracticeText}
                  onChange={(e) => setUserPracticeText(e.target.value)}
                  placeholder="Type how you would naturally answer this in an interview to get instant scoring..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-600 outline-none resize-none font-medium"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={evaluateUserPractice}
                    disabled={!userPracticeText.trim()}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send size={12} />
                    <span>Score My Response</span>
                  </button>
                </div>

                {practiceResult && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 animate-in fade-in duration-150 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {practiceResult.tone}
                      </span>
                      <span
                        className={`font-black px-2 py-0.5 rounded-full ${
                          practiceResult.score >= 80
                            ? 'bg-emerald-600 text-white'
                            : practiceResult.score >= 60
                            ? 'bg-amber-600 text-white'
                            : 'bg-rose-600 text-white'
                        }`}
                      >
                        Score: {practiceResult.score}/100
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 font-medium">
                      {practiceResult.feedback}
                    </p>
                    <div className="text-[11px] text-teal-700 dark:text-teal-300 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                      <strong>Tactical Improvement:</strong> {practiceResult.keyTip}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────
          MODE 2: 5 REAL-WORLD RECRUITER PRESET DILEMMAS
      ──────────────────────────────────────────────────────────── */}
      {activeTab === 'preset_library' && (
        <div className="space-y-6">
          {/* Question Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {PRESET_DILEMMAS.map((d, i) => (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  setActiveDilemmaIdx(i)
                  setSelectedOptId(null)
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeDilemmaIdx === i
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>Q{i + 1}: {d.title}</span>
              </button>
            ))}
          </div>

          {/* Question Card */}
          <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3 shadow-md border border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 size={16} className="text-amber-400" />
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                  {activeDilemma.interviewerTone}
                </span>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                High-Stakes Recruiter Question
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 italic font-mono leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
              {activeDilemma.question}
            </p>

            <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
              <AlertCircle size={13} className="text-amber-400 shrink-0" />
              <span><strong>Hidden Concern:</strong> {activeDilemma.hiddenConcern}</span>
            </div>
          </div>

          {/* Interactive Response Options */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Compare Response Approaches:
            </h4>

            <div className="grid grid-cols-1 gap-3">
              {activeDilemma.options.map((opt) => {
                const isSelected = selectedOptId === opt.id
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedOptId(opt.id)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? opt.verdict === 'gold'
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/20'
                        : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        {opt.title}
                      </span>
                      {isSelected && (
                        <span
                          className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                            opt.verdict === 'gold' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                          }`}
                        >
                          Score: {opt.score}/100
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      "{opt.script}"
                    </p>

                    {isSelected && (
                      <div className="mt-2 p-3 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 flex items-start gap-1.5">
                        {opt.verdict === 'gold' ? (
                          <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                        )}
                        <span>{opt.critique}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Gold Standard Script Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-teal-50 to-blue-50 dark:from-slate-800 dark:to-teal-950/40 border border-teal-200 dark:border-teal-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                <Award size={14} />
                <span>PunarSetu Gold Counter-Script</span>
              </span>
              <button
                type="button"
                onClick={() => handleCopy(activeDilemma.goldScript)}
                className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-slate-200 dark:border-slate-700 shadow-2xs"
              >
                {copiedScript ? 'Copied!' : 'Copy Script'}
              </button>
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 font-mono bg-white/90 dark:bg-slate-950/80 p-3.5 rounded-xl border border-teal-200/60 dark:border-slate-800 leading-relaxed">
              "{activeDilemma.goldScript}"
            </p>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────
          MODE 3: 30-SECOND ELEVATOR INTRO GENERATOR
      ──────────────────────────────────────────────────────────── */}
      {activeTab === 'elevator_pitch' && (
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-5 animate-in fade-in duration-150">
          <div>
            <div className="flex items-center gap-2">
              <Volume2 size={16} className="text-teal-600" />
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                Preemptive 30-Second Interview Opener ("Tell Me About Yourself")
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Say this in the first 60 seconds of your interview to dissolve career gap bias before the interviewer even asks about it!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor={elevatorGapYearsId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Career Break Duration (Years)
              </label>
              <input
                id={elevatorGapYearsId}
                type="number"
                step="0.5"
                value={gapYears}
                onChange={(e) => setGapYears(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-600 outline-none"
              />
            </div>

            <div>
              <label htmlFor={elevatorPastStackId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Past Core Foundation
              </label>
              <input
                id={elevatorPastStackId}
                type="text"
                value={pastStack}
                onChange={(e) => setPastStack(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-600 outline-none"
                placeholder="e.g. Java & SQL Backend"
              />
            </div>

            <div>
              <label htmlFor={elevatorTargetRoleId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Re-Entry Role
              </label>
              <input
                id={elevatorTargetRoleId}
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-600 outline-none"
                placeholder="e.g. GenAI Engineer"
              />
            </div>
          </div>

          {/* Generated Elevator Script */}
          <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3 shadow-md border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-teal-400 flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>Your 30-Second Audio-Ready Pitch</span>
              </span>

              <button
                type="button"
                onClick={() => handleCopy(generatedElevatorScript, true)}
                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
              >
                {copiedElevator ? (
                  <>
                    <Check size={12} className="text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy 30-Sec Pitch</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-mono bg-slate-950 p-4 rounded-2xl border border-slate-800">
              {generatedElevatorScript}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
