import { Link } from 'react-router-dom'
import { Building2, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function DashboardCompanyBanner() {
  const { t } = useTranslation()

  return (
    <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-600 via-[#0B4F9C] to-indigo-700 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
          <Building2 size={22} />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-white">
              {t('dashboard.company_banner.title')}
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-[#F26B1D] text-white uppercase tracking-wider">
              {t('dashboard.company_banner.new_badge')}
            </span>
          </div>
          <p className="text-xs text-blue-100">
            {t('dashboard.company_banner.subtitle')}
          </p>
        </div>
      </div>

      <Link
        to="/company-match"
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-[#0B4F9C] font-extrabold text-xs hover:bg-blue-50 shadow-md transition-all shrink-0 hover:scale-[1.02]"
      >
        <span>{t('dashboard.company_banner.launch_btn')}</span>
        <ArrowRight size={14} />
      </Link>
    </div>
  )
}
