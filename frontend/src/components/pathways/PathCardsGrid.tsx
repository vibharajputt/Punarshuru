import PathwayCard from '@/components/pathways/PathwayCard'
import type { PathwayOption } from '@/types'

interface PathCardsGridProps {
  pathways: PathwayOption[]
  selectedIndex: number
  onSelectIndex: (index: number) => void
}

export default function PathCardsGrid({
  pathways,
  selectedIndex,
  onSelectIndex,
}: PathCardsGridProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Choose Your Transition Strategy
        </h2>
        <span className="text-xs text-slate-400">
          Click any path to load its step-by-step roadmap
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {pathways.map((p, idx) => (
          <PathwayCard
            key={p.type}
            pathway={p}
            isSelected={selectedIndex === idx}
            onSelect={() => onSelectIndex(idx)}
          />
        ))}
      </div>
    </div>
  )
}
