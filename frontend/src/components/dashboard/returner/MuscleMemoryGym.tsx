import { useState, useEffect } from 'react'
import {
  Flame,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Code2,
  Clock,
  Terminal,
  ShieldCheck,
  Award,
  Zap,
  Check,
} from 'lucide-react'

interface DrillTrack {
  id: string
  name: string
  icon: string
  tag: string
}

interface InteractiveDrill {
  id: string
  trackId: string
  title: string
  difficulty: 'Beginner' | 'Intermediate' | 'Senior Architectural'
  concept: string
  scenario: string
  legacyCode: string
  modernSolution: string
  options: {
    id: string
    code: string
    isCorrect: boolean
    flawReason?: string
  }[]
  testCases: { name: string; latency: string; status: 'pass' | 'fail' }[]
  recruiterTakeaway: string
}

const TRACKS: DrillTrack[] = [
  { id: 'java_spring', name: 'Java 21 & Spring Boot 3', icon: '☕', tag: 'Backend' },
  { id: 'react_ts', name: 'React 19 & TypeScript', icon: '⚛️', tag: 'Frontend' },
  { id: 'sql_data', name: 'SQL & Distributed Data', icon: '🗄️', tag: 'Databases' },
  { id: 'docker_cloud', name: 'Docker & Cloud CI/CD', icon: '🐳', tag: 'DevOps' },
]

