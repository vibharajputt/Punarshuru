import { useState } from 'react'
import { motion } from 'framer-motion'
import { FolderLock, Star, CheckCircle2, Plus } from 'lucide-react'

export interface EvidenceItem {
  id: string
  skill: string
  rating: number
  evidenceCount: number
  evidenceType: 'invoice' | 'screenshot' | 'review' | 'link'
  description: string
  lastVerified: string
}

export default function EvidenceVault() {
  const [items, setItems] = useState<EvidenceItem[]>([
    {
      id: 'ev-1',
      skill: 'Time-Critical SLA Management',
      rating: 5,
      evidenceCount: 4200,
      evidenceType: 'screenshot',
      description: 'Swiggy Partner monthly statements & 98.6% on-time SLA metrics',
      lastVerified: 'October 2026',
    },
    {
      id: 'ev-2',
      skill: 'Customer Service & Dispute Resolution',
      rating: 4,
      evidenceCount: 185,
      evidenceType: 'review',
      description: 'Customer rating badge & 5-star direct feedback screenshots',
      lastVerified: 'September 2026',
    },
    {
      id: 'ev-3',
      skill: 'Digital Payments & Cash Reconciliation',
      rating: 5,
      evidenceCount: 36,
      evidenceType: 'invoice',
      description: 'Weekly payout settlement slips & zero-deficit audit reports',
      lastVerified: 'October 2026',
    },
    {
      id: 'ev-4',
      skill: 'Route Planning & Navigation',
      rating: 5,
      evidenceCount: 1200,
      evidenceType: 'link',
      description: 'Multi-point cluster delivery records across Lucknow city zones',
      lastVerified: 'August 2026',
    },
  ])

  const [newSkill, setNewSkill] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const handleAddEvidence = () => {
    if (!newSkill) return
    const newItem: EvidenceItem = {
      id: `ev-${Date.now()}`,
      skill: newSkill,
      rating: 5,
      evidenceCount: 1,
      evidenceType: 'screenshot',
      description: newDesc || 'Uploaded platform verification artifact',
      lastVerified: 'Just now',
    }
    setItems([newItem, ...items])
    setNewSkill('')
    setNewDesc('')
    setShowAdd(false)
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0B4F9C] dark:text-sky-300 text-xs font-bold mb-1">
            <FolderLock size={12} />
            <span>Feature 2 • Evidence Vault</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Proof-Backed Skill Verification
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Eliminates the "I have the skill but can't prove it" rejection barrier with verified work artifacts.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity"
        >
          <Plus size={14} />
          <span>Upload Evidence</span>
        </button>
      </div>

      {/* Add Evidence Modal/Accordion */}
      {showAdd && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 space-y-3"
        >
          <div className="text-xs font-bold text-slate-900 dark:text-white">
            Link New Work Proof / Screenshot / Invoice
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Competency / Skill (e.g., Fleet Maintenance)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200"
            />
            <input
              type="text"
              placeholder="Description or Link (e.g., Settlement slip #4829)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowAdd(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleAddEvidence}
              className="px-4 py-1.5 rounded-lg bg-[#0B4F9C] text-white text-xs font-bold hover:bg-blue-800"
            >
              Save to Vault
            </button>
          </div>
        </motion.div>
      )}

      {/* Vault Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.skill}</h4>
                <div className="flex items-center gap-1 text-amber-500 mt-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      size={12}
                      className={idx < item.rating ? 'fill-amber-500' : 'text-slate-300 dark:text-slate-600'}
                    />
                  ))}
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 ml-1">
                    {item.rating}.0/5
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1 shrink-0">
                <CheckCircle2 size={10} /> Verified
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {item.description}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500">
              <span className="font-semibold text-[#0B4F9C] dark:text-sky-400">
                📁 Evidence: {item.evidenceCount.toLocaleString()} {item.evidenceCount > 1 ? 'records' : 'artifact'}
              </span>
              <span>Audited: {item.lastVerified}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
