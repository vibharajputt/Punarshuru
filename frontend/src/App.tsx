import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@/i18n'

// Layout
import AppLayout from '@/components/layout/AppLayout'

// Auth guard
import ProtectedRoute from '@/components/auth/ProtectedRoute'

// Public pages
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'

// App pages (ux.md nav — 5 items)
import HomePage from '@/pages/HomePage'          // /home
import SkillsPage from '@/pages/SkillsPage'      // /skills
import PathPage from '@/pages/PathPage'          // /path
import JobsPage from '@/pages/JobsPage'          // /jobs
import PassportPage from '@/pages/PassportPage'  // /passport

// Other app pages
import OnboardingPage from '@/pages/OnboardingPage'
import PublicPassportPage from '@/pages/PublicPassportPage'

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
          {/* ── Public routes ──────────────────────────────────────── */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* ── Public passport share link ─────────────────────────── */}
          <Route path="/p/:slug" element={<PublicPassportPage />} />

          {/* ── Protected app routes (require login) ───────────────── */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              {/* Primary nav routes (ux.md) */}
              <Route path="/home"     element={<HomePage />} />
              <Route path="/skills"   element={<SkillsPage />} />
              <Route path="/path"     element={<PathPage />} />
              <Route path="/jobs"     element={<JobsPage />} />
              <Route path="/passport" element={<PassportPage />} />

              {/* Supporting routes */}
              <Route path="/onboarding" element={<OnboardingPage />} />
            </Route>
          </Route>

          {/* ── Legacy route redirects ─────────────────────────────── */}
          <Route path="/dashboard"    element={<Navigate to="/home"    replace />} />
          <Route path="/skill-gap"    element={<Navigate to="/skills"  replace />} />
          <Route path="/pathways"     element={<Navigate to="/path"    replace />} />
          <Route path="/market"       element={<Navigate to="/jobs"    replace />} />
          <Route path="/compensation" element={<Navigate to="/jobs"    replace />} />
          <Route path="/company-match" element={<Navigate to="/jobs"   replace />} />

          {/* ── Catch-all ──────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
