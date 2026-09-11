'use client'

import { cn } from '@/lib/utils'
import { motion } from 'motion/react'

export function Skeleton({ className }: { className?: string }) {
  return (
    <motion.div 
      className={cn('rounded-md bg-surface', className)}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl bg-surface-elevated overflow-hidden">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="p-4 flex flex-col gap-3">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  )
}
