import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Map, IndianRupee } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface HomeShortcutCardsProps {
  matchPct?: number
  targetRole?: string
  haveCount?: number
  missingCount?: number
  pathName?: string
  pathWeeks?: number
  estimatedSalaryLPA?: number
  city?: string
}

export default function HomeShortcutCards({
  matchPct = 42,
  targetRole = 'GenAI Engineer',
  haveCount = 4,
  missingCount = 4,
  pathName = 'Stretch Path',
  pathWeeks = 16,
  estimatedSalaryLPA = 12.5,
  city = 'Bengaluru',
}: HomeShortcutCardsProps) {
  const { t, i18n } = useTranslation()
  const isHi = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('hi')

  const localizedPathName = isHi
    ? pathName.includes('Safe')
      ? 'सुरक्षित मार्ग (Safe)'
      : pathName.includes('Stretch')
      ? 'उच्च वृद्धि मार्ग (Stretch)'
      : 'स्विच मार्ग (Switch)'
    : pathName

  const cards = [
    {
      title: t('dashboard.shortcuts.skills_match_title', 'Skills Match %'),
      value: isHi ? `${matchPct}% मिलान` : `${matchPct}% Match`,
      subtitle: t('dashboard.shortcuts.target_role', `Target: ${targetRole}`, { role: targetRole }),
      desc: isHi
        ? `${haveCount} मुख्य कौशल तैयार · ${missingCount} कौशल सीखने बाकी`
        : `${haveCount} core skills ready · ${missingCount} skills to learn`,
      link: '/skills',
      icon: Zap,
      iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60',
      actionText: t('dashboard.shortcuts.view_skills', 'View skills'),
    },
    {
      title: t('dashboard.shortcuts.best_path_title', 'Best Path'),
      value: localizedPathName,
      subtitle: isHi ? `तैयारी के लिए ${pathWeeks} सप्ताह` : `${pathWeeks} Weeks to Readiness`,
      desc: t('dashboard.shortcuts.path_desc', 'Free Govt & NPTEL verified roadmap'),
      link: '/path',
      icon: Map,
      iconColor: 'text-[#0B4F9C] bg-blue-50 dark:bg-blue-950/60 dark:text-sky-300',
      actionText: t('dashboard.shortcuts.view_roadmap', 'View roadmap'),
    },
    {
      title: t('dashboard.shortcuts.real_salary_title', 'Real Salary'),
      value: `₹${estimatedSalaryLPA} LPA`,
      subtitle: isHi ? `${city} में किराया व यात्रा खर्च के बाद` : `After rent & travel in ${city}`,
      desc: t('dashboard.shortcuts.salary_desc', 'Calculated using local cost-of-living indices'),
      link: '/jobs',
      icon: IndianRupee,
      iconColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400',
      actionText: t('dashboard.shortcuts.compare_salaries', 'Compare salaries'),
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {cards.map((c) => {
        const Icon = c.icon
        return (
          <Link
            key={c.title}
            to={c.link}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-[#0B4F9C]/50 hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {c.title}
                </span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${c.iconColor}`}>
                  <Icon size={16} />
                </div>
              </div>

              <div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-[#0B4F9C] dark:group-hover:text-sky-400 transition-colors">
                  {c.value}
                </h4>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                  {c.subtitle}
                </p>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {c.desc}
              </p>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#0B4F9C] dark:text-sky-400 group-hover:translate-x-1 transition-transform">
              <span>{c.actionText}</span>
              <ArrowRight size={14} />
            </div>
          </Link>
        )
      })}
    </div>
  )
}
