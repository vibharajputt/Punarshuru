import { useState, useId } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { ShieldCheck, MapPin, Award, CheckCircle2, Smartphone, Settings2 } from 'lucide-react'
import type { PassportResponse } from '@/types'

interface PassportCardProps {
  passport: PassportResponse
  showFullUrl?: boolean
  initialHost?: string
}

export default function PassportCard({
  passport,
  showFullUrl = false,
  initialHost,
}: PassportCardProps) {
  const customHostInputId = useId()
  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  
  // Active Wi-Fi network host for mobile phone scanning
  const currentNetworkHost = 'http://172.22.203.34:5173'
  const defaultNetworkHost = isLocalhost ? currentNetworkHost : (typeof window !== 'undefined' ? window.location.origin : 'https://punarshuru.in')

  const [targetOrigin, setTargetOrigin] = useState<string>(initialHost || defaultNetworkHost)
  const [showHostSettings, setShowHostSettings] = useState(false)
  const [customHost, setCustomHost] = useState(currentNetworkHost)


  const publicUrl = `${targetOrigin.replace(/\/$/, '')}/p/${passport.slug}`
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

          {/* QR Code & Mobile Scan Selector */}
          <div className="sm:col-span-4 flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2.5 text-center">
            <div className="p-2 bg-white rounded-xl shadow-xs">
              <QRCodeSVG
                value={publicUrl}
                size={100}
                level="M"
                includeMargin={false}
              />
            </div>
            
            <div className="space-y-1 w-full">
              <span className="text-[10px] font-mono text-[#0B4F9C] dark:text-sky-400 font-bold truncate block">
                /p/{passport.slug}
              </span>

              {/* Host Toggle Switcher for Mobile Phone Scanning */}
              {isLocalhost && (
                <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1">
                  <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-500">
                    <Smartphone size={11} className="text-[#F26B1D]" />
                    <span>Scan Target:</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      onClick={() => setTargetOrigin(currentNetworkHost)}
                      className={`px-2 py-0.5 rounded-lg text-[9.5px] font-bold transition cursor-pointer ${
                        targetOrigin === currentNetworkHost
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300'
                      }`}
                      title="Use Wi-Fi LAN IP so phone camera connects on same Wi-Fi"
                    >
                      Wi-Fi IP
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetOrigin('http://localhost:5173')}
                      className={`px-2 py-0.5 rounded-lg text-[9.5px] font-bold transition cursor-pointer ${
                        targetOrigin.includes('localhost')
                          ? 'bg-[#0B4F9C] text-white shadow-2xs'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300'
                      }`}
                      title="Use Localhost (PC only)"
                    >
                      Localhost
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowHostSettings(!showHostSettings)}
                      className="p-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 text-[9.5px] cursor-pointer"
                      title="Custom IP / Host"
                    >
                      <Settings2 size={10} />
                    </button>
                  </div>

                  {showHostSettings && (
                    <div className="pt-1.5 space-y-1 text-left">
                      <label htmlFor={customHostInputId} className="text-[9px] text-slate-400 block font-semibold">Custom Host / Tunnel:</label>
                      <div className="flex gap-1">
                        <input
                          id={customHostInputId}
                          type="text"
                          value={customHost}
                          onChange={(e) => setCustomHost(e.target.value)}
                          placeholder="http://192.168.1.x:5173"
                          className="w-full px-1.5 py-0.5 rounded text-[9px] font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600"
                        />
                        <button
                          type="button"
                          onClick={() => setTargetOrigin(customHost)}
                          className="px-1.5 py-0.5 bg-[#0B4F9C] text-white text-[9px] font-bold rounded cursor-pointer"
                        >
                          Set
                        </button>
                      </div>
                    </div>
                  )}

                  <p className="text-[9px] text-slate-400 leading-tight">
                    {targetOrigin === currentNetworkHost
                      ? '✓ Phone & PC same Wi-Fi par hone chahiye'
                      : '⚠️ Localhost phone par direct open nahi hota'}
                  </p>
                </div>
              )}

            </div>
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

