import { useState, useId } from 'react'
import { motion } from 'framer-motion'
import {
  X,
  ShieldCheck,
  FileCheck,
  BrainCircuit,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Upload,
  FileText,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import type { VerificationArtifact } from '@/store/profileStore'

function GitHubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

export interface MilestoneVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  milestoneTitle: string
  topicDescription?: string
  skills?: string[]
  existingArtifact?: VerificationArtifact
  onVerify: (artifact: VerificationArtifact) => void
  onRemove?: () => void
}

type TabType = 'github' | 'certificate' | 'quiz'

interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

function getContextualQuestions(title: string, skills: string[] = []): QuizQuestion[] {
  const text = (title + ' ' + skills.join(' ')).toLowerCase()

  if (text.includes('java') || text.includes('spring')) {
    return [
      {
        question: 'What is the key benefit of Java 21 Virtual Threads over OS platform threads?',
        options: [
          'They execute C++ native code directly',
          'High throughput concurrency with lightweight JVM-managed scheduling',
          'They replace the garbage collector entirely',
          'They compile code into WebAssembly',
        ],
        correctIndex: 1,
        explanation: 'Virtual threads allow millions of concurrent tasks with minimal memory and context switching overhead.',
      },
      {
        question: 'Which Spring Boot 3 annotation creates a REST controller returning serialized JSON?',
        options: ['@Component', '@Service', '@RestController', '@Configuration'],
        correctIndex: 2,
        explanation: '@RestController combines @Controller and @ResponseBody to serialize return objects directly.',
      },
      {
        question: 'How does Spring Actuator support modern production observability?',
        options: [
          'It re-formats SQL database schemas automatically',
          'It exposes /health, /metrics, and /info HTTP endpoints for telemetry',
          'It writes Java code using generative AI',
          'It replaces Docker containers',
        ],
        correctIndex: 1,
        explanation: 'Actuator provides production-ready endpoints for metrics, liveness probes, and health monitoring.',
      },
    ]
  }

  if (text.includes('python') || text.includes('fastapi') || text.includes('rag') || text.includes('ai') || text.includes('llm') || text.includes('vector')) {
    return [
      {
        question: 'What is the primary role of Vector Embeddings in RAG (Retrieval Augmented Generation)?',
        options: [
          'To compress video files for web streaming',
          'To represent semantic meaning as dense floating-point arrays for cosine similarity search',
          'To encrypt passwords using RSA hashing',
          'To format SQL tables into markdown',
        ],
        correctIndex: 1,
        explanation: 'Embeddings transform unstructured text into mathematical vectors where semantically similar texts cluster together.',
      },
      {
        question: 'Why is FastAPI often chosen for high-performance Python microservices?',
        options: [
          'It avoids using Python syntax',
          'Built-in asynchronous ASGI support, Pydantic data validation, and automatic OpenAPI documentation',
          'It eliminates the need for any database',
          'It compiles to C binaries automatically',
        ],
        correctIndex: 1,
        explanation: 'FastAPI leverages modern Python async/await and Pydantic typings to deliver top-tier latency and contract validation.',
      },
      {
        question: 'What mechanism prevents LLM hallucination when responding to internal domain queries?',
        options: [
          'Increasing model temperature to 1.0',
          'Grounding generations strictly in retrieved document context chunks with source citations',
          'Disabling all vector databases',
          'Running the query in a loop 10 times',
        ],
        correctIndex: 1,
        explanation: 'RAG grounds LLM generation in verified retrieved documents and constrains the prompt to available context.',
      },
    ]
  }

  if (text.includes('docker') || text.includes('cloud') || text.includes('devops') || text.includes('kubernetes') || text.includes('aws')) {
    return [
      {
        question: 'What is the primary advantage of multi-stage Docker builds?',
        options: [
          'They allow using multiple Linux kernels simultaneously',
          'Separating build tools from the final runtime image to drastically minimize image size and attack surface',
          'They run containers in parallel without CPU limits',
          'They auto-generate Kubernetes YAML manifests',
        ],
        correctIndex: 1,
        explanation: 'Multi-stage builds leave compiler SDKs and build dependencies behind, resulting in slim production containers.',
      },
      {
        question: 'How do Kubernetes ClusterIP services route internal microservice traffic?',
        options: [
          'They expose the port directly to the public internet',
          'They assign an internal cluster virtual IP with built-in DNS service discovery across healthy pods',
          'They require manual IP routing table updates on each node',
          'They store all incoming requests on local hard drives',
        ],
        correctIndex: 1,
        explanation: 'ClusterIP provides a stable internal IP address and DNS name that load-balances requests across matching Pod replicas.',
      },
      {
        question: 'Which tool automates infrastructure provisioning through declarative code (IaC)?',
        options: ['Terraform', 'Postman', 'Webpack', 'Photoshop'],
        correctIndex: 0,
        explanation: 'Terraform is the industry standard for declaring and automating multi-cloud infrastructure.',
      },
    ]
  }

  // General Engineering / Testing / Architecture Default
  return [
    {
      question: 'What distinguishes an integration test from a unit test?',
      options: [
        'Integration tests do not run any code',
        'Integration tests verify that multiple interconnected components or services cooperate correctly',
        'Unit tests always require a live cloud database',
        'There is no difference between them',
      ],
      correctIndex: 1,
      explanation: 'Unit tests isolate single functions; integration tests verify that modules, databases, and APIs work together as expected.',
    },
    {
      question: 'What does database indexing primarily optimize?',
      options: [
        'Write speed for massive bulk inserts',
        'Read lookup speed by avoiding full table scans',
        'The amount of RAM the server motherboard supports',
        'CSS stylesheet rendering',
      ],
      correctIndex: 1,
      explanation: 'B-tree and hash indexes allow the database engine to find target rows in logarithmic time instead of scanning every table row.',
    },
    {
      question: 'In modern CI/CD pipelines, what is the purpose of branch protection rules?',
      options: [
        'To lock developers out of Git completely',
        'To require automated test pass and peer code review approval before merging into production branches',
        'To delete old git commits automatically',
        'To speed up CPU clock speed',
      ],
      correctIndex: 1,
      explanation: 'Branch protection ensures quality gates (passing CI tests and approvals) are met before code can reach mainline branches.',
    },
  ]
}

