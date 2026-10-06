import { useState } from 'react'
import {
  Flame,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Code2,
} from 'lucide-react'

interface MicroDrill {
  id: string
  title: string
  stack: string
  question: string
  codeSnippet?: string
  options: { id: string; text: string; isCorrect: boolean }[]
  explanation: string
}

const DRILLS: MicroDrill[] = [
  {
    id: 'java-streams',
    title: 'Drill 1: Java 17/21 Streams & Immutability',
    stack: 'Java Backend',
    question: 'How do you filter a list of transactions > ₹10,000 and collect to an unmodifiable list in modern Java?',
    codeSnippet: `List<Transaction> txns = getTransactions();\n// Which modern one-liner is most idiomatic?`,
    options: [
      { id: 'a', text: 'txns.stream().filter(t -> t.amount() > 10000).toList();', isCorrect: true },
      { id: 'b', text: 'txns.stream().filter(t -> t.amount() > 10000).collect(Collectors.toList());', isCorrect: false },
      { id: 'c', text: 'Collections.unmodifiableList(new ArrayList<>(txns));', isCorrect: false },
    ],
    explanation: 'Java 16+ introduced stream.toList() which directly returns an unmodifiable List, replacing verbose Collectors.toList().',
  },
  {
    id: 'react-hooks',
    title: 'Drill 2: Modern React State & Cleanup',
    stack: 'Full-Stack Frontend',
    question: 'When subscribing to a WebSocket or timer in useEffect, how must cleanup be performed to prevent memory leaks?',
    codeSnippet: `useEffect(() => {\n  const socket = new WebSocket(URL);\n  // How to ensure clean disconnect on unmount?\n}, []);`,
    options: [
      { id: 'a', text: 'Call socket.close() outside the useEffect hook.', isCorrect: false },
      { id: 'b', text: 'Return a cleanup callback: return () => { socket.close(); }', isCorrect: true },
      { id: 'c', text: 'Rely on React garbage collection automatically.', isCorrect: false },
    ],
    explanation: 'Returning a cleanup function inside useEffect guarantees teardown whenever the component unmounts or dependencies change.',
  },
  {
    id: 'sql-window',
    title: 'Drill 3: SQL Window Functions (Running Totals)',
    stack: 'Data & Databases',
    question: 'Which clause generates a cumulative running balance of transaction amounts partitioned by customer?',
    codeSnippet: `SELECT customer_id, txn_date, amount,\n  SUM(amount) OVER (____?____) AS running_balance\nFROM transactions;`,
    options: [
      { id: 'a', text: 'PARTITION BY customer_id ORDER BY txn_date', isCorrect: true },
      { id: 'b', text: 'GROUP BY customer_id ORDER BY txn_date', isCorrect: false },
      { id: 'c', text: 'ORDER BY customer_id, txn_date', isCorrect: false },
    ],
    explanation: 'OVER (PARTITION BY customer_id ORDER BY txn_date) resets cumulative sum per customer while maintaining chronological rolling accumulation.',
  },
  {
    id: 'docker-compose',
    title: 'Drill 4: Docker Multi-Stage Builds',
    stack: 'Cloud & DevOps',
    question: 'Why are multi-stage Docker builds standard practice in modern Java and Node deployments?',
    codeSnippet: `FROM maven:3.9-eclipse-temurin-21 AS build\n...\nFROM eclipse-temurin:21-jre-alpine\nCOPY --from=build /target/app.jar app.jar`,
    options: [
      { id: 'a', text: 'To include all build tools (Maven, JDK) inside the production image for live compiling.', isCorrect: false },
      { id: 'b', text: 'To produce minimal, attack-hardened JRE images (<120MB) by discarding heavy Maven/compiler bloat.', isCorrect: true },
      { id: 'c', text: 'Multi-stage Docker builds are only needed for Kubernetes pods.', isCorrect: false },
    ],
    explanation: 'Multi-stage builds separate compilation from execution, keeping production container images lightweight (<120MB) and secure.',
  },
]

