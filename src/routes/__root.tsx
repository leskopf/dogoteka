import { createRootRoute, Outlet, redirect, useRouterState } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { TopBar } from '@/components/layout/TopBar'
import { useSession } from '@/hooks/useSession'

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    const isPublic =
      location.pathname.startsWith('/share') || location.pathname === '/login'
    if (isPublic) return

    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
  },
  component: RootLayout,
})

function RootLayout() {
  useSession()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isPublic = pathname.startsWith('/share') || pathname === '/login'

  if (isPublic) {
    return (
      <>
        <Outlet />
        <Toaster position="bottom-right" richColors />
      </>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <Outlet />
        </main>
        <BottomNav />
      </div>
      <Toaster position="bottom-right" richColors />
    </div>
  )
}
