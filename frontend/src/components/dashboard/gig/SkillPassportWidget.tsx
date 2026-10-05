import { useState } from 'react'
import { Award, Star, CheckCircle2 } from 'lucide-react'

export interface GigWorkHistory {
  platform: string
  role: string
  durationMonths: number
  tasksCount: number
  rating: number
  tools: string[]
  derivedSkills: string[]
}

export default function SkillPassportWidget({
  tasks = 4200,
  rating = 4.85,
}: {
  initialPlatform?: string
  tasks?: number
  rating?: number
}) {
  const [histories] = useState<GigWorkHistory[]>([
    {
      platform: 'Swiggy / Zomato Delivery',
      role: 'Quick Commerce Logistics Partner',
      durationMonths: 24,
      tasksCount: tasks,
      rating: rating,
      tools: ['Partner App GPS', 'UPI POS Terminal', 'Digital Incident Logging'],
      derivedSkills: [
        'Route Planning & Spatial Navigation',
        'Time-Critical SLA Management',
        'Customer Service & Dispute De-escalation',
        'Digital Payment & Cash Reconciliation',
        'Cold-Chain Asset Safety',
      ],
    },
    {
      platform: 'Urban Company / Freelance Tasks',
      role: 'Field Service Associate',
      durationMonths: 12,
      tasksCount: 340,
      rating: 4.9,
      tools: ['Work Order System', 'Quality Checklist Tool'],
      derivedSkills: [
        'Field Operations & Quality Assurance',
        'Direct Client Relationship Management',
        'Standard Operating Procedure (SOP) Compliance',
      ],
    },
  ])

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-xs font-bold mb-1">
            <Award size={12} />
            <span>Feature 1 • Gig Skill Passport Engine</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Transform Platform Work into Verifiable Competencies
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Converts scattered delivery, freelance & field jobs into industry-standard corporate skills.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black text-xs">
            <Star size={14} className="fill-amber-500 text-amber-500" />
            <span>{rating} / 5.0 Rating</span>
          </div>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Total Orders/Tasks</div>
          <div className="text-xl font-black text-slate-900 dark:text-white">4,540+</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Active Platforms</div>
          <div className="text-xl font-black text-[#0B4F9C] dark:text-sky-400">2 Platforms</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Field Experience</div>
          <div className="text-xl font-black text-[#F26B1D]">3.0 Years</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Derived Skills</div>
          <div className="text-xl font-black text-emerald-600">8 Verified</div>
        </div>
      </div>

      {/* Platform Cards */}
      <div className="space-y-4">
        {histories.map((h, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white">{h.platform}</span>
                <span className="text-xs text-slate-500 ml-2">({h.role} • {h.durationMonths} Months)</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>{h.tasksCount.toLocaleString()} completed orders</span>
                <span>•</span>
                <span className="text-amber-600 font-bold flex items-center gap-0.5">
                  <Star size={12} className="fill-amber-500" /> {h.rating}
                </span>
              </div>
            </div>

            {/* Derived Formal Skills */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Derived Corporate Skills:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {h.derivedSkills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs"
                  >
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
