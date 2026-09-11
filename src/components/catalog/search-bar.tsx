'use client'

import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'

const MotionSearch = motion(Search)
const MotionX = motion(X)

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = 'Buscar productos...' }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <motion.div
      className="relative"
      animate={{ scale: isFocused ? 1.02 : 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="relative">
        <MotionSearch
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          animate={{ color: isFocused ? 'var(--color-brand)' : 'var(--color-ink-muted)' }}
          transition={{ duration: 0.2 }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          aria-label="Buscar productos"
          className={`w-full rounded-lg border bg-glass py-2.5 pl-10 pr-10 text-sm transition-colors focus:outline-none focus:ring-2 ${
            isFocused
              ? 'border-brand ring-brand/20'
              : 'border-glass-border focus:border-glass-border'
          }`}
        />
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => onChange('')}
              type="button"
              aria-label="Limpiar búsqueda"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-ink-muted hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MotionX size={16} aria-hidden="true" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