export default function MuscleMemoryGym() {
  const [currentIdx, setCurrentIdx] = useState<number>(0)
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null)
  const [answered, setAnswered] = useState<boolean>(false)
  const [streakCount, setStreakCount] = useState<number>(4)

  const activeDrill = DRILLS[currentIdx]
  const isCorrect = activeDrill.options.find((o) => o.id === selectedOptId)?.isCorrect || false

  const handleSelect = (optId: string) => {
    if (answered) return
    setSelectedOptId(optId)
    setAnswered(true)
    const opt = activeDrill.options.find((o) => o.id === optId)
    if (opt?.isCorrect) {
      setStreakCount((prev) => prev + 1)
    }
  }

  const handleNext = () => {
    setSelectedOptId(null)
    setAnswered(false)
    if (currentIdx < DRILLS.length - 1) {
      setCurrentIdx((prev) => prev + 1)
    } else {
      setCurrentIdx(0)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-7">
      {/* ── 1. Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/60 dark:to-amber-950/60 text-orange-700 dark:text-orange-300 text-xs font-black mb-1.5 border border-orange-200/50">
            <Flame size={13} className="text-orange-600" />
            <span>5-Minute Daily Technical Muscle Memory Gym</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Shake Off Syntax Rustiness with Micro-Drills
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            Quick 5-minute interactive challenges on modern Java, React, SQL, and Docker to rebuild coding intuition without overwhelming video lectures.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0">
          <div className="text-center px-2">
            <div className="text-[10px] uppercase font-bold text-slate-400">Daily Streak</div>
            <div className="text-lg font-black text-orange-600 flex items-center justify-center gap-1">
              <Flame size={16} className="text-orange-500 animate-pulse" />
              <span>{streakCount} Days</span>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700" />
          <div className="text-center px-2">
            <div className="text-[10px] uppercase font-bold text-slate-400">Gym Progress</div>
            <div className="text-lg font-black text-slate-900 dark:text-white">
              {currentIdx + 1}/{DRILLS.length}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Active Drill Card ── */}
      <div className="p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-[#0B4F9C] dark:text-sky-400 flex items-center gap-1.5">
            <Code2 size={15} />
            <span>{activeDrill.title}</span>
          </span>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {activeDrill.stack}
          </span>
        </div>

        <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
          {activeDrill.question}
        </h4>

        {activeDrill.codeSnippet && (
          <pre className="p-3.5 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
            {activeDrill.codeSnippet}
          </pre>
        )}

        {/* Options */}
        <div className="grid grid-cols-1 gap-2.5 pt-1">
          {activeDrill.options.map((opt) => {
            const isSelected = selectedOptId === opt.id
            let btnStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'

            if (answered) {
              if (opt.isCorrect) {
                btnStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold'
              } else if (isSelected && !opt.isCorrect) {
                btnStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-100'
              }
            }

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt.id)}
                disabled={answered}
                className={`p-3.5 rounded-2xl border text-left text-xs transition cursor-pointer flex items-center justify-between gap-3 ${btnStyle}`}
              >
                <span className="font-mono">{opt.text}</span>
                {answered && opt.isCorrect && (
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                )}
                {answered && isSelected && !opt.isCorrect && (
                  <XCircle size={16} className="text-rose-600 shrink-0" />
                )}
              </button>
            )
          })}
        </div>

        {/* Explanation Banner */}
        {answered && (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className={isCorrect ? 'text-emerald-500' : 'text-amber-500'} />
              <span className="font-bold text-xs text-slate-900 dark:text-white">
                {isCorrect ? '✅ Correct! Key Concept Insight:' : '💡 Learning Takeaway:'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium pl-5">
              {activeDrill.explanation}
            </p>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 rounded-xl bg-[#0B4F9C] hover:bg-[#083b75] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>{currentIdx < DRILLS.length - 1 ? 'Next Drill' : 'Restart Workout'}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
