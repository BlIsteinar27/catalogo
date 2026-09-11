'use client'

import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Package } from 'lucide-react'
import { motion } from 'motion/react'
import { useCart } from '@/components/cart/cart-provider'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/supabase/types'
import { ShareButton } from '@/components/catalog/share-button'
import { ImageZoom } from '@/components/catalog/image-zoom'

const pageVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function ProductDetailClient({ product }: { product: Product }) {
  const { add, openCart } = useCart()

  const handleAddToCart = () => {
    add(product)
    openCart()
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 pb-28 md:pb-8">
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-0"
      >
        {/* Back-link — primer hijo del stagger */}
        <motion.div variants={sectionVariants} className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-ink-secondary hover:text-ink transition-colors"
          >
            <ArrowLeft size={16} /> Volver al catálogo
          </Link>
        </motion.div>

        {/* Grid imagen + info — segundo y tercer hijo */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Imagen hero */}
          <motion.div variants={sectionVariants} className="relative aspect-square overflow-hidden rounded-xl bg-surface">
            {product.image_url ? (
              <ImageZoom
                src={product.image_url}
                alt={product.name}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center bg-slate-100 p-4">
                <Package size={60} className="text-slate-400" />
                <span className="mt-2 text-xs text-slate-500">Sin imagen</span>
              </div>
            )}
          </motion.div>

          {/* Columna de info */}
          <motion.div variants={sectionVariants} className="flex flex-col gap-4">
            {/* Badge categoría + badge stock juntos */}
            <div className="flex items-center gap-2">
              <Badge variant="category">{product.category}</Badge>
              <Badge variant={product.in_stock ? 'in-stock' : 'out-of-stock'}>
                {product.in_stock ? 'Disponible' : 'Agotado'}
              </Badge>
            </div>

            <h1 className="font-display text-3xl font-bold leading-tight text-ink">
              {product.name}
            </h1>

            {product.description && (
              <p className="text-ink-secondary leading-relaxed">{product.description}</p>
            )}

            <div className="my-2 h-px bg-border" />

            {/* Precio — protagonismo sin competencia lateral */}
            <div>
              <p className="text-3xl font-bold text-ink tabular-nums">
                {formatCurrency(formatPrice(product), 'USD')}
              </p>
            </div>

            {/* Share button */}
            <div className="flex items-center gap-2 mt-2">
              <ShareButton product={product} currency="USD" />
            </div>

            {/* Botón desktop con whileTap — oculto en mobile */}
            <motion.button
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              whileTap={product.in_stock ? { scale: 0.96 } : undefined}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="hidden md:inline-flex items-center justify-center gap-2 rounded-md bg-brand px-6 py-3 text-base font-medium text-white hover:bg-brand-hover disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 w-full mt-2 transition-colors"
            >
              <ShoppingCart size={18} /> Agregar al carrito
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Sticky CTA mobile — slide-up desde abajo */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-20 md:hidden border-t border-glass-border bg-glass/95 backdrop-blur-md px-4 py-3 shadow-glass"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.3 }}
      >
        <motion.button
          onClick={handleAddToCart}
          disabled={!product.in_stock}
          whileTap={product.in_stock ? { scale: 0.96 } : undefined}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-6 py-3 text-base font-medium text-white hover:bg-brand-hover disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 w-full transition-colors"
        >
          <ShoppingCart size={18} /> Agregar al carrito
        </motion.button>
      </motion.div>
    </main>
  )
}
