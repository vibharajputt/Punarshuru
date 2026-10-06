import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  IndianRupee,
  Fuel,
  Wrench,
  Smartphone,
  PiggyBank,
  Calculator,
  Flame,
  Volume2,
  ShieldCheck,
} from 'lucide-react'

export interface PlatformEarning {
  platform: string
  logoText: string
  color: string
  accentColor: string
  today: number
  week: number
  month: number
  ordersToday: number
  hoursToday: number
  payoutStatus: 'Settled' | 'Pending' | 'Direct UPI'
}

export default function GigUnifiedEarnings() {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today')
  const [dailyTarget, setDailyTarget] = useState<number>(1500)
  const [autoSaveDaily, setAutoSaveDaily] = useState<number>(100)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false)

  // Platforms data
  const platforms: PlatformEarning[] = [
    {
      platform: 'Swiggy Food & Instamart',
      logoText: 'SW',
      color: 'bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800',
      accentColor: 'text-orange-600',
      today: 540,
      week: 3820,
      month: 15400,
      ordersToday: 9,
      hoursToday: 4.5,
      payoutStatus: 'Settled',
    },
    {
      platform: 'Zomato Delivery',
      logoText: 'ZM',
      color: 'bg-red-500/10 text-red-600 border-red-200 dark:border-red-800',
      accentColor: 'text-red-600',
      today: 320,
      week: 2450,
      month: 9800,
      ordersToday: 5,
      hoursToday: 2.8,
      payoutStatus: 'Settled',
    },
    {
      platform: 'Uber / Rapido Rides',
      logoText: 'UB',
      color: 'bg-slate-900/10 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700',
      accentColor: 'text-slate-900 dark:text-slate-200',
      today: 220,
      week: 1650,
      month: 6200,
      ordersToday: 4,
      hoursToday: 2.0,
      payoutStatus: 'Direct UPI',
    },
    {
      platform: 'Zepto / Blinkit Quick',
      logoText: 'ZP',
      color: 'bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800',
      accentColor: 'text-purple-600',
      today: 180,
      week: 1200,
      month: 4900,
      ordersToday: 3,
      hoursToday: 1.5,
      payoutStatus: 'Pending',
    },
  ]

  // Totals
  const grossToday = platforms.reduce((acc, p) => acc + p.today, 0) // 1,260
  const grossWeek = platforms.reduce((acc, p) => acc + p.week, 0)
  const grossMonth = platforms.reduce((acc, p) => acc + p.month, 0)

  const activeGross = period === 'today' ? grossToday : period === 'week' ? grossWeek : grossMonth

  // Expenses for Asli Bachat calculation
  const expenses = {
    today: {
      fuel: 220,
      maintenance: 50,
      mobile: 15,
      total: 285,
    },
    week: {
      fuel: 1450,
      maintenance: 350,
      mobile: 100,
      total: 1900,
    },
    month: {
      fuel: 6200,
      maintenance: 1600,
      mobile: 450,
      total: 8250,
    },
  }

  const activeExpense = expenses[period]
  const netSavings = activeGross - activeExpense.total

  // Target progress
  const targetPct = Math.min(100, Math.round((grossToday / dailyTarget) * 100))
  const remainingToday = Math.max(0, dailyTarget - grossToday)

  // Voice narration in Hindi
  const speakHindiSummary = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
        return
      }
      const text = `नमस्ते रमेश जी! आज की कुल कमाई बारह सौ साठ रुपये है। पेट्रोल और खर्च काटने के बाद आपकी असली बचत नौ सौ पचहत्तर रुपये है। आपका आज का लक्ष्य पंद्रह सौ रुपये है, जिसमें से केवल दो सौ चालीस रुपये बाकी हैं।`
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'hi-IN'
      utterance.rate = 0.95
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      setIsSpeaking(true)
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="space-y-6">
      {/* ── 1. Top Bar & Voice Readout ── */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-blue-500/10 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-slate-900 border border-amber-200/80 dark:border-amber-900/60 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-black mb-2">
            <IndianRupee size={13} />
            <span>Pillar 1 • Kamai & Asli Bachat Cockpit</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Unified Gig Earnings & Net Wealth Tracker
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Swiggy, Zomato, Uber aur Zepto ki poori kamai ek jagah — petrol aur maintenance kaat kar asli bachat.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={speakHindiSummary}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
              isSpeaking
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-amber-500 shadow-2xs'
            }`}
          >
            <Volume2 size={15} className={isSpeaking ? 'text-white' : 'text-amber-600'} />
            <span>{isSpeaking ? 'बोलना बंद करें' : 'हिन्दी में सुनें (Audio Summary)'}</span>
          </button>

          <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            {(['today', 'week', 'month'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  period === p
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {p === 'today' ? 'आज (Today)' : p === 'week' ? 'इस हफ्ते' : 'इस महीने'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. Daily Goal Tracker & 14-Day Streak ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
                🎯
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Daily Goal Tracker (आज का लक्ष्य)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Target पूरा करने पर platform peak incentive अनलॉक होता है
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Change Target:</span>
              <select
                value={dailyTarget}
                onChange={(e) => setDailyTarget(Number(e.target.value))}
                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <option value={1200}>₹1,200 / दिन</option>
                <option value={1500}>₹1,500 / दिन (Recommended)</option>
                <option value={1800}>₹1,800 / दिन</option>
                <option value={2200}>₹2,200 / दिन (Super Sprint)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">
                कमाई: <span className="text-emerald-600 dark:text-emerald-400 font-black">₹{grossToday}</span> / ₹{dailyTarget}
              </span>
              <span className="text-amber-600 dark:text-amber-400 font-black">
                {targetPct}% पूरा ({remainingToday === 0 ? 'टारगेट पूरा! 🎉' : `₹${remainingToday} बाकी`})
              </span>
            </div>

            {/* Custom styled progress bar */}
            <div className="w-full h-4 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${targetPct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Trips Today</p>
              <p className="text-base font-black text-slate-900 dark:text-white">21 Deliveries</p>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <p className="text-[10px] uppercase font-bold text-slate-400">Active Field Hours</p>
              <p className="text-base font-black text-[#0B4F9C] dark:text-sky-400">10.8 Hours</p>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <p className="text-[10px] uppercase font-bold text-slate-400">Per-Order Avg</p>
              <p className="text-base font-black text-emerald-600 dark:text-emerald-400">₹60 / Order</p>
            </div>
          </div>
        </div>

        {/* Streak & Motivation Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black">
              <Flame size={14} className="fill-white" />
              <span>CONSISTENCY STREAK</span>
            </div>
            <h3 className="text-2xl font-black">14 Days Active 🔥</h3>
            <p className="text-xs text-orange-100 font-medium leading-relaxed">
              लगातार 14 दिनों से आपने रोज़ाना minimum 15 deliveries पूरी की हैं। आपकी rating 4.88★ हो चुकी है!
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/20 backdrop-blur-xs border border-white/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Next Milestone Badge:</span>
              <span className="text-yellow-200">SLA Master (Day 20)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/30 overflow-hidden">
              <div className="w-[70%] h-full bg-yellow-300 rounded-full" />
            </div>
            <p className="text-[10px] text-orange-100">
              6 दिन और लगातार लक्ष्य पूरा करने पर ₹1,500 का bonus qualification unlock होगा।
            </p>
          </div>
        </div>
      </div>

      {/* ── 3. Asli Bachat (Net Income) vs Gross Revenue Split ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Gross Revenue by Platform */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Multi-Platform Gross Split</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-[#0B4F9C] dark:text-sky-300 font-bold">
                  4 Accounts Synced
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">All payouts calculated in real-time</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 font-bold uppercase">Gross Total</p>
              <p className="text-lg font-black text-slate-900 dark:text-white">₹{activeGross.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-3">
            {platforms.map((p) => {
              const val = period === 'today' ? p.today : period === 'week' ? p.week : p.month
              const pct = Math.round((val / (activeGross || 1)) * 100)

              return (
                <div
                  key={p.platform}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center font-black text-xs ${p.color}`}
                    >
                      {p.logoText}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{p.platform}</p>
                      <p className="text-[11px] text-slate-500">
                        {period === 'today' ? `${p.ordersToday} orders • ${p.hoursToday}h on-duty` : `${pct}% of total`}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-sm font-black ${p.accentColor}`}>₹{val.toLocaleString()}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                      {p.payoutStatus}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Asli Bachat Breakdown (Net Income Calculator) */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-900/5 dark:from-emerald-950/30 dark:to-slate-900 border border-emerald-300/80 dark:border-emerald-800/60 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-emerald-200/60 dark:border-emerald-900/60 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">
                  NET PROFIT AUDIT
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Calculator size={16} className="text-emerald-600" />
                  <span>Asli Bachat (Net Take-Home)</span>
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 font-semibold">Net In-Hand:</span>
                <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  ₹{netSavings.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Deductions breakdown */}
            <div className="space-y-2.5 pt-3">
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                <span className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                  <Fuel size={14} className="text-amber-500" />
                  <span>Petrol / Fuel / EV Charge</span>
                </span>
                <span className="font-black text-rose-500">-₹{activeExpense.fuel}</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                <span className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                  <Wrench size={14} className="text-blue-500" />
                  <span>Bike Servicing, Oil & Tyre Wear</span>
                </span>
                <span className="font-black text-rose-500">-₹{activeExpense.maintenance}</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                <span className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                  <Smartphone size={14} className="text-purple-500" />
                  <span>Mobile 4G Data & GPS Power</span>
                </span>
                <span className="font-black text-rose-500">-₹{activeExpense.mobile}</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
            <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Real Profit Margin: {Math.round((netSavings / (activeGross || 1)) * 100)}%</p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                Gross ₹{activeGross.toLocaleString()} में से ₹{activeExpense.total.toLocaleString()} खर्च होकर ₹{netSavings.toLocaleString()} आपके घर का actual profit बना।
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Daily Gullak & Tax Saving Helper (Section 44ADA) ── */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <PiggyBank size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>Daily Gullak & Tax Helper (बचत व टैक्स)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Zero Tax Qualified
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Automatic daily savings & Presumptive Tax calculation under Section 44ADA for Indian gig partners.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Daily Auto-Gullak:</span>
            <select
              value={autoSaveDaily}
              onChange={(e) => setAutoSaveDaily(Number(e.target.value))}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-amber-400"
            >
              <option value={50}>₹50 / day (₹1,500/mo)</option>
              <option value={100}>₹100 / day (₹3,000/mo)</option>
              <option value={150}>₹150 / day (₹4,500/mo)</option>
              <option value={200}>₹200 / day (₹6,000/mo)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-1">
            <p className="text-xs text-slate-400 font-bold uppercase">Gullak Balance This Month</p>
            <p className="text-2xl font-black text-amber-400">₹{(autoSaveDaily * 26).toLocaleString()}</p>
            <p className="text-[11px] text-slate-400">
              Emergency buffer ready for bike tyre replacement, challan, or sudden illness.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-1">
            <p className="text-xs text-slate-400 font-bold uppercase">Yearly Gross Projection</p>
            <p className="text-2xl font-black text-sky-400">₹3,45,000 / year</p>
            <p className="text-[11px] text-slate-400">
              Under 44ADA, 50% is treated as direct business expense (fuel & wear).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-1">
            <p className="text-xs text-slate-400 font-bold uppercase">Income Tax Owed (New Regime)</p>
            <p className="text-2xl font-black text-emerald-400">₹0 Tax (Nil)</p>
            <p className="text-[11px] text-slate-400">
              Annual taxable income is well under the ₹7 Lakh rebate limit. No IT penalty!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
