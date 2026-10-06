import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Flame,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Code2,
  Clock,
  ShieldCheck,
  Award,
  Zap,
  Check,
  FileText,
  Mic,
} from 'lucide-react'

interface DrillTrack {
  id: string
  name: string
  icon: string
  tag: string
  color: string
}

interface InteractiveDrill {
  id: string
  trackId: string
  title: string
  difficulty: string
  scenario: string
  legacyCode: string
  legacyLabel: string
  legacyProblem: string
  modernSolution: string
  options: {
    id: string
    code: string
    isCorrect: boolean
    flawReason?: string
  }[]
  testCases: string[]
  recruiterTip: string
  explanation: string
}

const TRACKS: DrillTrack[] = [
  { id: 'java_spring', name: 'Java 21 & Spring Boot', icon: '☕', tag: 'Backend', color: 'text-amber-500' },
  { id: 'react_ts', name: 'React 19 & TypeScript', icon: '⚛️', tag: 'Frontend', color: 'text-sky-500' },
  { id: 'sql_data', name: 'SQL & Distributed Data', icon: '🗄️', tag: 'Databases', color: 'text-emerald-500' },
  { id: 'docker_cloud', name: 'Docker & Cloud CI/CD', icon: '🐳', tag: 'DevOps', color: 'text-blue-500' },
]

