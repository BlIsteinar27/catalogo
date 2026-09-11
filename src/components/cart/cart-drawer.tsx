'use client'

import { useEffect, useRef } from 'react'
import { X, ShoppingCart, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useCart } from './cart-provider'
import { CartItemRow } from './cart-item'
import { Button } from '@/components/ui/button'
import { formatCurrency, buildWhatsAppMessage } from '@/lib/utils'
import { useMounted } from '@/lib/use-mounted'

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
}

export function CartDrawer() {
  const { items, totalItems, totalPrice, isOpen, closeCart, clear } = useCart()
  // Prevenir hydration mismatch: usar valores por defecto hasta montar en cliente
  const mounted = useMounted()
  const displayTotalPrice = mounted ? totalPrice : 0
  const drawerRef = useRef<HTMLDivElement>(null)
  const previousActiveElementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Cerrar con tecla Esc
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCart()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeCart])

  // Guardar y restaurar foco
  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement
      // Mover foco al drawer
      drawerRef.current?.focus()
    } else {
      // Restaurar foco al elemento que abrió el drawer
      previousActiveElementRef.current?.focus()
    }
  }, [isOpen])

  // Trampa de foco
  useEffect(() => {
    if (!isOpen || !drawerRef.current) return

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusableElements = drawerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusableElements || focusableElements.length === 0) return

      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      if (e.shiftKey) {
        // Shift + Tab: mover al último elemento
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab: mover al primer elemento
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleTab)
    return () => document.removeEventListener('keydown', handleTab)
  }, [isOpen])

  const handleWhatsApp = () => {
    window.open(buildWhatsAppMessage(items), '_blank', 'noopener,noreferrer')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            aria-hidden="true"
          />
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Carrito de compras"
            id="cart-drawer"
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-surface-elevated shadow-glass-lg backdrop-blur-md"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            tabIndex={-1}
          >
            <div className="flex items-center justify-between border-b border-glass-border px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-ink-secondary" />
                <h2 className="font-semibold text-ink">Tu carrito</h2>
                {totalItems > 0 && (
                  <span className="rounded-full bg-brand-subtle px-2 py-0.5 text-xs font-medium text-brand">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="rounded-sm p-1.5 text-ink-muted hover:bg-glass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 transition-colors"
                aria-label="Cerrar carrito"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                  <ShoppingCart size={40} className="text-ink-placeholder" />
                  <p className="text-ink-secondary text-sm">Tu carrito está vacío</p>
                </div>
              ) : (
                <motion.div
                  className="divide-y divide-glass-border"
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {items.map((item) => (
                    <CartItemRow key={item.product.id} item={item} />
                  ))}
                </motion.div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-glass-border px-5 py-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink-secondary">Total</span>
                  <span className="text-lg font-bold text-ink tabular-nums">
                    {formatCurrency(displayTotalPrice, 'USD')}
                  </span>
                </div>
                <Button
                  onClick={handleWhatsApp}
                  disabled={items.length === 0}
                  size="lg"
                  className="w-full gap-2"
                >
                  <MessageCircle size={18} /> Pedir por WhatsApp
                </Button>
                <button
                  type="button"
                  onClick={clear}
                  className="w-full py-2.5 px-4 rounded-md border border-border text-sm font-medium text-ink-secondary hover:bg-destructive-bg hover:text-destructive hover:border-destructive transition-colors"
                >
                  Vaciar carrito
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
