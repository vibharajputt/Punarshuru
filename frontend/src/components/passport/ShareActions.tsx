import { useState } from 'react'
import { Download, Share2, Copy, Check, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { PassportResponse } from '@/types'

interface ShareActionsProps {
  passport: PassportResponse
}

export default function ShareActions({ passport }: ShareActionsProps) {
  const [copied, setCopied] = useState(false)
  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://punarshuru.in'}/p/${passport.slug}`

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadPdf = () => {
    window.print()
  }

  const shareText = encodeURIComponent(
    `Check out my verified AI Talent Passport on Punarshuru (${passport.profile_name} — ${passport.target_role}): ${publicUrl}`
  )

  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Share / Action Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Copy Link */}
        <button
          type="button"
          onClick={handleCopy}
          className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:border-[#0B4F9C] hover:text-[#0B4F9C] transition-all flex flex-col items-center justify-center gap-1.5 shadow-2xs"
        >
          {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
          <span>{copied ? 'Link Copied!' : 'Copy Public URL'}</span>
        </button>

        {/* WhatsApp Share */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-all flex flex-col items-center justify-center gap-1.5 shadow-2xs"
        >
          <Share2 size={16} />
          <span>Share WhatsApp</span>
        </a>

        {/* LinkedIn Share */}
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noreferrer"
          className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-[#0B4F9C] dark:text-sky-300 text-xs font-bold hover:bg-sky-100 transition-all flex flex-col items-center justify-center gap-1.5 shadow-2xs"
        >
          <Share2 size={16} />
          <span>Share LinkedIn</span>
        </a>

        {/* Download PDF / Print */}
        <button
          type="button"
          onClick={handleDownloadPdf}
          className="p-3 rounded-2xl bg-[#0B4F9C] text-white text-xs font-bold hover:bg-[#083b75] transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm shadow-blue-900/15"
        >
          <Download size={16} />
          <span>Print / PDF Card</span>
        </button>
      </div>

      {/* Public URL Direct Link */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 truncate mr-2">
          <span className="text-slate-400 font-semibold">Public Link:</span>
          <span className="font-mono text-slate-700 dark:text-slate-300 truncate">
            {publicUrl}
          </span>
        </div>
        <Link
          to={`/p/${passport.slug}`}
          className="inline-flex items-center gap-1 text-[#0B4F9C] dark:text-sky-400 font-bold hover:underline shrink-0"
        >
          <span>View Live</span>
          <ExternalLink size={12} />
        </Link>
      </div>
    </div>
  )
}
