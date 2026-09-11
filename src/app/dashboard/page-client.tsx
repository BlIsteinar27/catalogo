'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Package, Tag, ExternalLink, Plus, Edit, Trash2, DollarSign, CheckCircle, XCircle, Search } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { Pagination } from '@/components/ui/pagination'
import Image from 'next/image'
import { showSuccess, showError, showActionConfirm } from '@/lib/alerts'
import { deleteProduct } from '@/server/products.admin'
import type { Product } from '@/lib/supabase/types'

export function DashboardClient({ products }: { products: Product[] }) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const itemsPerPage = 5
  
  const totalProducts = products.length
  const uniqueCategories = new Set(products.map(p => p.category)).size
  const availableProducts = products.filter(p => p.in_stock).length
  const outOfStockProducts = products.filter(p => !p.in_stock).length
  
  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1) // Resetear a página 1 cuando cambia la búsqueda
    }, 300)
    
    return () => clearTimeout(timer)
  }, [searchTerm])
  
  // Filtrar productos según búsqueda
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  )
  
  // Calcular productos paginados
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  // Recalcular stats cuando cambian los productos
  const [currentStats, setCurrentStats] = useState({
    totalProducts,
    uniqueCategories,
    availableProducts,
    outOfStockProducts
  })

  useEffect(() => {
    setCurrentStats({
      totalProducts,
      uniqueCategories,
      availableProducts,
      outOfStockProducts
    })
    setCurrentPage(1) // Resetear a página 1 cuando cambian los productos
  }, [totalProducts, uniqueCategories, availableProducts, outOfStockProducts])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleDelete = async (id: string, name: string) => {
    const confirmed = await showActionConfirm(
      '¿Eliminar producto?',
      `¿Estás seguro de eliminar "${name}"? Esta acción no se puede deshacer.`,
      'Sí, eliminar'
    )
    
    if (!confirmed) return

    const result = await deleteProduct(id)
    if (!result.success) {
      showError('Error', result.error)
      return
    }

    showSuccess('¡Eliminado!', 'Producto eliminado exitosamente')
    router.refresh()
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink">
          Bienvenido a {siteConfig.name}
        </h1>
        <p className="mt-2 text-ink-muted">
          Gestiona tu catálogo de productos
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <motion.div
          className="rounded-xl border border-border bg-surface-elevated p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm text-ink-muted">Productos publicados</p>
              <p className="text-2xl font-bold text-ink">{currentStats.totalProducts}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="rounded-xl border border-border bg-surface-elevated p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
              <Tag size={24} />
            </div>
            <div>
              <p className="text-sm text-ink-muted">Categorías</p>
              <p className="text-2xl font-bold text-ink">{currentStats.uniqueCategories}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="rounded-xl border border-border bg-surface-elevated p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-ink-muted">Productos disponibles</p>
              <p className="text-2xl font-bold text-ink">{currentStats.availableProducts}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="rounded-xl border border-border bg-surface-elevated p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <XCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-ink-muted">Productos agotados</p>
              <p className="text-2xl font-bold text-ink">{currentStats.outOfStockProducts}</p>
            </div>
          </div>
        </motion.div>
      </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* <motion.div
            className="flex-1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            >
            <Button
            onClick={() => router.push('/dashboard/nuevo')}
            className="w-full sm:w-auto"
            size="lg"
            >
              <Plus size={20} className="mr-2" />
              Nuevo Producto
              </Button>
              </motion.div> */}
         {/*  <motion.div
            className="flex-1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            >
            <Button
            onClick={() => router.push('/dashboard/categorias')}
            className="w-full sm:w-auto"
            size="lg"
            >
            <Plus size={20} className="mr-2" />
            Nueva Categoria
            </Button>
            </motion.div>
            
            <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            >
            <Button
            onClick={() => window.open('/', '_blank')}
            variant="secondary"
            size="lg"
            >
            <ExternalLink size={20} className="mr-2" />
            Ver catálogo público
            </Button>
          </motion.div> */}
        </div>
              
              {totalProducts > 0 && (
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                >
                <div className="rounded-xl border border-border bg-surface-elevated overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <h3 className="text-sm font-semibold text-ink">Productos ({filteredProducts.length})</h3>
                    <div className="flex-1 hidden md:flex items-center justify-center px-8">
                      <Input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-md"
                      />
                    </div>
                    {totalProducts < 30 && (
                      <>
                        <Button
                          type="button"
                          onClick={() => router.push('/dashboard/nuevo')}
                          className="hidden lg:inline-flex"
                        >
                          <Plus size={16} aria-hidden="true" />
                          Nuevo producto
                        </Button>
                        <Button
                          type="button"
                          onClick={() => router.push('/dashboard/nuevo')}
                          className="lg:hidden"
                          aria-label="Nuevo producto"
                        >
                          <Plus size={20} aria-hidden="true" />
                        </Button>
                      </>
                    )}
                  </div>
            <div className="hidden md:flex overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="px-4 py-3 font-medium text-ink-secondary text-left">Producto</th>
                    <th className="px-4 py-3 font-medium text-ink-secondary text-left">Categoría</th>
                    <th className="px-4 py-3 font-medium text-ink-secondary text-right">Precio</th>
                    <th className="px-4 py-3 font-medium text-ink-secondary text-center">Stock</th>
                    <th className="px-4 py-3 font-medium text-ink-secondary text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedProducts.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      className="hover:bg-surface/50 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-surface">
                            {product.image_url ? (
                              <Image
                                src={product.image_url}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <Package size={20} className="text-ink-placeholder" aria-hidden="true" />
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-ink line-clamp-1">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="category">{product.category}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {formatCurrency(product.price_usd, 'USD')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={product.in_stock ? 'in-stock' : 'out-of-stock'}>
                          {product.in_stock ? 'Disponible' : 'Agotado'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 justify-center">
                          <motion.button
                            type="button"
                            onClick={() => router.push(`/dashboard/editar/${product.id}`)}
                            className="p-2 rounded-sm text-ink-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                            whileHover={{ backgroundColor: 'var(--color-surface)' }}
                            transition={{ duration: 0.2 }}
                            aria-label={`Editar ${product.name}`}
                          >
                            <Edit size={14} aria-hidden="true" />
                          </motion.button>
                          <motion.button
                            type="button"
                            onClick={() => handleDelete(product.id, product.name)}
                            className="p-2 rounded-sm text-ink-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                            whileHover={{ backgroundColor: 'var(--color-destructive-bg)', color: 'var(--color-destructive)' }}
                            transition={{ duration: 0.2 }}
                            aria-label={`Eliminar ${product.name}`}
                          >
                            <Trash2 size={14} aria-hidden="true" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex md:hidden divide-y divide-border flex-col">
              {paginatedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-surface/50 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-surface">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package size={24} className="text-ink-placeholder" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink text-sm truncate">{product.name}</p>
                    <p className="text-xs text-ink-muted">{formatCurrency(product.price_usd, 'USD')}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <motion.button
                      type="button"
                      onClick={() => router.push(`/dashboard/editar/${product.id}`)}
                      className="p-2 rounded-sm text-ink-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                      whileHover={{ backgroundColor: 'var(--color-surface)' }}
                      transition={{ duration: 0.2 }}
                      aria-label={`Editar ${product.name}`}
                    >
                      <Edit size={16} aria-hidden="true" />
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => handleDelete(product.id, product.name)}
                      className="p-2 rounded-sm text-ink-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                      whileHover={{ backgroundColor: 'var(--color-destructive-bg)', color: 'var(--color-destructive)' }}
                      transition={{ duration: 0.2 }}
                      aria-label={`Eliminar ${product.name}`}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Paginación */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalProducts}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        </motion.div>
      )}

      {totalProducts === 0 && (
        <motion.div
          className="mt-12 rounded-xl border border-dashed border-border bg-surface p-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Package size={48} className="mx-auto text-ink-muted mb-4" />
          <h3 className="text-lg font-semibold text-ink mb-2">
            Tu catálogo está vacío
          </h3>
          <p className="text-ink-muted mb-6">
            Comienza agregando tu primer producto para que tus clientes puedan verlo.
          </p>
          <Button onClick={() => router.push('/dashboard/nuevo')} className="hidden lg:inline-flex">
            <Plus size={20} className="mr-2" />
            Agregar primer producto
          </Button>
          <Button onClick={() => router.push('/dashboard/nuevo')} className="lg:hidden" aria-label="Agregar primer producto">
            <Plus size={24} />
          </Button>
        </motion.div>
      )}
    </div>
  )
}
