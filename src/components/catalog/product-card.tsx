'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Package, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useCart } from '@/components/cart/cart-provider'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/supabase/types'
import { isNewProduct } from '@/lib/supabase/types'

const MotionImage = motion(Image)

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { add, openCart } = useCart()

  return (
    <motion.article
      className="group flex flex-col overflow-hidden rounded-xl bg-surface-elevated shadow-sm h-[400px]"
      whileHover={{
        y: -4,
        boxShadow: 'var(--shadow-lg)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <Link href={`/producto/${product.id}`} className="relative block aspect-square overflow-hidden bg-surface">
        {product.image_url ? (
          <MotionImage
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-slate-100 p-4">
            <Package size={40} className="text-slate-400" />
            <span className="mt-2 text-xs text-slate-500">Sin imagen</span>
          </div>
        )}
        {!product.in_stock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <Badge variant="out-of-stock">Agotado</Badge>
          </div>
        )}
        {isNewProduct(product) && (
          <div className="absolute top-2 right-2 z-10">
            <Badge variant="new">Nuevo</Badge>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Badge variant="category">{product.category}</Badge>
        <Link href={`/producto/${product.id}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded">
          <motion.h3
            className="font-semibold text-ink line-clamp-2 leading-snug text-sm"
            whileHover={{ color: 'var(--color-brand)' }}
            transition={{ duration: 0.2 }}
          >
            {product.name}
          </motion.h3>
        </Link>
        {product.description && (
          <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="text-base font-bold text-ink tabular-nums">
            {formatCurrency(formatPrice(product), 'USD')}
          </p>
          {product.in_stock && (
            <motion.button
              type="button"
              onClick={() => { add(product); openCart() }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="flex items-center gap-1.5 rounded-md bg-brand px-3 py-2 text-xs font-medium text-white hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              aria-label="Agregar al carrito"
            >
              <span className="hidden lg:inline">
                <ShoppingCart size={13} /> Agregar
              </span>
              <span className="lg:hidden flex items-center gap-1">
                <ShoppingCart size={16} />
              </span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.article>
  )
}
