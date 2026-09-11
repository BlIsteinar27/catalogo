import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { ToastProvider } from '@/components/ui/toast'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAuth()

  const supabase = await createClient()
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  return (
    <ToastProvider>
      <div className="flex h-screen bg-canvas overflow-hidden w-full min-w-0">
        <DashboardSidebar totalProducts={count || 0} />
        <main className="flex-1 overflow-auto min-w-0">{children}</main>
      </div>
    </ToastProvider>
  )
}