const DRILLS: InteractiveDrill[] = [
  {
    id: 'java-virtual-threads',
    trackId: 'java_spring',
    title: 'Modernizing Thread Pools to Java 21 Virtual Threads',
    difficulty: 'Senior Architect',
    scenario: 'Your service receives 10,000 concurrent HTTP requests. How do you spin up lightweight on-demand threads without thread-pool exhaustion or memory crashes?',
    legacyCode: 'ExecutorService executor = Executors.newFixedThreadPool(200);',
    legacyLabel: 'Java 8/11 Legacy Approach',
    legacyProblem: 'Allocates heavy 2MB OS platform threads. Under 10k spikes, thread-pool gets exhausted leading to severe timeouts.',
    modernSolution: 'ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();',
    options: [
      {
        id: 'opt-1',
        code: 'ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();',
        isCorrect: true,
      },
      {
        id: 'opt-2',
        code: 'ExecutorService executor = Executors.newCachedThreadPool();',
        isCorrect: false,
        flawReason: 'Still creates heavy OS threads; under 10k requests it spawns 10,000 OS threads and crashes with OutOfMemoryError.',
      },
      {
        id: 'opt-3',
        code: 'ForkJoinPool executor = new ForkJoinPool(Runtime.getRuntime().availableProcessors());',
        isCorrect: false,
        flawReason: 'ForkJoinPool is designed for CPU-heavy tasks, not blocking network I/O HTTP calls.',
      },
    ],
    testCases: ['10,000 Concurrent REST Calls [PASS - 12ms]', 'Memory Footprint <50MB [PASS]', 'Zero Pool Starvation [PASS]'],
    recruiterTip: 'Tell the interviewer: "I use Java 21 Virtual Threads to get synchronous code simplicity with asynchronous high throughput."',
    explanation: 'Java 21 Virtual Threads (Project Loom) run millions of lightweight user-mode threads on top of a few carrier threads, eliminating complex reactive frameworks.',
  },
  {
    id: 'react-action-cleanup',
    trackId: 'react_ts',
    title: 'React 19 AbortController & Memory Leak Prevention',
    difficulty: 'Intermediate',
    scenario: 'In an auto-complete search bar, how do you properly cancel pending API requests when the user types a new letter before the old request finishes?',
    legacyCode: `useEffect(() => {\n  fetchData(query).then(res => setData(res));\n}, [query]);`,
    legacyLabel: 'Naive React 16 Approach',
    legacyProblem: 'Causes race conditions where an old slow response overrides newer search results, plus memory leaks on unmount.',
    modernSolution: `useEffect(() => {\n  const controller = new AbortController();\n  fetchData(query, { signal: controller.signal }).then(setData);\n  return () => controller.abort();\n}, [query]);`,
    options: [
      {
        id: 'opt-1',
        code: `useEffect(() => {\n  const controller = new AbortController();\n  fetchData(query, { signal: controller.signal }).then(setData);\n  return () => controller.abort();\n}, [query]);`,
        isCorrect: true,
      },
      {
        id: 'opt-2',
        code: `let isMounted = true;\nuseEffect(() => {\n  fetchData(query).then(res => { if (isMounted) setData(res); });\n  return () => { isMounted = false; };\n}, [query]);`,
        isCorrect: false,
        flawReason: 'Boolean flags ignore ongoing network consumption and still consume client bandwidth.',
      },
      {
        id: 'opt-3',
        code: `useEffect(() => {\n  setTimeout(() => fetchData(query).then(setData), 400);\n}, [query]);`,
        isCorrect: false,
        flawReason: 'Uncancelled setTimeout leads to timer stacking and memory leaks when the component unmounts.',
      },
    ],
    testCases: ['Rapid Keystroke Cancellation [PASS]', 'Component Unmount Cleanup [PASS]', 'Zero Stale Data Overrides [PASS]'],
    recruiterTip: 'Tell the interviewer: "I always pass AbortController signals into async effects to guarantee zero race conditions."',
    explanation: 'Returning a cleanup function that triggers controller.abort() cleanly terminates browser network sockets instantly.',
  },
  {
    id: 'sql-upsert-idempotency',
    trackId: 'sql_data',
    title: 'Atomic SQL UPSERT (ON CONFLICT) & Idempotency',
    difficulty: 'Intermediate',
    scenario: 'High-frequency order events arrive from Kafka. How do you update existing orders or insert new ones without race conditions or duplicate key errors?',
    legacyCode: `IF (SELECT count(*) FROM orders WHERE id = 101) > 0\n  UPDATE orders SET status = 'DONE';\nELSE\n  INSERT INTO orders (id, status) VALUES (101, 'DONE');`,
    legacyLabel: 'Legacy 2-Step Check-then-Act',
    legacyProblem: 'Dangerous race condition under concurrency: two simultaneous workers see count=0 and both try to INSERT, causing primary key collisions.',
    modernSolution: `INSERT INTO orders (id, status, updated_at)\nVALUES (101, 'DONE', NOW())\nON CONFLICT (id) \nDO UPDATE SET status = EXCLUDED.status, updated_at = NOW();`,
    options: [
      {
        id: 'opt-1',
        code: `INSERT INTO orders (id, status, updated_at)\nVALUES (101, 'DONE', NOW())\nON CONFLICT (id) \nDO UPDATE SET status = EXCLUDED.status, updated_at = NOW();`,
        isCorrect: true,
      },
      {
        id: 'opt-2',
        code: `INSERT INTO orders (id, status) VALUES (101, 'DONE')\nON DUPLICATE KEY IGNORE;`,
        isCorrect: false,
        flawReason: 'IGNORE drops the new status update completely, leaving old stale data in the database.',
      },
      {
        id: 'opt-3',
        code: `LOCK TABLE orders IN EXCLUSIVE MODE;\nINSERT INTO orders (id, status) VALUES (101, 'DONE');`,
        isCorrect: false,
        flawReason: 'Locking the entire table halts all database writes and kills system performance.',
      },
    ],
    testCases: ['500 Concurrent Worker Inserts [PASS]', 'Zero Deadlock Exceptions [PASS]', 'Atomic Row Update Verified [PASS]'],
    recruiterTip: 'Explain: "I build idempotent consumers using database-level ON CONFLICT upserts instead of heavy application locks."',
    explanation: 'PostgreSQL native ON CONFLICT executes atomically in a single engine cycle with zero lock contention.',
  },
  {
    id: 'docker-distroless-security',
    trackId: 'docker_cloud',
    title: 'Hardened Multi-Stage Distroless Docker Builds',
    difficulty: 'Senior Architect',
    scenario: 'You are packaging a Spring Boot 3 microservice for AWS. Which Dockerfile pattern creates the most secure, minimal (<90MB) production container with zero root shell access?',
    legacyCode: `FROM openjdk:21\nCOPY target/app.jar app.jar\nENTRYPOINT ["java", "-jar", "app.jar"]`,
    legacyLabel: 'Fat 650MB Insecure Image',
    legacyProblem: 'Contains entire Linux package manager, bash shell, curl, and build tools, creating high vulnerability attack vectors (CVEs).',
    modernSolution: `FROM maven:3.9-eclipse-temurin-21 AS build\nCOPY . /app && cd /app && mvn package\nFROM gcr.io/distroless/java21-debian12\nCOPY --from=build /app/target/*.jar app.jar\nUSER nonroot:nonroot\nENTRYPOINT ["java", "-jar", "app.jar"]`,
    options: [
      {
        id: 'opt-1',
        code: `FROM maven:3.9-eclipse-temurin-21 AS build\nCOPY . /app && cd /app && mvn package\nFROM gcr.io/distroless/java21-debian12\nCOPY --from=build /app/target/*.jar app.jar\nUSER nonroot:nonroot\nENTRYPOINT ["java", "-jar", "app.jar"]`,
        isCorrect: true,
      },
      {
        id: 'opt-2',
        code: `FROM ubuntu:24.04\nRUN apt-get update && apt-get install -y openjdk-21-jdk\nCOPY . .\nRUN javac *.java\nCMD ["java", "Main"]`,
        isCorrect: false,
        flawReason: 'Leaves full OS compiler and root access inside production container, failing enterprise security compliance.',
      },
      {
        id: 'opt-3',
        code: `FROM openjdk:21-slim\nCOPY target/app.jar app.jar\nENTRYPOINT ["java", "-jar", "app.jar"]`,
        isCorrect: false,
        flawReason: 'Runs as root user and still contains shell binaries that attackers can exploit.',
      },
    ],
    testCases: ['Trivy Security Scan: 0 CVEs [PASS]', 'Image Size: 78MB [PASS]', 'Non-Root Execution (UID 65532) [PASS]'],
    recruiterTip: 'Tell interviewers: "We use distroless multi-stage builds running as non-root, keeping container size under 90MB with zero shell exposure."',
    explanation: 'Distroless images contain only your application runtime and dependencies—no package managers or shells.',
  },
]

