import { cn } from '@/lib/utils'

type BadgeVariant = 'category' | 'in-stock' | 'out-of-stock' | 'new'

const variants: Record<BadgeVariant, string> = {
  category: 'bg-brand text-white',
  'in-stock': 'bg-success-bg text-success',
  'out-of-stock': 'bg-destructive-bg text-destructive',
  'new': 'bg-brand text-white',
}

export function Badge({ children, variant = 'category', className }: {
  children: React.ReactNode; variant?: BadgeVariant; className?: string
}) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      variants[variant], className
    )}>
      {children}
    </span>
  )
}
