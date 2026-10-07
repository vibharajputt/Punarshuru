import { useState } from 'react'
import {
  Target,
  Check,
  FileText,
  Copy,
  Award,
  ShieldCheck,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useUserProfile } from '@/store/userProfileStore'
import type { VerificationArtifact } from '@/store/profileStore'
import MilestoneVerificationModal from '@/components/verification/MilestoneVerificationModal'

export interface MissingCompetency {
  id: string
  name: string
  importance: 'Critical' | 'High' | 'Medium'
  howToDemonstrate: string
  done: boolean
  businessImpact: string
  artifact?: VerificationArtifact
}

export default function PromotionReadiness({
  nextRole: propNextRole,
}: {
  nextRole?: string
  matchPct?: number
}) {
  const { t } = useTranslation()
  const { targetRole } = useUserProfile()
  const nextRole = propNextRole || targetRole || 'Senior AI Support & Chatbot Operations Lead'
  const [competencies, setCompetencies] = useState<MissingCompetency[]>([
    {
      id: 'c1',
      name: 'Automated Ticket Triage Pipeline (FastAPI Webhook)',
      importance: 'Critical',
      howToDemonstrate: 'Build a standalone FastAPI webhook script categorizing L2 tickets and auto-suggesting resolution runbooks.',
      done: true,
      businessImpact: 'Saves ~6.5 hours of manual triage every week across the pod.',
      artifact: {
        method: 'github',
        title: 'developer/fastapi-triage-webhook',
        repoFullName: 'developer/fastapi-triage-webhook',
        githubUrl: 'https://github.com/developer/fastapi-triage-webhook',
        stars: 6,
        language: 'Python',
        verifiedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        summary: 'FastAPI webhook script categorizing L2 tickets and auto-suggesting runbooks.',
      },
    },
    {
      id: 'c2',
      name: 'Internal Knowledge-Base Vector Search (ChromaDB + LLM)',
      importance: 'Critical',
      howToDemonstrate: 'Deploy a local semantic search over 200+ internal SOP runbooks so team finds answers in <500ms.',
      done: false,
      businessImpact: 'Reduces MTTR (Mean Time to Resolution) by 35%.',
    },
    {
      id: 'c3',
      name: 'Team SOP Standardization & Junior Mentorship',
      importance: 'High',
      howToDemonstrate: 'Author 3 standardized onboarding runbooks and mentor 2 junior engineers through shadow queues.',
      done: false,
      businessImpact: 'Cuts new hire ramp-up time from 60 days to 25 days.',
    },
    {
      id: 'c4',
      name: 'Executive ROI Documentation & Metric Tracking',
      importance: 'Medium',
      howToDemonstrate: 'Package ticket deflection statistics into a monthly dashboard deck for engineering directors.',
      done: true,
      businessImpact: 'Provides indisputable quantifiable proof for band elevation.',
      artifact: {
        method: 'certificate',
        title: 'Executive_ROI_Q4_Deck.pdf',
        fileName: 'Executive_ROI_Q4_Deck.pdf',
        fileSize: 1850000,
        verifiedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        summary: 'Packaged ticket deflection metrics deck for director appraisal review.',
      },
    },
  ])

  const [copiedScript, setCopiedScript] = useState(false)
  const [verifyingComp, setVerifyingComp] = useState<MissingCompetency | null>(null)

  const handleOpenVerification = (comp: MissingCompetency) => {
    setVerifyingComp(comp)
  }

  const handleVerifyComplete = (artifact: VerificationArtifact) => {
    if (!verifyingComp) return
    setCompetencies((prev) =>
      prev.map((c) =>
        c.id === verifyingComp.id
          ? { ...c, done: true, artifact }
          : c
      )
    )
    setVerifyingComp(null)
  }

  const handleRemoveVerification = () => {
    if (!verifyingComp) return
    setCompetencies((prev) =>
      prev.map((c) =>
        c.id === verifyingComp.id
          ? { ...c, done: false, artifact: undefined }
          : c
      )
    )
    setVerifyingComp(null)
  }

  const completedCount = competencies.filter((c) => c.done).length
  const liveReadiness = Math.round((completedCount / competencies.length) * 100)

  const proposalScript = `Hi [Manager Name],
Over the past quarter, alongside resolving core escalations, I initiated an automation project that addresses our team's repetitive ticket load:
1. Deployed an automated FastAPI triage webhook that deflected ~15% of repetitive volume, saving roughly 6.5 engineering hours/week.
2. Setup semantic search over our internal runbooks, which has already reduced initial triage latency by 35%.

Given that I have been operating with senior-level architectural ownership and mentoring junior pod members, I would like to formally discuss aligning my title and compensation to the ${nextRole} band in our upcoming appraisal review.`

  const copyProposal = () => {
    navigator.clipboard.writeText(proposalScript)
    setCopiedScript(true)
    setTimeout(() => setCopiedScript(false), 2500)
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-7">
      {/* ── 1. Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/60 dark:to-blue-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-black mb-1.5 border border-emerald-200/50">
            <Target size={13} className="text-emerald-600" />
            <span>{t('features.promotion-readiness.sidebar', 'Promotion Readiness')}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('features.promotion-readiness.heading', 'Next Level Elevation Rubric')} ({nextRole})
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            {t('features.promotion-readiness.subtitle', 'Unpacking the unstated technical evidence, business ROI, and leadership signals required to secure your next band promotion.')}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0">
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase">{t('features.promotion-readiness.completed', 'Live Promotion Score')}</div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {liveReadiness}% {t('features.promotion-readiness.completed', 'Ready')}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Interactive Competency Proof Checklist ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Award size={14} className="text-[#0B4F9C]" />
            <span>Promotion Rubric & Work Evidence (Click to Track):</span>
          </h4>
          <span className="text-xs font-bold text-slate-400">
            {completedCount} of {competencies.length} Evidence Artifacts Ready
          </span>
        </div>

        <div className="space-y-3">
          {competencies.map((comp) => (
            <div
              key={comp.id}
              onClick={() => handleOpenVerification(comp)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                comp.done
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 shadow-xs'
                  : 'bg-white dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      comp.done
                        ? 'bg-emerald-600 text-white'
                        : 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                    }`}
                  >
                    {comp.done && <Check size={13} strokeWidth={3} />}
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                      {comp.name}
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium leading-relaxed">
                      {comp.howToDemonstrate}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shrink-0 ${
                    comp.importance === 'Critical'
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                  }`}
                >
                  {comp.importance}
                </span>
              </div>

              {/* Quantifiable Business Impact Note */}
              <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span><strong className="text-emerald-700 dark:text-emerald-400">Measurable Impact:</strong> {comp.businessImpact}</span>
                <span className="text-[10px] font-bold text-slate-400 shrink-0 ml-2">
                  {comp.done ? '✅ Proof Ready' : '⏳ In Progress'}
                </span>
              </div>

              {/* Verified Proof Banner */}
              {comp.done && (
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-300 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-black text-[10px] uppercase flex items-center gap-1 shrink-0">
                      <ShieldCheck size={11} /> Proof Ready
                    </span>
                    <span className="font-mono text-xs text-slate-800 dark:text-slate-200 truncate font-semibold">
                      {comp.artifact?.method === 'github' && `🔗 GitHub: ${comp.artifact.repoFullName || comp.artifact.title}`}
                      {comp.artifact?.method === 'certificate' && `📜 Proof: ${comp.artifact.fileName || comp.artifact.title}`}
                      {comp.artifact?.method === 'quiz' && `🧠 Quiz Passed: ${comp.artifact.quizScore || '3/3'}`}
                      {!comp.artifact && 'Verified Proof Attached'}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#0B4F9C] dark:text-sky-300 hover:underline shrink-0 text-left sm:text-right">
                    Inspect Evidence ↗
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. Manager 1-on-1 Promotion Script Generator ── */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-slate-50 dark:from-slate-800 dark:via-blue-950/30 dark:to-slate-900 border-2 border-[#0B4F9C]/30 dark:border-blue-900/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-[#0B4F9C] dark:text-sky-400" />
            <h4 className="text-sm font-black text-slate-900 dark:text-white">
              Copy-Ready 1:1 Manager Promotion Proposal Script
            </h4>
          </div>

          <button
            type="button"
            onClick={copyProposal}
            className="px-3 py-1 rounded-xl bg-[#0B4F9C] hover:bg-blue-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            {copiedScript ? <Check size={13} /> : <Copy size={13} />}
            <span>{copiedScript ? t('features.promotion-readiness.dossier_copied', 'Copied to Clipboard!') : t('features.manager-1on1.copy_script', 'Copy Script')}</span>
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Use this data-backed script in your upcoming 1-on-1 to anchor the conversation around quantifiable engineering ROI rather than subjective tenure.
        </p>

        <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
          {proposalScript}
        </div>
      </div>

      {verifyingComp && (
        <MilestoneVerificationModal
          isOpen={Boolean(verifyingComp)}
          onClose={() => setVerifyingComp(null)}
          milestoneTitle={verifyingComp.name}
          existingArtifact={verifyingComp.artifact}
          onVerify={handleVerifyComplete}
          onRemove={handleRemoveVerification}
        />
      )}
    </div>
  )
}