const DRILLS: InteractiveDrill[] = [
  {
    id: 'java-virtual-threads',
    trackId: 'java_spring',
    title: 'Modernizing Blocking I/O to Virtual Threads (Project Loom)',
    difficulty: 'Senior Architectural',
    concept: 'Java 21 Virtual Threads replace heavy OS platform threads (2MB memory each) with lightweight user-mode threads (few KB).',
    scenario: 'Your high-scale service handles 10,000 concurrent HTTP requests. How do you create an executor that spawns an on-demand virtual thread per task without thread-pool exhaustion?',
    legacyCode: `// ❌ Legacy Java 8 / 11 Thread Pool (Pool exhaustion risk)\nExecutorService executor = Executors.newFixedThreadPool(200);`,
    modernSolution: `// ✅ Modern Java 21 Idiomatic Virtual Thread Per Task\nExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();`,
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
        flawReason: 'CachedThreadPool still allocates heavy OS kernel threads and crashes under 10k spikes with OutOfMemoryError.',
      },
      {
        id: 'opt-3',
        code: 'ForkJoinPool executor = new ForkJoinPool(Runtime.getRuntime().availableProcessors());',
        isCorrect: false,
        flawReason: 'ForkJoinPool is optimized for CPU-bound computation, not blocking I/O HTTP network calls.',
      },
    ],
    testCases: [
      { name: '10,000 Concurrent REST Calls', latency: '12ms', status: 'pass' },
      { name: 'Memory Footprint Check (<50MB)', latency: '8ms', status: 'pass' },
      { name: 'Zero Thread-Pool Starvation', latency: '4ms', status: 'pass' },
    ],
    recruiterTakeaway:
      'In interviews, emphasize: "Instead of tuning complex thread pools or reactive callback chains, Java 21 Virtual Threads give us synchronous simplicity with asynchronous throughput."',
  },
  {
    id: 'react-action-cleanup',
    trackId: 'react_ts',
    title: 'React 19 Action Optimism & Memory Leak Elimination',
    difficulty: 'Intermediate',
    concept: 'Prevent stale closures and memory leaks in async state transitions using modern AbortController and automatic cleanup.',
    scenario: 'A search dropdown fires auto-suggest API calls as the user types. How do you cancel pending network requests if a new keystroke arrives before the previous request finishes?',
    legacyCode: `// ❌ Stale state bug & race condition\nuseEffect(() => {\n  fetchData(query).then(res => setData(res));\n}, [query]);`,
    modernSolution: `// ✅ Modern AbortController Cleanup\nuseEffect(() => {\n  const controller = new AbortController();\n  fetchData(query, { signal: controller.signal })\n    .then(res => setData(res))\n    .catch(err => { if (err.name !== 'AbortError') setError(err); });\n  return () => controller.abort();\n}, [query]);`,
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
        flawReason: 'Boolean flags ignore ongoing network consumption and cause unnecessary bandwidth waste.',
      },
      {
        id: 'opt-3',
        code: `useEffect(() => {\n  setTimeout(() => fetchData(query).then(setData), 500);\n}, [query]);`,
        isCorrect: false,
        flawReason: 'Uncancelled setTimeout leads to timer stacking and delayed memory leaks on unmount.',
      },
    ],
    testCases: [
      { name: 'Rapid Keystroke Interruption (5 req/sec)', latency: '3ms', status: 'pass' },
      { name: 'Component Unmount Abort Verification', latency: '1ms', status: 'pass' },
      { name: 'Zero Stale Data Override', latency: '2ms', status: 'pass' },
    ],
    recruiterTakeaway:
      'Mention to interviewers: "I implement AbortController inside useEffects to eliminate race conditions and keep frontend state strictly synchronous with latest user intent."',
  },
  {
    id: 'sql-upsert-idempotency',
    trackId: 'sql_data',
    title: 'Atomic SQL Upsert (ON CONFLICT) & Idempotency',
    difficulty: 'Intermediate',
    concept: 'Replace race-condition prone SELECT-then-INSERT logic with native atomic database UPSERT.',
    scenario: 'High-frequency order tracking events arrive from Kafka partitions. How do you atomically update existing delivery status or insert new records without duplicate key exceptions?',
    legacyCode: `// ❌ Race condition under concurrency:\nIF (SELECT count(*) FROM orders WHERE order_id = 101) > 0\n  UPDATE orders SET status = 'DELIVERED';\nELSE\n  INSERT INTO orders (order_id, status) VALUES (101, 'DELIVERED');`,
    modernSolution: `// ✅ Native Atomic PostgreSQL UPSERT\nINSERT INTO orders (order_id, status, updated_at)\nVALUES (101, 'DELIVERED', NOW())\nON CONFLICT (order_id) \nDO UPDATE SET status = EXCLUDED.status, updated_at = NOW();`,
    options: [
      {
        id: 'opt-1',
        code: `INSERT INTO orders (order_id, status, updated_at)\nVALUES (101, 'DELIVERED', NOW())\nON CONFLICT (order_id) \nDO UPDATE SET status = EXCLUDED.status, updated_at = NOW();`,
        isCorrect: true,
      },
      {
        id: 'opt-2',
        code: `INSERT INTO orders (order_id, status) VALUES (101, 'DELIVERED')\nON DUPLICATE KEY IGNORE;`,
        isCorrect: false,
        flawReason: 'IGNORE simply drops newer status updates, causing silent data inconsistency for ongoing orders.',
      },
      {
        id: 'opt-3',
        code: `LOCK TABLE orders IN EXCLUSIVE MODE;\nINSERT INTO orders (order_id, status) VALUES (101, 'DELIVERED');`,
        isCorrect: false,
        flawReason: 'Full table locking destroys database concurrency and triggers widespread deadlock timeouts.',
      },
    ],
    testCases: [
      { name: '500 Concurrent Kafka Worker Inserts', latency: '9ms', status: 'pass' },
      { name: 'Deadlock & Race Condition Test', latency: '3ms', status: 'pass' },
      { name: 'Zero Duplicate Key Violations', latency: '2ms', status: 'pass' },
    ],
    recruiterTakeaway:
      'Key architectural pitch: "I ensure microservice consumers are fully idempotent by leveraging database-level atomic upserts over application-level locking."',
  },
  {
    id: 'docker-distroless-security',
    trackId: 'docker_cloud',
    title: 'Multi-Stage Distroless Production Docker Packaging',
    difficulty: 'Senior Architectural',
    concept: 'Distroless and multi-stage container builds eliminate shell vulnerabilities (CVEs) and trim 800MB images down to <90MB.',
    scenario: 'You are containerizing a Spring Boot 3 service for AWS ECS. Which Dockerfile pattern yields the smallest attack surface with zero root shell access in production?',
    legacyCode: `// ❌ Fat Vulnerable Image (650MB+, includes bash/curl/apt):\nFROM openjdk:21\nCOPY target/app.jar app.jar\nENTRYPOINT ["java", "-jar", "app.jar"]`,
    modernSolution: `// ✅ Multi-stage Hardened Alpine / Distroless Build (<90MB)\nFROM maven:3.9-eclipse-temurin-21 AS build\nWORKDIR /app\nCOPY . .\nRUN mvn clean package -DskipTests\n\nFROM gcr.io/distroless/java21-debian12\nCOPY --from=build /app/target/*.jar /app/app.jar\nUSER nonroot:nonroot\nENTRYPOINT ["java", "-jar", "/app/app.jar"]`,
    options: [
      {
        id: 'opt-1',
        code: `FROM maven:3.9-eclipse-temurin-21 AS build\nCOPY . /app && cd /app && mvn package\nFROM gcr.io/distroless/java21-debian12\nCOPY --from=build /app/target/*.jar app.jar\nUSER nonroot:nonroot\nENTRYPOINT ["java", "-jar", "app.jar"]`,
        isCorrect: true,
      },
      {
        id: 'opt-2',
        code: `FROM ubuntu:24.04\nRUN apt-get update && apt-get install -y openjdk-21-jdk maven\nCOPY . .\nRUN mvn package\nENTRYPOINT ["java", "-jar", "target/app.jar"]`,
        isCorrect: false,
        flawReason: 'Leaves full OS compiler, package manager, and shell inside production container, failing enterprise security audits.',
      },
      {
        id: 'opt-3',
        code: `FROM openjdk:21-slim\nCOPY . .\nRUN javac *.java\nCMD ["java", "Main"]`,
        isCorrect: false,
        flawReason: 'Runs as root user and contains build-time compiler dependencies in runtime layer.',
      },
    ],
    testCases: [
      { name: 'Vulnerability CVE Scan (Trivy)', latency: '0 Vulnerabilities', status: 'pass' },
      { name: 'Final Image Size Check', latency: '78.4 MB (Lightweight)', status: 'pass' },
      { name: 'Non-Root Execution Enforcement', latency: 'Verified (UID 65532)', status: 'pass' },
    ],
    recruiterTakeaway:
      'Demonstrate seniority: "We build multi-stage distroless containers running as non-root users, keeping container size under 90MB and drastically shrinking our attack surface."',
  },
]

