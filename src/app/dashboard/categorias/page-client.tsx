'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { CategoryManager } from '@/components/dashboard/category-manager'
import { Tag, TrendingUp, AlertCircle } from 'lucide-react'
import type { Category } from '@/lib/supabase/types'

interface CategoryStats {
  totalCategories: number
  categoryWithMostProducts: { name: string; count: number } | null
  productsWithoutCategory: number
}

export function CategoriesClient({ 
  categories, 
  stats 
}: { 
  categories: (Category & { product_count?: number })[]
  stats: CategoryStats 
}) {
  const [currentStats, setCurrentStats] = useState({
    totalCategories: categories.length,
    categoryWithMostProducts: categories
      .filter(cat => (cat.product_count || 0) > 0)
      .sort((a, b) => (b.product_count || 0) - (a.product_count || 0))[0] || null,
    productsWithoutCategory: stats.productsWithoutCategory
  })

  useEffect(() => {
    const categoryWithMostProducts = categories
      .filter(cat => (cat.product_count || 0) > 0)
      .sort((a, b) => (b.product_count || 0) - (a.product_count || 0))[0] || null

    setCurrentStats({
      totalCategories: categories.length,
      categoryWithMostProducts,
      productsWithoutCategory: stats.productsWithoutCategory
    })
  }, [categories, stats.productsWithoutCategory])

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Categorías</h1>
        <p className="text-sm text-ink-muted mt-0.5">Administra las categorías del catálogo</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <motion.div
          className="rounded-xl border border-border bg-surface-elevated p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
              <Tag size={24} />
            </div>
            <div>
              <p className="text-sm text-ink-muted">Total categorías</p>
              <p className="text-2xl font-bold text-ink">{currentStats.totalCategories}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="rounded-xl border border-border bg-surface-elevated p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-ink-muted">Categoría con más productos</p>
              <p className="text-2xl font-bold text-ink">
                {currentStats.categoryWithMostProducts ? currentStats.categoryWithMostProducts.name : 'N/A'}
              </p>
              <p className="text-xs text-ink-muted">
                {currentStats.categoryWithMostProducts ? `${currentStats.categoryWithMostProducts.product_count || 0} productos` : '-'}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="rounded-xl border border-border bg-surface-elevated p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-ink-muted">Productos sin categoría</p>
              <p className="text-2xl font-bold text-ink">{currentStats.productsWithoutCategory}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <CategoryManager categories={categories} />
    </div>
  )
}
