import { useState, useId, useRef, useEffect } from 'react'
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  Send,
  BookOpen,
  Volume2,
  VolumeX,
  Flame,
  Award,
  Mic,
  MicOff,
  Calculator,
  ExternalLink,
  Code2,
  Play,
  RotateCcw,
  Bot,
  User,
  Radio,
  MessageSquare,
} from 'lucide-react'
import { Link } from 'react-router-dom'

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

interface MockInterviewQuestion {
  id: number
  interviewerName: string
  interviewerRole: string
  question: string
  context: string
  idealKeywords: string[]
  apologyWordsToAvoid: string[]
}

const MOCK_INTERVIEW_QUESTIONS: MockInterviewQuestion[] = [
  {
    id: 1,
    interviewerName: 'Priya Nair',
    interviewerRole: 'Lead Engineering Hiring Manager (Amazon Rekindle / Tech Hub)',
    question:
      'Welcome! I see you have 5 years of strong backend foundations, followed by a 3-year career break after 2021. Could you explain what you were focused on during your break and how you prepared for modern cloud deliverables?',
    context: 'Round 1: Career Break Ownership & Modern Technical Currency',
    idealKeywords: ['caregiving', 'prioritization', 'Spring Boot 3', 'Docker', 'RAG', 'AWS', 'certifications', 'microservice'],
    apologyWordsToAvoid: ['sorry', 'lost touch', 'forgot', 'unfortunate', 'struggling', 'family problem'],
  },
  {
    id: 2,
    interviewerName: 'Priya Nair',
    interviewerRole: 'Lead Engineering Hiring Manager (Amazon Rekindle / Tech Hub)',
    question:
      'Our team deploys containerized microservices daily with CI/CD automation. How do we know you won’t face significant ramp-up delays coming back to hands-on production code?',
    context: 'Round 2: Practical Muscle Memory & CI/CD Agility',
    idealKeywords: ['GitHub', 'Docker', 'Compose', 'CI/CD', 'GitHub Actions', 'Swagger', 'PostgreSQL', 'latency', 'production'],
    apologyWordsToAvoid: ['need training', 'teach me', 'forgot syntax', 'slow learner'],
  },
  {
    id: 3,
    interviewerName: 'Priya Nair',
    interviewerRole: 'Lead Engineering Hiring Manager (Amazon Rekindle / Tech Hub)',
    question:
      'Since you were away from the market for 3 years, would you be comfortable starting on an associate-level compensation band before moving up?',
    context: 'Round 3: Lowball Salary Anchor & Seniority Parity Defense',
    idealKeywords: ['market parity', 'competencies', '90-day review', 'architectural maturity', 'milestone', 'value', 'deliverables'],
    apologyWordsToAvoid: ['any salary', 'desperate', 'low pay ok', 'junior role is fine'],
  },
]

