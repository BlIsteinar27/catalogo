'use client'
import type { Currency } from '@/lib/supabase/types'

// TEMPORARILY DISABLED: Single currency (USD) mode
export function useCurrencyDisplay(): Currency {
  return 'USD' // Always USD
}
