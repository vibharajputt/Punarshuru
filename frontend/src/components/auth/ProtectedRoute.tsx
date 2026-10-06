import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useDemoStore } from '@/store/demoStore'

/**
 * Product Decision & Security Policy:
 * Protected routes (/home, /skills, /path, /jobs, /passport, /features, /onboarding)
 * require EITHER:
 *  1. A verified user authentication session with a valid JWT token (`token`), OR
 *  2. An intentionally and explicitly activated demo persona session (`isDemo && personaKey`).
 *
 * Per deliberate product design (Option b):
 * An active demo persona is an intentionally allowed substitute for real login, enabling
 * judges and prospective candidates to explore the end-to-end Bharat 2.0 platform
 * (Career Risk Score, Skills Gap, 90-Day Pathways, Jobs/Compensation Fit, and Skill Passport)
 * without mandatory sign-up.
 *
 * However:
 * - If NO real token exists AND NO demo persona has been explicitly activated (e.g. direct URL
 *   navigation to /skills, /path, /jobs, or /passport), the guard gates access and redirects
 *   to /login with the intended route saved in `state.from`.
 * - In demo mode, the real authenticated user account menu is strictly hidden and replaced
 *   with the Sandbox Demo Session controller.
 */
export default function ProtectedRoute() {
  const token = useAuthStore((s) => s.token)
  const isDemo = useDemoStore((s) => s.isDemo)
  const personaKey = useDemoStore((s) => s.personaKey)
  const location = useLocation()

  const hasAccess = !!token || (isDemo && !!personaKey)

  if (!hasAccess) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

