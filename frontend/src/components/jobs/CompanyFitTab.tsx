import { useState, useMemo } from 'react'
import { CheckCircle2, Building2, Briefcase } from 'lucide-react'
import { useActiveProfile } from '@/hooks/useActiveProfile'
import { useSkillGap } from '@/hooks/useSkillGap'
import { useProfileStore } from '@/store/profileStore'
import { useUserProfile } from '@/store/userProfileStore'
import { companyCategoriesList, type CompanyCategory, type RoleData } from './CompanyCategoriesData'
import CompanyCategoryCard from './CompanyCategoryCard'
import CompanyRoleFitCard from './CompanyRoleFitCard'
import CompanySalaryProjection from './CompanySalaryProjection'

const categoryFilters = ['All', 'IT Services', 'GCCs', 'Product SaaS', 'FinTech', 'AI & Cloud']

export default function CompanyFitTab() {
  const { profile } = useActiveProfile()
  const userProfile = useUserProfile()
  const { gap } = useSkillGap(userProfile.targetRole || profile?.target_role)
  const setProfile = useProfileStore((s) => s.setProfile)

  const [selectedCategory, setSelectedCategory] = useState<CompanyCategory>(companyCategoriesList[0])
  const [selectedRole, setSelectedRole] = useState<RoleData>(companyCategoriesList[0].roles[0])
  const [filter, setFilter] = useState<string>('All')

  // Pull skills from single source of truth (respects userProfileStore / profileStore / demoStore / gap)
  const userSkills = useMemo(() => {
    return userProfile.skillsHave?.length
      ? userProfile.skillsHave
      : (profile?.skills_raw?.length ? profile.skills_raw : gap.have_skills)
  }, [userProfile.skillsHave, profile?.skills_raw, gap.have_skills])

  const filteredCategories = useMemo(() => {
    return filter === 'All' ? companyCategoriesList : companyCategoriesList.filter((c) => c.category === filter)
  }, [filter])

  const handleSelectCategory = (cat: CompanyCategory) => {
    setSelectedCategory(cat)
    setSelectedRole(cat.roles[0])
  }

  const handleSimulateLearnSkill = (skill: string) => {
    if (!userSkills.includes(skill)) {
      const updated = [...userSkills, skill]
      userProfile.setSkillsHave(updated)
      if (profile) setProfile({ ...profile, skills_raw: updated })
    }
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Saved Profile Context Banner (Zero Resume Upload) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Candidate Profile Skills:
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
              {userProfile.name || profile?.name || 'Active Candidate'}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {userSkills.map((sk) => (
              <span
                key={sk}
                className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1"
              >
                <CheckCircle2 size={11} className="text-emerald-500" />
                <span>{sk}</span>
              </span>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-slate-400 self-start sm:self-center shrink-0">
          Matched automatically using your saved profile
        </p>
      </div>

      {/* Category Filter Pills & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 size={18} className="text-[#0B4F9C]" />
            <span>Select Employer Category in India</span>
          </h3>
          <p className="text-xs text-slate-500">
            Compare hiring benchmarks, compensation, and required tech stacks by company tier.
          </p>
        </div>

        <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {categoryFilters.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filter === cat
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((c) => (
          <CompanyCategoryCard
            key={c.id}
            category={c}
            isSelected={selectedCategory.id === c.id}
            onSelect={handleSelectCategory}
          />
        ))}
      </div>

      {/* Selected Category Roles Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
        <div>
          <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase size={18} className="text-[#0B4F9C]" />
            <span>Target Roles in {selectedCategory.name}</span>
          </h4>
          <p className="text-xs text-slate-500">
            Skill readiness evaluated against your active profile. Click a role to view 5-year salary trajectory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedCategory.roles.map((role) => (
            <CompanyRoleFitCard
              key={role.id}
              role={role}
              userSkills={userSkills}
              isSelected={selectedRole.id === role.id}
              onSelectRole={setSelectedRole}
              onSimulateLearnSkill={handleSimulateLearnSkill}
            />
          ))}
        </div>
      </div>

      {/* 5-Year Compensation & Public Courses for Selected Role */}
      <CompanySalaryProjection role={selectedRole} categoryName={selectedCategory.name} />
    </div>
  )
}
