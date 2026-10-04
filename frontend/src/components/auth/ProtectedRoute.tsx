import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useDemoStore } from '@/store/demoStore'

/**
 * Wraps app routes that require login or demo mode (ux.md Flow).
 * Unauthenticated users not in demo mode are redirected to /login, with `from` saved.
 */
export default function ProtectedRoute() {
  const token = useAuthStore((s) => s.token)
  const isDemo = useDemoStore((s) => s.isDemo)
  const location = useLocation()

  if (!token && !isDemo) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
