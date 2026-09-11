import { Skeleton } from '@/components/ui/skeleton'
export default function DashboardLoading() {
  return (
    <div className="p-8 flex flex-col gap-4">
      <Skeleton className="h-8 w-48" />
      {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
    </div>
  )
}
