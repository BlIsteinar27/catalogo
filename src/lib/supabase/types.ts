export type Currency = 'USD' | 'EUR'

export type Product = {
  id: string
  name: string
  description: string | null
  price_usd: number
  price_eur: number
  image_url: string | null
  category: string
  in_stock: boolean
  created_at: string
  updated_at: string
}

export type ProductInsert = Omit<Product, 'id' | 'created_at' | 'updated_at'>
export type ProductUpdate = Partial<ProductInsert>

export type Category = {
  name: string
  created_at: string
}

export type CategoryInsert = Omit<Category, 'created_at'>
export type CategoryUpdate = Partial<CategoryInsert>

export type CartItem = {
  product: Product
  quantity: number
}

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Determina si un producto es "nuevo" (creado en los últimos 7 días).
 *
 * Calcula la diferencia en milisegundos entre `new Date()` y `product.created_at`,
 * y la convierte a días.
 *
 * **Preferir uso en componentes cliente.** Si se usa en un Server Component,
 * `new Date()` puede diferir entre servidor y cliente por milisegundos,
 * causando hydration mismatch cuando el producto está exactamente en el
 * límite de los 7 días.
 *
 * @param product - Producto a evaluar
 * @returns true si el producto fue creado en los últimos 7 días
 */
export function isNewProduct(product: Product): boolean {
  const now = new Date()
  const createdAt = new Date(product.created_at)
  const diffInMs = now.getTime() - createdAt.getTime()
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
  return diffInDays <= 7
}
