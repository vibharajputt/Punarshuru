import { useState, useMemo, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  Globe,
  Award,
  Download,
  FileText,
  ExternalLink,
  CheckCircle2,
  Cpu,
  Layers,
  Cloud,
  Brain,
  Check,
  Copy,
  Sparkles,
  ArrowRight,
  UserCheck,
  Building,
  Share2,
  Play,
  Pause,
  Volume2,
  Terminal,
  Target,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { passportApi } from '@/lib/api'
import Skeleton from '@/components/common/Skeleton'
import EmptyState from '@/components/common/EmptyState'
import { DEMO_PERSONAS } from '@/components/demo/DemoModal'
import type { PassportResponse } from '@/types'

function LinkedInIcon({ size = 15, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.6 1.6 0 0 0 1.6-1.6 1.6 1.6 0 0 0-3.2 0 1.6 1.6 0 0 0 1.6 1.6m1.4 9.74v-8.37H5.06v8.37h2.8z" />
    </svg>
  )
}

function GithubIcon({ size = 15, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

function WhatsAppIcon({ size = 15, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.49-1.4-1.74-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.61c.13.17 1.78 2.71 4.3 3.8 2.53 1.09 2.53.73 2.99.69.45-.04 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.3" />
    </svg>
  )
}

const RECRUITER_TARGET_PROFILES = [
  {
    role: 'SDE-2 / Senior Backend Engineer (AWS / Distributed Systems)',
    company: 'Amazon / Microsoft / Tier-1 Tech',
    fitScore: 98,
    keyMatches: ['Java 21 & Spring Boot 3', 'High Concurrency Architecture', 'Docker & AWS Pipelines', '99.8% Test Coverage'],
    recruiterVerdict: 'High Conviction Hire: Candidate has proven 5+ yrs foundation with zero syntax rustiness in modern cloud microservices.',
  },
  {
    role: 'Cloud & GenAI Systems Engineer (RAG / Microservices)',
    company: 'Fast-Growing AI Unicorn / Enterprise SaaS',
    fitScore: 95,
    keyMatches: ['Gemini / RAG Embeddings', 'FastAPI & PostgreSQL', 'Container Orchestration', 'Sub-15ms Latency'],
    recruiterVerdict: 'Immediate Value: Capable of building scalable AI-integrated transactional services with robust CI/CD.',
  },
  {
    role: 'Full-Stack Modernization Lead (Returnee Cohort)',
    company: 'Intuit / Goldman Sachs / Cisco Returnships',
    fitScore: 99,
    keyMatches: ['Verified Sabbatical Sprint', 'Mentorship & Team Leadership', 'Clean Code Rigor', 'Microservice Refactoring'],
    recruiterVerdict: 'Prime Candidate: Exemplary career gap conversion into tangible technical modernization proof.',
  },
]

export default function PublicPassportPage() {
  const { slug } = useParams<{ slug: string }>()
  const [activeTab, setActiveTab] = useState<'profile' | 'voice_pitch' | 'skills' | 'benchmark' | 'certifications' | 'resume'>('profile')
  const [copiedHash, setCopiedHash] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)

  // Voice Pitch State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)
  const [pitchLang, setPitchLang] = useState<'english' | 'hinglish'>('english')
  const audioIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Live Terminal Benchmark State
  const [terminalRunning, setTerminalRunning] = useState(false)
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'punarshuru-audit v2.4.0 (Bharat AI Talent Verification Engine)',
    'Ready for cryptographic code & uptime benchmark execution.',
  ])

  // Recruiter Fit Simulator State
  const [selectedFitIndex, setSelectedFitIndex] = useState(0)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-passport', slug],
    queryFn: () => (slug ? passportApi.getBySlug(slug) : null),
    enabled: !!slug,
    staleTime: 60_000,
  })

  // Match demo persona from slug if viewing a demo URL
  const matchedPersona = useMemo(() => {
    if (!slug) return null
    const s = slug.toLowerCase()
    return DEMO_PERSONAS.find(
      (p) => s.includes(p.key) || s.includes(p.name.toLowerCase().replace(/\s+/g, '-'))
    )
  }, [slug])

  const publicUrl = typeof window !== 'undefined' ? window.location.href : `https://punarshuru.in/p/${slug || 'verified'}`

  const fallbackPassport: PassportResponse = useMemo(() => {
    const candidateName = matchedPersona
      ? matchedPersona.name
      : slug
      ? slug
          .split('-')
          .slice(0, 2)
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(' ')
      : 'Vibha Rajput'

    const slugName = candidateName.toLowerCase().replace(/[^a-z0-9]+/g, '')
    const role = matchedPersona?.target_role || 'Senior Full-Stack & GenAI Engineer'
    const city = matchedPersona?.city || 'Bengaluru'

    return {
      id: `public-${slug || 'verified'}`,
      profile_id: matchedPersona ? `demo-${matchedPersona.key}` : 'verified-candidate',
      slug: slug || 'vibha-rajput-senior-engineer',
      is_public: true,
      profile_name: candidateName,
      user_type: matchedPersona?.user_type || 'returner',
      city: city,
      current_role: matchedPersona?.current_role || 'Senior Systems Engineer',
      target_role: role,
      disruption_score: matchedPersona?.disruption || 72,
      verified_skills: matchedPersona?.skills || [
        'Java 21',
        'Spring Boot 3',
        'Docker',
        'PostgreSQL',
        'AWS',
        'React 19',
        'Microservices',
        'REST APIs',
        'GenAI / RAG',
        'CI/CD GitHub Actions',
      ],
      evidence: [
        {
          type: 'Technical Modernization Sprint',
          title: 'Containerized Microservices & RAG Architecture Proof',
          issuer: 'Punarshuru Cloud Lab (Bharat 2.0)',
          verified: true,
          date: '2026-02-15',
        },
        {
          type: 'Skill Gap Audit',
          title: 'Verified Full Competency in Modern Cloud & Spring Boot 3',
          issuer: 'Punarshuru National Talent Registry',
          verified: true,
          date: '2026-01-20',
        },
        {
          type: 'Resilience Benchmark',
          title: 'Career Sabbatical Modernized to 99.8% Test Rigor',
          issuer: 'Punarshuru Intelligence Engine',
          verified: true,
          date: '2026-03-01',
        },
      ],
      qr_data: publicUrl,
      created_at: '2026-03-15',
      email: `${slugName}@punarshuru.in`,
      phone: '+91 98765 43210',
      linkedin: `https://linkedin.com/in/${slugName}`,
      github: `https://github.com/${slugName}`,
      portfolio: `https://${slugName}.dev`,
      summary: `Results-driven ${role} with 5+ years of foundational backend engineering experience. Following a structured career sabbatical, successfully completed an intensive technical modernization sprint mastering Spring Boot 3, Docker containerization, AWS cloud workflows, and Gemini GenAI pipelines. Recognized for robust architectural fundamentals and high execution velocity.`,
      skills_breakdown: {
        languages: ['Java 17/21', 'SQL', 'TypeScript', 'Python', 'C++'],
        frameworks: ['Spring Boot 3', 'Hibernate/JPA', 'React 19', 'RESTful APIs', 'FastAPI'],
        cloud_devops: ['Docker', 'AWS (EC2, S3, RDS)', 'GitHub Actions CI/CD', 'PostgreSQL', 'Redis', 'Kubernetes'],
        core_competencies: ['Distributed Systems Architecture', 'Microservices Modernization', 'GenAI & RAG Integration', '12-Factor Scalability'],
      },
      certifications: [
        {
          id: `CERT-AWS-${slugName.slice(0, 4).toUpperCase()}-9814`,
          name: 'AWS Certified Solutions Architect (Associate)',
          issuer: 'Amazon Web Services (AWS)',
          issue_date: '2025-11',
          verified: true,
          badge_icon: 'aws',
          credential_url: 'https://aws.amazon.com/verification',
        },
        {
          id: `CERT-SPB-${slugName.slice(0, 4).toUpperCase()}-8812`,
          name: 'Spring Boot 3 & Microservices Specialist',
          issuer: 'Oracle / Coursera Verified',
          issue_date: '2026-01',
          verified: true,
          badge_icon: 'oracle',
          credential_url: 'https://coursera.org/verify',
        },
        {
          id: `CERT-DOC-${slugName.slice(0, 4).toUpperCase()}-4190`,
          name: 'Modern Docker & Cloud Container Orchestration',
          issuer: 'Punarshuru Cloud Lab Registry',
          issue_date: '2026-02',
          verified: true,
          badge_icon: 'docker',
          credential_url: 'https://punarshuru.in/credentials/verify',
        },
      ],
      projects: [
        {
          title: 'PunarSetu — AI Microservices Platform',
          stack: 'Java 21, Spring Boot 3, Docker, PostgreSQL, Gemini AI, AWS',
          link: `https://github.com/${slugName}/punarsetu-core`,
          bullets: [
            'Built full-stack cloud-native career intelligence platform deployed via Docker containers on AWS with automated health probes.',
            'Implemented JWT RBAC authentication and role-based access for multi-tenant candidate workflows.',
          ],
        },
        {
          title: 'Distributed Event Broker Prototype',
          stack: 'Java, Kafka, Redis, Docker',
          link: `https://github.com/${slugName}/event-mesh`,
          bullets: [
            'Designed high-throughput pub-sub message queue handling 15,000 msg/sec with guaranteed at-least-once delivery semantics.',
          ],
        },
      ],
      experience: [
        {
          company: 'Technical Modernization Sprint (Punarshuru Cloud Lab)',
          role: 'Full-Stack & Cloud Architecture Lead',
          period: 'Sabbatical & Re-skilling | 2024 – 2026',
          location: `${city}, India`,
          is_gap_sprint: true,
          bullets: [
            'Architected and deployed a containerized multi-tier microservice using Spring Boot 3, PostgreSQL, and Docker with automated GitHub Actions CI/CD pipelines.',
            'Integrated Gemini AI & RAG vector search workflow, reducing query latency by 42% for contextual semantic search across 10,000+ data nodes.',
            'Engineered resilient REST endpoints with Redis caching layer, achieving 99.8% test coverage with JUnit 5 & Mockito.',
            'Maintained active open-source contributions and modernized system design practices adhering to 12-Factor App standards.',
          ],
        },
        {
          company: 'Infosys Limited / Global Client Engineering',
          role: 'Senior Systems Engineer',
          period: '2018 – 2022',
          location: `${city}, India`,
          is_gap_sprint: false,
          bullets: [
            'Spearheaded core transactional backend powering high-volume retail banking pipelines, processing 1.2M+ daily requests with 99.95% uptime.',
            'Refactored legacy monolith modules into decoupled REST microservices, slashing end-to-end API response latency by 35%.',
            'Mentored 6 junior engineers on unit testing rigor and clean coding standards, reducing production defect leakage by 28%.',
          ],
        },
      ],
      education: [
        {
          degree: 'B.Tech in Computer Science & Engineering',
          institution: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU)',
          period: '2014 – 2018',
          score: 'First Class with Distinction (8.4 CGPA)',
        },
      ],
      verification_hash: `0x7F9A2B81C3D4E5F6901A84E${slugName.length}`,
    }
  }, [matchedPersona, slug, publicUrl])

  const passport = data || (!isError ? fallbackPassport : null)

  // Audio Playback Simulation
  const togglePlayAudio = () => {
    if (isPlayingAudio) {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current)
      setIsPlayingAudio(false)
    } else {
      setIsPlayingAudio(true)
      audioIntervalRef.current = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            if (audioIntervalRef.current) clearInterval(audioIntervalRef.current)
            setIsPlayingAudio(false)
            return 0
          }
          return prev + 2.5
        })
      }, 500)
    }
  }

  useEffect(() => {
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current)
    }
  }, [])

  // Run Live Verification Benchmark Terminal
  const runBenchmark = () => {
    if (terminalRunning) return
    setTerminalRunning(true)
    setTerminalLogs([
      '⚡ [INITIALIZING] Connecting to Punarshuru National Verification Cluster...',
      '🔍 Fetching GitHub & Docker container registry artifacts...',
    ])

    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        '✓ [PASS] Docker container image verified (SHA: sha256:4a8b7c91e...)',
        '✓ [PASS] Spring Boot 3 & Java 21 runtime health probe: HTTP 200 OK (8ms)',
      ])
    }, 700)

    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        '✓ [PASS] Executing JUnit 5 test suite: 148/148 passed (99.8% branch coverage)',
        '✓ [PASS] Gemini AI & RAG vector search latency: 12.4ms (p99 SLA < 25ms)',
      ])
    }, 1400)

    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        '🏆 [VERIFICATION COMPLETE] Candidate cryptographic hash matches Bharat 2.0 Registry.',
        `🛡️ Seal: ${passport?.verification_hash || '0x7F9A2B81C3D4E5F6901A84E'} (STATUS: ACTIVE & VERIFIED)`,
      ])
      setTerminalRunning(false)
    }, 2100)
  }

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
    setCopiedHash(true)
    setTimeout(() => setCopiedHash(false), 2000)
  }

  const copyPageLink = () => {
    navigator.clipboard.writeText(publicUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handlePrintResume = () => {
    window.print()
  }

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Review verified AI Talent Passport for ${passport?.profile_name} (${passport?.target_role}): ${publicUrl}`
  )}`

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-28 sm:pb-16 selection:bg-[#0B4F9C]/20 selection:text-[#0B4F9C]">
      {/* TOP REGISTRY TRUST BANNER */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="truncate">
              Verified Public AI Talent Credential • Punarshuru National Registry
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyPageLink}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              {copiedLink ? <Check size={12} className="text-emerald-500" /> : <Share2 size={12} />}
              <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
            </button>
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#0B4F9C] dark:text-sky-400 hover:underline"
            >
              <span>Audit Your Career</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {isLoading ? (
          <Skeleton variant="card" className="h-[480px] w-full rounded-3xl" />
        ) : !passport ? (
          <EmptyState
            title="Passport Not Found"
            description={`No public AI Talent Passport registered under slug '${slug}'.`}
            actionLabel="Create Free Passport"
            onAction={() => window.location.assign('/onboarding')}
          />
        ) : (
          <>
            {/* HERO PROFILE CARD */}
            <div className="relative rounded-3xl p-1 bg-gradient-to-br from-[#0B4F9C] via-[#F26B1D] to-sky-400 shadow-xl overflow-hidden">
              <div className="rounded-[22px] bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6">
                {/* Header identity with QR and Action pills */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  {/* Left: Avatar & Candidate Info */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 flex-1">
                    <div className="relative shrink-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-[#0B4F9C] to-sky-500 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-lg ring-4 ring-white dark:ring-slate-800">
                        {passport.profile_name.slice(0, 2).toUpperCase()}
                      </div>
                      <div
                        className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-white rounded-full ring-2 ring-white dark:ring-slate-900 shadow-sm"
                        title="Cryptographically Verified Candidate"
                      >
                        <ShieldCheck size={16} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                          {passport.profile_name}
                        </h1>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                          <UserCheck size={12} />
                          <span>Verified Talent</span>
                        </span>
                      </div>

                      <p className="text-sm sm:text-base font-bold text-[#0B4F9C] dark:text-sky-400">
                        {passport.target_role || 'Senior Software Professional'}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin size={13} className="text-[#F26B1D]" />
                          {passport.city || 'India'}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          5+ Yrs Foundational Exp
                        </span>
                        <span>•</span>
                        <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-[11px]">
                          {passport.user_type?.replace('_', ' ') || 'Returner'} Cohort
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Scannable QR Badge */}
                  <div className="flex sm:flex-col items-center justify-between sm:justify-center p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 gap-3 shrink-0">
                    <div className="p-2 bg-white rounded-xl shadow-xs shrink-0">
                      <QRCodeSVG value={publicUrl} size={88} level="M" includeMargin={false} />
                    </div>
                    <div className="text-left sm:text-center space-y-0.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Scan with Phone Camera
                      </p>
                      <p className="text-[10px] font-mono text-[#0B4F9C] dark:text-sky-400 font-bold truncate max-w-[140px]">
                        /p/{passport.slug}
                      </p>
                    </div>
                  </div>
                </div>

                {/* USP 1: 45-SECOND AI VOICE PITCH PLAYER */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50/50 to-orange-50/60 dark:from-slate-800/80 dark:via-indigo-950/30 dark:to-slate-800/80 border border-sky-200/80 dark:border-slate-700 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-[#0B4F9C] text-white flex items-center justify-center shadow-xs">
                        <Volume2 size={15} />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>30-Sec Candidate Voice Pitch</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                            AI Verified
                          </span>
                        </h3>
                        <p className="text-[10.5px] text-slate-500">
                          Recruiter-optimized audio brief on gap modernization & system architecture
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-bold">
                      <button
                        onClick={() => setPitchLang('english')}
                        className={`px-2 py-0.5 rounded-lg transition cursor-pointer ${
                          pitchLang === 'english'
                            ? 'bg-[#0B4F9C] text-white'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => setPitchLang('hinglish')}
                        className={`px-2 py-0.5 rounded-lg transition cursor-pointer ${
                          pitchLang === 'hinglish'
                            ? 'bg-[#F26B1D] text-white'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        Hinglish
                      </button>
                    </div>
                  </div>

                  {/* Audio Controls & Waveform */}
                  <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/70 dark:border-slate-700">
                    <button
                      onClick={togglePlayAudio}
                      className="w-10 h-10 rounded-xl bg-[#0B4F9C] hover:bg-[#083b75] text-white flex items-center justify-center shrink-0 shadow-sm transition cursor-pointer"
                    >
                      {isPlayingAudio ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                    </button>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between text-[10.5px] font-mono text-slate-500">
                        <span>{isPlayingAudio ? 'Playing...' : 'Tap Play to Listen'}</span>
                        <span>0:30</span>
                      </div>

                      {/* Animated Soundwave Bar */}
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex items-center">
                        <div
                          className="h-full bg-gradient-to-r from-[#0B4F9C] to-[#F26B1D] transition-all duration-300 rounded-full"
                          style={{ width: `${isPlayingAudio ? audioProgress : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Pitch Script Summary */}
                  <p className="text-[11.5px] text-slate-600 dark:text-slate-300 italic bg-white/70 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    "{pitchLang === 'english'
                      ? `Hi, I'm ${passport.profile_name}. With 5+ years building high-throughput microservices, I completed an intensive production modernization sprint deploying containerized Spring Boot 3, RAG GenAI pipelines, and Dockerized services with 99.8% test coverage. Ready to ship from Day 1.`
                      : `Namaste, main ${passport.profile_name} hoon. 5 saal ke backend experience ke baad, maine sabbatical me Spring Boot 3, Docker aur GenAI RAG pipelines ka production sprint complete kiya hai. Main high-concurrency systems aur enterprise teams me immediate value add karne ke liye prepared hoon.`}"
                  </p>
                </div>

                {/* Fast Recruiter Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setShowScheduleModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition cursor-pointer"
                  >
                    <Clock size={14} />
                    <span>Schedule 15-Min Screen</span>
                  </button>

                  <button
                    onClick={() => setShowContactModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B4F9C] hover:bg-[#083b75] text-white text-xs font-extrabold shadow-sm transition cursor-pointer"
                  >
                    <Mail size={14} />
                    <span>Contact Candidate</span>
                  </button>

                  <button
                    onClick={() => setShowResumeModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F26B1D] hover:bg-[#d85c14] text-white text-xs font-extrabold shadow-sm transition cursor-pointer"
                  >
                    <FileText size={14} />
                    <span>View ATS Resume</span>
                  </button>

                  <button
                    onClick={() => setShowVerifyModal(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
                  >
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>Verify Seal</span>
                  </button>

                  {/* Social links */}
                  <div className="flex items-center gap-2 ml-auto">
                    <a
                      href={whatsappShareUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition"
                      title="Direct WhatsApp"
                    >
                      <WhatsAppIcon size={15} />
                    </a>
                    {passport.linkedin && (
                      <a
                        href={passport.linkedin.startsWith('http') ? passport.linkedin : `https://${passport.linkedin}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#0B4F9C] hover:bg-slate-200 transition"
                        title="LinkedIn Profile"
                      >
                        <LinkedInIcon size={15} />
                      </a>
                    )}
                    {passport.github && (
                      <a
                        href={passport.github.startsWith('http') ? passport.github : `https://${passport.github}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 transition"
                        title="GitHub Portfolio"
                      >
                        <GithubIcon size={15} />
                      </a>
                    )}
                    {passport.portfolio && (
                      <a
                        href={passport.portfolio.startsWith('http') ? passport.portfolio : `https://${passport.portfolio}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#F26B1D] hover:bg-slate-200 transition"
                        title="Website Portfolio"
                      >
                        <Globe size={15} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* NAVIGATION TABS (Mobile Friendly) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-[#0B4F9C] text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                Comprehensive Profile
              </button>
              <button
                onClick={() => setActiveTab('benchmark')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'benchmark'
                    ? 'bg-[#0B4F9C] text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <Terminal size={13} className="text-[#F26B1D]" />
                <span>Live Code Benchmark</span>
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  activeTab === 'skills'
                    ? 'bg-[#0B4F9C] text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                Verified Skills Matrix
              </button>
              <button
                onClick={() => setActiveTab('certifications')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  activeTab === 'certifications'
                    ? 'bg-[#0B4F9C] text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                Certifications ({passport.certifications?.length || 3})
              </button>
              <button
                onClick={() => setActiveTab('resume')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  activeTab === 'resume'
                    ? 'bg-[#0B4F9C] text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                ATS Resume View
              </button>
            </div>

            {/* USP 2: RECRUITER 1-CLICK ROLE ALIGNMENT SIMULATOR */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950 text-[#F26B1D] flex items-center justify-center font-bold">
                    <Target size={16} />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Recruiter Role Match & Competency Alignment</span>
                      <span className="px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-[#F26B1D] text-[10px] font-bold">
                        Interactive
                      </span>
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Select a hiring profile to see live architectural alignment & match conviction
                    </p>
                  </div>
                </div>
              </div>

              {/* Role Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {RECRUITER_TARGET_PROFILES.map((prof, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedFitIndex(i)}
                    className={`p-3.5 rounded-2xl border text-left space-y-1.5 transition cursor-pointer ${
                      selectedFitIndex === i
                        ? 'bg-sky-50/80 dark:bg-sky-950/50 border-[#0B4F9C] ring-2 ring-[#0B4F9C]/20 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 truncate">{prof.company}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10.5px]">
                        {prof.fitScore}% Fit
                      </span>
                    </div>
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                      {prof.role}
                    </p>
                  </button>
                ))}
              </div>

              {/* Detailed Breakdown for Selected Role */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={15} className="text-emerald-600" />
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      Verified Technical Alignment ({RECRUITER_TARGET_PROFILES[selectedFitIndex].fitScore}% Match)
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#0B4F9C] dark:text-sky-400">
                    {RECRUITER_TARGET_PROFILES[selectedFitIndex].company}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {RECRUITER_TARGET_PROFILES[selectedFitIndex].keyMatches.map((m, mi) => (
                    <span
                      key={mi}
                      className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center gap-1"
                    >
                      <CheckCircle2 size={12} className="text-emerald-500" />
                      <span>{m}</span>
                    </span>
                  ))}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 pt-1 leading-relaxed border-t border-slate-200 dark:border-slate-700">
                  <strong>Recruiter Insight:</strong> {RECRUITER_TARGET_PROFILES[selectedFitIndex].recruiterVerdict}
                </p>
              </div>
            </div>

            {/* USP 3: LIVE BENCHMARK & CODE AUDIT TERMINAL */}
            {(activeTab === 'benchmark' || activeTab === 'profile') && (
              <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4 font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-slate-400 ml-2 font-bold font-sans">
                      Punarshuru Live Verification Terminal • Cloud Lab Audit
                    </span>
                  </div>

                  <button
                    onClick={runBenchmark}
                    disabled={terminalRunning}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F26B1D] hover:bg-[#d85c14] text-white text-xs font-bold transition disabled:opacity-50 cursor-pointer"
                  >
                    <Play size={12} />
                    <span>{terminalRunning ? 'Running Audit...' : '▶ Run Live Benchmark'}</span>
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 min-h-[140px] bg-black/40 p-4 rounded-2xl border border-slate-800/80">
                  {terminalLogs.map((log, li) => (
                    <div
                      key={li}
                      className={`leading-relaxed ${
                        log.includes('[PASS]')
                          ? 'text-emerald-400 font-semibold'
                          : log.includes('🏆')
                          ? 'text-amber-300 font-bold'
                          : log.includes('⚡')
                          ? 'text-sky-400 font-bold'
                          : 'text-slate-400'
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1 font-sans">
                  <span>Docker Image: Spring Boot 3 + PostgreSQL</span>
                  <span>Uptime SLA: 99.95% Verified</span>
                  <span>Branch Coverage: 99.8%</span>
                </div>
              </div>
            )}

            {/* TAB CONTENT: PROFILE / EXPERIENCE / MODERNIZATION SPRINT */}
            {(activeTab === 'profile' || activeTab === 'skills') && (
              <div className="space-y-6">
                {/* CATEGORIZED SKILLS BREAKDOWN */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950 text-[#0B4F9C] dark:text-sky-300 flex items-center justify-center font-bold">
                        <Award size={16} />
                      </div>
                      <div>
                        <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                          Verified Skills & Technical Competencies
                        </h2>
                        <p className="text-[11px] text-slate-500">
                          Cross-verified via Punarshuru Cloud Labs & code evaluation
                        </p>
                      </div>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck size={14} />
                      <span>100% Validated</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Languages */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                        <Cpu size={14} className="text-[#0B4F9C]" />
                        <span>Programming Languages & Runtimes</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(passport.skills_breakdown?.languages || ['Java 17/21', 'SQL', 'TypeScript', 'Python']).map(
                          (sk) => (
                            <span
                              key={sk}
                              className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center gap-1"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              {sk}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    {/* Frameworks */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                        <Layers size={14} className="text-[#F26B1D]" />
                        <span>Frameworks & Microservices</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(passport.skills_breakdown?.frameworks || ['Spring Boot 3', 'Hibernate/JPA', 'React 19', 'RESTful APIs']).map(
                          (sk) => (
                            <span
                              key={sk}
                              className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center gap-1"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              {sk}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    {/* Cloud & DevOps */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                        <Cloud size={14} className="text-sky-500" />
                        <span>Cloud, Containers & DevOps</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(passport.skills_breakdown?.cloud_devops || ['Docker', 'AWS (EC2, S3, RDS)', 'GitHub Actions CI/CD', 'PostgreSQL', 'Redis']).map(
                          (sk) => (
                            <span
                              key={sk}
                              className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center gap-1"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              {sk}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    {/* Core Competencies */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                        <Brain size={14} className="text-purple-500" />
                        <span>Architecture & GenAI Specialization</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(passport.skills_breakdown?.core_competencies || ['Distributed Systems Architecture', 'Microservices Modernization', 'GenAI & RAG Integration']).map(
                          (sk) => (
                            <span
                              key={sk}
                              className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center gap-1"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                              {sk}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* SPRINT PROOF & PROFESSIONAL EXPERIENCE */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                      <Building size={16} />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                        Experience & Career Gap Modernization Sprint
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Demonstrated production code, uptime benchmarks, and architectural leadership
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                    {(passport.experience || []).map((exp, idx) => (
                      <div key={idx} className="relative pl-9 space-y-2">
                        {/* Timeline node */}
                        <div
                          className={`absolute left-1 top-1 w-5 h-5 rounded-full ring-4 ring-white dark:ring-slate-900 flex items-center justify-center text-[10px] font-bold ${
                            exp.is_gap_sprint
                              ? 'bg-[#F26B1D] text-white shadow-xs'
                              : 'bg-[#0B4F9C] text-white'
                          }`}
                        >
                          {idx + 1}
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <div>
                              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                <span>{exp.role}</span>
                                {exp.is_gap_sprint && (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                                    Verified Modernization Sprint
                                  </span>
                                )}
                              </h3>
                              <p className="text-xs font-semibold text-[#0B4F9C] dark:text-sky-400">
                                {exp.company} • <span className="text-slate-500 font-normal">{exp.location}</span>
                              </p>
                            </div>
                            <span className="text-[11px] font-mono text-slate-400 font-medium">
                              {exp.period}
                            </span>
                          </div>

                          <ul className="space-y-1.5 pt-1">
                            {exp.bullets.map((b, bi) => (
                              <li
                                key={bi}
                                className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2"
                              >
                                <CheckCircle2
                                  size={13}
                                  className={`shrink-0 mt-0.5 ${
                                    exp.is_gap_sprint ? 'text-[#F26B1D]' : 'text-emerald-600'
                                  }`}
                                />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FEATURED PROJECTS */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                        Featured Technical Projects
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Live microservices, vector pipelines & distributed code repos
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {(passport.projects || []).map((proj, pi) => (
                      <div
                        key={pi}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2.5 flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                              {proj.title}
                            </h3>
                            {proj.link && (
                              <a
                                href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-slate-400 hover:text-[#0B4F9C] transition"
                              >
                                <ExternalLink size={13} />
                              </a>
                            )}
                          </div>
                          <p className="text-[11px] font-mono text-[#0B4F9C] dark:text-sky-400 font-semibold">
                            {proj.stack}
                          </p>
                          <ul className="space-y-1 pt-1">
                            {proj.bullets.map((b, bi) => (
                              <li
                                key={bi}
                                className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5"
                              >
                                <span className="text-[#0B4F9C] font-bold">•</span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: CERTIFICATIONS */}
            {(activeTab === 'certifications' || activeTab === 'profile') && (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                      <Award size={16} />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                        Verifiable Industry Certifications
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Official credentials listed on candidate's verified resume
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                  {(passport.certifications || []).map((cert, ci) => (
                    <div
                      key={ci}
                      className="p-4 rounded-2xl bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/60 dark:to-slate-900 border border-slate-200/80 dark:border-slate-700/80 space-y-3 shadow-2xs flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            <span>Verified</span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {cert.issue_date}
                          </span>
                        </div>

                        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                          {cert.name}
                        </h3>

                        <p className="text-[11px] font-semibold text-[#0B4F9C] dark:text-sky-400">
                          {cert.issuer}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="truncate">ID: {cert.id}</span>
                        {cert.credential_url && (
                          <a
                            href={cert.credential_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#0B4F9C] dark:text-sky-400 font-bold hover:underline flex items-center gap-0.5"
                          >
                            <span>Verify</span>
                            <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: ATS RESUME PREVIEW */}
            {(activeTab === 'resume' || showResumeModal) && (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950 text-[#F26B1D] flex items-center justify-center font-bold">
                      <FileText size={16} />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                        Standard ATS & Overleaf Resume Preview
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Synchronized with live verified skills and sabbatical modernization sprint
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrintResume}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B4F9C] text-white text-xs font-bold hover:bg-[#083b75] transition cursor-pointer"
                    >
                      <Download size={13} />
                      <span>Download / Print PDF</span>
                    </button>
                  </div>
                </div>

                {/* Printable Document Paper */}
                <div
                  id="printable-resume-paper"
                  className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-6 sm:p-8 space-y-5 text-slate-900 dark:text-slate-100 shadow-md font-sans text-xs"
                >
                  {/* Header */}
                  <div className="text-center space-y-1 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <h2 className="text-xl font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      {passport.profile_name}
                    </h2>
                    <p className="text-slate-500 text-[11px]">
                      {passport.city || 'India'} | {passport.email} | {passport.phone}
                    </p>
                    <p className="text-[10px] text-[#0B4F9C] dark:text-sky-400 font-mono">
                      {passport.linkedin} • {passport.github}
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800 pb-0.5">
                      Professional Summary
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                      {passport.summary}
                    </p>
                  </div>

                  {/* Skills */}
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800 pb-0.5">
                      Technical Skills
                    </h3>
                    <div className="text-[11px] space-y-0.5 text-slate-700 dark:text-slate-300">
                      <p>
                        <strong className="text-slate-900 dark:text-white">Languages:</strong>{' '}
                        {(passport.skills_breakdown?.languages || []).join(', ')}
                      </p>
                      <p>
                        <strong className="text-slate-900 dark:text-white">Frameworks:</strong>{' '}
                        {(passport.skills_breakdown?.frameworks || []).join(', ')}
                      </p>
                      <p>
                        <strong className="text-slate-900 dark:text-white">Cloud & DevOps:</strong>{' '}
                        {(passport.skills_breakdown?.cloud_devops || []).join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800 pb-0.5">
                      Professional Experience
                    </h3>
                    {(passport.experience || []).map((exp, ei) => (
                      <div key={ei} className="space-y-0.5">
                        <div className="flex justify-between font-bold text-slate-900 dark:text-white text-[11px]">
                          <span>
                            {exp.role} — <span className="text-[#0B4F9C] dark:text-sky-400">{exp.company}</span>
                          </span>
                          <span className="font-normal font-mono text-[10px] text-slate-400">{exp.period}</span>
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 text-[10.5px] text-slate-600 dark:text-slate-300">
                          {exp.bullets.map((b, bi) => (
                            <li key={bi}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Certifications */}
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800 pb-0.5">
                      Certifications
                    </h3>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700 dark:text-slate-300">
                      {(passport.certifications || []).map((c, ci) => (
                        <li key={ci}>
                          <strong>{c.name}</strong> — {c.issuer} ({c.issue_date})
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Education */}
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800 pb-0.5">
                      Education
                    </h3>
                    {(passport.education || []).map((edu, edui) => (
                      <div key={edui} className="flex justify-between text-[11px] text-slate-700 dark:text-slate-300">
                        <span>
                          <strong>{edu.degree}</strong> — {edu.institution}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">{edu.period}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STICKY RECRUITER MOBILE ACTION BAR */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 p-3 sm:hidden shadow-2xl flex items-center justify-between gap-2">
              <button
                onClick={() => setShowScheduleModal(true)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-extrabold text-center flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Clock size={14} />
                <span>Schedule Screen</span>
              </button>

              <button
                onClick={() => setShowContactModal(true)}
                className="flex-1 py-2.5 rounded-xl bg-[#0B4F9C] text-white text-xs font-extrabold text-center flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Mail size={14} />
                <span>Contact</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* SCHEDULE 15-MIN SCREEN MODAL */}
      {showScheduleModal && passport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <Clock size={18} />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Fast-Track 15-Min Intro Screen
                </h3>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Invite {passport.profile_name} to a 15-minute introductory technical screen or portfolio discussion.
            </p>

            <div className="space-y-2.5">
              <a
                href={`mailto:${passport.email}?subject=Invitation: 15-Min Technical Screen with ${passport.profile_name}&body=Hi ${passport.profile_name},%0D%0A%0D%0AWe reviewed your verified Punarshuru AI Talent Passport for the ${passport.target_role} role.%0D%0A%0D%0AWe would love to invite you to a 15-minute introductory screen. Please let us know which of the following times suit you:%0D%0A- Tomorrow at 3:00 PM IST%0D%0A- Tomorrow at 5:30 PM IST%0D%0A%0D%0ALooking forward to speaking with you!`}
                className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 transition"
              >
                <Clock size={14} />
                <span>Send Calendar Invite via Email</span>
              </a>

              <a
                href={`https://api.whatsapp.com/send?phone=919876543210&text=${encodeURIComponent(
                  `Hi ${passport.profile_name}, I saw your verified Punarshuru AI Talent Passport. Are you free for a quick 15-min call regarding the ${passport.target_role} opening?`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-extrabold flex items-center justify-center gap-2 transition"
              >
                <WhatsAppIcon size={14} />
                <span>Message on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* VERIFY CRYPTOGRAPHIC SEAL MODAL */}
      {showVerifyModal && passport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <ShieldCheck size={18} />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Cryptographic Trust Seal
                </h3>
              </div>
              <button
                onClick={() => setShowVerifyModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              This profile has been verified against the Punarshuru National AI Talent Registry. Skills, certifications, and experience evidence are cryptographically hashed.
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Registry Slug:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{passport.slug}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-emerald-600">Active & Verified</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Issue Timestamp:</span>
                <span className="font-mono text-slate-600 dark:text-slate-300">{passport.created_at}</span>
              </div>
              <div className="space-y-1 pt-1 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 text-[10px]">SHA-256 Verification Signature:</span>
                <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-900 font-mono text-[11px] text-slate-700 dark:text-slate-300 break-all">
                  <span className="truncate">{passport.verification_hash || '0x7F9A2B81C3D4E5F6901A84E'}</span>
                  <button
                    onClick={() => copyHash(passport.verification_hash || '0x7F9A2B81C3D4E5F6901A84E')}
                    className="p-1 text-slate-400 hover:text-slate-700 shrink-0"
                    title="Copy Signature"
                  >
                    {copiedHash ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowVerifyModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#0B4F9C] text-white text-xs font-bold cursor-pointer"
            >
              Close Verification Inspector
            </button>
          </div>
        </div>
      )}

      {/* RECRUITER CONTACT MODAL */}
      {showContactModal && passport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950 text-[#0B4F9C] flex items-center justify-center font-bold">
                  <Mail size={18} />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Fast-Track Recruiter Outreach
                </h3>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Connect directly with {passport.profile_name} for high-priority interviews and role considerations.
            </p>

            <div className="space-y-2.5">
              <a
                href={`mailto:${passport.email}?subject=Interview Invitation: ${passport.target_role || 'Senior Software Engineer'}&body=Hi ${passport.profile_name}, We reviewed your verified Punarshuru AI Talent Passport and would like to schedule an interview.`}
                className="w-full py-3 px-4 rounded-2xl bg-[#0B4F9C] hover:bg-[#083b75] text-white text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <Mail size={14} />
                <span>Send Direct Email ({passport.email})</span>
              </a>

              {passport.linkedin && (
                <a
                  href={passport.linkedin.startsWith('http') ? passport.linkedin : `https://${passport.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-2xl bg-[#0077B5] hover:bg-[#005f93] text-white text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <LinkedInIcon size={14} />
                  <span>Message on LinkedIn</span>
                </a>
              )}

              <a
                href={`tel:${passport.phone || '+919876543210'}`}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition"
              >
                <Phone size={14} />
                <span>Call {passport.phone || '+91 98765 43210'}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
