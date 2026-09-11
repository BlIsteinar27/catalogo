import { Suspense } from 'react'
import { ProductDetailServer } from './page-server'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-4xl px-4 py-8 grid gap-8 md:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-3/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-12 w-full" />
        </div>
      </div>
    }>
      <ProductDetailServer params={params} />
    </Suspense>
  )
}
