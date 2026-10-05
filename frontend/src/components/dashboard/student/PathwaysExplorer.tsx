import { Compass } from 'lucide-react'

export interface StudentTrack {
  trackName: string
  demandIndex: string
  startingPackageLPA: number
  keyPrerequisites: string[]
  recommendedFirstRole: string
  growthCeiling5Yr: string
}

export default function PathwaysExplorer() {
  const tracks: StudentTrack[] = [
    {
      trackName: 'Fullstack & Backend Engineering',
      demandIndex: 'High (Core Foundation)',
      startingPackageLPA: 7.5,
      keyPrerequisites: ['Python / Node.js / Java', 'PostgreSQL', 'Docker', 'REST APIs'],
      recommendedFirstRole: 'Associate Software Engineer / Backend Developer',
      growthCeiling5Yr: '₹24–35 LPA (Senior Backend / System Architect)',
    },
    {
      trackName: 'Cloud, DevOps & SRE',
      demandIndex: 'Very High (Talent Scarcity)',
      startingPackageLPA: 8.5,
      keyPrerequisites: ['Linux', 'Docker / K8s', 'AWS / GCP', 'CI/CD Pipelines'],
      recommendedFirstRole: 'Cloud Operations Engineer / Junior DevOps',
      growthCeiling5Yr: '₹28–40 LPA (Platform & Infrastructure Lead)',
    },
    {
      trackName: 'Applied AI / Machine Learning',
      demandIndex: 'Explosive Growth',
      startingPackageLPA: 9.5,
      keyPrerequisites: ['Python', 'LangChain / Vector DBs', 'PyTorch / Transformers Basics', 'FastAPI'],
      recommendedFirstRole: 'Junior AI Engineer / GenAI Developer',
      growthCeiling5Yr: '₹32–50 LPA (AI Research & Systems Lead)',
    },
  ]

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0B4F9C] dark:text-sky-300 text-xs font-bold mb-1">
            <Compass size={12} />
            <span>Feature 4 • High-Velocity Career Track Explorer</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Which Career Track Should You Target?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compare 3 entry pathways by day-1 packages, tech barrier, and 5-year Indian industry compensation trajectories.
          </p>
        </div>
      </div>

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tracks.map((t, idx) => (
          <div
            key={t.trackName}
            className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 hover:border-[#0B4F9C]/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-[#0B4F9C] dark:text-sky-300">
                  Track {idx + 1}
                </span>
                <span className="text-xs font-black text-emerald-600">
                  ₹{t.startingPackageLPA} LPA Start
                </span>
              </div>

              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.trackName}</h4>
              <p className="text-xs text-slate-500 font-medium">🎯 {t.recommendedFirstRole}</p>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-slate-400">Core Stack:</div>
                <div className="flex flex-wrap gap-1">
                  {t.keyPrerequisites.map((req, rIdx) => (
                    <span
                      key={rIdx}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
              <span className="font-bold text-slate-900 dark:text-white">5-Yr Ceiling:</span> {t.growthCeiling5Yr}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
