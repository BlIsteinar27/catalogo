'use client'

import { useState, useEffect, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Edit, Trash2, Package, Plus } from 'lucide-react'
import { motion } from 'motion/react'
import { deleteProduct } from "@/server/products.admin";
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { showSuccess, showError, showActionConfirm } from '@/lib/alerts'
import type { Product } from '@/lib/supabase/types'

const MotionLink = motion(Link)

interface ProductActionsProps {
  product: Product
  onDelete: (id: string, name: string) => void
  isDeleting: boolean
  deletingId: string | null
}

function ProductActions({ product, onDelete, isDeleting, deletingId }: ProductActionsProps) {
  const isActive = isDeleting && deletingId === product.id
  return (
    <div className="flex items-center gap-1.5">
      <MotionLink
        href={`/dashboard/editar/${product.id}`}
        className="p-2 rounded-sm text-ink-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        whileHover={{ backgroundColor: 'var(--color-surface)' }}
        transition={{ duration: 0.2 }}
        aria-label={`Editar ${product.name}`}
      >
        <Edit size={14} aria-hidden="true" />
      </MotionLink>
      <motion.button
        onClick={() => onDelete(product.id, product.name)}
        disabled={isDeleting}
        className="p-2 rounded-sm text-ink-secondary disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        whileHover={{ backgroundColor: 'var(--color-destructive-bg)', color: 'var(--color-destructive)' }}
        transition={{ duration: 0.2 }}
        aria-label={`Eliminar ${product.name}`}
      >
        {isActive ? (
          <motion.div
            className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <Trash2 size={14} aria-hidden="true" />
        )}
      </motion.button>
    </div>
  )
}

export function ProductTable({ products }: { products: Product[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  
  // Estado local para optimistic update
  const [localProducts, setLocalProducts] = useState(products)
  
  // Sincronizar estado local cuando cambian las props
  useEffect(() => {
    setLocalProducts(products)
  }, [products])

  const handleDelete = async (id: string, name: string) => {
    const confirmed = await showActionConfirm(
      '¿Eliminar producto?',
      `¿Estás seguro de eliminar "${name}"? Esta acción no se puede deshacer.`,
      'Sí, eliminar'
    )
    
    if (!confirmed) return
    
    setDeletingId(id)
    
    // Optimistic update: remover inmediatamente de la UI
    setLocalProducts(prev => prev.filter(p => p.id !== id))
    
    startTransition(async () => {
      const result = await deleteProduct(id)
      
      if (!result.success) {
        // Rollback: restaurar el producto en caso de error
        setLocalProducts(products)
        showError('Error', result.error)
        setDeletingId(null)
        return
      }
      
      // Éxito: mostrar alerta y sincronizar con servidor
      showSuccess('¡Eliminado!', 'Producto eliminado exitosamente')
      router.refresh() // Sincronizar con el servidor
      setDeletingId(null)
    })
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface-elevated p-12 text-center">
        <Package size={48} className="text-ink-placeholder mx-auto mb-3" aria-hidden="true" />
        <p className="text-ink-secondary">No hay productos todavía.</p>
        <div className="flex items-center justify-center gap-2">
          <Link href="/dashboard/nuevo" className="hidden lg:inline-flex text-brand hover:underline text-sm">Crea tu primer producto</Link>
          <Link href="/dashboard/nuevo" className="lg:hidden text-brand hover:underline text-sm" aria-label="Crea tu primer producto">
            <Plus size={20} className="inline" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-surface-elevated overflow-hidden">
      {/* Desktop */}
      <div className="hidden md:flex overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface">
              {['Producto', 'Categoría', 'Precio', 'Stock', 'Acciones'].map((h) => (
                <th key={h} className={`px-4 py-3 font-medium text-ink-secondary ${h === 'Precio' ? 'text-right' : h === 'Stock' || h === 'Acciones' ? 'text-center' : 'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {localProducts.map((product) => (
              <tr key={product.id} className="hover:bg-surface/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-surface">
                      {product.image_url ? <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="40px" /> : <div className="flex h-full items-center justify-center"><Package size={20} className="text-ink-placeholder" aria-hidden="true" /></div>}
                    </div>
                    <span className="font-medium text-ink line-clamp-1">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3"><Badge variant="category">{product.category}</Badge></td>
                <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(product.price_usd, 'USD')}</td>
                <td className="px-4 py-3 text-center">
                  <Badge variant={product.in_stock ? 'in-stock' : 'out-of-stock'}>{product.in_stock ? 'Disponible' : 'Agotado'}</Badge>
                </td>
                <td className="px-4 py-3">
                  <ProductActions product={product} onDelete={handleDelete} isDeleting={isPending} deletingId={deletingId} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile */}
      <div className="flex md:hidden divide-y divide-border flex-col">
        {localProducts.map((product) => (
          <div key={product.id} className="flex items-center gap-3 px-4 py-3">
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-surface">
              {product.image_url ? <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="48px" /> : <div className="flex h-full items-center justify-center"><Package size={24} className="text-ink-placeholder" aria-hidden="true" /></div>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-ink text-sm truncate">{product.name}</p>
              <p className="text-xs text-ink-muted">{formatCurrency(product.price_usd, 'USD')}</p>
            </div>
            <ProductActions product={product} onDelete={handleDelete} isDeleting={isPending} deletingId={deletingId} />
          </div>
        ))}
      </div>
    </div>
  )
}
