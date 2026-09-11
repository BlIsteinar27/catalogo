'use client'

import Image from 'next/image'
import { Minus, Plus, X, Package } from 'lucide-react'
import { motion } from 'motion/react'
import { useCart } from './cart-provider'
import { formatCurrency, formatPrice } from '@/lib/utils'
import type { CartItem } from '@/lib/supabase/types'

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
}

export function CartItemRow({ item }: { item: CartItem }) {
  const { increment, decrement, remove } = useCart()
  const price = formatPrice(item.product) // USD por defecto

  return (
    <motion.div variants={itemVariants} className="flex gap-3 py-3">
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-surface">
        {item.product.image_url ? (
          <Image src={item.product.image_url} alt={item.product.name} fill className="object-cover" sizes="64px" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package size={24} className="text-ink-placeholder" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-ink truncate">{item.product.name}</p>
          <button type="button" onClick={() => remove(item.product.id)} className="p-1 text-ink-muted hover:text-destructive transition-colors" aria-label={`Eliminar ${item.product.name} del carrito`}>
            <X size={14} aria-hidden="true" />
          </button>
        </div>
        <p className="text-sm font-semibold text-brand">{formatCurrency(price * item.quantity)}</p> 
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => decrement(item.product.id)} className="h-6 w-6 flex items-center justify-center rounded-sm border border-border-strong text-ink-secondary hover:bg-surface" aria-label={`Disminuir cantidad de ${item.product.name}`}>
            <Minus size={12} aria-hidden="true" />
          </button>
          <span className="text-sm font-medium w-5 text-center tabular-nums">{item.quantity}</span>
          <button type="button" onClick={() => increment(item.product.id)} className="h-6 w-6 flex items-center justify-center rounded-sm border border-border-strong text-ink-secondary hover:bg-surface" aria-label={`Aumentar cantidad de ${item.product.name}`}>
            <Plus size={12} aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
