import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin,
  Flame,
  Clock,
  Navigation,
  Fuel,
  Star,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react'

export interface SurgeHotspot {
  area: string
  surgeMultiplier: number
  activeOrders: number
  deliveryTimeAvgMin: number
  bestFor: 'Food & Quick Comm' | 'Rides & Express' | 'Grocery Bulk'
  tip: string
  demandLevel: 'high' | 'very-high' | 'normal'
}

export default function GigDemandHeatmap() {
  const [selectedCity, setSelectedCity] = useState<'Lucknow' | 'Bengaluru' | 'Delhi-NCR'>('Lucknow')
  const [selectedSlot, setSelectedSlot] = useState<'lunch' | 'evening' | 'dinner'>('dinner')

  // Hotspots by city
  const cityHotspots: Record<string, SurgeHotspot[]> = {
    Lucknow: [
      {
        area: 'Gomti Nagar & Patrakarpuram',
        surgeMultiplier: 1.7,
        activeOrders: 142,
        deliveryTimeAvgMin: 18,
        bestFor: 'Food & Quick Comm',
        tip: 'Zepto Dark Store + Zomato food cluster around Manoj Pandey Chowk',
        demandLevel: 'very-high',
      },
      {
        area: 'Hazratganj & Halwasiya Market',
        surgeMultiplier: 1.5,
        activeOrders: 98,
        deliveryTimeAvgMin: 22,
        bestFor: 'Food & Quick Comm',
        tip: 'Evening street food & cafe rush; park near Mayfair cinema for quick pickups',
        demandLevel: 'high',
      },
      {
        area: 'Aliganj & Kapoorthala',
        surgeMultiplier: 1.4,
        activeOrders: 76,
        deliveryTimeAvgMin: 19,
        bestFor: 'Grocery Bulk',
        tip: 'Blinkit & Swiggy Instamart hub orders with heavy multi-bag tips',
        demandLevel: 'high',
      },
      {
        area: 'Charbagh & Station Zone',
        surgeMultiplier: 1.6,
        activeOrders: 110,
        deliveryTimeAvgMin: 25,
        bestFor: 'Rides & Express',
        tip: 'Rapido / Uber ride demand high during train arrivals; heavy luggage tips',
        demandLevel: 'very-high',
      },
    ],
    Bengaluru: [
      {
        area: 'Koramangala 4th-6th Block',
        surgeMultiplier: 1.8,
        activeOrders: 230,
        deliveryTimeAvgMin: 17,
        bestFor: 'Food & Quick Comm',
        tip: 'Dense cloud kitchens; highest double-order stacking velocity in South BLR',
        demandLevel: 'very-high',
      },
      {
        area: 'Indiranagar 100ft Road',
        surgeMultiplier: 1.7,
        activeOrders: 185,
        deliveryTimeAvgMin: 20,
        bestFor: 'Food & Quick Comm',
        tip: 'Fine dining & gourmet deliveries with 2x per-drop incentive payout',
        demandLevel: 'very-high',
      },
      {
        area: 'HSR Layout Sector 1 to 7',
        surgeMultiplier: 1.5,
        activeOrders: 160,
        deliveryTimeAvgMin: 16,
        bestFor: 'Grocery Bulk',
        tip: 'Zepto & Instamart residential deliveries; short 1.2 km cluster radius',
        demandLevel: 'high',
      },
    ],
    'Delhi-NCR': [
      {
        area: 'Cyber Hub & DLF Phase 2 (Gurugram)',
        surgeMultiplier: 1.8,
        activeOrders: 280,
        deliveryTimeAvgMin: 21,
        bestFor: 'Food & Quick Comm',
        tip: 'Late night tech worker deliveries; 20% night allowance on all food drops',
        demandLevel: 'very-high',
      },
      {
        area: 'Connaught Place & Barakhamba',
        surgeMultiplier: 1.6,
        activeOrders: 155,
        deliveryTimeAvgMin: 24,
        bestFor: 'Rides & Express',
        tip: 'Metro feeder rides and lunch corporate meal subscriptions',
        demandLevel: 'high',
      },
      {
        area: 'Sector 62 & 18 (Noida)',
        surgeMultiplier: 1.5,
        activeOrders: 140,
        deliveryTimeAvgMin: 19,
        bestFor: 'Grocery Bulk',
        tip: 'High volume residential tower drops with dedicated delivery lifts',
        demandLevel: 'high',
      },
    ],
  }

  const currentHotspots = cityHotspots[selectedCity] || cityHotspots.Lucknow

  return (
    <div className="space-y-6">
      {/* ── 1. Header Banner ── */}
      <div className="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-amber-500/10 dark:from-red-950/30 dark:via-orange-950/20 dark:to-slate-900 border border-orange-200/80 dark:border-orange-900/60 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-700 dark:text-red-400 text-xs font-black mb-2">
            <Flame size={13} className="fill-red-500" />
            <span>Pillar 2 • Smart AI Demand Heatmap & Route Saver</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Peak-Hour Prediction & Fuel Optimization Radar
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Kahan aur kis samay sabse zyada orders milenge — kam petrol me maximum kamai ka AI guide.
          </p>
        </div>

        {/* City Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">City:</span>
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            {(['Lucknow', 'Bengaluru', 'Delhi-NCR'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCity(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCity === c
                    ? 'bg-orange-500 text-white font-black shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. Peak Hours Hourly Surge Bar ── */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-orange-500" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Peak Hours Multiplier Timeline (कब काम करने पर सबसे ज्यादा कमाई?)
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Live Demand Pulse Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Lunch Slot */}
          <button
            onClick={() => setSelectedSlot('lunch')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedSlot === 'lunch'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>LUNCH RUSH</span>
              <span className="text-amber-600 font-black">1.4x Surge</span>
            </div>
            <p className="text-base font-black text-slate-900 dark:text-white mt-1">12:00 PM – 3:30 PM</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Corporate lunches & cloud kitchen thali combos</p>
          </button>

          {/* Evening Slot */}
          <button
            onClick={() => setSelectedSlot('evening')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedSlot === 'evening'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>EVENING SNACKS</span>
              <span className="text-amber-600 font-black">1.5x Surge</span>
            </div>
            <p className="text-base font-black text-slate-900 dark:text-white mt-1">5:00 PM – 7:30 PM</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Quick commerce snacks & evening chai/samosa deliveries</p>
          </button>

          {/* Dinner Slot */}
          <button
            onClick={() => setSelectedSlot('dinner')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedSlot === 'dinner'
                ? 'bg-red-50 dark:bg-red-950/40 border-red-500 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1 text-red-500 font-black">
                <Flame size={12} className="fill-red-500" />
                MEGA DINNER SURGE
              </span>
              <span className="text-red-600 font-black">1.8x Surge</span>
            </div>
            <p className="text-base font-black text-slate-900 dark:text-white mt-1">8:00 PM – 11:45 PM</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Peak family dining orders + maximum customer tip rates</p>
          </button>
        </div>
      </div>

      {/* ── 3. High-Order Corridors Heatmap Grid ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin size={16} className="text-[#F26B1D]" />
            <span>High-Demand Corridors in {selectedCity}</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">Auto-refreshed every 15 mins</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentHotspots.map((spot, i) => (
            <motion.div
              key={spot.area}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 hover:border-orange-400 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <h4 className="text-base font-black text-slate-900 dark:text-white">{spot.area}</h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{spot.bestFor}</p>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-500/10 text-orange-600 font-black text-xs">
                  <Flame size={13} className="fill-orange-500" />
                  <span>{spot.surgeMultiplier}x Payout</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Live Active Orders</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{spot.activeOrders}+ Orders</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Avg Drop Time</p>
                  <p className="text-sm font-black text-emerald-600">{spot.deliveryTimeAvgMin} Minutes</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
                <Sparkles size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <span><strong className="font-bold">AI Pro-Tip:</strong> {spot.tip}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── 4. Fuel-Saving Route Suggestions & Performance Radar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Fuel-Saving Advisory */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 dark:from-emerald-950/30 dark:to-slate-900 border border-emerald-300/80 dark:border-emerald-800/60 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-emerald-200/60 dark:border-emerald-900/60 pb-3">
              <Fuel size={18} className="text-emerald-600" />
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Best-Route & Fuel-Saving Advisor (पेट्रोल बचाने के नियम)
                </h3>
                <p className="text-[11px] text-slate-500">रोज़ाना लगभग ₹180 का पेट्रोल बचाएं</p>
              </div>
            </div>

            <div className="space-y-3 pt-3">
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 flex items-start gap-2.5">
                <Navigation size={16} className="text-[#0B4F9C] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    1. Cluster-Based Order Stacking
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Ek hi restaurant se 2 orders lene par 35% travel time aur ₹45 petrol bachta hai.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 flex items-start gap-2.5">
                <Clock size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    2. Engine Idle Cutoff at Red Lights & Hubs
                  </p>
                  <p className="text-[11px] text-slate-500">
                    30 seconds se zyada rukhne par engine band karein. Mahine me ₹900 ki direct bachat hoti hai.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 flex items-start gap-2.5">
                <Zap size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    3. EV 2-Wheeler Rental Switch ROI
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Petrol bike (₹2.2/km) ki jagah Yulu / Bounce EV (₹0.4/km) use karke mahine me ₹4,800 bachein.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
            <span>Monthly Fuel Savings Potential:</span>
            <span className="text-sm font-black text-emerald-600">₹4,200 - ₹5,400 / Month</span>
          </div>
        </div>

        {/* Performance Insights Radar */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Star size={16} className="text-amber-500 fill-amber-500" />
                <span>AI Performance Insights (आपकी रेटिंग व सुधार टिप्स)</span>
              </h3>
              <p className="text-[11px] text-slate-500">Platform algorithm visibility score: Top 5%</p>
            </div>
            <span className="text-sm font-black text-amber-500 px-2.5 py-1 rounded-xl bg-amber-500/10">
              4.88 / 5.0 ★
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700">
              <p className="text-[10px] uppercase font-bold text-slate-400">On-Time SLA</p>
              <p className="text-base font-black text-emerald-600">99.1%</p>
              <p className="text-[10px] text-slate-400">Gold Standard</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700">
              <p className="text-[10px] uppercase font-bold text-slate-400">Acceptance Rate</p>
              <p className="text-base font-black text-[#0B4F9C] dark:text-sky-400">96.4%</p>
              <p className="text-[10px] text-slate-400">High Priority</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700">
              <p className="text-[10px] uppercase font-bold text-slate-400">Cancel Rate</p>
              <p className="text-base font-black text-emerald-600">0.8%</p>
              <p className="text-[10px] text-slate-400">Safe Zone (&lt;2%)</p>
            </div>
          </div>

          {/* AI Actionable Tips */}
          <div className="space-y-2 pt-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              AI Actionable Rating Tips:
            </p>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Doorstep Greeting:</strong> "Namaste Sir, aapka order" bolne se 5-star rating probability 30% badhti hai.
                </span>
              </div>
              <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Liquid & Gravy Handling:</strong> Chai ya gravy items ko bag ke center divider me vertical rakhne se zero leakage claims aate hain.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
