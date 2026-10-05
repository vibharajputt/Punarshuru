import { useState } from 'react'
import { FileText, Copy, Check, ShieldCheck } from 'lucide-react'

export default function ResumeGapRebuilder({
  gapYears = '2021 – 2025',
}: {
  name?: string
  gapYears?: string
  breakReason?: string
}) {
  const [copied, setCopied] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState<'consultative' | 'upskilling' | 'balanced'>('balanced')

  const bulletOptions = {
    balanced: [
      `Professional Sabbatical & Technical Upskilling | ${gapYears}`,
      `• Dedicated period managing family caregiving priorities while maintaining continuous self-directed software development practices.`,
      `• Modernized core backend skills from Java 8/Monoliths to Spring Boot 3, REST Microservices, and Docker containerization.`,
      `• Designed and deployed cloud-native portfolio projects on GitHub featuring PostgreSQL and Gemini AI integrations.`,
      `• Completed structured certifications in Cloud Computing (NPTEL) and Full Stack Microservices Architecture.`,
    ],
    upskilling: [
      `Independent Technical Development & Cloud Re-skilling | ${gapYears}`,
      `• Undertook rigorous curriculum in distributed systems, modern Spring Framework, and container orchestration.`,
      `• Built an end-to-end AI-powered service catalog featuring RAG workflows, JWT authentication, and automated CI/CD pipelines.`,
      `• Active member of open-source tech communities; audited modern engineering standards and Agile methodologies.`,
    ],
    consultative: [
      `Career Break & Professional Transition | ${gapYears}`,
      `• Successfully managed personal caregiving milestones, sharpening crisis management, prioritization, and rapid adaptability.`,
      `• Proactively upgraded architectural foundations: Spring Boot 3, AWS cloud services, and production deployment pipelines.`,
      `• Ready for immediate full-time re-entry with retained senior problem-solving foundations and up-to-date tool proficiency.`,
    ],
  }

  const currentBullets = bulletOptions[selectedStyle]
  const fullTextToCopy = currentBullets.join('\n')

  const handleCopy = () => {
    navigator.clipboard.writeText(fullTextToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 text-xs font-bold mb-1">
            <FileText size={12} />
            <span>Feature 4 • Resume Gap Rebuilder</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Transform Gap into High-Impact Narrative
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Reframe career hiatus constructively without fabricating employment or hiding authentic experience.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B4F9C] text-white hover:bg-blue-800 text-xs font-bold transition-all shadow-xs"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Resume Section'}</span>
        </button>
      </div>

      {/* Style Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase">Tone & Angle:</span>
        <div className="flex flex-wrap gap-2">
          {(['balanced', 'upskilling', 'consultative'] as const).map((style) => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all ${
                selectedStyle === style
                  ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {style} Emphasis
            </button>
          ))}
        </div>
      </div>

      {/* Narrative Card */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 font-mono text-xs space-y-2">
        <div className="font-bold text-[#0B4F9C] dark:text-sky-400 pb-2 border-b border-slate-200 dark:border-slate-700">
          {currentBullets[0]}
        </div>
        <div className="space-y-1.5 pt-1 text-slate-700 dark:text-slate-200 leading-relaxed">
          {currentBullets.slice(1).map((b, i) => (
            <p key={i}>{b}</p>
          ))}
        </div>
      </div>

      {/* Authenticity Guarantee Alert */}
      <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/50 flex items-start gap-3 text-xs">
        <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-bold text-emerald-900 dark:text-emerald-300">
            100% Truthful & ATS-Friendly Guarantee
          </div>
          <p className="text-emerald-700 dark:text-emerald-400">
            Employers respect authentic reasons (caregiving, health, sabbatical) paired with concrete proof of technical refresh. Never conceal the gap — own it with confidence!
          </p>
        </div>
      </div>
    </div>
  )
}
