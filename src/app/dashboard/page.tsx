import { Suspense } from 'react'
import { DashboardServer } from './page-server'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 flex flex-col gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>}>
      <DashboardServer />
    </Suspense>
  )
}
