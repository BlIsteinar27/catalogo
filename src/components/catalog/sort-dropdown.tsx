'use client'

import { ArrowUpDown, ChevronDown, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useState, useRef, useEffect, useId } from 'react'

const MotionChevronDown = motion(ChevronDown)

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'newest'

interface SortOptionItem {
  value: SortOption
  label: string
}

const SORT_OPTIONS: SortOptionItem[] = [
  { value: 'name-asc', label: 'Nombre A-Z' },
  { value: 'name-desc', label: 'Nombre Z-A' },
  { value: 'price-asc', label: 'Precio: Menor a Mayor' },
  { value: 'price-desc', label: 'Precio: Mayor a Menor' },
  { value: 'newest', label: 'Más recientes' },
]

interface SortDropdownProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const listboxId = useId()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = SORT_OPTIONS.find((opt) => opt.value === value)

  return (
    <div ref={ref} className="relative">
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.98 }}
        whileHover={{
          backgroundColor: 'var(--color-surface-80)',
          borderColor: 'var(--color-glass-border)',
          boxShadow: 'var(--shadow-md)',
        }}
        className="flex items-center gap-2 rounded-xl border border-glass-border bg-glass px-4 py-2.5 text-sm font-medium text-ink shadow-glass backdrop-blur-sm"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-label="Ordenar productos"
      >
        <ArrowUpDown size={16} className="text-ink-muted" aria-hidden="true" />
        <span className="truncate max-w-[120px] sm:max-w-[200px]">{selectedOption?.label || 'Ordenar'}</span>
        <MotionChevronDown
          size={16}
          className="text-ink-muted"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden="true"
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-glass-border bg-glass shadow-glass-lg backdrop-blur-md"
          >
            <div className="py-1.5" id={listboxId} role="listbox" aria-label="Opciones de orden">
              {SORT_OPTIONS.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={value === option.value}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className={`group flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                    value === option.value
                      ? 'bg-brand/10 text-brand font-medium'
                      : 'text-ink hover:bg-surface/50'
                  }`}
                >
                  <span className="flex-1">{option.label}</span>
                  {value === option.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center"
                    >
                      <Check size={14} className="text-brand" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
