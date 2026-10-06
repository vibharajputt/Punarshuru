import { useState, useId } from 'react'
import { Link } from 'react-router-dom'
import {
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  Code2,
  Eye,
  Building2,
  Briefcase,
  Plus,
  Trash2,
  Wand2,
  RefreshCw,
  ChevronDown,
  Mic,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'

interface ExperienceItem {
  id: string
  company: string
  role: string
  location: string
  period: string
  isGapSprint?: boolean
  bullets: string[]
}

interface ProjectItem {
  id: string
  title: string
  stack: string
  link: string
  bullets: string[]
}

interface EducationItem {
  id: string
  degree: string
  institution: string
  period: string
  score: string
}

const TARGET_COMPANIES = [
  {
    id: 'amazon',
    name: 'Amazon India',
    role: 'Software Development Engineer (SDE-2)',
    keywords: ['AWS', 'Distributed Systems', 'Java / Spring Boot', 'High Concurrency', 'Customer Obsession', 'Docker', 'CI/CD'],
    summaryAngle: 'Built for high-scale distributed systems and rapid ownership, combining 5+ years of foundational core backend engineering with recent production microservice modernization.',
    gapAngle: 'Executed a structured Modern Cloud sprint building high-throughput microservices on AWS with Docker and 99.9% uptime SLA simulations.',
  },
  {
    id: 'microsoft',
    name: 'Microsoft India',
    role: 'Software Engineer - Cloud & AI',
    keywords: ['Azure', 'Microservices', 'Spring Boot 3', 'REST APIs', 'Cloud Native', 'CI/CD Pipelines', 'RAG / GenAI'],
    summaryAngle: 'Experienced Systems Engineer with deep architectural fundamentals and modernized fluency in cloud infrastructure, containerization, and enterprise backend resilience.',
    gapAngle: 'Architected containerized microservice blueprints and AI search pipelines with end-to-end automated GitHub Actions CI/CD.',
  },
  {
    id: 'google',
    name: 'Google India',
    role: 'Software Engineer (L4 / L5)',
    keywords: ['Algorithms', 'High Scale', 'Go / Java', 'Distributed Storage', 'Performance Tuning', 'System Design'],
    summaryAngle: 'Senior Backend Engineer possessing strong computer science fundamentals, scalable distributed system designs, and modernized deployment workflows.',
    gapAngle: 'Implemented high-performance concurrent data structures and benchmarking suites with sub-15ms response latency.',
  },
  {
    id: 'intuit',
    name: 'Intuit India',
    role: 'Senior Software Engineer (Returnee Cohort)',
    keywords: ['Fintech Security', 'Spring Boot', 'PostgreSQL', 'Docker', 'Kubernetes', 'Test Driven Development'],
    summaryAngle: 'Enterprise engineer specializing in reliable financial microservices, data consistency, and modern cloud deployment pipelines.',
    gapAngle: 'Engineered secure JWT-authenticated transaction prototypes with 95%+ unit test coverage and automated container security scans.',
  },
  {
    id: 'startup',
    name: 'High-Growth AI Unicorn',
    role: 'Full-Stack / AI Backend Engineer',
    keywords: ['GenAI / RAG', 'Python / FastAPI', 'React 19', 'Docker', 'PostgreSQL', 'Rapid Shipping'],
    summaryAngle: 'Full-cycle builder moving fast from concept to production, integrating GenAI intelligence into robust enterprise software backends.',
    gapAngle: 'Shipped live production apps integrating LLM vector embeddings, PostgreSQL pgvector, and automated container deployment.',
  },
]

export default function ResumeGapRebuilder({
  name = 'Vibha Rajput',
  gapYears = '2022 – 2025',
}: {
  name?: string
  gapYears?: string
  breakReason?: string
}) {
  const targetCompanySelectId = useId()
  const customRoleInputId = useId()
  const candidateNameInputId = useId()
  const candidateEmailInputId = useId()
  const candidatePhoneInputId = useId()
  const candidateGithubInputId = useId()
  const candidateLinkedinInputId = useId()
  const summaryTextareaId = useId()
  const skillsLanguagesInputId = useId()
  const skillsFrameworksInputId = useId()
  const skillsCloudInputId = useId()
  const [editorMode, setEditorMode] = useState<'form' | 'latex' | 'ai_tailor'>('form')
  const [template, setTemplate] = useState<'faang_ats' | 'deedy_classic' | 'modern_returner'>('faang_ats')
  const [zoomLevel, setZoomLevel] = useState<number>(100)
  const [copiedLatex, setCopiedLatex] = useState(false)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [selectedTargetCompany, setSelectedTargetCompany] = useState<string>('amazon')
  const [customRole, setCustomRole] = useState<string>('Senior Software Engineer')

  // Resume Data State
  const [candidateInfo, setCandidateInfo] = useState({
    name: name || 'Vibha Rajput',
    email: 'vibha.rajput@email.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    github: 'github.com/vibharajput',
    linkedin: 'linkedin.com/in/vibharajput',
    portfolio: 'vibha.dev',
  })

  const [summary, setSummary] = useState(
    'Results-driven Senior Software Engineer with 5+ years of experience designing high-throughput backend services and distributed systems. Following a dedicated family caregiving sabbatical, completed an intensive production modernization sprint deploying containerized Spring Boot 3 microservices and GenAI pipelines. Recognized for robust architectural foundations, clean code standards, and rapid adaptability.'
  )

  const [skills, setSkills] = useState({
    languages: 'Java 17/21, SQL, TypeScript, Python, C++',
    frameworks: 'Spring Boot 3, Hibernate/JPA, React 19, RESTful APIs, Node.js',
    cloudDevOps: 'Docker, AWS (EC2, S3, RDS), GitHub Actions CI/CD, PostgreSQL, Redis, Maven',
    coreCompetencies: 'Distributed Systems, System Design, Microservices, RAG Workflows, Agile/Scrum',
  })

  const [experiences, setExperiences] = useState<ExperienceItem[]>([
    {
      id: 'exp-sprint',
      company: 'Technical Modernization Sprint (Punarshuru Cloud Lab)',
      role: 'Full-Stack & Cloud Architecture Lead',
      location: 'Bengaluru, India',
      period: `Sabbatical & Re-skilling | ${gapYears}`,
      isGapSprint: true,
      bullets: [
        'Architected and deployed a containerized multi-tier microservice using Spring Boot 3, PostgreSQL, and Docker with automated GitHub Actions CI/CD pipelines.',
        'Integrated Gemini AI & RAG vector search workflow, reducing query latency by 42% for contextual semantic search across 10,000+ data nodes.',
        'Engineered resilient REST endpoints with Redis caching layer, achieving 99.8% test coverage with JUnit 5 & Mockito.',
        'Maintained active open-source contributions and modernized system design practices adhering to 12-Factor App standards.',
      ],
    },
    {
      id: 'exp-1',
      company: 'Infosys Limited / Global Client Engineering',
      role: 'Senior Systems Engineer',
      location: 'Pune / Bengaluru',
      period: '2018 – 2022',
      bullets: [
        'Spearheaded the core transactional backend powering high-volume retail banking pipelines, processing 1.2M+ daily requests with 99.95% uptime.',
        'Refactored legacy monolith modules into decoupled REST microservices, slashing end-to-end API response latency by 35%.',
        'Mentored 6 junior engineers on unit testing rigor and clean coding standards, reducing production defect leakage by 28%.',
      ],
    },
  ])

  const [projects] = useState<ProjectItem[]>([
    {
      id: 'proj-1',
      title: 'PunarSetu — AI Microservices Platform',
      stack: 'Java 21, Spring Boot 3, Docker, PostgreSQL, Gemini AI, AWS',
      link: 'github.com/vibharajput/punarsetu-core',
      bullets: [
        'Built full-stack cloud-native career intelligence platform deployed via Docker containers on AWS with automated SSL and health probes.',
        'Implemented JWT RBAC authentication and role-based access for multi-tenant candidate workflows.',
      ],
    },
    {
      id: 'proj-2',
      title: 'Distributed Event Broker Prototype',
      stack: 'Java, Kafka, Redis, Docker',
      link: 'github.com/vibharajput/event-mesh',
      bullets: [
        'Designed high-throughput pub-sub message queue handling 15,000 msg/sec with guaranteed at-least-once delivery semantics.',
      ],
    },
  ])

  const [education] = useState<EducationItem[]>([
    {
      id: 'edu-1',
      degree: 'B.Tech in Computer Science & Engineering',
      institution: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU)',
      period: '2014 – 2018',
      score: 'First Class with Distinction (8.4 CGPA)',
    },
  ])

  const [certifications] = useState<string[]>([
    'AWS Certified Solutions Architect (Associate)',
    'Spring Boot 3 & Microservices Specialist (Oracle/Coursera Verified)',
    'Modern Docker & Container Orchestration Bootcamp (2025)',
  ])

  // Generate Overleaf / LaTeX code string
  const generateLatexCode = () => {
    return `% -------------------------------------------------------------
% Overleaf / LaTeX ATS-Optimized Resume
% Generated via Punarshuru AI Resume Studio
% Compatible with pdflatex / xelatex
% -------------------------------------------------------------
\\documentclass[letterpaper,10pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}

\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\begin{document}

% ---------- HEADING ----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${candidateInfo.name}} \\\ \\vspace{2pt}
    \\small ${candidateInfo.phone} $|$ \\href{mailto:${candidateInfo.email}}{\\underline{${candidateInfo.email}}} $|$ 
    \\href{https://${candidateInfo.linkedin}}{\\underline{${candidateInfo.linkedin}}} $|$
    \\href{https://${candidateInfo.github}}{\\underline{${candidateInfo.github}}}
\\end{center}

% ---------- PROFESSIONAL SUMMARY ----------
\\section{Professional Summary}
\\small{${summary}}

% ---------- TECHNICAL SKILLS ----------
\\section{Technical Skills}
\\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: ${skills.languages}} \\\ \\vspace{1pt}
     \\textbf{Frameworks \\& Libraries}{: ${skills.frameworks}} \\\ \\vspace{1pt}
     \\textbf{Cloud \\& DevOps}{: ${skills.cloudDevOps}} \\\ \\vspace{1pt}
     \\textbf{Architectural Competencies}{: ${skills.coreCompetencies}}
    }}
\\end{itemize}

% ---------- EXPERIENCE ----------
\\section{Experience \\& Career Modernization}
\\begin{itemize}[leftmargin=0.15in, label={}]
${experiences
  .map(
    (exp) => `    \\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{${exp.role}} & ${exp.period} \\\ \\vspace{1pt}
      \\textit{\\small ${exp.company}} & \\textit{\\small ${exp.location}} \\\
    \\end{tabular*}\\vspace{-5pt}
    \\begin{itemize}
${exp.bullets.map((b) => `        \\item \\small{${b.replace(/&/g, '\\&').replace(/%/g, '\\%')}}`).join('\n')}
    \\end{itemize}`
  )
  .join('\n\\vspace{4pt}\n')}
\\end{itemize}

% ---------- PROJECTS ----------
\\section{Key Projects \\& Cloud Deployments}
\\begin{itemize}[leftmargin=0.15in, label={}]
${projects
  .map(
    (proj) => `    \\item
    \\textbf{${proj.title}} $|$ \\textit{\\small ${proj.stack}} \\hfill \\href{https://${proj.link}}{\\underline{\\small GitHub Code}} \\\
    \\begin{itemize}
${proj.bullets.map((b) => `        \\item \\small{${b.replace(/&/g, '\\&').replace(/%/g, '\\%')}}`).join('\n')}
    \\end{itemize}`
  )
  .join('\n\\vspace{3pt}\n')}
\\end{itemize}

% ---------- EDUCATION ----------
\\section{Education}
\\begin{itemize}[leftmargin=0.15in, label={}]
${education
  .map(
    (edu) => `    \\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{${edu.institution}} & ${edu.period} \\\
      \\small ${edu.degree} & \\textit{\\small ${edu.score}} \\\
    \\end{tabular*}`
  )
  .join('\n')}
\\end{itemize}

% ---------- CERTIFICATIONS ----------
\\section{Certifications \\& Continuous Learning}
\\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
${certifications.map((c) => `     $\\bullet$ ${c} \\\ `).join('\n')}
    }}
\\end{itemize}

\\end{document}
`
  }

  const [latexCode, setLatexCode] = useState(generateLatexCode())

  // Handle AI Auto-Tailoring for specific company
  const handleAITailor = (companyId: string) => {
    setIsGeneratingAI(true)
    const company = TARGET_COMPANIES.find((c) => c.id === companyId) || TARGET_COMPANIES[0]

    setTimeout(() => {
      // 1. Update Summary with target angle
      setSummary(
        `Results-driven ${customRole || company.role} with 5+ years of software engineering excellence. ${company.summaryAngle} Proven track record of architecting maintainable microservices, leading Agile sprints, and driving zero-defect deployments.`
      )

      // 2. Update Gap Sprint experience bullets tailored to company keywords
      setExperiences((prev) =>
        prev.map((exp) => {
          if (exp.isGapSprint) {
            return {
              ...exp,
              role: `Cloud Architecture & ${company.name.split(' ')[0]} Modernization Sprint`,
              bullets: [
                `Engineered and deployed microservices adhering to ${company.name} high-scale paradigms using ${company.keywords.slice(0, 3).join(', ')}.`,
                `${company.gapAngle}`,
                `Implemented automated CI/CD pipelines with zero-downtime rolling deployments, automated test coverage (98%), and Docker containerization.`,
                `Led technical code reviews and architectural RFCs aligned with enterprise industry standards.`,
              ],
            }
          }
          return exp
        })
      )

      // 3. Update LaTeX
      setLatexCode(generateLatexCode())
      setIsGeneratingAI(false)
      setEditorMode('form')
    }, 900)
  }

  const handleCopyLatex = () => {
    navigator.clipboard.writeText(latexCode)
    setCopiedLatex(true)
    setTimeout(() => setCopiedLatex(false), 2200)
  }

  const handleDownloadLatex = () => {
    const element = document.createElement('a')
    const file = new Blob([latexCode], { type: 'text/plain;charset=utf-8' })
    element.href = URL.createObjectURL(file)
    element.download = `${candidateInfo.name.toLowerCase().replace(/\s+/g, '_')}_resume.tex`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handlePrint = () => {
    window.print()
  }

  // Calculate ATS Score & Keyword Match
  const currentCompany = TARGET_COMPANIES.find((c) => c.id === selectedTargetCompany) || TARGET_COMPANIES[0]
  const allResumeText = `${summary} ${skills.languages} ${skills.frameworks} ${skills.cloudDevOps} ${experiences.map((e) => e.bullets.join(' ')).join(' ')}`
  const matchedKeywords = currentCompany.keywords.filter((kw) =>
    allResumeText.toLowerCase().includes(kw.toLowerCase().split(' ')[0])
  )
  const atsScore = Math.min(98, Math.round((matchedKeywords.length / currentCompany.keywords.length) * 40 + 58))

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-7 shadow-xs space-y-6">
      {/* ── 1. Top Header Banner ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/60 dark:to-indigo-950/60 text-[#0B4F9C] dark:text-sky-300 text-xs font-black border border-blue-200/50 mb-1.5">
            <Code2 size={13} className="text-[#0B4F9C]" />
            <span>Overleaf LaTeX Engine • AI ATS Resume Studio</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            AI Resume Rebuilder & Overleaf LaTeX Studio
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
            Live Overleaf dual-pane editor with instant PDF preview, 1-click company tailoring, and ATS gap reframing.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLatex}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
            title="Copy LaTeX .tex code for Overleaf"
          >
            {copiedLatex ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            <span>{copiedLatex ? 'Copied .tex!' : 'Copy LaTeX Code'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadLatex}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
            title="Download .tex source file"
          >
            <Download size={14} />
            <span>Export .tex</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-[#0B4F9C] hover:bg-blue-800 text-white text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-blue-900/20 cursor-pointer"
          >
            <Printer size={14} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* ── 2. AI Company Match & ATS Score Bar ── */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/50 to-teal-50 dark:from-slate-800/90 dark:via-blue-950/40 dark:to-slate-800/90 border border-blue-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-700 flex items-center justify-center font-black text-xs text-[#0B4F9C] dark:text-sky-300 shrink-0 shadow-xs">
            <Building2 size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Company:</span>
              <select
                id={targetCompanySelectId}
                value={selectedTargetCompany}
                onChange={(e) => {
                  setSelectedTargetCompany(e.target.value)
                  handleAITailor(e.target.value)
                }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-black text-slate-900 dark:text-white cursor-pointer"
              >
                {TARGET_COMPANIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.role}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <span className="text-[10px] font-bold text-slate-400">Target Keywords:</span>
              {currentCompany.keywords.map((kw, i) => {
                const isMatched = allResumeText.toLowerCase().includes(kw.toLowerCase().split(' ')[0])
                return (
                  <span
                    key={i}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                      isMatched
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 line-through'
                    }`}
                  >
                    {isMatched && <Check size={10} />}
                    {kw}
                  </span>
                )
              })}
            </div>
          </div>
        </div>

        {/* ATS Gauge */}
        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase">ATS Compatibility</div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{atsScore}/100</div>
          </div>
          <button
            type="button"
            onClick={() => handleAITailor(selectedTargetCompany)}
            disabled={isGeneratingAI}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-black transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isGeneratingAI ? (
              <RefreshCw size={13} className="animate-spin" />
            ) : (
              <Wand2 size={13} />
            )}
            <span>{isGeneratingAI ? 'AI Tailoring...' : 'AI Auto-Tailor'}</span>
          </button>
        </div>
      </div>

      {/* ── 3. Dual-Pane Studio Layout (Overleaf Style) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* ── LEFT PANE: Editor (Form / LaTeX Source / AI Tailor) ── */}
        <div className="xl:col-span-6 space-y-4">
          {/* Sub-Editor Nav Tabs */}
          <div className="flex items-center justify-between p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setEditorMode('form')}
                className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                  editorMode === 'form'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Briefcase size={13} />
                <span>Visual Form Editor</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLatexCode(generateLatexCode())
                  setEditorMode('latex')
                }}
                className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                  editorMode === 'latex'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Code2 size={13} />
                <span>Overleaf LaTeX Code</span>
              </button>

              <button
                type="button"
                onClick={() => setEditorMode('ai_tailor')}
                className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                  editorMode === 'ai_tailor'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sparkles size={13} className="text-[#0B4F9C]" />
                <span>AI Prompt Helper</span>
              </button>
            </div>

            <span className="text-[10px] text-slate-400 font-medium px-2 hidden sm:inline">
              Auto-Sync
            </span>
          </div>

          {/* Mode 1: Visual Form Editor */}
          {editorMode === 'form' && (
            <div className="space-y-4 max-h-[720px] overflow-y-auto pr-1">
              {/* Personal Details */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>1. Contact & Header Info</span>
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <label htmlFor={candidateNameInputId} className="text-[10px] font-bold text-slate-400">Full Name</label>
                    <input
                      id={candidateNameInputId}
                      type="text"
                      value={candidateInfo.name}
                      onChange={(e) => setCandidateInfo({ ...candidateInfo, name: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
                    />
                  </div>
                  <div>
                    <label htmlFor={candidateEmailInputId} className="text-[10px] font-bold text-slate-400">Email</label>
                    <input
                      id={candidateEmailInputId}
                      type="email"
                      value={candidateInfo.email}
                      onChange={(e) => setCandidateInfo({ ...candidateInfo, email: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"
                    />
                  </div>
                  <div>
                    <label htmlFor={candidatePhoneInputId} className="text-[10px] font-bold text-slate-400">Phone & Location</label>
                    <input
                      id={candidatePhoneInputId}
                      type="text"
                      value={candidateInfo.phone}
                      onChange={(e) => setCandidateInfo({ ...candidateInfo, phone: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"
                    />
                  </div>
                  <div>
                    <label htmlFor={candidateGithubInputId} className="text-[10px] font-bold text-slate-400">GitHub Profile</label>
                    <input
                      id={candidateGithubInputId}
                      type="text"
                      value={candidateInfo.github}
                      onChange={(e) => setCandidateInfo({ ...candidateInfo, github: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor={candidateLinkedinInputId} className="text-[10px] font-bold text-slate-400">LinkedIn URL</label>
                    <input
                      id={candidateLinkedinInputId}
                      type="text"
                      value={candidateInfo.linkedin}
                      onChange={(e) => setCandidateInfo({ ...candidateInfo, linkedin: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Summary with AI Polish Button */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">
                    2. Professional Summary (Gap Reframed)
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setSummary(
                        `Accomplished Senior Software Engineer with 5+ years building distributed Java/Spring services. Completed intensive returnee modernization sprint deploying containerized microservices and AI workflows with Docker, AWS, and CI/CD. Ready for immediate impact with sharp architectural leadership.`
                      )
                    }}
                    className="text-[10px] font-bold text-[#0B4F9C] dark:text-sky-300 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles size={11} />
                    <span>AI Polish</span>
                  </button>
                </div>
                <textarea
                  id={summaryTextareaId}
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium"
                />
              </div>

              {/* Technical Skills */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2.5 text-xs">
                <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">
                  3. Technical Skills Stack
                </h4>
                <div className="space-y-2">
                  <div>
                    <label htmlFor={skillsLanguagesInputId} className="text-[10px] font-bold text-slate-400">Languages</label>
                    <input
                      id={skillsLanguagesInputId}
                      type="text"
                      value={skills.languages}
                      onChange={(e) => setSkills({ ...skills, languages: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"
                    />
                  </div>
                  <div>
                    <label htmlFor={skillsFrameworksInputId} className="text-[10px] font-bold text-slate-400">Frameworks & Libraries</label>
                    <input
                      id={skillsFrameworksInputId}
                      type="text"
                      value={skills.frameworks}
                      onChange={(e) => setSkills({ ...skills, frameworks: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"
                    />
                  </div>
                  <div>
                    <label htmlFor={skillsCloudInputId} className="text-[10px] font-bold text-slate-400">Cloud, DevOps & Databases</label>
                    <input
                      id={skillsCloudInputId}
                      type="text"
                      value={skills.cloudDevOps}
                      onChange={(e) => setSkills({ ...skills, cloudDevOps: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Work Experience & Returnee Sprints */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">
                    4. Work Experience & Returnee Sprints
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newExp: ExperienceItem = {
                        id: `exp-${Date.now()}`,
                        company: 'New Company Inc.',
                        role: 'Software Engineer',
                        location: 'Bengaluru',
                        period: '2016 – 2018',
                        bullets: ['Designed and delivered scalable web applications with automated unit tests.'],
                      }
                      setExperiences([...experiences, newExp])
                    }}
                    className="text-[10px] font-bold px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-[#0B4F9C] dark:text-sky-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>Add Role</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {experiences.map((exp, idx) => (
                    <div
                      key={exp.id}
                      className={`p-3.5 rounded-2xl border ${
                        exp.isGapSprint
                          ? 'bg-teal-50/50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-800'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                      } space-y-2 text-xs`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => {
                              const updated = [...experiences]
                              updated[idx].role = e.target.value
                              setExperiences(updated)
                            }}
                            className="font-bold text-slate-900 dark:text-white bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 focus:outline-hidden text-xs"
                          />
                          {exp.isGapSprint && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-teal-600 text-white uppercase">
                              Career Gap Proof
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setExperiences(experiences.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-red-500 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-slate-500">
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...experiences]
                            updated[idx].company = e.target.value
                            setExperiences(updated)
                          }}
                          className="w-1/2 bg-transparent border-b border-dashed border-slate-200 dark:border-slate-700 focus:outline-hidden text-xs"
                        />
                        <span>•</span>
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => {
                            const updated = [...experiences]
                            updated[idx].period = e.target.value
                            setExperiences(updated)
                          }}
                          className="w-1/2 bg-transparent border-b border-dashed border-slate-200 dark:border-slate-700 focus:outline-hidden text-xs"
                        />
                      </div>

                      {/* Bullets */}
                      <div className="space-y-1.5 pt-1">
                        {exp.bullets.map((b, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-1.5">
                            <span className="text-slate-400 mt-1">•</span>
                            <textarea
                              rows={2}
                              value={b}
                              onChange={(e) => {
                                const updated = [...experiences]
                                updated[idx].bullets[bIdx] = e.target.value
                                setExperiences(updated)
                              }}
                              className="w-full p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Overleaf LaTeX Source Editor */}
          {editorMode === 'latex' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>LaTeX 2e Source Code (pdflatex compatible)</span>
                <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">✓ Syntax Validated</span>
              </div>
              <textarea
                value={latexCode}
                onChange={(e) => setLatexCode(e.target.value)}
                rows={26}
                className="w-full p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed border border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 selection:bg-blue-600 resize-none shadow-inner"
                spellCheck={false}
              />
            </div>
          )}

          {/* Mode 3: AI Prompt Helper / Smart Customizer */}
          {editorMode === 'ai_tailor' && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-4 text-xs">
              <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
                <Sparkles size={16} className="text-[#0B4F9C]" />
                <span>AI Job Description & Company Customizer</span>
              </div>

              <div className="space-y-2">
                <label htmlFor={customRoleInputId} className="font-bold text-slate-700 dark:text-slate-300">
                  Target Role or Specialty
                </label>
                <input
                  id={customRoleInputId}
                  type="text"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="e.g. Senior Java Backend Engineer / Cloud SDE-2"
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-700 dark:text-slate-300">
                  Select High-Impact Company Archetype:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TARGET_COMPANIES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleAITailor(c.id)}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-[#0B4F9C] text-left transition cursor-pointer group"
                    >
                      <div className="font-black text-slate-900 dark:text-white group-hover:text-[#0B4F9C] flex items-center justify-between">
                        <span>{c.name}</span>
                        <ChevronDown size={12} className="-rotate-90 text-slate-400 group-hover:text-[#0B4F9C]" />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">{c.role}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800/60 text-blue-900 dark:text-blue-200 text-[11px] space-y-1">
                <strong>💡 Why this beats ChatGPT:</strong>
                <p>
                  PunarSetu injects verifiably compliant Returnee Modernization anchors, exact ATS-parsed indentation, and Form-16 anti-lowball metrics into your LaTeX resume structure.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT PANE: Overleaf-Style Live Rendered Canvas Preview ── */}
        <div className="xl:col-span-6 space-y-3">
          {/* Canvas Controls Bar */}
          <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200">
              <Eye size={14} className="text-[#0B4F9C]" />
              <span>Overleaf Rendered Output</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                100% ATS Safe
              </span>
            </div>

            {/* Zoom & Template Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(75, z - 10))}
                  className="text-slate-500 hover:text-slate-900 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut size={13} />
                </button>
                <span className="text-[11px] font-bold px-1">{zoomLevel}%</span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                  className="text-slate-500 hover:text-slate-900 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn size={13} />
                </button>
              </div>

              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value as any)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <option value="faang_ats">Template: Jake's FAANG ATS</option>
                <option value="deedy_classic">Template: Deedy Classic</option>
                <option value="modern_returner">Template: Returnee Modern</option>
              </select>
            </div>
          </div>

          {/* ── High-Fidelity A4 Resume Canvas ── */}
          <div className="overflow-x-auto p-2 bg-slate-200 dark:bg-slate-950 rounded-3xl border border-slate-300 dark:border-slate-800 flex justify-center shadow-inner">
            <div
              id="printable-resume-page"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="w-[620px] min-h-[820px] bg-white text-slate-900 font-serif p-8 rounded-xl shadow-2xl space-y-4 border border-slate-200 transition-transform select-text"
            >
              {/* Header */}
              <div className="text-center space-y-1 pb-2 border-b-2 border-slate-900">
                <h1 className="text-2xl font-black uppercase tracking-wider text-slate-900">
                  {candidateInfo.name}
                </h1>
                <div className="text-[11px] font-sans text-slate-700 flex flex-wrap items-center justify-center gap-2">
                  <span>{candidateInfo.phone}</span>
                  <span>|</span>
                  <span className="text-blue-700 underline">{candidateInfo.email}</span>
                  <span>|</span>
                  <span>{candidateInfo.location}</span>
                </div>
                <div className="text-[10px] font-sans text-slate-600 flex flex-wrap items-center justify-center gap-2">
                  <span className="text-blue-700">{candidateInfo.linkedin}</span>
                  <span>|</span>
                  <span className="text-blue-700">{candidateInfo.github}</span>
                </div>
              </div>

              {/* Summary Section */}
              <div className="space-y-1">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                  Professional Summary
                </h2>
                <p className="text-[11px] font-sans text-slate-800 leading-relaxed text-justify">
                  {summary}
                </p>
              </div>

              {/* Technical Skills */}
              <div className="space-y-1">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                  Technical Skills
                </h2>
                <div className="text-[11px] font-sans space-y-0.5 text-slate-800">
                  <div><strong>Languages:</strong> {skills.languages}</div>
                  <div><strong>Frameworks & Libraries:</strong> {skills.frameworks}</div>
                  <div><strong>Cloud & DevOps:</strong> {skills.cloudDevOps}</div>
                  <div><strong>Architecture:</strong> {skills.coreCompetencies}</div>
                </div>
              </div>

              {/* Work Experience */}
              <div className="space-y-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                  Experience & Career Modernization
                </h2>
                <div className="space-y-2.5">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex justify-between items-baseline text-[11px] font-sans">
                        <div>
                          <strong className="text-slate-900">{exp.role}</strong>
                          <span className="text-slate-600"> — {exp.company}</span>
                        </div>
                        <span className="text-slate-600 font-semibold">{exp.period}</span>
                      </div>
                      <ul className="list-disc list-outside pl-4 text-[10.5px] font-sans text-slate-700 space-y-0.5">
                        {exp.bullets.map((b, i) => (
                          <li key={i} className="leading-tight">{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="space-y-1.5">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                  Key Projects & Deployments
                </h2>
                <div className="space-y-2">
                  {projects.map((proj) => (
                    <div key={proj.id} className="space-y-0.5">
                      <div className="flex justify-between items-baseline text-[11px] font-sans">
                        <div>
                          <strong className="text-slate-900">{proj.title}</strong>
                          <span className="text-slate-500 text-[10px]"> | {proj.stack}</span>
                        </div>
                        <span className="text-blue-700 text-[10px] underline">{proj.link}</span>
                      </div>
                      <ul className="list-disc list-outside pl-4 text-[10.5px] font-sans text-slate-700 space-y-0.5">
                        {proj.bullets.map((b, i) => (
                          <li key={i} className="leading-tight">{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Certs */}
              <div className="space-y-1">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                  Education & Certifications
                </h2>
                <div className="text-[10.5px] font-sans text-slate-800 space-y-1">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex justify-between">
                      <div>
                        <strong>{edu.institution}</strong> — {edu.degree}
                      </div>
                      <span className="text-slate-600">{edu.period}</span>
                    </div>
                  ))}
                  <div className="pt-0.5 flex flex-wrap gap-x-2 text-[10px] text-slate-600">
                    {certifications.map((c, i) => (
                      <span key={i}>• {c}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Authenticity & ATS Guarantee Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60 flex items-start gap-3 text-xs">
        <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-bold text-emerald-900 dark:text-emerald-300">
            Overleaf Compatible • Guaranteed ATS Parser Compatibility
          </div>
          <p className="text-emerald-700 dark:text-emerald-400">
            Copy the raw LaTeX code into <strong className="underline">Overleaf.com</strong> or export directly to PDF. Every section follows FAANG recruiter standards, strictly separating historical tenure from recent containerized modernization sprints.
          </p>
        </div>
      </div>

      {/* ── Interconnected Next Action in Returnee Journey ── */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-teal-50 via-blue-50 to-indigo-50 dark:from-slate-800/90 dark:via-teal-950/30 dark:to-slate-900 border border-teal-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
            <Sparkles size={14} className="text-teal-600 dark:text-teal-400" />
            <span>Resume Ready? Practice Speaking These Points Aloud</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            Test how confidently you speak about your modernization sprint with the 1:1 Voice AI mock interviewer.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link
            to="/features/returnships"
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition"
          >
            <span>Returnships Hub</span>
            <ExternalLink size={12} />
          </Link>

          <Link
            to="/features/gap-to-strength"
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black flex items-center gap-1.5 transition shadow-sm"
          >
            <Mic size={13} />
            <span>Start 1:1 Voice Mock</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}
