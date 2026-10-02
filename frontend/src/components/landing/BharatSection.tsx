import { motion } from 'framer-motion'
import { HeartHandshake, MapPin, GraduationCap, Languages, Sparkles } from 'lucide-react'

const bharatCards = [
  {
    icon: HeartHandshake,
    title: 'Career Break Normalization',
    desc: 'Empowering maternity returners and caretakers with structured skills modernization that turns gaps into proven strengths.',
    tag: 'Gender Diversity & Inclusion',
  },
  {
    icon: Sparkles,
    title: 'Gig-to-Tech Pathways',
    desc: 'Transforming operational grit of delivery and field workers into tech operations and logistics data analyst roles.',
    tag: 'Workforce Mobility',
  },
  {
    icon: MapPin,
    title: 'Tier-2 & Tier-3 Arbitrage',
    desc: 'Cost-of-living indexing for Mohali, Lucknow, Jaipur & Pune — helping talent optimize real wealth over vanity CTC.',
    tag: 'Geographic Decentralization',
  },
  {
    icon: GraduationCap,
    title: 'NPTEL & SWAYAM Integration',
    desc: 'Zero-cost learning pathways curated exclusively from top IITs, NPTEL, SWAYAM, and Skill India certifications.',
    tag: 'Affordable Reskilling',
  },
  {
    icon: Languages,
    title: 'Bilingual Interface (EN / हिन्दी)',
    desc: 'Full accessibility in Hindi and English ensuring non-metro talent can audit their career without language barriers.',
    tag: 'Vernacular First',
  },
]

export default function BharatSection() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/80 text-xs font-bold text-[#F26B1D] border border-orange-200 dark:border-orange-800">
            <Sparkles size={14} />
            <span>Bharat 2.0 Priority</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Built for India's Unique Workforce Realities
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Silicon Valley career tools ignore Indian family care breaks, gig platform realities, and Tier-2 purchasing power. Punarshuru was engineered specifically for Bharat.
          </p>
        </div>

        {/* Bharat Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bharatCards.map((c, idx) => {
            const Icon = c.icon
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#E8F3FF] dark:bg-sky-950 text-[#0B4F9C] dark:text-sky-300 flex items-center justify-center">
                    <Icon size={24} />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {c.tag}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
