import { useState } from 'react'
import {
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  Volume2,
} from 'lucide-react'

interface InterviewDilemma {
  id: string
  question: string
  interviewerTone: string
  context: string
  options: {
    id: string
    title: string
    script: string
    verdict: 'flawed' | 'average' | 'gold'
    score: number
    critique: string
  }[]
  goldScript: string
}

const DILEMMAS: InterviewDilemma[] = [
  {
    id: 'why_gap',
    question: '"I see a 3-year gap on your resume after 2021. Why did you take this break, and what have you been doing since?"',
    interviewerTone: 'Skeptical / Assessing Tech Currency',
    context: 'The classic opening interview question designed to test if you feel defensive about your career break.',
    options: [
      {
        id: 'opt-1-1',
        title: 'Apologetic & Defensive (Trap)',
        script:
          '"I had family and childcare responsibilities so I had to quit my job. It was hard to keep up with tech during that time, but now my kids are older so I want to try working again."',
        verdict: 'flawed',
        score: 30,
        critique:
          'Sounds apologetic and explicitly admits losing touch with technology, triggering concerns about long ramp-up time.',
      },
      {
        id: 'opt-1-2',
        title: 'Brief & Minimalist',
        script:
          '"I took time off for personal family reasons. Now I am back and ready to work full-time again."',
        verdict: 'average',
        score: 60,
        critique:
          'Answers the personal question politely, but fails to showcase proactive learning or modernized technical skills.',
      },
      {
        id: 'opt-1-3',
        title: 'The PunarSetu "Pivot-to-Currency" Gold Pitch',
        script:
          '"I deliberately stepped back for 2 years for dedicated family caregiving — a milestone I am deeply proud of that strengthened my prioritization and time management. In parallel over the past 4 months, I executed an intensive returnee upskilling sprint: modernizing my Java foundation into Spring Boot 3, building a live LangChain RAG document search microservice deployed with Docker on AWS, and completing NPTEL cloud certifications. I am entering this role with refreshed technical energy and zero legacy inertia."',
        verdict: 'gold',
        score: 98,
        critique:
          'Masterclass! Owns the break with pride in 1 sentence, immediately pivots to recent modern proof of work (Spring Boot 3, RAG, Docker), and frames fresh mindset as an asset.',
      },
    ],
    goldScript:
      'I took a planned career break for family caregiving. Over the past 4 months, I executed a focused modernization sprint: refreshing my Java foundations into Spring Boot 3, containerizing services with Docker, and building a live RAG search microservice on AWS. I come with strong architectural maturity combined with modern full-stack skills and complete readiness to deliver from Day 1.',
  },
  {
    id: 'tech_pace',
    question: '"Tech stacks change every 6 months. How do we know you will not struggle to ramp up on our modern cloud pipelines?"',
    interviewerTone: 'Challenging / Assessing Agility',
    context: 'Assessing whether you have hands-on practical muscle memory vs just theoretical book knowledge.',
    options: [
      {
        id: 'opt-2-1',
        title: 'Relying Solely on Past Experience',
        script:
          '"I have 5 years of experience before my break, so I am very smart and will learn your tools quickly once you train me."',
        verdict: 'flawed',
        score: 40,
        critique:
          'Companies hire to solve problems immediately; asking for extensive on-job training raises hiring hesitation.',
      },
      {
        id: 'opt-2-2',
        title: 'Showcasing Verifiable Proof-of-Work (Gold Standard)',
        script:
          '"That is a very fair question. To ensure zero ramp-up delay, I did not just watch tutorials — I built and deployed an end-to-end cloud microservice on GitHub with CI/CD GitHub Actions, PostgreSQL indexing, and Docker Compose. My prior 5 years gave me deep system design intuition, while my recent sprint proved I can master modern frameworks in under 3 weeks. You can inspect my live Swagger API docs today."',
        verdict: 'gold',
        score: 96,
        critique:
          'Unbeatable! Directly points interviewer to verifiable live code artifacts (Docker, CI/CD, Swagger), proving rapid learning velocity.',
      },
    ],
    goldScript:
      'That is an understandable concern. To eliminate any ramp-up friction, I built and deployed a production-ready microservice on GitHub featuring Docker Compose, GitHub Actions CI/CD, and PostgreSQL indexing. My core engineering intuition remains as sharp as ever, and my recent builds prove I adapt to modern cloud tooling in days, not months.',
  },
]

