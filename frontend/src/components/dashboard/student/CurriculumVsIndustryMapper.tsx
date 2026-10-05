import { useState } from 'react'
import {
  Layers,
  CheckCircle2,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Code2,
  Terminal,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts'
import { Link } from 'react-router-dom'

export interface SyllabusItem {
  topic: string
  category: string
  collegeFocusPct: number
  marketDemandPct: number
  verdict: 'Aligned' | 'Oversaturated' | 'Critical Market Gap'
  collegeContent: string
  industryDemand: string
  freeBridgeFix: string
  bridgeHours: number
}

export interface StreamData {
  id: string
  title: string
  icon: any
  alignmentScore: number
  avgGapWeeks: number
  syllabus: SyllabusItem[]
  radarData: Array<{ dimension: string; college: number; industry: number }>
}

const STREAM_DATA: StreamData[] = [
  {
    id: 'cs-core',
    title: 'Computer Science & IT (Core B.Tech / BCA)',
    icon: Code2,
    alignmentScore: 48,
    avgGapWeeks: 6,
    syllabus: [
      {
        topic: 'Cloud Infrastructure (AWS / Azure / GCP)',
        category: 'Deployment & Infra',
        collegeFocusPct: 15,
        marketDemandPct: 92,
        verdict: 'Critical Market Gap',
        collegeContent: 'Brief 1-chapter theory on virtual machines and cloud types.',
        industryDemand: 'Hands-on VPC, S3, IAM roles, ECS deployment & containerized networking.',
        freeBridgeFix: 'AWS Cloud Practitioner Essentials + Free Tier Hands-on',
        bridgeHours: 20,
      },
      {
        topic: 'Docker, Microservices & CI/CD',
        category: 'DevOps & Tooling',
        collegeFocusPct: 10,
        marketDemandPct: 88,
        verdict: 'Critical Market Gap',
        collegeContent: 'Often completely missing or only mentioned as an elective.',
        industryDemand: 'Dockerfile multi-stage builds, Docker Compose, GitHub Actions CI/CD pipelines.',
        freeBridgeFix: 'Docker for Beginners by Nana + GitHub Actions Lab',
        bridgeHours: 15,
      },
      {
        topic: 'GenAI, Embeddings & Modern APIs',
        category: 'Emerging Tech',
        collegeFocusPct: 8,
        marketDemandPct: 85,
        verdict: 'Critical Market Gap',
        collegeContent: 'Legacy AI/Prolog or 1990s expert systems syllabus.',
        industryDemand: 'OpenAI/Gemini API integration, LangChain, Vector Embeddings, pgvector.',
        freeBridgeFix: 'DeepLearning.AI LangChain for LLM App Development',
        bridgeHours: 18,
      },
      {
        topic: 'Modern Web Engineering & TypeScript',
        category: 'Software Engineering',
        collegeFocusPct: 25,
        marketDemandPct: 82,
        verdict: 'Critical Market Gap',
        collegeContent: 'Static HTML/CSS/PHP or basic JSP and Servlets.',
        industryDemand: 'React/Next.js 15, TypeScript type safety, RESTful API design, Postman tests.',
        freeBridgeFix: 'Full Stack Open (University of Helsinki Free Course)',
        bridgeHours: 28,
      },
      {
        topic: 'DBMS & Relational SQL',
        category: 'Databases',
        collegeFocusPct: 85,
        marketDemandPct: 80,
        verdict: 'Aligned',
        collegeContent: 'ER Diagrams, 3NF Normalization, Relational Algebra, basic SQL queries.',
        industryDemand: 'Indexing strategies, query optimization, connection pooling, transactions in Node/Python.',
        freeBridgeFix: 'Use The Index, Luke (SQL Indexing Mastery)',
        bridgeHours: 8,
      },
      {
        topic: 'Operating Systems & C/C++ Theory',
        category: 'Foundations',
        collegeFocusPct: 90,
        marketDemandPct: 40,
        verdict: 'Oversaturated',
        collegeContent: 'Deadlock avoidance (Banker\'s Algo), Semaphore math, Turbo C compiler.',
        industryDemand: 'Concurrency basics, Linux shell commands, memory leaks & Docker system stats.',
        freeBridgeFix: 'Linux Command Line for Developers (OverTheWire Bandit)',
        bridgeHours: 10,
      },
    ],
    radarData: [
      { dimension: 'Cloud / AWS', college: 15, industry: 92 },
      { dimension: 'DevOps / Docker', college: 10, industry: 88 },
      { dimension: 'Modern APIs', college: 25, industry: 85 },
      { dimension: 'GenAI / LLMs', college: 8, industry: 85 },
      { dimension: 'Databases / SQL', college: 85, industry: 80 },
      { dimension: 'Core CS Theory', college: 90, industry: 45 },
    ],
  },
  {
    id: 'ai-data',
    title: 'AI, Machine Learning & Data Science',
    icon: Sparkles,
    alignmentScore: 42,
    avgGapWeeks: 7,
    syllabus: [
      {
        topic: 'RAG & Vector Search Engineering',
        category: 'Generative AI',
        collegeFocusPct: 5,
        marketDemandPct: 95,
        verdict: 'Critical Market Gap',
        collegeContent: 'Not present in standard UGC/AICTE university curriculum.',
        industryDemand: 'Chunking strategies, Qdrant/Pinecone/Chroma integration, Hybrid search.',
        freeBridgeFix: 'Pinecone Vector DB Mastery & RAG Handbook',
        bridgeHours: 22,
      },
      {
        topic: 'Model Deployment & MLOps (FastAPI/Docker)',
        category: 'Production ML',
        collegeFocusPct: 12,
        marketDemandPct: 90,
        verdict: 'Critical Market Gap',
        collegeContent: 'Jupyter Notebook `.ipynb` model training only; no production deployment.',
        industryDemand: 'Packaging models in FastAPI endpoints, Docker containers, AWS SageMaker/ECS.',
        freeBridgeFix: 'MadeWithML Production MLOps Course',
        bridgeHours: 24,
      },
      {
        topic: 'Data Pipelines (PySpark / Airflow / SQL)',
        category: 'Data Engineering',
        collegeFocusPct: 20,
        marketDemandPct: 86,
        verdict: 'Critical Market Gap',
        collegeContent: 'Small CSV datasets with Pandas `read_csv` in memory.',
        industryDemand: 'Streaming data, ETL orchestration with Airflow, data warehouse SQL.',
        freeBridgeFix: 'Data Engineering Zoomcamp (Free on GitHub)',
        bridgeHours: 30,
      },
      {
        topic: 'Traditional Machine Learning Algorithms',
        category: 'Foundations',
        collegeFocusPct: 85,
        marketDemandPct: 75,
        verdict: 'Aligned',
        collegeContent: 'Linear Regression, SVM, Decision Trees, K-Means mathematical derivations.',
        industryDemand: 'Feature engineering, hyperparameter tuning, model evaluation metrics in production.',
        freeBridgeFix: 'Scikit-Learn Official User Guide Practice',
        bridgeHours: 12,
      },
    ],
    radarData: [
      { dimension: 'RAG & Vector DB', college: 5, industry: 95 },
      { dimension: 'MLOps & Deploy', college: 12, industry: 90 },
      { dimension: 'Data Pipelines', college: 20, industry: 86 },
      { dimension: 'Classical ML', college: 85, industry: 75 },
      { dimension: 'Deep Learning', college: 40, industry: 80 },
      { dimension: 'Math / Stats', college: 80, industry: 60 },
    ],
  },
]

export default function CurriculumVsIndustryMapper() {
  const [selectedStreamId, setSelectedStreamId] = useState<string>('cs-core')
  const [viewMode, setViewMode] = useState<'bars' | 'radar' | 'audit'>('bars')

  // Audit Checklist State (interactive student tool)
  const [checkedAuditItems, setCheckedAuditItems] = useState<Record<string, boolean>>({
    'git-prs': false,
    'docker-deploy': false,
    'cloud-aws': false,
    'rest-api': true,
    'sql-dbms': true,
    'genai-rag': false,
  })

  const activeStream = STREAM_DATA.find((s) => s.id === selectedStreamId) || STREAM_DATA[0]

  const toggleAudit = (key: string) => {
    setCheckedAuditItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Calculate audit score
  const totalAuditItems = Object.keys(checkedAuditItems).length
  const completedAuditCount = Object.values(checkedAuditItems).filter(Boolean).length
  const studentReadinessScore = Math.round((completedAuditCount / totalAuditItems) * 100)

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-7">
      {/* ── 1. Header & Context ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/60 dark:to-indigo-950/60 text-[#0B4F9C] dark:text-sky-300 text-xs font-black mb-1.5 border border-blue-200/50">
            <Layers size={13} />
            <span>Feature 2 • Curriculum vs Industry Demand Analytics</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Academic Syllabus vs Real Tech Recruiter Demand
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            Discover the exact blindspots in university curriculum that cause 85%+ campus candidate rejections — and the actionable free modules to fix them.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Average Gap</span>
            <span className="text-sm font-black text-[#F26B1D]">~{activeStream.avgGapWeeks} Weeks Bridge</span>
          </div>
        </div>
      </div>

      {/* ── 2. Stream & View Selectors ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-2xl border border-slate-200/70 dark:border-slate-700/60">
        {/* Stream Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {STREAM_DATA.map((stream) => {
            const Icon = stream.icon
            const isSelected = stream.id === selectedStreamId
            return (
              <button
                key={stream.id}
                type="button"
                onClick={() => setSelectedStreamId(stream.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 text-[#0B4F9C] dark:text-sky-400 shadow-xs border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon size={14} className={isSelected ? 'text-[#0B4F9C] dark:text-sky-400' : 'text-slate-400'} />
                <span>{stream.title}</span>
              </button>
            )
          })}
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/70 dark:border-slate-700 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('bars')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              viewMode === 'bars'
                ? 'bg-[#0B4F9C] text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Comparative Bars
          </button>
          <button
            type="button"
            onClick={() => setViewMode('radar')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              viewMode === 'radar'
                ? 'bg-[#0B4F9C] text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Radar Gap Map
          </button>
          <button
            type="button"
            onClick={() => setViewMode('audit')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              viewMode === 'audit'
                ? 'bg-[#0B4F9C] text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Audit My Syllabus 🧪
          </button>
        </div>
      </div>

      {/* ── 3. Graphical Comparison Views ── */}
      {viewMode === 'bars' && (
        <div className="space-y-6">
          {/* Recharts Bar Chart Container */}
          <div className="p-5 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  University Coverage vs Industry Job Openings (%)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Notice how college prioritizes 1980s theory while tech recruiters test production deployment.
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-3 h-3 rounded-md bg-slate-400" />
                  <span>College Syllabus</span>
                </span>
                <span className="flex items-center gap-1.5 text-[#0B4F9C] dark:text-sky-400">
                  <span className="w-3 h-3 rounded-md bg-[#0B4F9C]" />
                  <span>Market Demand</span>
                </span>
              </div>
            </div>

            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={activeStream.syllabus.map((s) => ({
                    topic: s.topic.split(' (')[0],
                    College: s.collegeFocusPct,
                    Industry: s.marketDemandPct,
                  }))}
                  margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
                  barGap={6}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis
                    dataKey="topic"
                    tick={{ fill: '#64748B', fontSize: 10, fontWeight: 600 }}
                    angle={-15}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                    unit="%"
                    domain={[0, 100]}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
                            <p className="font-black text-amber-400">{label}</p>
                            <p className="text-slate-300 flex justify-between gap-4">
                              <span>College Syllabus:</span>
                              <span className="font-bold">{payload[0]?.value}%</span>
                            </p>
                            <p className="text-sky-400 flex justify-between gap-4">
                              <span>Industry Demand:</span>
                              <span className="font-bold">{payload[1]?.value}%</span>
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="College" fill="#94A3B8" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="Industry" fill="#0B4F9C" radius={[4, 4, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Syllabus Item Cards */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <BookOpen size={14} className="text-[#0B4F9C]" />
              <span>Detailed Topic Gap & Actionable Bridge Solutions:</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {activeStream.syllabus.map((item) => (
                <div
                  key={item.topic}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                    item.verdict === 'Critical Market Gap'
                      ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-900/60 shadow-2xs'
                      : item.verdict === 'Aligned'
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/60'
                      : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                        {item.category}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                          item.verdict === 'Critical Market Gap'
                            ? 'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-200 border border-rose-300'
                            : item.verdict === 'Aligned'
                            ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {item.verdict}
                      </span>
                    </div>

                    <h5 className="text-sm font-black text-slate-900 dark:text-white">
                      {item.topic}
                    </h5>

                    {/* What College Teaches vs Industry */}
                    <div className="mt-3 space-y-1.5 text-[11px] leading-relaxed">
                      <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800">
                        <strong className="text-slate-500 dark:text-slate-400">🏫 College Teaches: </strong>
                        <span className="text-slate-700 dark:text-slate-300">{item.collegeContent}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-blue-50/80 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-900/60">
                        <strong className="text-[#0B4F9C] dark:text-sky-400">💼 Recruiter Demands: </strong>
                        <span className="text-blue-950 dark:text-blue-100 font-medium">{item.industryDemand}</span>
                      </div>
                    </div>
                  </div>

                  {/* Free Bridge Fix */}
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
                      <Sparkles size={12} />
                      <span className="truncate max-w-[200px] sm:max-w-[240px]">{item.freeBridgeFix}</span>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border shrink-0">
                      ~{item.bridgeHours}h
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 4. Radar View ── */}
      {viewMode === 'radar' && (
        <div className="p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
          <div className="text-center max-w-xl mx-auto">
            <h4 className="text-base font-black text-slate-900 dark:text-white">
              Syllabus Coverage Perimeter Radar
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              The grey area shows what college syllabi cover, while the blue outline represents what product tech companies require for entry-level roles.
            </p>
          </div>

          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={activeStream.radarData}>
                <PolarGrid stroke="#CBD5E1" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 9 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const p = payload[0].payload
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
                          <p className="font-bold text-amber-400">{p.dimension}</p>
                          <p className="text-slate-300">College Focus: {p.college}%</p>
                          <p className="text-sky-400">Industry Requirement: {p.industry}%</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Radar
                  name="College Syllabus"
                  dataKey="college"
                  stroke="#94A3B8"
                  fill="#94A3B8"
                  fillOpacity={0.4}
                />
                <Radar
                  name="Industry Benchmark"
                  dataKey="industry"
                  stroke="#0B4F9C"
                  fill="#0B4F9C"
                  fillOpacity={0.35}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── 5. Interactive "Audit My Syllabus" Tool ── */}
      {viewMode === 'audit' && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-50/80 via-orange-50/40 to-slate-50 dark:from-slate-800/80 dark:via-slate-800/40 dark:to-slate-900 border-2 border-[#0B4F9C]/30 dark:border-blue-900/80 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-700/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Terminal size={16} className="text-[#0B4F9C] dark:text-sky-400" />
                <span className="text-[10px] font-black uppercase tracking-wider text-[#0B4F9C] dark:text-sky-400">
                  Interactive Student Audit
                </span>
              </div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                Check What Your College Has Actually Taught You
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tick the practical production skills you currently know to calculate your recruiter readiness.
              </p>
            </div>

            {/* Live Score Circle */}
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs shrink-0">
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Readiness Score</span>
                <span
                  className={`text-2xl font-black ${
                    studentReadinessScore >= 70
                      ? 'text-emerald-600'
                      : studentReadinessScore >= 40
                      ? 'text-amber-500'
                      : 'text-rose-600'
                  }`}
                >
                  {studentReadinessScore}%
                </span>
              </div>
              <span
                className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${
                  studentReadinessScore >= 70
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : studentReadinessScore >= 40
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}
              >
                {studentReadinessScore >= 70 ? 'Job Ready' : studentReadinessScore >= 40 ? 'Moderate Risk' : 'High Risk'}
              </span>
            </div>
          </div>

          {/* Checkboxes List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'git-prs',
                title: 'Git Branching & GitHub Pull Requests',
                desc: 'Know how to resolve merge conflicts and write clean commit messages.',
              },
              {
                id: 'docker-deploy',
                title: 'Dockerizing Full-Stack Apps',
                desc: 'Have written a Dockerfile and deployed via Docker Compose locally.',
              },
              {
                id: 'cloud-aws',
                title: 'AWS Cloud Deployment (EC2 / S3 / IAM)',
                desc: 'Deployed a live web app or API with cloud storage and access keys.',
              },
              {
                id: 'rest-api',
                title: 'REST API Design & Postman Testing',
                desc: 'Understand HTTP status codes, CORS headers, and auth tokens (JWT).',
              },
              {
                id: 'sql-dbms',
                title: 'SQL Indexing & Relational DB Connections',
                desc: 'Can optimize slow queries and connect PostgreSQL/MySQL to code.',
              },
              {
                id: 'genai-rag',
                title: 'Vector Search & GenAI Embeddings',
                desc: 'Built or experimented with LangChain, OpenAI/Gemini API, or Vector DBs.',
              },
            ].map((chk) => {
              const isChecked = checkedAuditItems[chk.id]
              return (
                <button
                  key={chk.id}
                  type="button"
                  onClick={() => toggleAudit(chk.id)}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex items-start gap-3 ${
                    isChecked
                      ? 'bg-white dark:bg-slate-800 border-[#0B4F9C] dark:border-sky-500 shadow-xs'
                      : 'bg-slate-100/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isChecked
                        ? 'bg-[#0B4F9C] text-white'
                        : 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                    }`}
                  >
                    {isChecked && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-900 dark:text-white">{chk.title}</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                      {chk.desc}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Action Recommendation Banner */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                Recommended 21-Day Syllabus Patch:
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                Bridge the {totalAuditItems - completedAuditCount} missing practical skills using our curated 30-Day Sprint.
              </p>
            </div>
            <Link
              to="/path"
              className="px-4 py-2 rounded-xl bg-[#0B4F9C] hover:bg-blue-800 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <span>Start Action Sprint</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}

      {/* ── 6. Recruiter Reality Check Quote Cards ── */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert size={16} className="text-amber-400" />
          <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
            Tech Recruiter Truth: Why Campus Resumes Get Rejected in Round 1
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs space-y-1">
            <span className="text-[10px] font-extrabold text-rose-400">92% Rejection Cause</span>
            <p className="text-slate-300 leading-relaxed font-medium">
              "Candidates write textbook definitions of OS Deadlocks and DBMS 3NF on paper, but cannot create a simple Docker container or debug a CORS error."
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs space-y-1">
            <span className="text-[10px] font-extrabold text-amber-400">84% Missing Proofs</span>
            <p className="text-slate-300 leading-relaxed font-medium">
              "Zero active GitHub history. Resumes list 'Library Management System' from 2nd year with no live URL or containerized deployment."
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs space-y-1">
            <span className="text-[10px] font-extrabold text-emerald-400">Hiring Fast-Track</span>
            <p className="text-slate-300 leading-relaxed font-medium">
              "Candidates who present 1 working FastAPI + AWS ECS repo with clean GitHub Actions skip the theoretical screening round directly to engineering rounds."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

