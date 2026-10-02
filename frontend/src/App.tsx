import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppLayout from '@/components/layout/AppLayout'
import LandingPage from '@/pages/LandingPage'
import DashboardPage from '@/pages/DashboardPage'
import OnboardingPage from '@/pages/OnboardingPage'
import SkillGapPage from '@/pages/SkillGapPage'
import MarketPage from '@/pages/MarketPage'
import PathwaysPage from '@/pages/PathwaysPage'
import CompensationPage from '@/pages/CompensationPage'
import PassportPage from '@/pages/PassportPage'
import PublicPassportPage from '@/pages/PublicPassportPage'
import FloatingDemoSwitcher from '@/components/common/FloatingDemoSwitcher'
import '@/i18n'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 2,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Landing has no persistent nav */}
          <Route
            path="/"
            element={
              <>
                <LandingPage />
                <FloatingDemoSwitcher />
              </>
            }
          />

          {/* App routes share layout */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/skill-gap" element={<SkillGapPage />} />
            <Route path="/market" element={<MarketPage />} />
            <Route path="/pathways" element={<PathwaysPage />} />
            <Route path="/compensation" element={<CompensationPage />} />
            <Route path="/passport" element={<PassportPage />} />
            <Route path="/p/:slug" element={<PublicPassportPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