export default function GapToStrengthSimulator() {
  const [activeDilemmaIdx, setActiveDilemmaIdx] = useState<number>(0)
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null)
  const [copiedScript, setCopiedScript] = useState<boolean>(false)

  const dilemma = DILEMMAS[activeDilemmaIdx]

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedScript(true)
    setTimeout(() => setCopiedScript(false), 2500)
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-7">
      {/* ── 1. Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950/60 dark:to-blue-950/60 text-teal-700 dark:text-teal-300 text-xs font-black mb-1.5 border border-teal-200/50">
            <MessageSquare size={13} className="text-teal-600" />
            <span>AI Interview Confidence Coach</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Career Gap-to-Strength Interview Simulator
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            Never feel nervous about the "gap question" again. Practice gold-standard framing that transforms time away into proof of resilience, agility, and fresh technical passion.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {DILEMMAS.map((d, i) => (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                setActiveDilemmaIdx(i)
                setSelectedOptId(null)
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition cursor-pointer ${
                activeDilemmaIdx === i
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Question {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* ── 2. The Interviewer Question Box ── */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3 shadow-md border border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 size={16} className="text-teal-400" />
            <span className="text-xs font-black uppercase tracking-wider text-teal-400">
              Interviewer Prompt ({dilemma.interviewerTone})
            </span>
          </div>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
            High-Stakes Screen
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-100 italic font-medium leading-relaxed bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
          {dilemma.question}
        </p>
      </div>

      {/* ── 3. Strategy Options ── */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Sparkles size={13} className="text-[#F26B1D]" />
          <span>Select How You Would Respond:</span>
        </h4>

        <div className="grid grid-cols-1 gap-3">
          {dilemma.options.map((opt) => {
            const isSelected = selectedOptId === opt.id
            return (
              <div
                key={opt.id}
                onClick={() => setSelectedOptId(opt.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? opt.verdict === 'gold'
                      ? 'bg-teal-50/70 dark:bg-teal-950/40 border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                      : opt.verdict === 'average'
                      ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                      : 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/20 shadow-xs'
                    : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        opt.verdict === 'gold'
                          ? 'bg-teal-500'
                          : opt.verdict === 'average'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                    />
                    <span>{opt.title}</span>
                  </span>

                  {isSelected && (
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        opt.verdict === 'gold'
                          ? 'bg-teal-600 text-white'
                          : opt.verdict === 'average'
                          ? 'bg-amber-600 text-white'
                          : 'bg-rose-600 text-white'
                      }`}
                    >
                      Impact Score: {opt.score}/100
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium pl-4">
                  "{opt.script}"
                </p>

                {isSelected && (
                  <div className="mt-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-slate-900 dark:text-white">
                      {opt.verdict === 'gold' ? (
                        <CheckCircle2 size={14} className="text-teal-500" />
                      ) : (
                        <AlertCircle size={14} className="text-amber-500" />
                      )}
                      <span>Recruiter Psychology Insight:</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium pl-5">
                      {opt.critique}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── 4. Copy-Ready Gold Standard Script ── */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-teal-500/10 via-blue-500/10 to-emerald-500/5 dark:from-slate-800 dark:via-teal-950/30 dark:to-slate-900 border-2 border-teal-500/30 dark:border-teal-800/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-teal-600 dark:text-teal-400" />
            <span className="text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-300">
              Gold-Standard Interview Response (Memorize & Adapt)
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleCopy(dilemma.goldScript)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700 shadow-2xs"
          >
            {copiedScript ? (
              <>
                <Check size={13} className="text-teal-600" />
                <span className="text-teal-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copy Script</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono bg-white/80 dark:bg-slate-900/80 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
          "{dilemma.goldScript}"
        </p>
      </div>
    </div>
  )
}
