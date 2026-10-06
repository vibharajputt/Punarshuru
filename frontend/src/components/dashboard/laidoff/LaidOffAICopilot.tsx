import { useState } from 'react'
import {
  Sparkles,
  FileText,
  Copy,
  Check,
  Volume2,
  ShieldCheck,
  Zap,
} from 'lucide-react'

export default function LaidOffAICopilot() {
  const [jobDescription, setJobDescription] = useState(
    'Looking for a Senior SDET with hands-on experience in Playwright or Cypress, PyTest, Dockerized test execution, and CI/CD pipeline integration (GitHub Actions / Jenkins). Must possess strong API testing background and system reliability mindset.'
  )

  const [activeNarrativeTone, setActiveNarrativeTone] = useState<'restructuring' | 'highperformer' | 'growth'>('restructuring')
  const [copiedResume, setCopiedResume] = useState(false)
  const [copiedNarrative, setCopiedNarrative] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Extracted keywords from sample JD
  const extractedKeywords = [
    { word: 'Playwright & PyTest', status: 'missing', fix: 'Mapped from existing Selenium & Python SDLC' },
    { word: 'Dockerized Grid', status: 'missing', fix: 'Add containerized execution bullet' },
    { word: 'CI/CD Pipelines (GitHub Actions)', status: 'missing', fix: 'Add automated regression triggers' },
    { word: 'REST API Automation', status: 'matched', fix: 'Already in top 3 skills' },
    { word: 'Jira & TestRail', status: 'matched', fix: 'Already in foundation' },
  ]

  // Synthesized tailored bullets
  const tailoredBullets = [
    'Architected automated test suites with PyTest & Playwright, reducing regression execution cycle time from 14 hours to 35 minutes across distributed environments.',
    'Dockerized test automation pipelines and integrated them into GitHub Actions CI/CD workflows, achieving zero flaky test leaks in daily production releases.',
    'Led API contract testing and reliability audits across 40+ microservices, identifying 120+ edge-case concurrency anomalies before customer checkout.',
    'Spearheaded quality engineering transition from manual workflows to 85% end-to-end automation test coverage within 4 months.',
  ]

  // Layoff explanation narratives
  const narratives = {
    restructuring:
      "My departure was part of a company-wide strategic restructuring where our entire business unit was phased out due to macroeconomic re-allocation. Prior to this, I maintained a top-tier appraisal rating (4.8/5.0). The positive outcome is that I am available to join your engineering team immediately with 0-day notice period and zero transition delays.",
    highperformer:
      "Our division experienced a macro organizational downsize affecting 40% of the engineering vertical. I was privileged to lead automation testing for core payments until the final sprint, with full management recommendations. I have spent the last 3 weeks upgrading to Playwright and CI/CD pipelines, and I'm ready to deploy high-velocity test suites on Day 1.",
    growth:
      "While the corporate layoff was unexpected, I treat it as an accelerated inflection point. It gave me the dedicated window to bridge the delta from traditional testing to modern Cloud QA and Dockerized test frameworks. With immediate joining availability, I can solve your active test automation bottlenecks without waiting for a 60-day notice period.",
  }

  const handleCopyResume = () => {
    navigator.clipboard.writeText(tailoredBullets.join('\n\n'))
    setCopiedResume(true)
    setTimeout(() => setCopiedResume(false), 2000)
  }

  const handleCopyNarrative = () => {
    navigator.clipboard.writeText(narratives[activeNarrativeTone])
    setCopiedNarrative(true)
    setTimeout(() => setCopiedNarrative(false), 2000)
  }

  const handleSpeakNarrative = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
        return
      }
      const utterance = new SpeechSynthesisUtterance(narratives[activeNarrativeTone])
      utterance.rate = 0.95
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      setIsSpeaking(true)
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="space-y-6">
      {/* ── 1. Top Header ── */}
      <div className="bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 dark:from-purple-950/30 dark:via-indigo-950/20 dark:to-slate-900 border border-purple-200/80 dark:border-purple-900/60 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-black mb-2">
            <Sparkles size={13} />
            <span>Pillar 3 • Smart AI Copilot & Stigma Removal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            JD-to-Resume Tailor & Layoff Explanation Helper
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Beat ATS screening algorithms with tailored keywords and deliver confident, stigma-free interview answers.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold">
          <Zap size={14} className="text-purple-600" />
          <span>ATS Pass Rate: 94%</span>
        </div>
      </div>

      {/* ── 2. JD-to-Resume Tailor Lab ── */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FileText size={16} className="text-[#0B4F9C]" />
              <span>Interactive JD Keyword Optimizer</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Paste target company job description to extract missing keywords and synthesize tailored bullet points.
            </p>
          </div>

          <button
            onClick={handleCopyResume}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0B4F9C] hover:bg-blue-800 text-white text-xs font-bold transition cursor-pointer self-start sm:self-auto"
          >
            {copiedResume ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedResume ? 'Copied to Clipboard!' : 'Copy Tailored Bullets'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left: Input JD */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Target Job Description (JD):</label>
            <textarea
              rows={6}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed focus:outline-none focus:border-[#0B4F9C]"
            />

            {/* Keyword Delta Badges */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">AI Detected Keyword Gaps:</span>
              <div className="flex flex-wrap gap-1.5">
                {extractedKeywords.map((k, i) => (
                  <span
                    key={i}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
                      k.status === 'matched'
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : 'bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    {k.status === 'matched' ? '✓ ' : '+ '}
                    {k.word}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Synthesized ATS Bullets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase">AI Synthesized Resume Bullets:</label>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                Quantified Impact Format
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700 space-y-3">
              {tailoredBullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B4F9C] shrink-0 mt-1.5" />
                  <p className="leading-relaxed">{bullet}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Layoff Explanation & Interview Narrative Helper ── */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-400" />
              <span>Layoff Stigma Removal & HR Narrative Helper</span>
            </h3>
            <p className="text-xs text-slate-400">
              Confident, polished responses to the question: <em>"Why did you leave your previous role?"</em>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeakNarrative}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Volume2 size={14} className={isSpeaking ? 'text-amber-400 animate-pulse' : 'text-slate-300'} />
              <span>{isSpeaking ? 'Stop Audio' : 'Listen Pitch'}</span>
            </button>

            <button
              onClick={handleCopyNarrative}
              className="px-3.5 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100 transition cursor-pointer"
            >
              {copiedNarrative ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copiedNarrative ? 'Copied!' : 'Copy Script'}</span>
            </button>
          </div>
        </div>

        {/* Tone Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold">Select Narrative Angle:</span>
          <div className="flex flex-wrap gap-1 p-1 bg-slate-800 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveNarrativeTone('restructuring')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeNarrativeTone === 'restructuring' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Macro Restructuring (Executive)
            </button>
            <button
              onClick={() => setActiveNarrativeTone('highperformer')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeNarrativeTone === 'highperformer' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Top-Tier Performer Angle
            </button>
            <button
              onClick={() => setActiveNarrativeTone('growth')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeNarrativeTone === 'growth' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Fast-Track Upskilling Angle
            </button>
          </div>
        </div>

        {/* Pitch Box */}
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 text-sm text-slate-200 leading-relaxed font-sans relative">
          <p className="italic font-medium">"{narratives[activeNarrativeTone]}"</p>
        </div>

        {/* Immediate Joiner Negotiation Tips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <p className="font-bold text-amber-400">1. Don't Disclose Cash Urgency</p>
            <p className="text-slate-400 text-[11px] mt-0.5">Focus on company culture fit and urgent project start dates.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <p className="font-bold text-emerald-400">2. 0-Day Notice Is High-Value</p>
            <p className="text-slate-400 text-[11px] mt-0.5">Companies lose ₹1.5L every month an open position remains unfilled.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <p className="font-bold text-sky-400">3. Ask for Joining Bonus</p>
            <p className="text-slate-400 text-[11px] mt-0.5">Request a sign-on bonus in lieu of unvested stock or delayed bonus.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
