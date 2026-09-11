import { Skeleton } from '@/components/ui/skeleton'

export default function EditProductLoading() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <Skeleton className="h-8 w-48 mb-1" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-96 w-full max-w-xl" />
    </div>
  )
}
