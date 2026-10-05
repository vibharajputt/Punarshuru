import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shuffle, AlertCircle, Flame } from 'lucide-react'

export interface AdjacentRoleOption {
  title: string
  matchPct: number
  growthVelocity: string
  avgSalaryLPA: number
  whyFeasible: string
  keySkillsNeeded: string[]
  topEmployers: string[]
}

export default function AdjacentRolesMapper({
  currentRole = 'Manual QA / Test Engineer',
}: {
  currentRole?: string
  skills?: string[]
}) {
  const [selectedRole, setSelectedRole] = useState<string>('Automation SDET')

  const adjacentRoles: AdjacentRoleOption[] = [
    {
      title: 'Automation SDET (Software Development Engineer in Test)',
      matchPct: 82,
      growthVelocity: '+41% Hiring Surge',
      avgSalaryLPA: 14.5,
      whyFeasible: 'Your core understanding of edge-case test design and test pyramids carries 80% of the job. You only need to add Playwright / Cypress script automation.',
      keySkillsNeeded: ['Playwright / Selenium', 'TypeScript / Python', 'CI/CD Test Pipelines'],
      topEmployers: ['Razorpay', 'Swiggy', 'Freshworks', 'Groww'],
    },
    {
      title: 'QA Performance & Reliability Engineer',
      matchPct: 76,
      growthVelocity: '+28% Growth',
      avgSalaryLPA: 13.0,
      whyFeasible: 'High demand for load & stress testing in high-concurrency fintech applications without requiring complex feature frontend coding.',
      keySkillsNeeded: ['k6 / JMeter', 'Distributed Tracing (Datadog)', 'API Stress Testing'],
      topEmployers: ['PhonePe', 'Flipkart', 'CRED', 'Jio'],
    },
    {
      title: 'AI / LLM Quality & Eval Engineer',
      matchPct: 71,
      growthVelocity: '+85% Emerging Surge',
      avgSalaryLPA: 16.0,
      whyFeasible: 'AI startups urgently need systematic testing of chatbot hallucinations, ground truth benchmarking, and prompt evaluation datasets.',
      keySkillsNeeded: ['Ragas / PromptFoo', 'Python Basics', 'LLM Benchmark Scoring'],
      topEmployers: ['Sarvam AI', 'Krutrim', 'Postman', 'InMobi'],
    },
    {
      title: 'Release & Delivery Operations Specialist',
      matchPct: 69,
      growthVelocity: '+22% Steady',
      avgSalaryLPA: 12.0,
      whyFeasible: 'Bridges QA sign-offs with staging deployment gates, managing release rollouts and hotfix verification.',
      keySkillsNeeded: ['GitHub Actions', 'Docker Basics', 'Release Governance'],
      topEmployers: ['TCS Digital', 'Infosys Cobalt', 'Zomato'],
    },
  ]

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold mb-1">
            <Shuffle size={12} />
            <span>Feature 1 • Reallocation & Adjacent Career Mapper</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Don't Search Only Your Old Job Title
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Escaping shrinking sectors by reallocating your existing skills into high-velocity adjacent industries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Current: <span className="text-rose-600 font-black">{currentRole}</span>
          </span>
        </div>
      </div>

      {/* Rationale Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
        <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-bold text-slate-900 dark:text-white">
            Market Intelligence Warning:
          </span>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Manual QA listings in India dropped by 38% this year due to AI-assisted coding tools. Repositioning your test design foundation into <strong className="text-slate-900 dark:text-white">SDET or AI Evaluation</strong> immediately restores high recruiter inbound.
          </p>
        </div>
      </div>

      {/* Adjacent Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {adjacentRoles.map((role, idx) => {
          const isSelected = selectedRole === role.title
          return (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              onClick={() => setSelectedRole(role.title)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                isSelected
                  ? 'bg-blue-50/50 dark:bg-blue-950/40 border-[#0B4F9C] dark:border-sky-500 ring-2 ring-blue-500/20 shadow-md'
                  : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{role.title}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                    <Flame size={12} />
                    <span>{role.growthVelocity}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Match</div>
                  <div className="text-base font-black text-[#0B4F9C] dark:text-sky-400">
                    {role.matchPct}%
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {role.whyFeasible}
              </p>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-slate-400">Bridge Skills:</div>
                <div className="flex flex-wrap gap-1">
                  {role.keySkillsNeeded.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    >
                      + {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                <span>Avg: <strong className="text-slate-900 dark:text-white">₹{role.avgSalaryLPA} LPA</strong></span>
                <span className="truncate ml-2 text-slate-400">Hiring: {role.topEmployers.join(', ')}</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
