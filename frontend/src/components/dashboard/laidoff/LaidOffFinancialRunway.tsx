import { useState } from 'react'
import {
  IndianRupee,
  Clock,
  Scissors,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  PieChart,
  FileCheck,
} from 'lucide-react'

export interface SettlementItem {
  id: string
  name: string
  expectedAmount: number
  status: 'received' | 'pending' | 'in-process'
  dueDate: string
  notes: string
}

export default function LaidOffFinancialRunway() {
  // Financial inputs
  const [savings, setSavings] = useState<number>(450000) // ₹4.5L bank savings
  const [severance, setSeverance] = useState<number>(350000) // ₹3.5L severance payout
  const monthlyRent = 28000 // Rent & Maintenance
  const monthlyEmi = 24000 // Home / Car / Personal loan
  const monthlyEssentials = 20000 // Groceries & Utilities
  const monthlyDiscretionary = 18000 // Subscriptions, dining, leisure

  // Expense cutter active toggles
  const [pausedSubscriptions, setPausedSubscriptions] = useState(true)
  const [pausedDiningOut, setPausedDiningOut] = useState(true)
  const [pausedGymClub, setPausedGymClub] = useState(false)

  // Settlement checklist
  const [settlements] = useState<SettlementItem[]>([
    {
      id: 'set-1',
      name: 'Severance Payout (3 Months Salary)',
      expectedAmount: 350000,
      status: 'received',
      dueDate: 'Credited on 28 Sep 2026',
      notes: 'Deposited directly to salary account; TDS deducted at standard slab.',
    },
    {
      id: 'set-2',
      name: 'Earned Leave Encashment (18 Days)',
      expectedAmount: 72000,
      status: 'in-process',
      dueDate: 'Expected 15 Oct 2026',
      notes: 'Final settlement calculation approved by finance ops.',
    },
    {
      id: 'set-3',
      name: 'PF & Gratuity Portability',
      expectedAmount: 280000,
      status: 'pending',
      dueDate: 'Self-Transfer on EPFO Portal',
      notes: 'Keep in EPFO account to earn 8.25% interest tax-free; transfer to next employer.',
    },
    {
      id: 'set-4',
      name: 'Notice Period Salary Buyout',
      expectedAmount: 110000,
      status: 'received',
      dueDate: 'Credited with Sep FNF',
      notes: 'Full & Final (FnF) clearance certificate received.',
    },
  ])

  // Calculations
  const totalLiquidFunds = savings + severance

  // Expense savings from cutter
  const pausedSavings =
    (pausedSubscriptions ? 4500 : 0) +
    (pausedDiningOut ? 8500 : 0) +
    (pausedGymClub ? 3000 : 0)

  const activeMonthlyBurn =
    monthlyRent +
    monthlyEmi +
    monthlyEssentials +
    (monthlyDiscretionary - pausedSavings)

  const rawRunwayMonths = (totalLiquidFunds / (activeMonthlyBurn || 1)).toFixed(1)
  const runwayMonths = Number(rawRunwayMonths)

  // Status tier
  const runwayStatus =
    runwayMonths >= 6
      ? { label: 'Comfortable Runway', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800' }
      : runwayMonths >= 3
      ? { label: 'Moderate Buffer (Sprint Window)', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800' }
      : { label: 'Urgent Action Required', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800' }

  return (
    <div className="space-y-6">
      {/* ── 1. Top Header Banner ── */}
      <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 dark:from-blue-950/30 dark:via-purple-950/20 dark:to-slate-900 border border-blue-200/80 dark:border-blue-900/60 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-[#0B4F9C] dark:text-sky-300 text-xs font-black mb-2">
            <Clock size={13} />
            <span>Pillar 1 • Financial Runway & Cash Safety Cockpit</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Survival Runway & Expense Cutter Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Calculate your exact zero-income survival months, pause non-essential expenses, and track your FnF benefits.
          </p>
        </div>

        {/* Big Runway Indicator */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm text-right shrink-0">
          <p className="text-[10px] uppercase font-bold text-slate-400">Total Survival Runway</p>
          <div className="flex items-baseline gap-1 justify-end">
            <span className="text-3xl sm:text-4xl font-black text-[#0B4F9C] dark:text-sky-400">
              {runwayMonths}
            </span>
            <span className="text-sm font-bold text-slate-500">Months</span>
          </div>
          <span className={`inline-block mt-1 text-[10px] font-black px-2 py-0.5 rounded-full border ${runwayStatus.color}`}>
            {runwayStatus.label}
          </span>
        </div>
      </div>

      {/* ── 2. Interactive Runway Calculator Inputs ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Funds & Inflow */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <IndianRupee size={16} className="text-emerald-500" />
              <span>Available Cash & Severance Payout</span>
            </h3>
            <span className="text-sm font-black text-emerald-600">
              Total: ₹{(totalLiquidFunds / 100000).toFixed(1)} Lakhs
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Bank Savings & Liquid FDs:</span>
                <span className="font-mono font-black text-slate-900 dark:text-white">
                  ₹{savings.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={50000}
                max={1500000}
                step={25000}
                value={savings}
                onChange={(e) => setSavings(Number(e.target.value))}
                className="w-full accent-[#0B4F9C]"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Severance Package & FnF Clearance:</span>
                <span className="font-mono font-black text-slate-900 dark:text-white">
                  ₹{severance.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1200000}
                step={25000}
                value={severance}
                onChange={(e) => setSeverance(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2">
            <Sparkles size={16} className="text-[#0B4F9C] dark:text-sky-400 shrink-0 mt-0.5" />
            <p>
              <strong>Immediate Safety Tip:</strong> Keep at least 3 months of emergency expenses in a high-yield liquid mutual fund or sweep-in account earning 6.8% interest without locking the capital.
            </p>
          </div>
        </div>

        {/* Monthly Burn Rate */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart size={16} className="text-rose-500" />
              <span>Monthly Outflow (Burn Rate)</span>
            </h3>
            <span className="text-sm font-black text-rose-500">
              ₹{activeMonthlyBurn.toLocaleString()} / month
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700">
              <span className="font-bold text-slate-700 dark:text-slate-300">House Rent / Society Maintenance:</span>
              <span className="font-mono font-black text-slate-900 dark:text-white">₹{monthlyRent.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700">
              <span className="font-bold text-slate-700 dark:text-slate-300">Home / Car / Education EMIs:</span>
              <span className="font-mono font-black text-slate-900 dark:text-white">₹{monthlyEmi.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700">
              <span className="font-bold text-slate-700 dark:text-slate-300">Groceries, Milk, Gas & Utilities:</span>
              <span className="font-mono font-black text-slate-900 dark:text-white">₹{monthlyEssentials.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Discretionary Spending (After Pauses):
              </span>
              <span className="font-mono font-black text-emerald-600">
                ₹{(monthlyDiscretionary - pausedSavings).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Expense Cutter & Runway Extension ── */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Scissors size={18} className="text-[#F26B1D]" />
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Aashiyana Expense Cutter (खर्च कम करके रनवे बढ़ाएं)
              </h3>
              <p className="text-[11px] text-slate-500">
                Pause non-essential subscriptions and leisure costs to gain up to 1.8 months extra job hunting buffer.
              </p>
            </div>
          </div>

          <span className="text-xs font-black text-emerald-600 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
            Saving ₹{pausedSavings.toLocaleString()} / Month (+{((pausedSavings * 6) / activeMonthlyBurn).toFixed(1)} Months Gained)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Pause OTT & Subscriptions */}
          <div
            onClick={() => setPausedSubscriptions(!pausedSubscriptions)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between ${
              pausedSubscriptions
                ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <CheckCircle2 size={15} className={pausedSubscriptions ? 'text-emerald-600' : 'text-slate-400'} />
                <span>Pause OTT & SaaS Subscriptions</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Netflix, Spotify, Prime, ChatGPT Plus</p>
              <p className="text-xs font-black text-emerald-600 mt-2">Saves ₹4,500 / month</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700">
              {pausedSubscriptions ? 'PAUSED' : 'ACTIVE'}
            </span>
          </div>

          {/* Pause Weekend Dining & Parties */}
          <div
            onClick={() => setPausedDiningOut(!pausedDiningOut)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between ${
              pausedDiningOut
                ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <CheckCircle2 size={15} className={pausedDiningOut ? 'text-emerald-600' : 'text-slate-400'} />
                <span>Pause Fine Dining & Weekend Outings</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Cafes, bar tabs, and weekend dine-in</p>
              <p className="text-xs font-black text-emerald-600 mt-2">Saves ₹8,500 / month</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700">
              {pausedDiningOut ? 'PAUSED' : 'ACTIVE'}
            </span>
          </div>

          {/* Pause Luxury Gym & Club */}
          <div
            onClick={() => setPausedGymClub(!pausedGymClub)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between ${
              pausedGymClub
                ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <CheckCircle2 size={15} className={pausedGymClub ? 'text-emerald-600' : 'text-slate-400'} />
                <span>Pause Premium Gym / Club Membership</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Temporarily switch to park jogs & home workouts</p>
              <p className="text-xs font-black text-emerald-600 mt-2">Saves ₹3,000 / month</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700">
              {pausedGymClub ? 'PAUSED' : 'ACTIVE'}
            </span>
          </div>
        </div>
      </div>

      {/* ── 4. Benefits Settlement Tracker & Insurance Continuity Alert ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settlements Table */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck size={16} className="text-[#0B4F9C]" />
              <span>Full & Final (FnF) Benefits Checklist</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">4 Items Tracked</span>
          </div>

          <div className="space-y-3">
            {settlements.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.2 rounded-md ${
                        item.status === 'received'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : item.status === 'in-process'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.notes}</p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <p className="text-sm font-black text-slate-900 dark:text-white">
                    ₹{item.expectedAmount.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-400">{item.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insurance & EMI Alerts */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
              <ShieldAlert size={16} />
              <span>CRITICAL STATUTORY ALERTS</span>
            </div>
            <h3 className="text-base font-black text-white">Health Insurance Portability</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Company group health policy 30 din baad expire ho jayegi. Pre-existing disease waiting period bachaane ke liye retail policy (HDFC ERGO / Star Health) me <strong>Port</strong> karein.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="text-amber-400">Portability Window:</span>
                <span className="text-white font-mono">14 Days Left</span>
              </div>
              <p className="text-[10px] text-slate-400">Porting without medical checkup eligible until Oct 19.</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="text-sky-400">Home Loan EMI Due:</span>
                <span className="text-white font-mono">10th of Every Month</span>
              </div>
              <p className="text-[10px] text-slate-400">Auto-debit active on SBI account.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
