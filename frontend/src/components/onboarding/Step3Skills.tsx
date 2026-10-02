import { useState } from 'react'
import { Search, Plus, X, Sparkles, Check } from 'lucide-react'

interface Step3SkillsProps {
  selectedSkills: string[]
  onChange: (skills: string[]) => void
  userType?: string
}

const commonSkillsByCategory: Record<string, string[]> = {
  'Programming & Core': ['Python', 'Java', 'JavaScript', 'TypeScript', 'C++', 'SQL', 'Git'],
  'Backend & Frameworks': ['FastAPI', 'Node.js', 'Spring Boot', 'Django', 'REST APIs', 'Microservices'],
  'AI / Machine Learning': ['Machine Learning', 'GenAI', 'Prompt Engineering', 'LangChain', 'RAG', 'Vector Databases'],
  'Frontend & Mobile': ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Flutter', 'React Native'],
  'Cloud & DevOps': ['Docker', 'Kubernetes', 'AWS', 'Azure', 'CI/CD', 'Linux'],
  'Testing & QA': ['Manual Testing', 'Selenium', 'Playwright', 'JIRA', 'Agile', 'Automation QA'],
  'Operations & Business': ['Communication Skills', 'CRM', 'MS Excel', 'Power BI', 'Customer Support', 'Route Optimization'],
}

export default function Step3Skills({
  selectedSkills = [],
  onChange,
}: Step3SkillsProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [customInput, setCustomInput] = useState('')

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      onChange(selectedSkills.filter((s) => s !== skill))
    } else {
      onChange([...selectedSkills, skill])
    }
  }

  const handleAddCustom = () => {
    const trimmed = customInput.trim()
    if (trimmed && !selectedSkills.includes(trimmed)) {
      onChange([...selectedSkills, trimmed])
      setCustomInput('')
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Tag Your Verified & Familiar Skills
        </h2>
        <p className="text-xs text-slate-500">
          Select at least 3-5 competencies to enable accurate skill-gap indexing and taxonomy matching.
        </p>
      </div>

      {/* Search & Custom Add */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search skills (e.g. Python, Docker, Spring Boot)..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-[#0B4F9C]"
          />
        </div>
        <div className="flex gap-1.5">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
            placeholder="Custom skill..."
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-[#0B4F9C] w-36"
          />
          <button
            type="button"
            onClick={handleAddCustom}
            className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#0B4F9C] hover:text-white transition-all text-xs font-bold"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      {/* Selected Skills Badges */}
      {selectedSkills.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900 space-y-2">
          <span className="text-[11px] font-bold text-[#0B4F9C] dark:text-sky-300 flex items-center gap-1">
            <Sparkles size={12} /> Selected Skills ({selectedSkills.length})
          </span>
          <div className="flex flex-wrap gap-1.5">
            {selectedSkills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs"
              >
                <span>{s}</span>
                <button
                  type="button"
                  onClick={() => toggleSkill(s)}
                  className="text-slate-400 hover:text-rose-500"
                >
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Categorized Skills Grid */}
      <div className="space-y-4 pt-1">
        {Object.entries(commonSkillsByCategory).map(([category, skills]) => {
          const filtered = skills.filter((sk) =>
            sk.toLowerCase().includes(searchTerm.toLowerCase())
          )
          if (filtered.length === 0) return null

          return (
            <div key={category} className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {filtered.map((sk) => {
                  const isSelected = selectedSkills.includes(sk)
                  return (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => toggleSkill(sk)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#0B4F9C] text-white border-[#0B4F9C] shadow-2xs font-semibold'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <span>{sk}</span>
                      {isSelected && <Check size={12} />}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
