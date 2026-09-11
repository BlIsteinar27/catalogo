'use client'

import { motion } from 'motion/react'

interface CategoryFilterProps {
  categories: string[]
  selected: string | null
  onChange: (category: string | null) => void
}

export function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-ink">Categorías</span>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar" role="listbox" aria-label="Filtrar por categoría">
        {[null, ...categories].map((cat) => (
          <motion.button
            key={cat ?? 'all'}
            type="button"
            onClick={() => onChange(cat)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
              selected === cat
                ? 'text-white'
                : 'text-ink-secondary border border-glass-border bg-glass hover:border-glass-border hover:text-ink'
            }`}
            aria-selected={selected === cat}
            role="option"
          >
            {selected === cat && (
              <motion.span
                layoutId="category-pill"
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{cat ?? 'Todos'}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
