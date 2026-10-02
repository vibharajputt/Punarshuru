import { useState, useEffect } from 'react'
import { Trophy, Plus, Trash2, TrendingUp, Layers } from 'lucide-react'
import { compensationApi } from '@/lib/api'
import CompareBars from '@/components/charts/CompareBars'
import type { OfferItem, CompareResponse } from '@/types'

export default function OfferComparisonTool() {
  const [offers, setOffers] = useState<OfferItem[]>([
    { offer_name: 'Bangalore FinTech', city: 'Bengaluru', salary_lpa: 22, bhk: 1 },
    { offer_name: 'Mohali SaaS Remote', city: 'Mohali', salary_lpa: 14, bhk: 1 },
    { offer_name: 'Pune IT Product', city: 'Pune', salary_lpa: 18, bhk: 1 },
  ])

  const [compareData, setCompareData] = useState<CompareResponse | null>(null)

  useEffect(() => {
    compensationApi
      .compare({ offers })
      .then((res) => setCompareData(res))
      .catch(() => {
        // fallback
      })
  }, [offers])

  const addOffer = () => {
    if (offers.length < 5) {
      setOffers([
        ...offers,
        {
          offer_name: `Offer ${offers.length + 1}`,
          city: 'Hyderabad',
          salary_lpa: 16,
          bhk: 1,
        },
      ])
    }
  }

  const removeOffer = (idx: number) => {
    if (offers.length > 2) {
      setOffers(offers.filter((_, i) => i !== idx))
    }
  }

  const updateOffer = (idx: number, field: keyof OfferItem, value: string | number) => {
    const updated = [...offers]
    updated[idx] = { ...updated[idx], [field]: value }
    setOffers(updated)
  }

  const bestOffer = compareData?.best_offer_by_real_income || 'Mohali SaaS Remote'
  const comparisons = compareData?.comparisons || []

  return (
    <div className="space-y-6">
      {/* Comparison Tool Header & Cards */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers size={18} className="text-[#0B4F9C]" />
              <span>Multi-Offer Purchasing Power Comparison</span>
            </h3>
            <p className="text-xs text-slate-500">
              Side-by-side analysis of net take-home and disposable real income.
            </p>
          </div>

          <button
            type="button"
            onClick={addOffer}
            disabled={offers.length >= 5}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#0B4F9C] text-white hover:bg-[#083b75] disabled:opacity-40 transition-all self-start sm:self-auto"
          >
            <Plus size={14} />
            <span>Add Offer ({offers.length}/5)</span>
          </button>
        </div>

        {/* Offer Cards Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {offers.map((offer, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
            >
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={offer.offer_name}
                  onChange={(e) => updateOffer(idx, 'offer_name', e.target.value)}
                  className="font-bold text-xs text-slate-900 dark:text-white bg-transparent border-b border-slate-300 dark:border-slate-600 focus:outline-none w-36"
                />
                {offers.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOffer(idx)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block">City</label>
                  <select
                    value={offer.city}
                    onChange={(e) => updateOffer(idx, 'city', e.target.value)}
                    className="w-full p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                  >
                    {['Bengaluru', 'Mohali', 'Pune', 'Hyderabad', 'Lucknow', 'Noida', 'Mumbai', 'Jaipur', 'Ahmedabad'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block">CTC (₹ LPA)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={offer.salary_lpa}
                    onChange={(e) => updateOffer(idx, 'salary_lpa', Number(e.target.value))}
                    className="w-full p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold font-mono"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Winner Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-800 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Trophy size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                Highest Real Disposable Income Winner
              </p>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                {bestOffer}
              </p>
            </div>
          </div>
          <span className="hidden sm:inline px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
            Top Wealth Creator
          </span>
        </div>

        {/* Compare Bars Chart */}
        <CompareBars data={comparisons} height={280} />
      </div>

      {/* 5-Year Wealth Accumulation Projection */}
      {compareData?.five_year_projection && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-[#0B4F9C]" />
                <span>5-Year Cumulative Savings & Wealth Projection (₹ Lakhs)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Accounts for 10% annual salary hike and 6% metro expense inflation.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Timeline</th>
                  {offers.map((o) => (
                    <th key={o.offer_name} className="py-2.5 px-3 font-bold">
                      {o.offer_name} ({o.city})
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {compareData.five_year_projection.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-200">
                      {String(row.year)}
                    </td>
                    {offers.map((o) => (
                      <td key={o.offer_name} className="py-2.5 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                        ₹{row[o.offer_name] !== undefined ? row[o.offer_name] : row[o.city]} L
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