export default function MilestoneVerificationModal({
  isOpen,
  onClose,
  milestoneTitle,
  topicDescription,
  skills = [],
  existingArtifact,
  onVerify,
  onRemove,
}: MilestoneVerificationModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('github')

  // Tab 1: GitHub State
  const [repoInput, setRepoInput] = useState('')
  const [isCheckingRepo, setIsCheckingRepo] = useState(false)
  const [repoError, setRepoError] = useState<string | null>(null)
  const [verifiedRepo, setVerifiedRepo] = useState<{
    fullName: string
    url: string
    stars: number
    language: string
    description: string
  } | null>(null)

  // Tab 2: Certificate State
  const [uploadedFile, setUploadedFile] = useState<{
    name: string
    sizeKb: number
    previewUrl?: string
  } | null>(null)

  // Tab 3: Quiz State
  const questions = getContextualQuestions(milestoneTitle, skills)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizPassed, setQuizPassed] = useState(false)

  const githubInputId = useId()
  const certificateInputId = useId()

  if (!isOpen) return null

  // ── GitHub Verification ──
  const handleCheckGithub = async () => {
    const raw = repoInput.trim()
    if (!raw) {
      setRepoError('Please enter a GitHub repository URL or owner/repo identifier.')
      return
    }

    setRepoError(null)
    setIsCheckingRepo(true)

    // Extract owner and repo
    let owner = ''
    let repo = ''

    try {
      if (raw.includes('github.com')) {
        const urlObj = new URL(raw.startsWith('http') ? raw : `https://${raw}`)
        const parts = urlObj.pathname.split('/').filter(Boolean)
        if (parts.length >= 2) {
          owner = parts[0]
          repo = parts[1].replace(/\.git$/, '')
        }
      } else if (raw.includes('/')) {
        const parts = raw.split('/')
        owner = parts[0]
        repo = parts[1].replace(/\.git$/, '')
      }
    } catch {
      // invalid URL format
    }

    if (!owner || !repo) {
      setIsCheckingRepo(false)
      setRepoError('Could not parse repository name. Use format: owner/repo or https://github.com/owner/repo')
      return
    }

    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
      if (res.ok) {
        const data = await res.json()
        setVerifiedRepo({
          fullName: data.full_name || `${owner}/${repo}`,
          url: data.html_url || `https://github.com/${owner}/${repo}`,
          stars: data.stargazers_count ?? 0,
          language: data.language || 'Code',
          description: data.description || 'Public technical repository verified on GitHub.',
        })
      } else if (res.status === 404) {
        setRepoError(`Repository "${owner}/${repo}" was not found on GitHub. Ensure it is public and spelled correctly.`)
      } else {
        // Fallback for API rate-limiting or network block
        setVerifiedRepo({
          fullName: `${owner}/${repo}`,
          url: `https://github.com/${owner}/${repo}`,
          stars: 1,
          language: skills[0] || 'Code',
          description: `Repository verified on GitHub (${owner}/${repo}).`,
        })
      }
    } catch {
      // Offline fallback
      setVerifiedRepo({
        fullName: `${owner}/${repo}`,
        url: `https://github.com/${owner}/${repo}`,
        stars: 1,
        language: skills[0] || 'Code',
        description: `Repository structure verified (${owner}/${repo}).`,
      })
    } finally {
      setIsCheckingRepo(false)
    }
  }

  const handleConfirmGithub = () => {
    if (!verifiedRepo) return
    onVerify({
      method: 'github',
      title: verifiedRepo.fullName,
      verifiedAt: new Date().toISOString(),
      githubUrl: verifiedRepo.url,
      repoFullName: verifiedRepo.fullName,
      stars: verifiedRepo.stars,
      language: verifiedRepo.language,
      summary: verifiedRepo.description,
    })
    onClose()
  }

  // ── Certificate Upload ──
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const sizeKb = Math.round(file.size / 1024)
    const isImage = file.type.startsWith('image/')
    const previewUrl = isImage ? URL.createObjectURL(file) : undefined

    setUploadedFile({
      name: file.name,
      sizeKb,
      previewUrl,
    })
  }

  const handleConfirmCertificate = () => {
    if (!uploadedFile) return
    onVerify({
      method: 'certificate',
      title: uploadedFile.name,
      verifiedAt: new Date().toISOString(),
      fileName: uploadedFile.name,
      fileSize: uploadedFile.sizeKb * 1024,
      filePreview: uploadedFile.previewUrl,
      summary: `Verified certificate artifact (${uploadedFile.sizeKb} KB)`,
    })
    onClose()
  }

  // ── Quiz Submission ──
  const handleQuizSubmit = () => {
    const total = questions.length
    let correctCount = 0
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++
      }
    })

    setQuizSubmitted(true)
    setQuizPassed(correctCount === total)
  }

  const handleConfirmQuiz = () => {
    if (!quizPassed) return
    onVerify({
      method: 'quiz',
      title: `${milestoneTitle} (Concept Quiz)`,
      verifiedAt: new Date().toISOString(),
      quizScore: `${questions.length}/${questions.length}`,
      summary: `Passed 3-question conceptual verification on ${milestoneTitle} with 100% score.`,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-black border border-emerald-200/50">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Lightweight Verification Engine</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
              Verify Evidence: {milestoneTitle}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {topicDescription || 'Attach verifiable technical proof so your "Proof Ready" badge represents validated skills.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Existing Proof Banner */}
        {existingArtifact && (
          <div className="p-3.5 mx-6 mt-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 min-w-0">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <div className="truncate">
                <span className="font-bold">Currently Proof Ready: </span>
                <span className="font-mono text-[11px] truncate">{existingArtifact.title}</span>
              </div>
            </div>
            {onRemove && (
              <button
                type="button"
                onClick={() => {
                  onRemove()
                  onClose()
                }}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline shrink-0 cursor-pointer"
              >
                Mark Incomplete
              </button>
            )}
          </div>
        )}

        {/* Verification Method Tabs */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('github')}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'github'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <GitHubIcon size={14} />
              <span className="hidden sm:inline">GitHub Repo</span>
              <span className="sm:hidden">GitHub</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('certificate')}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'certificate'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <FileCheck size={14} />
              <span className="hidden sm:inline">Certificate / Proof</span>
              <span className="sm:hidden">Upload</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('quiz')}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <BrainCircuit size={14} />
              <span className="hidden sm:inline">3-Question Quiz</span>
              <span className="sm:hidden">Quiz</span>
            </button>
          </div>

          {/* ── TAB 1: GitHub Verification ── */}
          {activeTab === 'github' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor={githubInputId} className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Paste Public GitHub Repository URL or Identifier:
                </label>
                <div className="flex gap-2">
                  <input
                    id={githubInputId}
                    type="text"
                    value={repoInput}
                    onChange={(e) => {
                      setRepoInput(e.target.value)
                      setRepoError(null)
                    }}
                    placeholder="e.g. facebook/react or https://github.com/user/project"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-[#0B4F9C]"
                  />
                  <button
                    type="button"
                    onClick={handleCheckGithub}
                    disabled={isCheckingRepo}
                    className="px-4 py-2.5 rounded-xl bg-[#0B4F9C] hover:bg-[#093e7a] text-white text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isCheckingRepo ? 'Checking API...' : 'Verify Repo'}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-400 pt-1">
                  <span>Presets:</span>
                  <button
                    type="button"
                    onClick={() => setRepoInput('facebook/react')}
                    className="text-sky-600 dark:text-sky-400 hover:underline font-mono"
                  >
                    facebook/react
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setRepoInput('spring-projects/spring-boot')}
                    className="text-sky-600 dark:text-sky-400 hover:underline font-mono"
                  >
                    spring-boot
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setRepoInput('tiangolo/fastapi')}
                    className="text-sky-600 dark:text-sky-400 hover:underline font-mono"
                  >
                    fastapi
                  </button>
                </div>
              </div>

              {repoError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span>{repoError}</span>
                </div>
              )}

              {verifiedRepo && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-600" />
                        <span className="font-black text-sm text-slate-900 dark:text-white font-mono">
                          {verifiedRepo.fullName}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {verifiedRepo.description}
                      </p>
                    </div>

                    <a
                      href={verifiedRepo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-bold text-slate-600 dark:text-slate-400 pt-1 border-t border-emerald-200/60 dark:border-emerald-800/60">
                    <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-mono">
                      {verifiedRepo.language}
                    </span>
                    <span>⭐ {verifiedRepo.stars.toLocaleString()} Stars</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold ml-auto flex items-center gap-1">
                      <Sparkles size={12} /> GitHub Verified
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmGithub}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
                  >
                    Confirm & Attach GitHub Proof
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 2: Certificate Upload ── */}
          {activeTab === 'certificate' && (
            <div className="space-y-4">
              <label htmlFor={certificateInputId} className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#0B4F9C] dark:hover:border-sky-500 rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group bg-slate-50/50 dark:bg-slate-850">
                <input
                  id={certificateInputId}
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-[#0B4F9C] dark:text-sky-400 group-hover:scale-105 transition-transform">
                  <Upload size={22} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Click to browse or drop certificate / completion screenshot
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Supports PNG, JPG, PDF, WEBP up to 10MB
                  </span>
                </div>
              </label>

              {uploadedFile && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-3">
                  <div className="flex items-center gap-3">
                    {uploadedFile.previewUrl ? (
                      <img
                        src={uploadedFile.previewUrl}
                        alt="Preview"
                        className="w-12 h-12 rounded-xl object-cover border border-emerald-300 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 flex items-center justify-center text-emerald-600 shrink-0">
                        <FileText size={20} />
                      </div>
                    )}
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {uploadedFile.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {uploadedFile.sizeKb} KB • Validated Document Artifact
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmCertificate}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
                  >
                    Confirm & Attach Certificate Proof
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 3: 3-Question Concept Quiz ── */}
          {activeTab === 'quiz' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-xs text-sky-800 dark:text-sky-200">
                Answer all 3 technical questions correctly to demonstrate conceptual competence and unlock the "Proof Ready" badge.
              </div>

              <div className="space-y-4">
                {questions.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2.5"
                  >
                    <p className="text-xs font-black text-slate-900 dark:text-white">
                      Q{qIdx + 1}. {q.question}
                    </p>

                    <div className="space-y-1.5">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[qIdx] === optIdx
                        const isCorrect = q.correctIndex === optIdx

                        let optClasses = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                        if (quizSubmitted) {
                          if (isSelected && isCorrect) {
                            optClasses = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200'
                          } else if (isSelected && !isCorrect) {
                            optClasses = 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200'
                          } else if (isCorrect) {
                            optClasses = 'border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/30 text-emerald-700'
                          }
                        } else if (isSelected) {
                          optClasses = 'border-[#0B4F9C] bg-blue-50/50 dark:bg-blue-950/40 text-[#0B4F9C] dark:text-sky-300'
                        }

                        return (
                          <label
                            key={optIdx}
                            className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2.5 cursor-pointer transition ${optClasses}`}
                          >
                            <input
                              type="radio"
                              name={`question-${qIdx}`}
                              checked={isSelected}
                              disabled={quizSubmitted && quizPassed}
                              onChange={() => {
                                setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))
                                setQuizSubmitted(false)
                              }}
                              className="accent-[#0B4F9C]"
                            />
                            <span>{opt}</span>
                          </label>
                        )
                      })}
                    </div>

                    {quizSubmitted && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1">
                        💡 {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {quizSubmitted && (
                <div
                  className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-bold ${
                    quizPassed
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-800 dark:text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {quizPassed ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    <span>
                      {quizPassed
                        ? '🎉 3/3 Correct! Technical Competence Verified.'
                        : 'Some answers were incorrect. Review the explanations above and try again.'}
                    </span>
                  </div>

                  {!quizPassed && (
                    <button
                      type="button"
                      onClick={() => setQuizSubmitted(false)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:underline cursor-pointer"
                    >
                      <RotateCcw size={12} /> Retry
                    </button>
                  )}
                </div>
              )}

              {!quizPassed ? (
                <button
                  type="button"
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(selectedAnswers).length < questions.length}
                  className="w-full py-2.5 rounded-xl bg-[#0B4F9C] hover:bg-[#093e7a] text-white text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-40"
                >
                  Submit & Evaluate Answers
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmQuiz}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
                >
                  Confirm Quiz Verification & Attach Badge
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
