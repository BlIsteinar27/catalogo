import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Currency, CartItem } from './supabase/types'
import { siteConfig } from './site-config'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: Currency = "USD"): string {
  const formatted = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  const symbol = '$' // Always USD
  return `${formatted} ${symbol}`
}

export function formatPrice(product: { price_usd: number; price_eur: number }, currency: Currency = "USD"): number {
  return product.price_usd // Always USD
}

export function buildWhatsAppMessage(
  items: CartItem[]
): string {
  if (items.length === 0) {
    return ''
  }

  const lines = items.map(
    ({ product, quantity }, index) =>
      `${index + 1}. ${product.name} — $${formatPrice(product).toFixed(2)} x ${quantity}`
  )
  
  const total = items.reduce(
    (acc, { product, quantity }) =>
      acc + formatPrice(product) * quantity, 0
  )
  
  const message = `¡Hola! Vengo del catálogo web de ${siteConfig.name}.

Me interesa hacer un pedido:

${lines.join('\n')}

Total estimado: $${total.toFixed(2)}

¿Podrían confirmarme disponibilidad y método de pago?`
  
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`
}
