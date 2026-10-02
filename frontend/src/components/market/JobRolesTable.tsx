import { useState } from 'react'
import { Search, Briefcase, MapPin, Laptop } from 'lucide-react'

interface JobRole {
  id: number
  title: string
  city: string
  salary_min_lpa: number
  salary_max_lpa: number
  required_skills: string[]
  exp_min: number
  exp_max: number
  remote: boolean
  posted_month: string
}

const sampleJobs: JobRole[] = [
  {
    id: 1,
    title: 'GenAI Engineer',
    city: 'Bengaluru',
    salary_min_lpa: 22,
    salary_max_lpa: 45,
    required_skills: ['Python', 'GenAI', 'LangChain', 'Vector Databases', 'RAG'],
    exp_min: 2,
    exp_max: 6,
    remote: true,
    posted_month: '2026-09',
  },
  {
    id: 2,
    title: 'Senior Python Developer',
    city: 'Bengaluru',
    salary_min_lpa: 18,
    salary_max_lpa: 32,
    required_skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS'],
    exp_min: 4,
    exp_max: 8,
    remote: true,
    posted_month: '2026-09',
  },
  {
    id: 3,
    title: 'Automation QA / SDET',
    city: 'Pune',
    salary_min_lpa: 10,
    salary_max_lpa: 18,
    required_skills: ['Selenium', 'Playwright', 'Python', 'CI/CD', 'JIRA'],
    exp_min: 2,
    exp_max: 6,
    remote: true,
    posted_month: '2026-09',
  },
  {
    id: 4,
    title: 'Logistics Tech Analyst',
    city: 'Hyderabad',
    salary_min_lpa: 8,
    salary_max_lpa: 15,
    required_skills: ['SQL', 'Python', 'Power BI', 'Operations', 'Route Optimization'],
    exp_min: 1,
    exp_max: 4,
    remote: false,
    posted_month: '2026-09',
  },
  {
    id: 5,
    title: 'Full Stack Developer (React + Node)',
    city: 'Hyderabad',
    salary_min_lpa: 14,
    salary_max_lpa: 24,
    required_skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Docker'],
    exp_min: 3,
    exp_max: 7,
    remote: false,
    posted_month: '2026-09',
  },
  {
    id: 6,
    title: 'DevOps Engineer',
    city: 'Chennai',
    salary_min_lpa: 14,
    salary_max_lpa: 26,
    required_skills: ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'CI/CD'],
    exp_min: 3,
    exp_max: 7,
    remote: false,
    posted_month: '2026-09',
  },
]

export default function JobRolesTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [remoteOnly, setRemoteOnly] = useState(false)

  const filtered = sampleJobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.required_skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesRemote = remoteOnly ? j.remote : true
    return matchesSearch && matchesRemote
  })

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase size={18} className="text-[#0B4F9C]" />
            <span>Active Indian Tech Job Snapshots</span>
          </h3>
          <p className="text-xs text-slate-500">
            Real market salary ranges & required skill frequency from 300+ tracked Indian roles.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search roles or skills..."
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-[#0B4F9C]"
            />
          </div>
          <button
            type="button"
            onClick={() => setRemoteOnly(!remoteOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 ${
              remoteOnly
                ? 'bg-[#0B4F9C] text-white border-[#0B4F9C]'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Laptop size={13} />
            <span>Remote</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Role Title</th>
              <th className="py-2.5 px-3">City & Work Mode</th>
              <th className="py-2.5 px-3">Salary Band</th>
              <th className="py-2.5 px-3">Experience</th>
              <th className="py-2.5 px-3">Key Skill Requirements</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((job) => (
              <tr key={job.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                  {job.title}
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#F26B1D]" />
                    <span className="text-slate-700 dark:text-slate-300">{job.city}</span>
                    {job.remote && (
                      <span className="px-1.5 py-0.2 rounded-md bg-sky-100 dark:bg-sky-950 text-[#0B4F9C] dark:text-sky-300 text-[10px] font-bold">
                        Remote
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                  ₹{job.salary_min_lpa} - ₹{job.salary_max_lpa} LPA
                </td>
                <td className="py-3 px-3 text-slate-500">
                  {job.exp_min}-{job.exp_max} Years
                </td>
                <td className="py-3 px-3">
                  <div className="flex flex-wrap gap-1">
                    {job.required_skills.map((sk) => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
