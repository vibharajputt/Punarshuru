import { useRef } from 'react'
import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import PersonaCardsSection from '@/components/landing/PersonaCardsSection'
import StepFlowSection from '@/components/landing/StepFlowSection'
import StatsSection from '@/components/landing/StatsSection'
import FeatureRowsSection from '@/components/landing/FeatureRowsSection'
import BharatSection from '@/components/landing/BharatSection'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
  const personasRef = useRef<HTMLDivElement>(null)

  const scrollToPersonas = () => {
    const el = document.getElementById('demo-personas')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#080F1A] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <main className="flex-1">
        <HeroSection onExplorePersonas={scrollToPersonas} />
        <StatsSection />
        <div ref={personasRef}>
          <PersonaCardsSection />
        </div>
        <StepFlowSection />
        <FeatureRowsSection />
        <BharatSection />
      </main>
      <Footer />
    </div>
  )
}