export default function MuscleMemoryGym() {
  const [selectedTrack, setSelectedTrack] = useState<string>('java_spring')
  const [currentIdx, setCurrentIdx] = useState<number>(0)
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null)
  const [verified, setVerified] = useState<boolean>(false)
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false)
  const [streakCount, setStreakCount] = useState<number>(5)
  const [xpPoints, setXpPoints] = useState<number>(320)
  const [timerSeconds, setTimerSeconds] = useState<number>(30)
  const [timerActive, setTimerActive] = useState<boolean>(true)
  const [viewMode, setViewMode] = useState<'drill' | 'diff'>('drill')

  // Filter drills by track
  const trackDrills = DRILLS.filter((d) => d.trackId === selectedTrack)
  const activeDrill = trackDrills[currentIdx] || trackDrills[0] || DRILLS[0]

  // Countdown timer for muscle memory reflex
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined
    if (timerActive && timerSeconds > 0 && !verified) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerActive, timerSeconds, verified])

  const selectedOption = activeDrill.options.find((o) => o.id === selectedOptId)
  const isCorrect = selectedOption?.isCorrect || false

  const handleRunVerification = (optId: string) => {
    setSelectedOptId(optId)
    setIsRunningTests(true)
    setTimerActive(false)

    setTimeout(() => {
      setIsRunningTests(false)
      setVerified(true)
      const opt = activeDrill.options.find((o) => o.id === optId)
      if (opt?.isCorrect) {
        setStreakCount((prev) => prev + 1)
        setXpPoints((prev) => prev + 50)
      }
    }, 700)
  }

  const handleNextDrill = () => {
    setSelectedOptId(null)
    setVerified(false)
    setIsRunningTests(false)
    setTimerSeconds(30)
    setTimerActive(true)
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
    setVerified(false)
    setIsRunningTests(false)
    setTimerSeconds(30)
    setTimerActive(true)
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
      {/* ── 1. Top Header Banner ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/60 dark:to-amber-950/60 text-orange-700 dark:text-orange-300 text-xs font-black border border-orange-200/50 mb-1.5">
            <Flame size={13} className="text-orange-600 animate-pulse" />
            <span>Interactive Code Reflex Arena • 5-Min Daily Drills</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Code Muscle Memory Gym & Live Verification Lab
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl font-medium">
            Shake off syntax rustiness with interactive code refactoring, simulated compiler tests, and modern architectural intuition drills.
          </p>
        </div>

        {/* Gamified Stat Badges */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0">
          <div className="text-center px-2">
            <div className="text-[9px] uppercase font-black text-slate-400">Daily Streak</div>
            <div className="text-base font-black text-orange-600 flex items-center justify-center gap-1">
              <Flame size={14} className="text-orange-500" />
              <span>{streakCount} Days</span>
            </div>
          </div>

          <div className="h-7 w-[1px] bg-slate-200 dark:bg-slate-700" />

          <div className="text-center px-2">
            <div className="text-[9px] uppercase font-black text-slate-400">Reflex XP</div>
            <div className="text-base font-black text-teal-600 dark:text-teal-400 flex items-center justify-center gap-1">
              <Zap size={14} className="text-teal-500" />
              <span>{xpPoints} pts</span>
            </div>
          </div>

          <div className="h-7 w-[1px] bg-slate-200 dark:bg-slate-700" />

          <div className="text-center px-2">
            <div className="text-[9px] uppercase font-black text-slate-400">Speed Timer</div>
            <div
              className={`text-base font-black flex items-center justify-center gap-1 ${
                timerSeconds <= 8 ? 'text-rose-600 animate-bounce' : 'text-slate-900 dark:text-white'
              }`}
            >
              <Clock size={13} className="text-slate-400" />
              <span>{timerSeconds}s</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Track Selector Horizontal Bar ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-2 px-2 scrollbar-none">
        {TRACKS.map((t) => {
          const isActive = t.id === selectedTrack
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTrackChange(t.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-[#0B4F9C] text-white shadow-md shadow-blue-900/15'
                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="text-sm">{t.icon}</span>
              <span>{t.name}</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold uppercase tracking-wider ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200/70 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {t.tag}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── 3. Active Drill Arena ── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-5">
        {/* Drill Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-[#0B4F9C] dark:text-sky-400 flex items-center gap-1.5">
              <Code2 size={15} />
              <span>Drill {currentIdx + 1} of {trackDrills.length}:</span>
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">{activeDrill.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {activeDrill.difficulty}
            </span>
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setViewMode('drill')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  viewMode === 'drill'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Interactive Drill
              </button>
              <button
                type="button"
                onClick={() => setViewMode('diff')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  viewMode === 'diff'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Legacy vs Modern Diff
              </button>
            </div>
          </div>
        </div>

        {/* Concept Brief */}
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
          <Sparkles size={15} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900 dark:text-white">Core Architectural Intuition: </strong>
            <span>{activeDrill.concept}</span>
          </div>
        </div>

        {/* View Mode 1: Interactive Drill with Live Code Playground */}
        {viewMode === 'drill' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>🎯 Problem Scenario & Code Context:</span>
                <span className="text-[10px] text-slate-400 font-medium">Select the most production-ready modern syntax</span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                {activeDrill.scenario}
              </p>

              {/* Legacy Code Context Box */}
              <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs border border-slate-800 overflow-x-auto">
                <div className="text-[10px] font-bold text-rose-400 uppercase pb-1 mb-1 border-b border-slate-800 flex items-center justify-between">
                  <span>Current Legacy Anti-Pattern</span>
                  <span className="text-slate-500 font-sans">Requires Modernization</span>
                </div>
                <pre className="leading-relaxed">{activeDrill.legacyCode}</pre>
              </div>
            </div>

            {/* Interactive Options with Live Syntax Snippets */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Choose the Idiomatic Modern Solution:
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {activeDrill.options.map((opt, i) => {
                  const isSelected = selectedOptId === opt.id
                  let cardStyle =
                    'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-[#0B4F9C] dark:hover:border-blue-500'

                  if (verified) {
                    if (opt.isCorrect) {
                      cardStyle =
                        'bg-emerald-50/70 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-100 shadow-sm'
                    } else if (isSelected && !opt.isCorrect) {
                      cardStyle =
                        'bg-rose-50/70 dark:bg-rose-950/60 border-rose-500 text-rose-950 dark:text-rose-100'
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleRunVerification(opt.id)}
                      disabled={verified || isRunningTests}
                      className={`p-3.5 rounded-2xl border text-left transition cursor-pointer space-y-2 ${cardStyle}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-[10px] text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                            Candidate Code Option
                          </span>
                        </div>

                        {verified && opt.isCorrect && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md">
                            <CheckCircle2 size={12} />
                            <span>Idiomatic 100%</span>
                          </span>
                        )}

                        {verified && isSelected && !opt.isCorrect && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-black text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 rounded-md">
                            <XCircle size={12} />
                            <span>Anti-Pattern</span>
                          </span>
                        )}
                      </div>

                      <pre className="font-mono text-xs p-2.5 rounded-xl bg-slate-900 text-slate-100 overflow-x-auto leading-relaxed">
                        {opt.code}
                      </pre>

                      {verified && opt.flawReason && (
                        <p className="text-[11px] text-rose-700 dark:text-rose-300 font-sans font-medium pl-1">
                          ⚠️ <strong>Why this fails:</strong> {opt.flawReason}
                        </p>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* View Mode 2: Legacy vs Modern Diff */}
        {viewMode === 'diff' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-rose-700 dark:text-rose-400 uppercase">
                <XCircle size={14} />
                <span>Legacy Syntax (What you might remember from 5 yrs ago)</span>
              </div>
              <pre className="font-mono text-xs p-3 rounded-xl bg-slate-900 text-slate-100 overflow-x-auto leading-relaxed border border-slate-800">
                {activeDrill.legacyCode}
              </pre>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase">
                <CheckCircle2 size={14} />
                <span>2026 Production Standard (How FAANG writes it today)</span>
              </div>
              <pre className="font-mono text-xs p-3 rounded-xl bg-slate-900 text-slate-100 overflow-x-auto leading-relaxed border border-slate-800">
                {activeDrill.modernSolution}
              </pre>
            </div>
          </div>
        )}

        {/* ── 4. Simulated Test Suite Execution Terminal ── */}
        {(isRunningTests || verified) && (
          <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs border border-slate-800 space-y-3 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-teal-400" />
                <span className="text-[11px] font-bold uppercase text-slate-300">
                  Punarshuru Live Test Suite & Memory Profiler
                </span>
              </div>
              {isRunningTests ? (
                <span className="text-[10px] text-amber-400 animate-pulse">Running assertions...</span>
              ) : isCorrect ? (
                <span className="text-[10px] font-bold text-emerald-400">All 3 Tests Passed (0.02s)</span>
              ) : (
                <span className="text-[10px] font-bold text-rose-400">Assertion Failed</span>
              )}
            </div>

            <div className="space-y-1.5 pt-1 font-mono text-[11px]">
              {activeDrill.testCases.map((tc, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2">
                    {isRunningTests ? (
                      <span className="text-amber-400 animate-spin">⟳</span>
                    ) : isCorrect ? (
                      <Check size={13} className="text-emerald-400" />
                    ) : (
                      <span className="text-rose-400">✗</span>
                    )}
                    <span>{tc.name}</span>
                  </div>
                  <span className="text-slate-400 text-[10px]">{isRunningTests ? 'profiling...' : tc.latency}</span>
                </div>
              ))}
            </div>

            {/* Recruiter Interview Tip */}
            {verified && (
              <div className="pt-2 border-t border-slate-800 text-slate-300 text-xs font-sans space-y-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                  <Award size={13} />
                  <span>Recruiter & Hiring Manager Pitch Angle:</span>
                </div>
                <p className="text-slate-200 text-xs leading-relaxed italic bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                  {activeDrill.recruiterTakeaway}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-400 font-medium">
            Score: <strong className="text-slate-900 dark:text-white">{xpPoints} XP</strong> • Level: <strong className="text-teal-600">Modern Architecture Ready</strong>
          </div>

          <button
            type="button"
            onClick={handleNextDrill}
            disabled={!verified}
            className="px-5 py-2.5 rounded-xl bg-[#0B4F9C] hover:bg-blue-800 text-white text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-md shadow-blue-900/15 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>{currentIdx < trackDrills.length - 1 ? 'Next Challenge' : 'Complete Track Workout'}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ── 5. Verifiable Muscle Memory Shield ── */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950/30 dark:to-blue-950/30 border border-teal-200/60 dark:border-teal-800/50 flex items-start gap-3 text-xs">
        <ShieldCheck size={18} className="text-teal-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-bold text-teal-900 dark:text-teal-200">
            Muscle Memory Reflex Anchors to Karamveer Skill Passport
          </div>
          <p className="text-teal-800 dark:text-teal-300">
            Completing these 5-minute drills proves to hiring managers that your gap did not cause technical obsolescence. Your daily streak and test-suite pass metrics automatically boost your live verified profile score.
          </p>
        </div>
      </div>
    </div>
  )
}
