'use client'

import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

/**
 * Devuelve `true` solo después del primer render en el cliente.
 *
 * Previene hydration mismatch: el primer render (server y primer render
 * del cliente) siempre devuelve `false`, garantizando que los valores
 * derivados sean consistentes con el HTML del servidor.
 *
 * Es necesario porque con Next.js Cache Components + Suspense, un
 * componente puede montarse DESPUÉS de que su provider ya se hidrató,
 * por lo que leer `hydrated` del contexto no es suficiente.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
}
