'use client'

import { createContext, useContext, useEffect, useReducer, useState } from 'react'
import { MotionConfig } from 'motion/react'
import { formatPrice } from '@/lib/utils'
import type { CartItem, Product } from '@/lib/supabase/types'

type CartAction =
  | { type: 'ADD'; product: Product }
  | { type: 'REMOVE'; id: string }
  | { type: 'INCREMENT'; id: string }
  | { type: 'DECREMENT'; id: string }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; items: CartItem[] }

interface CartContextValue {
  items: CartItem[]
  add: (product: Product) => void
  remove: (id: string) => void
  increment: (id: string) => void
  decrement: (id: string) => void
  clear: () => void
  totalItems: number
  totalPrice: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

function isValidCartItems(data: unknown): data is CartItem[] {
  if (!Array.isArray(data)) return false
  return data.every((item) => {
    if (typeof item !== 'object' || item === null) return false
    const candidate = item as Record<string, unknown>
    if (typeof candidate.quantity !== 'number') return false
    const product = candidate.product
    if (typeof product !== 'object' || product === null) return false
    const p = product as Record<string, unknown>
    return (
      typeof p.id === 'string' &&
      typeof p.name === 'string' &&
      typeof p.price_usd === 'number' &&
      typeof p.price_eur === 'number'
    )
  })
}

function cartReducer(items: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD': {
      const existing = items.find((i) => i.product.id === action.product.id)
      if (existing) return items.map((i) =>
        i.product.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i
      )
      return [...items, { product: action.product, quantity: 1 }]
    }
    case 'REMOVE': return items.filter((i) => i.product.id !== action.id)
    case 'INCREMENT': return items.map((i) =>
      i.product.id === action.id ? { ...i, quantity: i.quantity + 1 } : i
    )
    case 'DECREMENT': return items
      .map((i) => i.product.id === action.id ? { ...i, quantity: i.quantity - 1 } : i)
      .filter((i) => i.quantity > 0)
    case 'CLEAR': return []
    case 'HYDRATE': return action.items
    default: return items
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, [])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('catalogo-cart')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (isValidCartItems(parsed)) {
          dispatch({ type: 'HYDRATE', items: parsed })
        } else {
          // Datos corruptos o de un schema anterior: ignorar y empezar con carrito vacío
          localStorage.removeItem('catalogo-cart')
        }
      }
    } catch {
      localStorage.removeItem('catalogo-cart')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('catalogo-cart', JSON.stringify(items))
  }, [items])

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)
  const totalPrice = items.reduce(
    (acc, i) => acc + formatPrice(i.product) * i.quantity, 0
  )

  return (
    <MotionConfig reducedMotion="user">
      <CartContext.Provider value={{
        items,
        add: (product) => dispatch({ type: 'ADD', product }),
        remove: (id) => dispatch({ type: 'REMOVE', id }),
        increment: (id) => dispatch({ type: 'INCREMENT', id }),
        decrement: (id) => dispatch({ type: 'DECREMENT', id }),
        clear: () => dispatch({ type: 'CLEAR' }),
        totalItems, totalPrice,
        isOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false),
      }}>
        {children}
      </CartContext.Provider>
    </MotionConfig>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (ctx === undefined) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}
