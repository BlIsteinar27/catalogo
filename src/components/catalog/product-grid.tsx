'use client'

import { motion } from 'motion/react'
import { SearchX } from 'lucide-react'
import { ProductCard } from './product-card'
import type { Product } from '@/lib/supabase/types'

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 260, damping: 22 },
  },
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <SearchX size={40} className="text-ink-muted mb-4" />
        <p className="text-ink-secondary">No se encontraron productos</p>
        <p className="text-sm text-ink-muted mt-1">Prueba con otra categoría</p>
      </div>
    )
  }
  return (
    <motion.div
      className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      variants={gridVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={cardVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  )
}
