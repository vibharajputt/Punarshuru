import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldAlert,
  PhoneCall,
  Share2,
  HeartPulse,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  X,
  ExternalLink,
  ShieldCheck,
  Ambulance,
  MapPin,
  Loader2,
  RefreshCw,
} from 'lucide-react'

export interface DocumentItem {
  id: string
  title: string
  docNumber: string
  issuedTo: string
  expiryDate: string
  daysLeft: number
  status: 'valid' | 'expiring-soon' | 'expired'
  authority: string
}

export default function GigSurakshaVault() {
  const [sosActive, setSosActive] = useState(false)
  const [familyPhone, setFamilyPhone] = useState('9817512192')
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [gpsError, setGpsError] = useState<string | null>(null)

  // Real browser HTML5 Geolocation fetcher
  const fetchLiveGps = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setGpsError('Aapke browser me GPS geolocation support nahi hai.')
      return
    }

    setGpsLoading(true)
    setGpsError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLocation({
          lat: Number(position.coords.latitude.toFixed(6)),
          lng: Number(position.coords.longitude.toFixed(6)),
          accuracy: Math.round(position.coords.accuracy),
        })
        setGpsLoading(false)
      },
      (error) => {
        console.warn('Geolocation error:', error)
        let errMsg = 'Location access allow karein taaki accurate GPS mil sake.'
        if (error.code === error.PERMISSION_DENIED) {
          errMsg = 'GPS Permission Blocked. Browser me location permission allow karein.'
        } else if (error.code === error.TIMEOUT) {
          errMsg = 'GPS signal timeout. Retrying...'
        }
        setGpsError(errMsg)
        setGpsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    )
  }, [])

  // Auto-fetch on mount & when SOS is triggered
  useEffect(() => {
    fetchLiveGps()
  }, [fetchLiveGps])

  // Document Tracker
  const [documents] = useState<DocumentItem[]>([
    {
      id: 'doc-1',
      title: 'Commercial Driving Licence (MCWG + LMV)',
      docNumber: 'UP32 2019004821',
      issuedTo: 'Ramesh Kumar',
      expiryDate: '24 Oct 2026',
      daysLeft: 19,
      status: 'expiring-soon',
      authority: 'RTO Lucknow (Transport Dept)',
    },
    {
      id: 'doc-2',
      title: 'Two-Wheeler Comprehensive Insurance',
      docNumber: 'POL-ICICI-8839219',
      issuedTo: 'Hero Splendor Plus (UP32 EK 4092)',
      expiryDate: '15 Nov 2026',
      daysLeft: 41,
      status: 'valid',
      authority: 'ICICI Lombard General Insurance',
    },
    {
      id: 'doc-3',
      title: 'Pollution Under Control (PUC) Certificate',
      docNumber: 'PUC-UP-9938210',
      issuedTo: 'Hero Splendor Plus',
      expiryDate: '11 Oct 2026',
      daysLeft: 6,
      status: 'expiring-soon',
      authority: 'UP Parivahan Seva',
    },
    {
      id: 'doc-4',
      title: 'Vehicle Registration Certificate (RC)',
      docNumber: 'UP32EK4092',
      issuedTo: 'Ramesh Kumar',
      expiryDate: '14 May 2034',
      daysLeft: 2780,
      status: 'valid',
      authority: 'Govt of Uttar Pradesh',
    },
  ])

  // SOS Emergency Trigger
  const handleTriggerSos = () => {
    setSosActive(true)
    fetchLiveGps()
  }

  const handleShareLocationWhatsapp = () => {
    // If live GPS acquired, use real coords
    const lat = gpsLocation?.lat || 26.8467
    const lng = gpsLocation?.lng || 80.9462
    const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`
    const accuracyText = gpsLocation?.accuracy ? ` (GPS Accuracy: ±${gpsLocation.accuracy}m)` : ''

    const text = `🚨 *EMERGENCY SOS ALERT!* 🚨%0A%0AMai abhi delivery route par hoon aur mujhe emergency madad ki zaroorat hai!%0A%0A📍 *Meri Real-Time Live Location:*%0A${mapsUrl}${accuracyText}%0A%0AKripya turant mujhe call karein ya 112 par police ko inform karein!`
    const url = `https://api.whatsapp.com/send?phone=91${familyPhone.trim()}&text=${text}`
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* ── 1. Top Header ── */}
      <div className="bg-gradient-to-r from-rose-500/10 via-red-500/10 to-amber-500/10 dark:from-rose-950/30 dark:via-red-950/20 dark:to-slate-900 border border-rose-200/80 dark:border-rose-900/60 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-black mb-2">
            <ShieldAlert size={13} className="text-rose-600" />
            <span>Pillar 3 • Suraksha, SOS & Document Vault</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Emergency SOS, Arogya Shield & Document Alerts
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Raat ke samay suraksha, emergency accident cover aur Licence/PUC expire hone se pehle alerts.
          </p>
        </div>

        {/* Big 1-Tap SOS Button */}
        <button
          onClick={handleTriggerSos}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-sm shadow-lg shadow-red-500/30 flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all cursor-pointer animate-pulse"
        >
          <ShieldAlert size={18} />
          <span>1-TAP EMERGENCY SOS</span>
        </button>
      </div>

      {/* ── 2. SOS Live Location Modal ── */}
      <AnimatePresence>
        {sosActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 rounded-3xl bg-red-600 text-white shadow-2xl space-y-4 relative overflow-hidden"
          >
            <button
              onClick={() => setSosActive(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-red-600 flex items-center justify-center font-black">
                <Ambulance size={28} />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider bg-black/20 px-2.5 py-0.5 rounded-full">
                  Emergency Protocol Activated
                </span>
                <h3 className="text-xl sm:text-2xl font-black">Emergency Help & Family Alert</h3>
              </div>
            </div>

            <p className="text-xs text-red-100 max-w-2xl leading-relaxed">
              Aapki current live GPS location track kar li gayi hai. Niche diye gaye button par click karke turant apne parivaar ko WhatsApp par live map link bhein ya 112 police helpline call karein.
            </p>
            {/* Live GPS Coordinates Acquired Badge */}
            <div className="p-3 rounded-2xl bg-black/30 backdrop-blur-xs border border-white/20 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-amber-300 shrink-0 animate-bounce" />
                <div>
                  <span className="font-bold text-white">Live GPS Coordinates: </span>
                  {gpsLoading ? (
                    <span className="text-amber-200 inline-flex items-center gap-1">
                      <Loader2 size={12} className="animate-spin" /> Satellite lock lene ki koshish chal rahi hai...
                    </span>
                  ) : gpsLocation ? (
                    <span className="text-emerald-300 font-mono font-bold">
                      {gpsLocation.lat}° N, {gpsLocation.lng}° E {gpsLocation.accuracy ? `(Accuracy: ±${gpsLocation.accuracy}m)` : ''}
                    </span>
                  ) : (
                    <span className="text-amber-200">{gpsError || 'Fetching GPS...'}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {gpsLocation && (
                  <a
                    href={`https://maps.google.com/?q=${gpsLocation.lat},${gpsLocation.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold flex items-center gap-1 transition"
                  >
                    <span>Maps Par Check Karein ↗</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={fetchLiveGps}
                  disabled={gpsLoading}
                  className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <RefreshCw size={11} className={gpsLoading ? 'animate-spin' : ''} />
                  <span>Refresh GPS</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
                <span className="text-xs font-bold text-red-200">Family Number:</span>
                <input
                  type="text"
                  value={familyPhone}
                  onChange={(e) => setFamilyPhone(e.target.value)}
                  className="w-32 bg-transparent text-white font-black text-xs border-b border-white focus:outline-none"
                  placeholder="9876543210"
                />
              </div>

              <button
                onClick={handleShareLocationWhatsapp}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition"
              >
                <Share2 size={14} />
                <span>WhatsApp Par Live Location Bhejo</span>
              </button>

              <a
                href="tel:112"
                className="px-4 py-2 rounded-xl bg-white text-red-600 hover:bg-red-50 font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition"
              >
                <PhoneCall size={14} />
                <span>Call Police (112)</span>
              </a>

              <a
                href="tel:108"
                className="px-4 py-2 rounded-xl bg-white text-red-600 hover:bg-red-50 font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition"
              >
                <Ambulance size={14} />
                <span>Call Ambulance (108)</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 3. Insurance & Emergency Fund (Arogya / Suraksha Guard) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
                <HeartPulse size={16} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Accident & Health Cover</h3>
                <p className="text-[11px] text-slate-500">Government & Platform Guard</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              Active Protection
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Accidental Disability Cover</span>
                <span className="text-emerald-600 font-black">₹5,00,000</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Under PM Suraksha Bima Yojana (PMSBY) + Platform Partner Group Policy.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Emergency Hospitalization IPD</span>
                <span className="text-emerald-600 font-black">₹1,00,000</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Cashless admission in 4,200+ network hospitals pan-India.
              </p>
            </div>
          </div>
        </div>

        {/* Sick-Day Wage Buffer (Swasthya Bachat) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                <ShieldCheck size={16} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Sick-Day Wage Buffer</h3>
                <p className="text-[11px] text-slate-500">Bimari me "Paid Leave" jaisa fund</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-[#0B4F9C] dark:text-sky-300">
              ₹800 / Day Protected
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
            <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
              Swasthya Wage Shield Status:
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              Agar aap viral fever ya bike accident ke kaaran 3 din delivery nahi kar pate, toh aapko rozana ₹800 ka wage compensation milta hai taaki parivaar par aarthik bojh na pade.
            </p>
            <div className="pt-1 flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-200">
              <span>Reserve Fund Balance:</span>
              <span className="text-sm font-black text-emerald-600">₹6,400 (8 Days Covered)</span>
            </div>
          </div>
        </div>

        {/* Helpline Directory */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <PhoneCall size={16} className="text-rose-400" />
              <span>24x7 Verified Helplines</span>
            </h3>
            <p className="text-xs text-slate-400">
              Emergency hone par bina phone unlock kiye call karne ke liye save karein:
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800 text-xs">
              <span className="font-bold">National Emergency Helpline</span>
              <a href="tel:112" className="font-black text-rose-400 hover:underline">112</a>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800 text-xs">
              <span className="font-bold">Gig Partner Highway Rescue</span>
              <a href="tel:1033" className="font-black text-amber-400 hover:underline">1033 (NHAI)</a>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800 text-xs">
              <span className="font-bold">Medical Ambulance</span>
              <a href="tel:108" className="font-black text-emerald-400 hover:underline">108</a>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Document Expiry Reminders (Licence, Insurance, PUC) ── */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileCheck size={18} className="text-[#0B4F9C]" />
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Vehicle & Personal Document Expiry Radar (चालान से बचाव)
              </h3>
              <p className="text-[11px] text-slate-500">
                Document expire hone se pehle alert milta hai taaki platform par ID block na ho
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <AlertTriangle size={13} />
            2 Documents Need Attention This Month
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => {
            const isExpiring = doc.status === 'expiring-soon'

            return (
              <div
                key={doc.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isExpiring
                    ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/60'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {isExpiring ? (
                        <AlertTriangle size={14} className="text-amber-600 shrink-0" />
                      ) : (
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      )}
                      <span>{doc.title}</span>
                    </h4>
                    <p className="text-xs font-mono font-bold text-slate-500 mt-0.5">{doc.docNumber}</p>
                  </div>

                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-xl ${
                      isExpiring
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {isExpiring ? `${doc.daysLeft} Din Baki!` : 'Valid'}
                  </span>
                </div>

                <div className="pt-3 mt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <div className="text-slate-500 text-[11px]">
                    Expiry: <strong className="text-slate-800 dark:text-slate-200">{doc.expiryDate}</strong>
                  </div>
                  <a
                    href="https://parivahan.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-[#0B4F9C] dark:text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <span>Renew Online (Parivahan)</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
