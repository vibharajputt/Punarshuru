import { useState } from 'react'
import { Briefcase, Calculator, Building2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import JobsForYouTab from '@/components/jobs/JobsForYouTab'
import RealSalaryCalculatorTab from '@/components/jobs/RealSalaryCalculatorTab'
import CompanyFitTab from '@/components/jobs/CompanyFitTab'

type JobTab = 'jobs' | 'salary' | 'fit'

export default function JobsPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<JobTab>('jobs')

  const tabs: { id: JobTab; label: string; icon: typeof Briefcase }[] = [
    { id: 'jobs', label: t('market.tabs.jobs', 'Jobs for you'), icon: Briefcase },
    { id: 'salary', label: t('market.tabs.salary', 'Real salary calculator'), icon: Calculator },
    { id: 'fit', label: t('market.tabs.fit', 'Check company fit'), icon: Building2 },
  ]

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('market.title', 'Jobs & Salary')}
            </h1>
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-orange-100 dark:bg-orange-950 text-[#F26B1D] dark:text-orange-300">
              {t('market.snapshot_badge', 'Market Snapshot')}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {t('market.subtitle', 'Explore live role demand, calculate real purchasing power after expenses, and evaluate your company tier fit.')}
          </p>
        </div>
      </div>

      {/* 3 Tabs Navigation Bar */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 w-full sm:w-fit overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-[#0B4F9C] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-[#0B4F9C] dark:text-sky-400' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'jobs' && <JobsForYouTab />}
      {activeTab === 'salary' && <RealSalaryCalculatorTab />}
      {activeTab === 'fit' && <CompanyFitTab />}
    </div>
  )
}
