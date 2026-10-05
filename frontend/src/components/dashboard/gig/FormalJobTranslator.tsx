import { useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Building2, Sparkles } from 'lucide-react'

export interface TranslatedRole {
  title: string
  industry: string
  matchPct: number
  avgSalaryLPA: number
  skillOverlap: string[]
  deltaSkills: string[]
  growthOutlook: string
}

export default function FormalJobTranslator() {
  const [inputExp, setInputExp] = useState('Delivery Partner (2.5 Years) at Swiggy / Zomato')

  const translatedRoles: TranslatedRole[] = [
    {
      title: 'Logistics Operations Associate',
      industry: 'Supply Chain & E-Commerce (Delhivery, Shadowfax, Zepto)',
      matchPct: 86,
      avgSalaryLPA: 5.5,
      skillOverlap: ['Route Planning', 'SLA Adherence', 'Inventory Handling', 'Digital Tracking'],
      deltaSkills: ['Excel / Google Sheets', 'WMS Software Basics'],
      growthOutlook: 'High Demand (34% YoY Growth in Quick Commerce)',
    },
    {
      title: 'Field Fleet Coordinator / Dispatcher',
      industry: 'Urban Mobility & Last-Mile Delivery (Rapido, Porter, Uber)',
      matchPct: 82,
      avgSalaryLPA: 4.8,
      skillOverlap: ['Driver Operations', 'Geographic Clustering', 'Real-Time Escalation'],
      deltaSkills: ['Fleet Management Dashboard', 'Vendor Coordination'],
      growthOutlook: 'Rapid Expansion in Tier 2/3 Hubs',
    },
    {
      title: 'Customer Success & Operations Specialist',
      industry: 'B2B Logistics & Retail Tech',
      matchPct: 75,
      avgSalaryLPA: 6.0,
      skillOverlap: ['Customer Handling', 'Cash / POS Reconciliation', 'Exception Management'],
      deltaSkills: ['CRM Tools (Freshdesk/Zendesk)', 'Email Communication'],
      growthOutlook: 'Solid Long-Term Corporate Pathway',
    },
  ]

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-1">
            <Briefcase size={12} />
            <span>Feature 3 • Formal Job Translator</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Translate Gig Tasks into High-Paying Formal Careers
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Mapping informal hustle directly to conventional salaried corporate openings.
          </p>
        </div>
      </div>

      {/* Input / Current Hustle */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase">Your Platform Background</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={inputExp}
            onChange={(e) => setInputExp(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 font-semibold"
          />
          <button className="px-4 py-2 rounded-xl bg-[#0B4F9C] text-white font-bold text-xs hover:bg-blue-800 flex items-center justify-center gap-1.5">
            <Sparkles size={14} />
            <span>Re-Translate Roles</span>
          </button>
        </div>
      </div>

      {/* Transferable Roles Cards */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Suggested Salaried Roles With Transferable Match
        </h4>

        <div className="grid grid-cols-1 gap-4">
          {translatedRoles.map((role, idx) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-[#0B4F9C]/50 transition-all shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{role.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0B4F9C] dark:text-sky-300">
                      {role.matchPct}% Transferable Match
                    </span>
                  </h4>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Building2 size={12} />
                    <span>{role.industry}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-slate-400">Target Starting Package</div>
                  <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                    ₹{role.avgSalaryLPA} LPA
                  </div>
                </div>
              </div>

              {/* Skills Overlap & Missing Delta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                  <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase mb-1">
                    ✓ Your Ready Superpowers
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {role.skillOverlap.map((s, i) => (
                      <span key={i} className="text-[11px] font-medium text-emerald-800 dark:text-emerald-200">
                        {s}{i < role.skillOverlap.length - 1 ? ' • ' : ''}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40">
                  <div className="text-[10px] font-bold text-orange-700 dark:text-orange-300 uppercase mb-1">
                    + Mini-Skill to Add (1-2 Weeks)
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {role.deltaSkills.map((s, i) => (
                      <span key={i} className="text-[11px] font-medium text-orange-800 dark:text-orange-200">
                        {s}{i < role.deltaSkills.length - 1 ? ' • ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 font-medium">
                📈 Market Momentum: <span className="text-slate-800 dark:text-slate-200">{role.growthOutlook}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
