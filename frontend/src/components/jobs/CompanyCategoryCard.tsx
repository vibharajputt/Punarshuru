import { MapPin, ArrowRight } from 'lucide-react'
import type { CompanyCategory } from './CompanyCategoriesData'

interface CompanyCategoryCardProps {
  category: CompanyCategory
  isSelected: boolean
  onSelect: (category: CompanyCategory) => void
}

export default function CompanyCategoryCard({
  category,
  isSelected,
  onSelect,
}: CompanyCategoryCardProps) {
  return (
    <div
      onClick={() => onSelect(category)}
      className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
        isSelected
          ? 'bg-white dark:bg-slate-900 border-[#0B4F9C] ring-2 ring-[#0B4F9C]/20 shadow-md scale-[1.01]'
          : 'bg-slate-50/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 hover:border-slate-300 shadow-2xs'
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl ${category.badgeBg} text-white flex items-center justify-center font-black text-xs shadow-xs`}
            >
              {category.badgeText}
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                {category.name}
              </h4>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {category.category}
              </span>
            </div>
          </div>

          {isSelected && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black shrink-0">
              Selected
            </span>
          )}
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {category.tagline}
        </p>

        <div className="space-y-1 pt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Core Tech Stack:
          </span>
          <div className="flex flex-wrap gap-1">
            {category.coreStack.map((stk) => (
              <span
                key={stk}
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300"
              >
                {stk}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-0.5">
          <MapPin size={12} className="text-[#F26B1D] shrink-0" />
          <span className="truncate">Hubs: {category.hiringHubs.join(', ')}</span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#0B4F9C] dark:text-sky-400">
        <span>{category.roles.length} Tracked Roles</span>
        <ArrowRight size={13} />
      </div>
    </div>
  )
}
