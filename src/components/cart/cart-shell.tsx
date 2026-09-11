'use client'

import { usePathname } from 'next/navigation'
import { CartDrawer } from './cart-drawer'
import { CartButton } from './cart-button'
import { useMounted } from '@/lib/use-mounted'

/**
 * Componente shell que restringe el render del carrito a rutas públicas.
 *
 * Evita que CartButton y CartDrawer aparezcan en rutas privadas como
 * /dashboard y /login donde no tienen sentido.
 *
 * Usa useMounted para prevenir hydration mismatch y usePathname para
 * detectar la ruta actual.
 */
// Rutas privadas donde NO debe mostrar el carrito
const privateRoutes = ['/dashboard', '/login']

export function CartShell() {
  const pathname = usePathname()
  const mounted = useMounted()

  const isPrivateRoute = privateRoutes.some(route => pathname?.startsWith(route))

  // No renderizar si:
  // - No está montado (previene hydration mismatch)
  // - pathname es null (durante SSR)
  // - Es una ruta privada
  if (!mounted || pathname == null || isPrivateRoute) {
    return null
  }

  return (
    <>
      <CartDrawer />
      <CartButton />
    </>
  )
}
