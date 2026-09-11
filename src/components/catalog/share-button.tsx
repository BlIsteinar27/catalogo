'use client'

import { useState, useRef, useEffect } from 'react'
import { Share2, Check } from 'lucide-react'
import { motion } from 'motion/react'
import { formatCurrency, formatPrice } from '@/lib/utils'
import type { Product, Currency } from '@/lib/supabase/types'

interface ShareButtonProps {
  product: Product
  currency: Currency
}

export function ShareButton({ product, currency }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current)
      }
    }
  }, [])

  const price = formatPrice(product, currency)
  const shareText = `${product.name} — ${formatCurrency(price, currency)}${product.description ? `\n\n${product.description}` : ''}`

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: shareText,
      url: typeof window !== 'undefined' ? window.location.href : '',
    }

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // El usuario canceló
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareData.url}`)
        setCopied(true)
        if (copiedTimeoutRef.current) {
          clearTimeout(copiedTimeoutRef.current)
        }
        copiedTimeoutRef.current = setTimeout(() => setCopied(false), 2000)
      } catch {
        // No se pudo copiar
      }
    }
  }

  return (
    <motion.button
      onClick={handleShare}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-xs font-medium text-ink-secondary hover:bg-surface-elevated hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      aria-label="Compartir producto"
    >
      {copied ? (
        <>
          <Check size={14} /> Copiado
        </>
      ) : (
        <>
          <Share2 size={14} /> Compartir
        </>
      )}
    </motion.button>
  )
}
