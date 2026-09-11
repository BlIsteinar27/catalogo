'use client'

import { usePathname } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useCart } from './cart-provider'
import { useMounted } from '@/lib/use-mounted'

export function CartButton() {
  const { totalItems, openCart, isOpen } = useCart()
  const pathname = usePathname()
  const isProductDetail = pathname?.startsWith('/producto/')
  // Prevenir hydration mismatch: el primer render siempre usa 0 (consistente
  // con SSR). useMounted garantiza esto incluso si el componente se monta
  // después de que el CartProvider ya se hidrató (Cache Components + Suspense).
  const mounted = useMounted()
  const displayItems = mounted ? totalItems : 0

  return (
    <motion.button
      type="button"
      onClick={openCart}
      className={`fixed ${isProductDetail ? 'bottom-24' : 'bottom-6'} right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-glass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2`}
      aria-label={`Carrito con ${displayItems} ${displayItems === 1 ? 'producto' : 'productos'}`}
      aria-expanded={isOpen}
      aria-controls="cart-drawer"
      aria-haspopup="dialog"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      <ShoppingCart size={22} />
      <AnimatePresence>
        {displayItems > 0 && (
          <motion.span
            key={displayItems}
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-xs font-bold text-white"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          >
            {displayItems > 99 ? '99+' : displayItems}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
