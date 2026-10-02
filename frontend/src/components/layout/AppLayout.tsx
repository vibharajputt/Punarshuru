import { Outlet } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import FloatingDemoSwitcher from '@/components/common/FloatingDemoSwitcher'

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-[#080F1A] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      <FloatingDemoSwitcher />
    </div>
  )
}
