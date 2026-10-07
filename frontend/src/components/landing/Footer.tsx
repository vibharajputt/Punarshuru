import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import HealthBadge from '@/components/common/HealthBadge'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="/logo.png"
                alt="Punarshuru"
                className="h-9 w-auto object-contain group-hover:scale-105 transition-transform"
              />
              <span className="font-black text-xl text-white">
                Punar<span className="text-[#F26B1D]">shuru</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              AI career intelligence for disruption, transition & growth.
              Detect the disruption. Understand the gap. Find the next move.
            </p>
            <div className="inline-block p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-sky-300">
              🇮🇳 Build for Bharat 2.0 • Intelligent Talent & Workforce Ecosystem
            </div>
          </div>

          {/* Col 2: Modules */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Intelligence Modules
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Disruption Audit
                </Link>
              </li>
              <li>
                <Link to="/skills" className="hover:text-white transition-colors">
                  My Skills
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">
                  Jobs & Salary
                </Link>
              </li>
              <li>
                <Link to="/path" className="hover:text-white transition-colors">
                  Safe / Stretch / Switch Paths
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">
                  Real Salary (After Rent & Travel)
                </Link>
              </li>
              <li>
                <Link to="/passport" className="hover:text-white transition-colors">
                  Skill Passport
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Personas */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Supported Archetypes
            </h4>
            <ul className="space-y-2">
              <li className="hover:text-white cursor-pointer">Career Break Returners</li>
              <li className="hover:text-white cursor-pointer">Gig Platform Workers</li>
              <li className="hover:text-white cursor-pointer">Laid-off Professionals</li>
              <li className="hover:text-white cursor-pointer">Stagnant Employees</li>
              <li className="hover:text-white cursor-pointer">Tier-2/3 BTech Students</li>
            </ul>
          </div>

          {/* Col 4: System & Team */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Engine Architecture
            </h4>
            <p className="text-[11px] text-slate-400">
              FastAPI + SQLAlchemy2 async + Pydantic2 + RapidFuzz + Gemini 1.5 Flash
            </p>
            <div className="pt-2">
              <HealthBadge />
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              API Docs:{' '}
              <a
                href="/api/docs"
                target="_blank"
                rel="noreferrer"
                className="text-sky-400 underline hover:text-sky-300"
              >
                /api/docs (Swagger)
              </a>
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 Punarshuru. Built with <Heart size={12} className="inline text-rose-500 mx-0.5" /> for Indian Tech Talent.</p>
          <p>Privacy First • Zero Scraping • NPTEL / SWAYAM Public Resources</p>
        </div>
      </div>
    </footer>
  )
}
