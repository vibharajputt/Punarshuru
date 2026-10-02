import { motion } from 'framer-motion'
import { Database, Layers, MapPin, BookOpen, Sparkles } from 'lucide-react'

const stats = [
  {
    value: '250+',
    label: 'Standardized Skills',
    sub: 'Categorized with automation risk index',
    icon: Database,
  },
  {
    value: '300+',
    label: 'Indian Job Snapshots',
    sub: 'GenAI, FullStack, Cloud & DevOps',
    icon: Layers,
  },
  {
    value: '12',
    label: 'Indian Tech Hubs',
    sub: 'Mohali CoL baseline vs Tier-1 metros',
    icon: MapPin,
  },
  {
    value: '120+',
    label: 'Free Verified Courses',
    sub: 'NPTEL, SWAYAM & Skill India',
    icon: BookOpen,
  },
  {
    value: '100%',
    label: 'Bharat 2.0 Focused',
    sub: 'Real compensation & break normalization',
    icon: Sparkles,
  },
]

export default function StatsSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-[#0B4F9C] via-[#083b75] to-[#0B4F9C] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="space-y-2 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <div className="w-9 h-9 mx-auto rounded-xl bg-white/10 flex items-center justify-center text-[#F26B1D]">
                  <Icon size={18} />
                </div>
                <div className="text-3xl sm:text-4xl font-black tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-sky-200">
                  {stat.label}
                </div>
                <div className="text-[11px] text-sky-100/70 line-clamp-1">
                  {stat.sub}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
