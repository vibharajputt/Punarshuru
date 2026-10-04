import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import StepFlowSection from '@/components/landing/StepFlowSection'
import PersonaCardsSection from '@/components/landing/PersonaCardsSection'
import FinalCTASection from '@/components/landing/FinalCTASection'
import Footer from '@/components/landing/Footer'
import DemoModal from '@/components/demo/DemoModal'

export default function LandingPage() {
  const [demoModalOpen, setDemoModalOpen] = useState(false)

  const handleOpenDemo = () => {
    setDemoModalOpen(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#080F1A] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero: headline, 1 line, Get started free + Try a demo */}
        <HeroSection onOpenDemo={handleOpenDemo} />

        {/* 2. 3 steps: Upload/Chat → See your score → Follow your path */}
        <StepFlowSection />

        {/* 3. 5 "Who it's for" cards */}
        <PersonaCardsSection />

        {/* 4. Final CTA */}
        <FinalCTASection onOpenDemo={handleOpenDemo} />
      </main>

      {/* 5. Footer */}
      <Footer />

      {/* Demo Mode Modal (ux.md: Landing "Try a demo" → modal with 5 persona cards → loads persona → /home) */}
      <DemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />
    </div>
  )
}
