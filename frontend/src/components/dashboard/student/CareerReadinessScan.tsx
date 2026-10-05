import { GraduationCap, CheckCircle2, AlertTriangle } from 'lucide-react'

export default function CareerReadinessScan({
  degree = 'B.Tech Computer Science (Final Year)',
}: {
  degree?: string
  collegeCity?: string
}) {
  const readinessScore = 58

  const scanItems = [
    {
      domain: 'Core Computer Science Theory',
      readiness: 'High (85%)',
      status: 'ready',
      feedback: 'Solid data structures, DBMS concepts, and operating systems foundation from college coursework.',
    },
    {
      domain: 'Production-Grade Software Engineering',
      readiness: 'Needs Bridge (42%)',
      status: 'gap',
      feedback: 'Missing experience with Docker containers, CI/CD pipelines, Git teamwork workflows, and cloud deployments.',
    },
    {
      domain: 'Modern Backend & API Architecture',
      readiness: 'Moderate (60%)',
      status: 'gap',
      feedback: 'Knows academic SQL and basic Python; needs hands-on FastAPI / Node.js and vector search exposure.',
    },
  ]

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0B4F9C] dark:text-sky-300 text-xs font-bold mb-1">
            <GraduationCap size={12} />
            <span>Feature 1 • Fresher Career Readiness Scan</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Industry Alignment Diagnosis
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Scanning academic profile ({degree}) against 300+ entry-level campus & off-campus hiring criteria.
          </p>
        </div>

        <div className="text-right">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Industry Readiness</div>
          <div className="text-xl font-black text-[#0B4F9C] dark:text-sky-400">
            {readinessScore}% <span className="text-xs font-semibold text-slate-500">Ready</span>
          </div>
        </div>
      </div>

      {/* Domain Breakdown */}
      <div className="space-y-3">
        {scanItems.map((item) => (
          <div
            key={item.domain}
            className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                {item.status === 'ready' ? (
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                ) : (
                  <AlertTriangle size={16} className="text-amber-500 shrink-0" />
                )}
                <span>{item.domain}</span>
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                  item.status === 'ready'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                }`}
              >
                {item.readiness}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {item.feedback}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
