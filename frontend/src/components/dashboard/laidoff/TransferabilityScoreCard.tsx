import { useState, useMemo } from 'react'
import {
  CheckCircle2,
  Clock,
  Sparkles,
  Target,
  Zap,
  ArrowRight,
  Building2,
  Copy,
  Check,
  BarChart2,
  Briefcase,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { Link } from 'react-router-dom'

export interface TargetPivot {
  targetRole: string
  matchPct: number
  retainedCapitalPct: number
  salaryRangeLPA: string
  avgHikePct: string
  hiringVelocity: string
  estimatedWeeks: string
  retainedSkills: { name: string; whyValuable: string }[]
  deltaSkills: { name: string; hoursToLearn: number; freeCourse: string }[]
  targetCompanies: { name: string; tag: string }[]
  resumePitch: string
  tacticalMove: string
}

export interface SourceProfile {
  sourceRole: string
  category: string
  baselineDescription: string
  pivots: TargetPivot[]
}

const SOURCE_PROFILES: Record<string, SourceProfile> = {
  qa: {
    sourceRole: 'Manual QA / Test Engineer',
    category: 'Quality Engineering',
    baselineDescription: 'Strong edge-case intuition, bug lifecycle governance, regression strategy, API schema understanding.',
    pivots: [
      {
        targetRole: 'Automation SDET (Playwright & Python)',
        matchPct: 84,
        retainedCapitalPct: 80,
        salaryRangeLPA: '₹12 - ₹18 LPA',
        avgHikePct: '+45%',
        hiringVelocity: 'High (450+ Active Openings)',
        estimatedWeeks: '3–4 Weeks',
        retainedSkills: [
          { name: 'Test Scenario & Edge Case Design', whyValuable: 'Directly dictates robust automation test suites without flaky test cases.' },
          { name: 'API Contract & Postman Verification', whyValuable: '70% identical to writing programmatic API integration assertions.' },
          { name: 'SQL Query & Schema Validation', whyValuable: 'Used for database state assertions before/after automated runs.' },
          { name: 'Jira Defect Triaging & Agile Lifecycles', whyValuable: 'Crucial for CI/CD automated pipeline bug reporting.' },
        ],
        deltaSkills: [
          { name: 'Playwright / TypeScript Test Runner', hoursToLearn: 18, freeCourse: 'Playwright Automation Bootcamp (freeCodeCamp)' },
          { name: 'Python Automation Scripts', hoursToLearn: 14, freeCourse: 'Python for Testers (SWAYAM)' },
          { name: 'GitHub Actions Automated Test CI', hoursToLearn: 10, freeCourse: 'CI/CD Pipelines (Skill India)' },
        ],
        targetCompanies: [
          { name: 'Razorpay', tag: 'Product Unicorn' },
          { name: 'Swiggy', tag: 'High-Growth Tech' },
          { name: 'Barclays Tech', tag: 'Global GCC' },
          { name: 'Freshworks', tag: 'SaaS Leader' },
        ],
        resumePitch: 'SDET with 3+ years testing foundation, specializing in zero-flakiness Playwright test suites, automated API regression, and GitHub Actions CI pipelines.',
        tacticalMove: 'Convert 1 complex manual test suite into a public GitHub repository running Playwright with automated GitHub Actions PR checks.',
      },
      {
        targetRole: 'Cloud QA & Performance Engineer',
        matchPct: 76,
        retainedCapitalPct: 72,
        salaryRangeLPA: '₹13 - ₹19 LPA',
        avgHikePct: '+50%',
        hiringVelocity: 'Very High (Fintech Surge)',
        estimatedWeeks: '4–6 Weeks',
        retainedSkills: [
          { name: 'System Boundary & Stress Limits', whyValuable: 'Core intuition required for designing distributed load and burst traffic profiles.' },
          { name: 'Root-Cause Analysis (RCA)', whyValuable: 'Accelerates tracing slow query latencies and server bottlenecks in APM logs.' },
          { name: 'Cross-Service Regression Strategy', whyValuable: 'Ensures zero regressions during cloud microservice canary rollouts.' },
        ],
        deltaSkills: [
          { name: 'k6 / Distributed Load Testing', hoursToLearn: 16, freeCourse: 'Performance Testing with k6 (freeCodeCamp)' },
          { name: 'AWS CloudWatch & Datadog Metrics', hoursToLearn: 14, freeCourse: 'Cloud Observability (NPTEL)' },
          { name: 'Dockerized Test Environments', hoursToLearn: 12, freeCourse: 'Docker for Engineers (freeCodeCamp)' },
        ],
        targetCompanies: [
          { name: 'PhonePe', tag: 'FinTech Scale' },
          { name: 'CRED', tag: 'High-Concurrency' },
          { name: 'Lowe’s India', tag: 'Retail GCC' },
          { name: 'Jio Platforms', tag: 'Telecom Tech' },
        ],
        resumePitch: 'Performance & Reliability QA with proven expertise in stress-testing distributed microservices using k6, tracing APM metrics, and containerized performance benchmarking.',
        tacticalMove: 'Set up an automated k6 load script testing an open-source payment API with simulated 10k concurrent users and publish report graph on GitHub.',
      },
      {
        targetRole: 'AI Quality & LLM Evaluation Specialist',
        matchPct: 72,
        retainedCapitalPct: 68,
        salaryRangeLPA: '₹15 - ₹22 LPA',
        avgHikePct: '+70%',
        hiringVelocity: 'Fastest Emerging (+85% YoY)',
        estimatedWeeks: '4–5 Weeks',
        retainedSkills: [
          { name: 'Adversarial Prompting & Edge Cases', whyValuable: 'Directly maps to finding prompt injection and hallucination vulnerabilities.' },
          { name: 'Ground Truth Dataset Formulation', whyValuable: 'Formulates gold-standard benchmark datasets for AI model evaluation.' },
          { name: 'Qualitative Acceptance Criteria', whyValuable: 'Defines strict rubric standards for GenAI output reliability.' },
        ],
        deltaSkills: [
          { name: 'Ragas / PromptFoo Evaluation Framework', hoursToLearn: 16, freeCourse: 'LLM Evaluation & Benchmarking (DeepLearning.AI)' },
          { name: 'Python Data Extraction & Pandas', hoursToLearn: 15, freeCourse: 'Python Data Fundamentals (SWAYAM)' },
          { name: 'Vector Similarity Testing (ChromaDB)', hoursToLearn: 12, freeCourse: 'Vector DBs in Action (freeCodeCamp)' },
        ],
        targetCompanies: [
          { name: 'Sarvam AI', tag: 'GenAI Lab' },
          { name: 'Fractal AI', tag: 'Enterprise AI' },
          { name: 'Postman', tag: 'Dev Tools' },
          { name: 'InMobi', tag: 'AdTech AI' },
        ],
        resumePitch: 'AI Quality Specialist combining deep test-design rigor with modern LLM evaluation harnesses (Ragas, PromptFoo) to eliminate model hallucinations in enterprise RAG pipelines.',
        tacticalMove: 'Run an evaluation benchmark comparing 3 open-source embedding models on Indian legal/tech FAQs and publish results table on LinkedIn.',
      },
    ],
  },
  dev: {
    sourceRole: 'Backend / Full-Stack Developer',
    category: 'Software Engineering',
    baselineDescription: 'API engineering, relational databases, business logic implementation, clean code, Git workflows.',
    pivots: [
      {
        targetRole: 'GenAI & RAG Platform Engineer',
        matchPct: 88,
        retainedCapitalPct: 85,
        salaryRangeLPA: '₹16 - ₹24 LPA',
        avgHikePct: '+60%',
        hiringVelocity: 'Extreme Demand (1,200+ Openings)',
        estimatedWeeks: '3–4 Weeks',
        retainedSkills: [
          { name: 'FastAPI / Node Backend Architecture', whyValuable: '90% of GenAI applications are standard async REST microservices.' },
          { name: 'Database Query Optimization', whyValuable: 'Directly applies to pgvector and relational metadata filtering in RAG.' },
          { name: 'Docker & Microservices Deployments', whyValuable: 'Essential for containerizing vector search engines and LLM gateways.' },
        ],
        deltaSkills: [
          { name: 'LangChain & LlamaIndex Architecture', hoursToLearn: 18, freeCourse: 'Production GenAI Applications (DeepLearning.AI)' },
          { name: 'ChromaDB / Vector Search Indexing', hoursToLearn: 12, freeCourse: 'Vector Databases in Practice (freeCodeCamp)' },
          { name: 'LLM Token Latency & Caching (Redis)', hoursToLearn: 10, freeCourse: 'High-Performance API Caching (SWAYAM)' },
        ],
        targetCompanies: [
          { name: 'Razorpay', tag: 'Product Unicorn' },
          { name: 'Sarvam AI', tag: 'GenAI Lab' },
          { name: 'Persistent Systems', tag: 'Enterprise Elevate' },
          { name: 'Siemens Healthineers', tag: 'Global GCC' },
        ],
        resumePitch: 'Backend Engineer specialized in building production RAG pipelines, FastAPI vector search microservices, and semantic retrieval caching with Redis.',
        tacticalMove: 'Deploy a multi-document semantic search engine on AWS ECS using FastAPI and ChromaDB with live Swagger docs.',
      },
      {
        targetRole: 'Cloud Infrastructure & SRE Lead',
        matchPct: 80,
        retainedCapitalPct: 78,
        salaryRangeLPA: '₹15 - ₹22 LPA',
        avgHikePct: '+55%',
        hiringVelocity: 'High (Stable GCC Hiring)',
        estimatedWeeks: '4–5 Weeks',
        retainedSkills: [
          { name: 'Backend Debugging & Thread Dumps', whyValuable: 'Crucial for isolating production latency spikes and memory leaks.' },
          { name: 'Linux Commands & Shell Scripting', whyValuable: 'Forms 60% of daily server configuration and container debugging.' },
          { name: 'Git & Branching Lifecycles', whyValuable: 'Directly translates into GitOps and Infrastructure-as-Code workflows.' },
        ],
        deltaSkills: [
          { name: 'Kubernetes (EKS) & Helm Charts', hoursToLearn: 20, freeCourse: 'Kubernetes for Developers (freeCodeCamp)' },
          { name: 'Terraform Infrastructure as Code', hoursToLearn: 15, freeCourse: 'Terraform on AWS (NPTEL)' },
          { name: 'Prometheus & Grafana Alerting', hoursToLearn: 12, freeCourse: 'DevOps Monitoring (Skill India)' },
        ],
        targetCompanies: [
          { name: 'PhonePe', tag: 'Scale Platform' },
          { name: 'Target Tech', tag: 'Retail GCC' },
          { name: 'Barclays', tag: 'FinTech GCC' },
          { name: 'Swiggy', tag: 'Hyperlocal Tech' },
        ],
        resumePitch: 'Backend SWE transitioning to Cloud & SRE, leveraging deep application debugging experience with Kubernetes orchestration, Terraform IaC, and Prometheus observability.',
        tacticalMove: 'Write Terraform scripts provisioning an EKS cluster with automated horizontal pod autoscaling (HPA) and publish GitHub repo.',
      },
      {
        targetRole: 'Distributed Systems & Data Platform Engineer',
        matchPct: 75,
        retainedCapitalPct: 70,
        salaryRangeLPA: '₹17 - ₹25 LPA',
        avgHikePct: '+65%',
        hiringVelocity: 'High (Product Scaleups)',
        estimatedWeeks: '5–6 Weeks',
        retainedSkills: [
          { name: 'Relational & NoSQL Schema Design', whyValuable: 'Directly maps to dimensional modeling and event schema registries.' },
          { name: 'Concurrency & Multi-threading', whyValuable: 'Fundamental for high-throughput stream processing with Kafka.' },
        ],
        deltaSkills: [
          { name: 'Apache Kafka Event Streams', hoursToLearn: 18, freeCourse: 'Kafka for Backend Engineers (freeCodeCamp)' },
          { name: 'PySpark Large-Scale Processing', hoursToLearn: 16, freeCourse: 'Data Engineering with PySpark (SWAYAM)' },
          { name: 'Apache Airflow Orchestration', hoursToLearn: 12, freeCourse: 'ETL Pipelines with Airflow (NPTEL)' },
        ],
        targetCompanies: [
          { name: 'Swiggy', tag: 'Logistics Tech' },
          { name: 'Flipkart', tag: 'E-Commerce' },
          { name: 'InMobi', tag: 'AdTech' },
          { name: 'Groww', tag: 'Fintech' },
        ],
        resumePitch: 'Distributed Systems Engineer building real-time event streaming architectures with Kafka, Airflow ETL DAGs, and resilient microservice data synchronization.',
        tacticalMove: 'Build an end-to-end stock price anomaly detector streaming events via Kafka into ClickHouse/PostgreSQL.',
      },
    ],
  },
  data: {
    sourceRole: 'Data Analyst / SQL Developer',
    category: 'Data & Analytics',
    baselineDescription: 'Advanced SQL, Tableau/PowerBI dashboards, exploratory data analysis, business metric reporting.',
    pivots: [
      {
        targetRole: 'Analytics Engineer (dbt & Modern Data Stack)',
        matchPct: 86,
        retainedCapitalPct: 82,
        salaryRangeLPA: '₹13 - ₹18 LPA',
        avgHikePct: '+48%',
        hiringVelocity: 'High (Modern Startups & GCCs)',
        estimatedWeeks: '3–4 Weeks',
        retainedSkills: [
          { name: 'Complex SQL Queries & Window Functions', whyValuable: 'dbt models are 90% modular, version-controlled SQL transformation logic.' },
          { name: 'Business KPIs & Dimensional Modeling', whyValuable: 'Directly dictates star schemas and clean data marts.' },
          { name: 'Data Cleansing & QA Reconciliation', whyValuable: 'Translates directly into dbt generic and singular automated tests.' },
        ],
        deltaSkills: [
          { name: 'dbt Core & Semantic Layer', hoursToLearn: 16, freeCourse: 'dbt Fundamentals Bootcamp (freeCodeCamp)' },
          { name: 'Git & CI/CD for Data Pipelines', hoursToLearn: 12, freeCourse: 'Git for Data Teams (Skill India)' },
          { name: 'Snowflake / BigQuery Warehouse Tuning', hoursToLearn: 14, freeCourse: 'Cloud Data Warehousing (NPTEL)' },
        ],
        targetCompanies: [
          { name: 'CRED', tag: 'Product Unicorn' },
          { name: 'Fractal Analytics', tag: 'Enterprise Analytics' },
          { name: 'Lowe’s India', tag: 'Global GCC' },
          { name: 'Freshworks', tag: 'SaaS Tech' },
        ],
        resumePitch: 'Analytics Engineer with deep SQL and data modeling expertise, transforming raw warehouse tables into production-grade, tested dbt models and self-serve data marts.',
        tacticalMove: 'Build a public dbt project modeling e-commerce clickstream data with automated schema tests and lineage documentation on GitHub.',
      },
      {
        targetRole: 'Data Platform Engineer (PySpark & Airflow)',
        matchPct: 78,
        retainedCapitalPct: 75,
        salaryRangeLPA: '₹14 - ₹20 LPA',
        avgHikePct: '+55%',
        hiringVelocity: 'Very High',
        estimatedWeeks: '4–6 Weeks',
        retainedSkills: [
          { name: 'Relational Database Schema Design', whyValuable: 'Essential for designing parquet partitioning strategies and Delta tables.' },
          { name: 'Data Pipeline Troubleshooting', whyValuable: 'Accelerates identifying malformed records and schema drifts.' },
        ],
        deltaSkills: [
          { name: 'PySpark DataFrame Transformations', hoursToLearn: 18, freeCourse: 'PySpark for Data Engineers (freeCodeCamp)' },
          { name: 'Apache Airflow DAG Scheduling', hoursToLearn: 14, freeCourse: 'Airflow Pipeline Orchestration (SWAYAM)' },
          { name: 'Dockerized ETL Jobs', hoursToLearn: 10, freeCourse: 'Docker for Data Engineering (NPTEL)' },
        ],
        targetCompanies: [
          { name: 'Flipkart', tag: 'Scale Data' },
          { name: 'Barclays', tag: 'Banking Data' },
          { name: 'Target Tech', tag: 'Retail GCC' },
          { name: 'Swiggy', tag: 'High-Velocity' },
        ],
        resumePitch: 'Data Engineer specializing in scalable batch & streaming ETL pipelines using PySpark, Airflow DAG orchestration, and cloud data lake architectures.',
        tacticalMove: 'Write an Airflow DAG that ingests public weather/finance APIs, transforms with PySpark, and loads into PostgreSQL.',
      },
      {
        targetRole: 'Applied AI & Predictive Modeling Analyst',
        matchPct: 74,
        retainedCapitalPct: 70,
        salaryRangeLPA: '₹15 - ₹21 LPA',
        avgHikePct: '+60%',
        hiringVelocity: 'High Demand',
        estimatedWeeks: '5–6 Weeks',
        retainedSkills: [
          { name: 'Statistical Distributions & Hypothesis Testing', whyValuable: 'Core theoretical foundation for evaluating model accuracy vs random noise.' },
          { name: 'Feature Engineering & Aggregations', whyValuable: 'Creates the input vectors that determine 80% of model performance.' },
        ],
        deltaSkills: [
          { name: 'Scikit-Learn & XGBoost Modeling', hoursToLearn: 18, freeCourse: 'Machine Learning with Python (SWAYAM)' },
          { name: 'FastAPI Model Serving Endpoints', hoursToLearn: 12, freeCourse: 'Deploying ML Models with FastAPI (freeCodeCamp)' },
          { name: 'Model Drift & Performance Telemetry', hoursToLearn: 10, freeCourse: 'MLOps Essentials (DeepLearning.AI)' },
        ],
        targetCompanies: [
          { name: 'Fractal AI', tag: 'AI Solutions' },
          { name: 'InMobi', tag: 'Ad Intelligence' },
          { name: 'Razorpay', tag: 'Risk AI' },
          { name: 'Postman', tag: 'Product AI' },
        ],
        resumePitch: 'Applied AI Analyst bridging business KPIs with predictive machine learning (XGBoost, Scikit-Learn) and real-time FastAPI inference microservices.',
        tacticalMove: 'Train a churn prediction model on telecom customer data, wrap in a FastAPI service, and deploy on Render with live prediction UI.',
      },
    ],
  },
}

export default function TransferabilityScoreCard() {
  const [selectedSourceKey, setSelectedSourceKey] = useState<string>('qa')
  const [selectedPivotIdx, setSelectedPivotIdx] = useState<number>(0)
  const [copiedPitch, setCopiedPitch] = useState<boolean>(false)
  const [weeklyStudyHours, setWeeklyStudyHours] = useState<number>(20)

  const activeSource = SOURCE_PROFILES[selectedSourceKey] || SOURCE_PROFILES.qa
  const activePivot = activeSource.pivots[selectedPivotIdx] || activeSource.pivots[0]

  // Calculate adjusted weeks to bridge based on user's weekly study hours
  const totalDeltaHours = useMemo(() => {
    return activePivot.deltaSkills.reduce((acc, s) => acc + s.hoursToLearn, 0)
  }, [activePivot])

  const calculatedWeeks = Math.max(2, Number((totalDeltaHours / (weeklyStudyHours * 0.75)).toFixed(1)))

  // Copy resume pitch to clipboard
  const handleCopyPitch = () => {
    navigator.clipboard.writeText(activePivot.resumePitch)
    setCopiedPitch(true)
    setTimeout(() => setCopiedPitch(false), 2500)
  }

  // Chart data comparing all pivots for the selected source role
  const chartData = useMemo(() => {
    return activeSource.pivots.map((p) => ({
      role: p.targetRole.split(' (')[0].split('&')[0].trim(),
      'Retained Capital': p.retainedCapitalPct,
      'Skill Match': p.matchPct,
    }))
  }, [activeSource])

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-7">
      {/* ── 1. Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/60 dark:to-emerald-950/60 text-[#0B4F9C] dark:text-sky-300 text-xs font-black mb-1.5 border border-blue-200/50">
            <Target size={13} className="text-[#0B4F9C]" />
            <span>AI Skill Transferability & Career Pivot Engine</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Capitalize on Your Accumulated Career Equity
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            Don’t start from zero after a layoff. See how <strong>75%–88%</strong> of your past domain experience directly transfers to higher-paying tech sectors with only a 3–4 week bridge sprint.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-right shrink-0">
          <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">
            Retained Career Equity
          </div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
            {activePivot.retainedCapitalPct}% Capital Intact
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Only ~{totalDeltaHours}h to full parity</div>
        </div>
      </div>

      {/* ── 2. Select Source Domain & Target Pivot ── */}
      <div className="space-y-4">
        {/* Step A: Source Background Switcher */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Briefcase size={13} className="text-[#0B4F9C]" />
            <span>Step 1: Select Your Pre-Layoff Domain Background:</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'qa', label: 'Manual QA / Test Engineer', badge: 'Quality Eng' },
              { id: 'dev', label: 'Backend / Full-Stack SWE', badge: 'Development' },
              { id: 'data', label: 'Data Analyst / SQL Dev', badge: 'Data & BI' },
            ].map((src) => (
              <button
                key={src.id}
                type="button"
                onClick={() => {
                  setSelectedSourceKey(src.id)
                  setSelectedPivotIdx(0)
                }}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  selectedSourceKey === src.id
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/70 dark:to-indigo-950/70 border-[#0B4F9C] dark:border-sky-500 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    {src.label}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                    {src.badge}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step B: Target High-Growth Pivot Tabs */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Zap size={13} className="text-[#F26B1D]" />
            <span>Step 2: Explore High-Velocity Adjacent Target Roles:</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {activeSource.pivots.map((pivot, idx) => (
              <button
                key={pivot.targetRole}
                type="button"
                onClick={() => setSelectedPivotIdx(idx)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  selectedPivotIdx === idx
                    ? 'bg-[#0B4F9C] text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200/80 dark:border-slate-700'
                }`}
              >
                <span>{pivot.targetRole.split(' (')[0]}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                    selectedPivotIdx === idx
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  {pivot.matchPct}% Match
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. Main Pivot Spotlight Card ── */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-50 via-blue-50/20 to-emerald-50/20 dark:from-slate-800/80 dark:via-blue-950/20 dark:to-slate-900 border-2 border-[#0B4F9C]/20 dark:border-blue-800/50 space-y-6 shadow-xs">
        {/* Top Header of Active Pivot */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-slate-200/80 dark:border-slate-700/80 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#0B4F9C] dark:text-sky-400">
                Recommended Target Transition
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300/50">
                {activePivot.hiringVelocity}
              </span>
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {activePivot.targetRole}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
              Compensation Benchmark: <strong className="text-emerald-600 dark:text-emerald-400">{activePivot.salaryRangeLPA}</strong> ({activePivot.avgHikePct} market upside).
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="flex flex-wrap items-center gap-3 bg-white/90 dark:bg-slate-900/90 p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-700/80 shadow-xs shrink-0">
            <div className="text-center px-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">Skill Overlap</div>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                {activePivot.matchPct}%
              </div>
            </div>
            <div className="text-center border-l border-slate-200 dark:border-slate-700 px-3">
              <div className="text-[10px] uppercase font-bold text-slate-400">Delta Hours</div>
              <div className="text-xl font-black text-[#F26B1D]">
                {totalDeltaHours}h
              </div>
            </div>
            <div className="text-center border-l border-slate-200 dark:border-slate-700 px-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">Est. Transition</div>
              <div className="text-xl font-black text-[#0B4F9C] dark:text-sky-400">
                {calculatedWeeks} Wks
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Study Hours Slider */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Clock size={14} className="text-[#F26B1D]" />
              <span>Your Weekly Upskilling Commitment:</span>
            </span>
            <span className="text-[#0B4F9C] dark:text-sky-400 font-black">
              {weeklyStudyHours} Hours/Week → Ready for Interviews in ~{calculatedWeeks} Weeks
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="40"
            step="5"
            value={weeklyStudyHours}
            onChange={(e) => setWeeklyStudyHours(parseInt(e.target.value))}
            className="w-full accent-[#0B4F9C] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
            <span>10h/wk (Part-Time)</span>
            <span>20h/wk (Dedicated Transitioner)</span>
            <span>40h/wk (Full-Time Sprint)</span>
          </div>
        </div>

        {/* Two-Column Deep Breakdown: Retained Skills vs Delta Bridge */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Column A: Retained Skills (What You Already Own) */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/40 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <h5 className="font-black text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Your Retained Transferable Assets ({activePivot.retainedSkills.length})
                </h5>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                100% Retained
              </span>
            </div>

            <div className="space-y-2.5 pt-1">
              {activePivot.retainedSkills.map((s, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1"
                >
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="text-emerald-500 font-black">✓</span>
                    <span>{s.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium pl-4">
                    {s.whyValuable}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Column B: Bridge Delta (What to Learn in 3–4 Weeks) */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-orange-200/80 dark:border-orange-900/40 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-[#F26B1D]" />
                <h5 className="font-black text-xs uppercase tracking-wider text-orange-700 dark:text-orange-400">
                  Precision Bridge Delta ({activePivot.deltaSkills.length} High-ROI Skills)
                </h5>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300">
                {totalDeltaHours} Hours Total
              </span>
            </div>

            <div className="space-y-2.5 pt-1">
              {activePivot.deltaSkills.map((s, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                    <span className="flex items-center gap-1.5">
                      <span className="text-orange-500 font-black">⚡</span>
                      <span>{s.name}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ~{s.hoursToLearn}h
                    </span>
                  </div>
                  <div className="pl-4 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 truncate max-w-[220px]">
                      📖 {s.freeCourse}
                    </span>
                    <span className="text-emerald-600 font-bold text-[10px]">100% Free</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Target Hiring Companies Badge Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Building2 size={14} className="text-[#0B4F9C]" />
              <span>Target Tech Employers Actively Hiring for this Exact Transition:</span>
            </div>
            <Link
              to="/jobs"
              className="text-xs font-bold text-[#0B4F9C] hover:underline flex items-center gap-1"
            >
              <span>View Openings</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {activePivot.targetCompanies.map((c, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{c.name}</span>
                <span className="text-[10px] font-semibold text-slate-400">({c.tag})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Copy-Ready Recruiter Elevator Pitch */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-amber-400" />
              <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                1-Click Recruiter Elevator Pitch & LinkedIn Summary
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyPitch}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              {copiedPitch ? (
                <>
                  <Check size={13} className="text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy Pitch</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-slate-300 italic font-mono bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
            "{activePivot.resumePitch}"
          </p>

          <div className="pt-1 flex items-start gap-2 text-xs text-slate-400">
            <span className="font-bold text-sky-400">💡 Immediate Proof-of-Work Step:</span>
            <span>{activePivot.tacticalMove}</span>
          </div>
        </div>
      </div>

      {/* ── 4. Cross-Pivot Comparison Visual Graph ── */}
      <div className="p-5 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 size={16} className="text-[#0B4F9C]" />
              <span>Transferability Capital vs Skill Match Across Pivots (%)</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Notice how 70%+ of your accumulated background carries over into all 3 adjacent roles.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1 text-emerald-600">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span>Retained Capital</span>
            </span>
            <span className="flex items-center gap-1 text-[#0B4F9C]">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#0B4F9C]" />
              <span>Skill Match</span>
            </span>
          </div>
        </div>

        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
              barGap={4}
            >
              <XAxis dataKey="role" tick={{ fill: '#64748B', fontSize: 11, fontWeight: 700 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} unit="%" domain={[0, 100]} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
                        <p className="font-black text-amber-400">{label}</p>
                        <p className="text-emerald-300 flex justify-between gap-4">
                          <span>Retained Capital:</span>
                          <span className="font-bold">{payload[0]?.value}%</span>
                        </p>
                        <p className="text-sky-300 flex justify-between gap-4">
                          <span>Overall Match:</span>
                          <span className="font-bold">{payload[1]?.value}%</span>
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="Retained Capital" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="Skill Match" fill="#0B4F9C" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