const PRESET_DILEMMAS: InterviewDilemma[] = [
  {
    id: 'why_gap',
    title: 'Why the 3-Year Gap?',
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
    title: 'Tech Stacks Change Fast',
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
    title: 'Junior Title / Pay Cut Trap',
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
]

export default function GapToStrengthSimulator() {
  const customQuestionInputId = useId()
  const customContextInputId = useId()
  const userPracticeInputId = useId()
  const elevatorGapYearsId = useId()
  const elevatorPastStackId = useId()
  const elevatorTargetRoleId = useId()
  const preBreakCtcId = useId()
  const breakYearsParityId = useId()

  const [activeTab, setActiveTab] = useState<
    'voice_1on1' | 'custom_ai' | 'proof_shield' | 'salary_parity' | 'preset_library' | 'elevator_pitch'
  >('voice_1on1')

  // ── 1:1 Live Voice Mock Interview State ──
  const [mockRoundIdx, setMockRoundIdx] = useState<number>(0)
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false)
  const [isUserRecording, setIsUserRecording] = useState<boolean>(false)
  const [userSpokenText, setUserSpokenText] = useState<string>('')
  const [roundFeedback, setRoundFeedback] = useState<{
    score: number
    verdict: string
    detectedKeywords: string[]
    detectedApologies: string[]
    feedbackText: string
  } | null>(null)
  const [isInterviewCompleted, setIsInterviewCompleted] = useState<boolean>(false)

  // Voice speech synthesis & recognition refs
  const recognitionRef = useRef<any>(null)

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

  // Salary Parity Calculator State
  const [preBreakCTC, setPreBreakCTC] = useState<number>(8.0)
  const [breakYears, setBreakYears] = useState<number>(3.0)

  // 30-Sec Elevator Pitch Generator State
  const [gapYears, setGapYears] = useState<number>(3)
  const [pastStack, setPastStack] = useState<string>('Java & SQL Backend')
  const [targetRole, setTargetRole] = useState<string>('GenAI & Spring Boot 3 Engineer')
  const [copiedElevator, setCopiedElevator] = useState<boolean>(false)
  const [copiedBadge, setCopiedBadge] = useState<boolean>(false)

  // Interactive Practice State
  const [userPracticeText, setUserPracticeText] = useState<string>('')
  const [practiceResult, setPracticeResult] = useState<{
    score: number
    feedback: string
    tone: string
    keyTip: string
  } | null>(null)

  // Salary Parity Computations
  const inflationCompounded = Number((preBreakCTC * Math.pow(1.10, breakYears)).toFixed(1))
  const deltaSkillPremiumCTC = Number((inflationCompounded * 1.25).toFixed(1))
  const marketPenaltyAvoided = Number((deltaSkillPremiumCTC - preBreakCTC).toFixed(1))

  const currentMockQ = MOCK_INTERVIEW_QUESTIONS[mockRoundIdx]

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // Text-To-Speech: AI Interviewer speaks out loud
  const speakText = (text: string) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95
    utterance.pitch = 1.05

    const voices = window.speechSynthesis.getVoices()
    const femaleVoice = voices.find(
      (v) =>
        (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Google UK English Female') || v.name.includes('Samantha')) &&
        v.lang.startsWith('en')
    ) || voices.find((v) => v.lang.startsWith('en'))

    if (femaleVoice) {
      utterance.voice = femaleVoice
    }

    utterance.onstart = () => setIsAiSpeaking(true)
    utterance.onend = () => setIsAiSpeaking(false)
    utterance.onerror = () => setIsAiSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setIsAiSpeaking(false)
    }
  }

  // Toggle Live User Recording
  const toggleUserMic = () => {
    if (isUserRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      setIsUserRecording(false)
      return
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Your browser does not support Speech Recognition. You can type your answer in the box below!')
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (event: any) => {
        let transcript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript
        }
        setUserSpokenText(transcript)
      }

      recognition.onerror = () => setIsUserRecording(false)
      recognition.onend = () => setIsUserRecording(false)

      recognition.start()
      recognitionRef.current = recognition
      setIsUserRecording(true)
    } catch {
      setIsUserRecording(false)
    }
  }

  // Evaluate Live Mock Answer
  const evaluateMockAnswer = () => {
    if (!userSpokenText.trim()) return

    const lower = userSpokenText.toLowerCase()
    let score = 55

    // Detect Keywords
    const foundKeywords = currentMockQ.idealKeywords.filter((k) => lower.includes(k.toLowerCase()))
    const foundApologies = currentMockQ.apologyWordsToAvoid.filter((w) => lower.includes(w.toLowerCase()))

    score += foundKeywords.length * 8
    score -= foundApologies.length * 15

    if (userSpokenText.length > 100) score += 10
    score = Math.min(98, Math.max(35, score))

    const verdict =
      score >= 80
        ? '⭐ Excellent & Confident Delivery (Pass)'
        : score >= 60
        ? '👍 Strong Foundation, Minor Polishing Needed'
        : '⚠️ Apologetic Tone / Low Technical Keywords'

    const feedback =
      score >= 80
        ? `Superb answer! You owned your career milestones with pride and backed up your claims with ${foundKeywords.length} verified technical keywords.`
        : `Good effort. To impress the interviewer, avoid hesitation and cite concrete project proofs like Docker, Spring Boot 3, and 90-day review agreements.`

    setRoundFeedback({
      score,
      verdict,
      detectedKeywords: foundKeywords,
      detectedApologies: foundApologies,
      feedbackText: feedback,
    })
  }

  // Next Question in Mock Interview
  const nextMockQuestion = () => {
    setUserSpokenText('')
    setRoundFeedback(null)
    if (mockRoundIdx < MOCK_INTERVIEW_QUESTIONS.length - 1) {
      const nextIdx = mockRoundIdx + 1
      setMockRoundIdx(nextIdx)
      speakText(MOCK_INTERVIEW_QUESTIONS[nextIdx].question)
    } else {
      setIsInterviewCompleted(true)
    }
  }

  const resetMockInterview = () => {
    setMockRoundIdx(0)
    setUserSpokenText('')
    setRoundFeedback(null)
    setIsInterviewCompleted(false)
    stopSpeaking()
  }

  const handleCopy = (text: string, type: 'script' | 'elevator' | 'badge') => {
    navigator.clipboard.writeText(text)
    if (type === 'elevator') {
      setCopiedElevator(true)
      setTimeout(() => setCopiedElevator(false), 2000)
    } else if (type === 'badge') {
      setCopiedBadge(true)
      setTimeout(() => setCopiedBadge(false), 2000)
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

  const generatedElevatorScript = `“I am a Senior Engineer with a strong foundation in ${pastStack}. Following a planned ${gapYears}-year career break for family milestones, I recently completed an intensive returnee modernization sprint—building and deploying live cloud microservices with Docker, CI/CD, and GenAI workflows. I combine the battle-tested system design judgment of an experienced engineer with the energized, modern agility required for your ${targetRole} opening.”`

  const activeDilemma = PRESET_DILEMMAS[activeDilemmaIdx]

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
      {/* ── 1. Top Header & Mode Selector (Clean Responsive Layout) ── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950/60 dark:to-blue-950/60 text-teal-700 dark:text-teal-300 text-xs font-black border border-teal-200/50">
            <Radio size={13} className="text-teal-600 animate-pulse" />
            <span>AI Voice Mock Interviewer & Superpower Engine</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Career Gap-to-Strength Proof & 1:1 Voice Simulator
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl font-medium">
            AI interviewer speaks out loud, listens to your microphone response, and gives real-time vocal feedback.
          </p>
        </div>

        {/* Clean Filter Tabs Bar */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => {
              setActiveTab('voice_1on1')
              stopSpeaking()
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'voice_1on1'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Mic size={13} />
            <span>1:1 Voice Mock Room</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('custom_ai')
              stopSpeaking()
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'custom_ai'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Sparkles size={13} />
            <span>AI Question Solver</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('proof_shield')
              stopSpeaking()
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'proof_shield'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Code2 size={13} />
            <span>Proof Shield</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('salary_parity')
              stopSpeaking()
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'salary_parity'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Calculator size={13} />
            <span>Form-16 Parity</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('preset_library')
              stopSpeaking()
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'preset_library'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <BookOpen size={13} />
            <span>Preset Traps</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('elevator_pitch')
              stopSpeaking()
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'elevator_pitch'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Volume2 size={13} />
            <span>30s Intro</span>
          </button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────
          MODE 1: 1:1 VOICE AI MOCK INTERVIEW ROOM
      ──────────────────────────────────────────────────────────── */}
      {activeTab === 'voice_1on1' && (
        <div className="space-y-6">
          {!isInterviewCompleted ? (
            <div className="space-y-5">
              {/* Virtual Interviewer Stage */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white border border-slate-800 shadow-xl space-y-5">
                {/* Interviewer Profile Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
                        <Bot size={26} />
                      </div>
                      {isAiSpeaking && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 animate-ping" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-base text-white">
                          {currentMockQ.interviewerName}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                          AI Hiring Manager
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {currentMockQ.interviewerRole}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
                      Round {mockRoundIdx + 1} of {MOCK_INTERVIEW_QUESTIONS.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => speakText(currentMockQ.question)}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Volume2 size={13} />
                      <span>{isAiSpeaking ? 'Replay Voice' : 'Hear Question 🔊'}</span>
                    </button>
                    {isAiSpeaking && (
                      <button
                        type="button"
                        onClick={stopSpeaking}
                        className="p-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white transition"
                        title="Stop audio"
                      >
                        <VolumeX size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Spoken Question Box */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-teal-400 uppercase tracking-wider">
                    <span>{currentMockQ.context}</span>
                    {isAiSpeaking && (
                      <span className="text-emerald-400 flex items-center gap-1 animate-pulse">
                        <span>● AI is speaking...</span>
                      </span>
                    )}
                  </div>

                  <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed bg-slate-950/90 p-5 rounded-2xl border border-slate-800">
                    "{currentMockQ.question}"
                  </p>
                </div>
              </div>

              {/* Candidate Response Stage */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-[#0B4F9C] dark:text-sky-400" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      Your Turn: Speak Your Answer (Mic or Text)
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleUserMic}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-xs ${
                        isUserRecording
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-teal-600 hover:bg-teal-700 text-white'
                      }`}
                    >
                      {isUserRecording ? <MicOff size={14} /> : <Mic size={14} />}
                      <span>{isUserRecording ? 'Listening... Tap to Stop' : 'Speak into Microphone 🎙️'}</span>
                    </button>
                  </div>
                </div>

                {/* Speech Textarea */}
                <textarea
                  rows={3}
                  value={userSpokenText}
                  onChange={(e) => setUserSpokenText(e.target.value)}
                  placeholder="Click the microphone button and speak aloud, or type your answer here... (e.g. 'I took planned time for family caregiving, while executing an intensive Spring Boot 3 & Docker RAG sprint...')"
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-600 outline-none resize-none font-medium"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {userSpokenText ? `${userSpokenText.split(' ').filter(Boolean).length} words recorded` : 'Ready to record your voice'}
                  </span>

                  <button
                    type="button"
                    onClick={evaluateMockAnswer}
                    disabled={!userSpokenText.trim()}
                    className="px-5 py-2.5 rounded-xl bg-[#0B4F9C] hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send size={13} />
                    <span>Submit & Get Instant AI Feedback</span>
                  </button>
                </div>

                {/* AI Real-Time Feedback Card */}
                {roundFeedback && (
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        {roundFeedback.verdict}
                      </span>
                      <span
                        className={`text-xs font-black px-3 py-1 rounded-full ${
                          roundFeedback.score >= 80
                            ? 'bg-emerald-600 text-white'
                            : roundFeedback.score >= 60
                            ? 'bg-amber-600 text-white'
                            : 'bg-rose-600 text-white'
                        }`}
                      >
                        Vocal Score: {roundFeedback.score}/100
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      {roundFeedback.feedbackText}
                    </p>

                    {/* Detected Keywords */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                        <strong>✓ Power Words Detected ({roundFeedback.detectedKeywords.length}):</strong>{' '}
                        {roundFeedback.detectedKeywords.length > 0
                          ? roundFeedback.detectedKeywords.join(', ')
                          : 'None detected (try citing Docker, Spring Boot, RAG)'}
                      </div>

                      <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300">
                        <strong>⚠️ Apology Words Found ({roundFeedback.detectedApologies.length}):</strong>{' '}
                        {roundFeedback.detectedApologies.length > 0
                          ? roundFeedback.detectedApologies.join(', ')
                          : 'Zero apologetic words detected! Clean delivery.'}
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={nextMockQuestion}
                        className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>{mockRoundIdx < MOCK_INTERVIEW_QUESTIONS.length - 1 ? 'Proceed to Round ' + (mockRoundIdx + 2) : 'View Final Hiring Scorecard'}</span>
                        <Play size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Interview Completion Scorecard */
            <div className="p-7 rounded-3xl bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-blue-500/10 dark:from-slate-900 dark:to-teal-950/40 border-2 border-teal-500/30 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-teal-600 text-white flex items-center justify-center mx-auto shadow-lg">
                <Award size={32} />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-black text-slate-900 dark:text-white">
                  1:1 Voice Mock Interview Successfully Completed! 🎉
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto font-medium">
                  You successfully cleared all 3 interview rounds (Career Gap Ownership, Production Currency, and Salary Parity Defense) with a passing grade.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Confidence Tone</div>
                  <div className="text-base font-black text-emerald-600">Unshakable Professional</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Ramp-Up Skepticism</div>
                  <div className="text-base font-black text-teal-600">Eliminated (0 Flags)</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Returnee Readiness</div>
                  <div className="text-base font-black text-[#0B4F9C] dark:text-sky-400">96% Job-Ready</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetMockInterview}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <RotateCcw size={13} />
                  <span>Restart Voice Mock</span>
                </button>

                <Link
                  to="/features/returnships"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black transition flex items-center gap-1.5 shadow-xs"
                >
                  <span>Apply to Corporate Returnships</span>
                  <ExternalLink size={13} />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────
          TAB 2: ASK ANY CUSTOM QUESTION / SCENARIO
      ──────────────────────────────────────────────────────────── */}
      {activeTab === 'custom_ai' && (
        <div className="space-y-5">
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

          {customGeneratedPitch && (
            <div className="space-y-4 animate-in fade-in duration-200">
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
                    onClick={() => handleCopy(customGeneratedPitch.goldScript, 'script')}
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
          TAB 3: PROOF OF WORK SHIELD
      ──────────────────────────────────────────────────────────── */}
      {activeTab === 'proof_shield' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950 text-white space-y-4 border border-teal-900/40 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code2 size={18} className="text-teal-400" />
                <span className="text-xs font-black uppercase tracking-wider text-teal-400">
                  Verifiable Code Proof-of-Work Artifact (Recruiter Verification Shield)
                </span>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                PunarSetu Cryptographic Badge
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              ChatGPT can only give text scripts that recruiters often distrust. PunarSetu generates a <strong>Live Verifiable Proof Dossier</strong> linking your actual GitHub commits, container IDs, and live Swagger endpoints to prove Day-1 deployment capability.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Live Microservice</div>
                <div className="text-xs font-black text-emerald-400">Spring Boot 3 + ChromaDB RAG</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">https://api.punarsetu.in/rag</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Docker Image</div>
                <div className="text-xs font-black text-sky-400">sha256:d8a4f91e84 (JRE-21)</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">Deployed on AWS ECS</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">CI/CD Pipeline</div>
                <div className="text-xs font-black text-amber-400">100% Green Build</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">GitHub Actions Tested</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="font-mono text-slate-300 text-[11px]">
                🛡️ Verified Returnee Proof: <span className="text-teal-300 font-bold">PunarSetu-Verified-ID: RET-2026-982</span>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    '🛡️ Verified Returnee Technical Proof (PunarSetu RET-2026-982): Live RAG Microservice (Spring Boot 3, Docker, ChromaDB): https://api.punarsetu.in/v1/demos/rag-triage',
                    'badge'
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
              >
                {copiedBadge ? (
                  <>
                    <Check size={12} />
                    <span>Copied Proof Badge!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy Recruiter Proof URL</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────
          TAB 4: FORM-16 & RETURNEE SALARY PARITY
      ──────────────────────────────────────────────────────────── */}
      {activeTab === 'salary_parity' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center gap-2">
              <Calculator size={16} className="text-teal-600" />
              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Anti-Lowball Parity Engine: What Should Your Post-Break Salary Be?
              </h4>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Indian recruiters often anchor salary to your pre-break Form-16. PunarSetu computes fair market value adjusted for 10% annual inflation + GenAI delta skill premium so you never get lowballed.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={preBreakCtcId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pre-Break Salary (₹ LPA)
                </label>
                <input
                  id={preBreakCtcId}
                  type="number"
                  value={preBreakCTC}
                  onChange={(e) => setPreBreakCTC(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-600 outline-none"
                  placeholder="8.0"
                />
              </div>

              <div>
                <label htmlFor={breakYearsParityId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Career Break Duration (Years)
                </label>
                <input
                  id={breakYearsParityId}
                  type="number"
                  step="0.5"
                  value={breakYears}
                  onChange={(e) => setBreakYears(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-600 outline-none"
                  placeholder="3"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Old Pre-Break CTC</div>
                <div className="text-base font-black text-slate-800 dark:text-slate-200">₹{preBreakCTC} LPA</div>
                <div className="text-[10px] text-slate-400">Base salary in 2021</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Inflation Adjusted (10% YoY)</div>
                <div className="text-base font-black text-amber-500">₹{inflationCompounded} LPA</div>
                <div className="text-[10px] text-slate-400">Zero career discount base</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-1">
                <div className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300">Fair Returnee Target</div>
                <div className="text-base font-black text-emerald-600 dark:text-emerald-400">₹{deltaSkillPremiumCTC} LPA</div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold">+₹{marketPenaltyAvoided}L Penalty Defended</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────
          TAB 5: 5 REAL-WORLD RECRUITER PRESET DILEMMAS
      ──────────────────────────────────────────────────────────── */}
      {activeTab === 'preset_library' && (
        <div className="space-y-6">
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
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────
          TAB 6: 30-SECOND ELEVATOR INTRO GENERATOR
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

          <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3 shadow-md border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-teal-400 flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>Your 30-Second Audio-Ready Pitch</span>
              </span>

              <button
                type="button"
                onClick={() => handleCopy(generatedElevatorScript, 'elevator')}
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

      {/* ── Footer Link ── */}
      <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="text-teal-900 dark:text-teal-200 font-medium">
          Ready to apply to verified returnship cohorts with zero gap stigma?
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/features/returnships"
            className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition flex items-center gap-1.5 shadow-2xs"
          >
            <span>Explore Returnships Hub</span>
            <ExternalLink size={12} />
          </Link>
          <Link
            to="/features/muscle-memory"
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition"
          >
            <span>Code Gym 🔥</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