export default function MuscleMemoryGym() {
  const [selectedTrack, setSelectedTrack] = useState<string>('java_spring')
  const [currentIdx, setCurrentIdx] = useState<number>(0)
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null)
  const [answered, setAnswered] = useState<boolean>(false)
  const [streakCount, setStreakCount] = useState<number>(5)
  const [xpPoints, setXpPoints] = useState<number>(320)
  const [timerSeconds, setTimerSeconds] = useState<number>(30)

  // Filter drills by track
  const trackDrills = DRILLS.filter((d) => d.trackId === selectedTrack)
  const activeDrill = trackDrills[currentIdx] || trackDrills[0] || DRILLS[0]

  // Timer Countdown
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined
    if (!answered && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [answered, timerSeconds])

  const handleSelectOption = (optId: string) => {
    if (answered) return
    setSelectedOptId(optId)
    setAnswered(true)
    const opt = activeDrill.options.find((o) => o.id === optId)
    if (opt?.isCorrect) {
      setStreakCount((prev) => prev + 1)
      setXpPoints((prev) => prev + 50)
    }
  }

  const handleNextDrill = () => {
    setSelectedOptId(null)
    setAnswered(false)
    setTimerSeconds(30)
    if (currentIdx < trackDrills.length - 1) {
      setCurrentIdx((prev) => prev + 1)
    } else {
      setCurrentIdx(0)
    }
  }

  const handleTrackChange = (trackId: string) => {
    setSelectedTrack(trackId)
    setCurrentIdx(0)
    setSelectedOptId(null)
    setAnswered(false)
    setTimerSeconds(30)
  }

  const selectedOption = activeDrill.options.find((o) => o.id === selectedOptId)
  const isCorrect = selectedOption?.isCorrect || false

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* ── 1. Clean Top Header & Gamified Scoreboard ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 text-xs font-black border border-orange-200/60 mb-1">
            <Flame size={13} className="text-orange-600 animate-pulse" />
            <span>5-Minute Daily Code Muscle Memory</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Code Intuition Gym & Syntax Refresher
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Test modern 2026 production idioms vs legacy anti-patterns with instant feedback.
          </p>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-800/80 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0">
          <div className="px-3 text-center border-r border-slate-200 dark:border-slate-700">
            <div className="text-[9px] uppercase font-black text-slate-400">Streak</div>
            <div className="text-sm font-black text-orange-600 flex items-center justify-center gap-1">
              <Flame size={13} />
              <span>{streakCount} Days</span>
            </div>
          </div>
          <div className="px-3 text-center border-r border-slate-200 dark:border-slate-700">
            <div className="text-[9px] uppercase font-black text-slate-400">Score</div>
            <div className="text-sm font-black text-teal-600 dark:text-teal-400 flex items-center justify-center gap-1">
              <Zap size={13} />
              <span>{xpPoints} XP</span>
            </div>
          </div>
          <div className="px-3 text-center">
            <div className="text-[9px] uppercase font-black text-slate-400">Timer</div>
            <div className={`text-sm font-black flex items-center justify-center gap-1 ${timerSeconds <= 8 ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
              <Clock size={12} className="text-slate-400" />
              <span>{timerSeconds}s</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Track Selector Pills ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TRACKS.map((t) => {
          const isActive = t.id === selectedTrack
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTrackChange(t.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition cursor-pointer flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-[#0B4F9C] text-white shadow-md shadow-blue-900/15'
                  : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="text-sm">{t.icon}</span>
              <span>{t.name}</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold uppercase ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                }`}
              >
                {t.tag}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── 3. Main Workout Card (Clear & Uncluttered Layout) ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
        {/* Drill Title & Scenario */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-black text-[#0B4F9C] dark:text-sky-400 flex items-center gap-1.5 uppercase">
              <Code2 size={15} />
              <span>Challenge {currentIdx + 1} of {trackDrills.length}:</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {activeDrill.difficulty}
            </span>
          </div>

          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            {activeDrill.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            {activeDrill.scenario}
          </p>
        </div>

        {/* Legacy Code Anti-Pattern (What you may remember from before) */}
        <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-400">
            <span className="flex items-center gap-1.5">
              <XCircle size={14} />
              <span>{activeDrill.legacyLabel} (Anti-Pattern)</span>
            </span>
            <span className="text-[10px] text-rose-500 font-medium hidden sm:inline">Causes bugs & latency</span>
          </div>

          <pre className="font-mono text-xs p-3 rounded-xl bg-slate-900 text-rose-200 overflow-x-auto border border-slate-800 leading-relaxed">
            {activeDrill.legacyCode}
          </pre>

          <p className="text-[11px] text-rose-700 dark:text-rose-300 font-medium">
            ⚠️ <strong>Why this fails today:</strong> {activeDrill.legacyProblem}
          </p>
        </div>

        {/* Options Selection (Pick the modern one-liner) */}
        <div className="space-y-3">
          <div className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={13} className="text-amber-500" />
            <span>Select the 2026 Production-Ready Fix:</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {activeDrill.options.map((opt, i) => {
              const isSelected = selectedOptId === opt.id
              let cardStyle =
                'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-[#0B4F9C] hover:bg-blue-50/30'

              if (answered) {
                if (opt.isCorrect) {
                  cardStyle = 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20'
                } else if (isSelected && !opt.isCorrect) {
                  cardStyle = 'bg-rose-50 dark:bg-rose-950/70 border-rose-500 text-rose-900 dark:text-rose-100'
                } else {
                  cardStyle = 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
                }
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={answered}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer space-y-2 ${cardStyle}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-[10px] text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">Option {String.fromCharCode(65 + i)}</span>
                    </div>

                    {answered && opt.isCorrect && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md">
                        <CheckCircle2 size={12} />
                        <span>Correct 2026 Standard</span>
                      </span>
                    )}

                    {answered && isSelected && !opt.isCorrect && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 rounded-md">
                        <XCircle size={12} />
                        <span>Flawed Syntax</span>
                      </span>
                    )}
                  </div>

                  <pre className="font-mono text-xs p-2.5 rounded-xl bg-slate-900 text-slate-100 overflow-x-auto leading-relaxed">
                    {opt.code}
                  </pre>

                  {answered && opt.flawReason && (
                    <p className="text-[11px] text-rose-700 dark:text-rose-300 font-medium pl-1">
                      ⚠️ {opt.flawReason}
                    </p>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── 4. Solution & Recruiter Takeaway (Clean Drawer after Answer) ── */}
        {answered && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/70 to-teal-50/70 dark:from-slate-800 dark:to-slate-800 border border-blue-200/80 dark:border-slate-700 space-y-3.5">
            {/* Verdict */}
            <div className="flex items-center gap-2">
              <Sparkles size={16} className={isCorrect ? 'text-emerald-600' : 'text-amber-500'} />
              <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                {isCorrect ? '✅ Spot on! You nailed the modern idiom.' : '💡 Learning Insight:'}
              </h4>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {activeDrill.explanation}
            </p>

            {/* Test Case Badges */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-black uppercase text-slate-400">Simulated Tests:</span>
              {activeDrill.testCases.map((tc, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-300 flex items-center gap-1"
                >
                  <Check size={10} />
                  <span>{tc}</span>
                </span>
              ))}
            </div>

            {/* Recruiter Tip */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-[#0B4F9C] dark:text-sky-300 flex items-center gap-1.5">
                <Award size={13} />
                <span>How to explain this in an interview:</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 italic">
                {activeDrill.recruiterTip}
              </p>
            </div>

            {/* Next CTA */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleNextDrill}
                className="px-5 py-2.5 rounded-xl bg-[#0B4F9C] hover:bg-blue-800 text-white text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-md shadow-blue-900/15"
              >
                <span>{currentIdx < trackDrills.length - 1 ? 'Next Challenge' : 'Complete Track Workout'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── 5. Bottom Guarantee Banner ── */}
      <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/70 dark:border-teal-800/50 flex items-start gap-3 text-xs">
        <ShieldCheck size={18} className="text-teal-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-bold text-teal-900 dark:text-teal-200">
            5-Minute Daily Habit = Zero Skill Rustiness
          </div>
          <p className="text-teal-800 dark:text-teal-300">
            Each completed challenge proves your technical currency to recruiters and adds verified streak score to your returnee profile.
          </p>
        </div>
      </div>

      {/* ── 6. Interconnected Re-Entry Next Steps ── */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-orange-50 via-amber-50 to-blue-50 dark:from-slate-800/90 dark:via-orange-950/20 dark:to-slate-900 border border-orange-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
            <Sparkles size={14} className="text-orange-600 dark:text-orange-400" />
            <span>Refreshed Your Code Intuition? Next Step:</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            Lock these modern skills into your resume or practice answering technical interview dilemmas aloud.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link
            to="/features/resume-rebuilder"
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition"
          >
            <FileText size={13} className="text-purple-500" />
            <span>Inject Into Resume</span>
          </Link>

          <Link
            to="/features/gap-to-strength"
            className="px-4 py-2 rounded-xl bg-[#0B4F9C] hover:bg-blue-800 text-white text-xs font-black flex items-center gap-1.5 transition shadow-sm"
          >
            <Mic size={13} />
            <span>Practice 1:1 Voice AI</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}
