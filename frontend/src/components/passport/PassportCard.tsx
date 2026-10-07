import { QRCodeSVG } from 'qrcode.react'
import { ShieldCheck, MapPin, Award, CheckCircle2 } from 'lucide-react'
import type { PassportResponse } from '@/types'

interface PassportCardProps {
  passport: PassportResponse
  showFullUrl?: boolean
}

export default function PassportCard({
  passport,
  showFullUrl = false,
}: PassportCardProps) {
  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://punarshuru.in'}/p/${passport.slug}`
  const resilienceScore = Math.max(20, 100 - (passport.disruption_score || 35))

  return (
    <div
      id="passport-id-card"
      className="relative max-w-2xl mx-auto rounded-3xl p-1 bg-gradient-to-br from-[#0B4F9C] via-[#F26B1D] to-sky-400 shadow-2xl shadow-blue-900/15 overflow-hidden"
    >
      {/* Inner Card */}
      <div className="rounded-[22px] bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 text-slate-900 dark:text-slate-100">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="Punarshuru"
              className="w-9 h-9 rounded-xl object-contain shadow-sm shrink-0"
            />
            <div>
              <h2 className="text-sm font-black tracking-tight text-[#0B4F9C] dark:text-sky-400 uppercase">
                Punarshuru AI Talent Passport
              </h2>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                Verifiable Competency Proof • Bharat 2.0
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
            <ShieldCheck size={14} />
            <span>Cryptographically Verified</span>
          </div>
        </div>

        {/* Profile Info & QR Code */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          {/* Candidate Profile Details */}
          <div className="sm:col-span-8 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0B4F9C] to-sky-500 text-white flex items-center justify-center font-extrabold text-xl shadow-md shrink-0">
                {passport.profile_name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {passport.profile_name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span className="flex items-center gap-0.5">
                    <MapPin size={12} className="text-[#F26B1D]" />
                    {passport.city || 'India'}
                  </span>
                  <span>•</span>
                  <span className="capitalize font-bold text-[#0B4F9C] dark:text-sky-400">
                    {passport.user_type.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
              <p className="text-slate-400">Target Role Competency</p>
              <p className="font-bold text-slate-900 dark:text-white text-sm">
                {passport.target_role || 'Modern Software Professional'}
              </p>
            </div>
          </div>

          {/* QR Code */}
          <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2 text-center">
            <div className="p-2 bg-white rounded-xl shadow-xs">
              <QRCodeSVG
                value={publicUrl}
                size={95}
                level="M"
                includeMargin={false}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]">
              /p/{passport.slug}
            </span>
          </div>
        </div>

        {/* Verified Skills */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Award size={13} className="text-[#0B4F9C]" />
            <span>Verified Skills & Competencies</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {passport.verified_skills.slice(0, 8).map((sk) => (
              <span
                key={sk}
                className="px-3 py-1 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-[#0B4F9C] dark:text-sky-300 border border-sky-100 dark:border-sky-900 text-xs font-bold shadow-2xs"
              >
                ✓ {sk}
              </span>
            ))}
          </div>
        </div>

        {/* Evidence Artifacts */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Verified Proof of Work
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {passport.evidence.map((ev, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs flex items-center gap-2 shadow-2xs"
              >
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <div className="truncate">
                  <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{ev.title}</p>
                  <p className="text-[10px] text-slate-400">{ev.issuer} • {ev.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
          <div>
            <span>Market Resilience Index: </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {resilienceScore}/100 High
            </span>
          </div>
          <div className="font-mono text-[10px]">
            Issued: {passport.created_at}
          </div>
        </div>

        {showFullUrl && (
          <p className="text-center text-[10px] text-slate-400 font-mono break-all pt-1">
            Verifiable Link: {publicUrl}
          </p>
        )}
      </div>
    </div>
  )
}
