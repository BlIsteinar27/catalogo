'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Plus, Edit, Trash2, Tags, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Pagination } from '@/components/ui/pagination'
import { showSuccess, showError, showActionConfirm } from '@/lib/alerts'
import { createCategory, updateCategory, deleteCategory } from '@/server/categories'
import { PRODUCT_VALIDATIONS, validateCategoryName } from '@/lib/validations'
import type { Category } from '@/lib/supabase/types'

interface CategoryManagerProps {
  categories: (Category & { product_count?: number })[]
}

export function CategoryManager({ categories }: CategoryManagerProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const itemsPerPage = 5

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingName, setEditingName] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1) // Resetear a página 1 cuando cambia la búsqueda
    }, 300)
    
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Filtrar categorías según búsqueda
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  )

  // Resetear a página 1 cuando cambian las categorías
  useEffect(() => {
    setCurrentPage(1)
  }, [categories.length])

  // Calcular categorías paginadas
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const resetForm = () => {
    setEditingName(null)
    setName('')
    setError(null)
    setIsModalOpen(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmedName = name.trim()
    const validationError = validateCategoryName(trimmedName)
    if (validationError) {
      setError(validationError)
      return
    }

    startTransition(async () => {
      const result = editingName
        ? await updateCategory(editingName, trimmedName)
        : await createCategory({ name: trimmedName })

      if (!result.success) {
        setError(result.error)
        return
      }

      showSuccess(editingName ? 'Categoría actualizada' : 'Categoría creada')
      resetForm()
      router.refresh()
    })
  }

  const handleEdit = (category: Category) => {
    setEditingName(category.name)
    setName(category.name)
    setError(null)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setEditingName(null)
    setName('')
    setError(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (category: Category) => {
    const confirmed = await showActionConfirm(
      '¿Eliminar categoría?',
      `¿Estás seguro de eliminar la categoría "${category.name}"? Esta acción no se puede deshacer.`,
      'Sí, eliminar'
    )
    
    if (!confirmed) return

    startTransition(async () => {
      const result = await deleteCategory(category.name)
      if (!result.success) {
        showError('Error', result.error)
        return
      }

      showSuccess('¡Eliminada!', 'Categoría eliminada exitosamente')
      if (editingName === category.name) {
        resetForm()
      }
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingName ? 'Editar categoría' : 'Nueva categoría'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            id="category-name"
            label="Nombre de la categoría"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre de la categoría"
            maxLength={PRODUCT_VALIDATIONS.CATEGORY.MAX_LENGTH}
            disabled={isPending}
          />

          {error && (
            <p className="rounded-md bg-destructive-bg px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <Button type="submit" loading={isPending} disabled={isPending}>
              {editingName ? 'Guardar cambios' : 'Crear categoría'}
            </Button>
            <Button type="button" variant="secondary" onClick={resetForm} disabled={isPending}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      {categories.length === 0 ? (
        <motion.div
          className="rounded-xl border border-dashed border-border bg-surface p-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Tags size={48} className="mx-auto text-ink-muted mb-4" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-ink mb-2">
            No hay categorías todavía
          </h3>
          <p className="text-ink-muted mb-6">
            Crea la primera categoría para organizar tus productos.
          </p>
          <Button
            type="button"
            onClick={handleCreate}
            className="hidden lg:inline-flex"
          >
            <Plus size={20} className="mr-2" aria-hidden="true" />
            Crear primera categoría
          </Button>
          <Button
            type="button"
            onClick={handleCreate}
            className="lg:hidden"
            aria-label="Crear primera categoría"
          >
            <Plus size={24} aria-hidden="true" />
          </Button>
        </motion.div>
      ) : (
        <motion.div
          className="rounded-xl border border-border bg-surface-elevated overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-ink">Categorías ({filteredCategories.length})</h3>
            <div className="flex-1 hidden md:flex items-center justify-center px-8">
              <Input
                type="text"
                placeholder="Buscar categorías..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-md"
              />
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleCreate}
              disabled={isPending}
              className="hidden lg:inline-flex"
            >
              <Plus size={16} aria-hidden="true" />
              Nueva categoría
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleCreate}
              disabled={isPending}
              className="lg:hidden"
              aria-label="Nueva categoría"
            >
              <Plus size={20} aria-hidden="true" />
            </Button>
          </div>
          <div className="hidden md:flex lg:hidden overflow-x-auto no-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="px-4 py-3 font-medium text-ink-secondary text-left w-1/2">Categoría</th>
                  <th className="px-4 py-3 font-medium text-ink-secondary text-left w-1/4">Productos</th>
                  <th className="px-4 py-3 font-medium text-ink-secondary text-center w-1/4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedCategories.map((category, index) => (
                  <motion.tr
                    key={category.name}
                    className="hover:bg-surface/50 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-ink">{category.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-white bg-brand px-2 py-1 rounded-full font-medium">
                        {category.product_count || 0} prod
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 justify-center">
                        <motion.button
                          type="button"
                          onClick={() => handleEdit(category)}
                          disabled={isPending}
                          className="p-2 rounded-sm text-ink-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                          whileHover={{ backgroundColor: 'var(--color-surface)' }}
                          transition={{ duration: 0.2 }}
                          aria-label={`Editar ${category.name}`}
                        >
                          <Edit size={14} aria-hidden="true" />
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={() => handleDelete(category)}
                          disabled={isPending}
                          className="p-2 rounded-sm text-ink-secondary disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                          whileHover={{ backgroundColor: 'var(--color-destructive-bg)', color: 'var(--color-destructive)' }}
                          transition={{ duration: 0.2 }}
                          aria-label={`Eliminar ${category.name}`}
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
          <div className="hidden lg:flex overflow-x-auto no-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="px-4 py-3 font-medium text-ink-secondary text-left w-1/2">Categoría</th>
                  <th className="px-4 py-3 font-medium text-ink-secondary text-left w-1/4">Productos</th>
                  <th className="px-4 py-3 font-medium text-ink-secondary text-center w-1/4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedCategories.map((category, index) => (
                  <motion.tr
                    key={category.name}
                    className="hover:bg-surface/50 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-ink">{category.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-white bg-brand px-2 py-1 rounded-full font-medium">
                        {category.product_count || 0} prod
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 justify-center">
                        <motion.button
                          type="button"
                          onClick={() => handleEdit(category)}
                          disabled={isPending}
                          className="p-2 rounded-sm text-ink-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                          whileHover={{ backgroundColor: 'var(--color-surface)' }}
                          transition={{ duration: 0.2 }}
                          aria-label={`Editar ${category.name}`}
                        >
                          <Edit size={14} aria-hidden="true" />
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={() => handleDelete(category)}
                          disabled={isPending}
                          className="p-2 rounded-sm text-ink-secondary disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                          whileHover={{ backgroundColor: 'var(--color-destructive-bg)', color: 'var(--color-destructive)' }}
                          transition={{ duration: 0.2 }}
                          aria-label={`Eliminar ${category.name}`}
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
            {paginatedCategories.map((category, index) => (
              <motion.div
                key={category.name}
                className="flex items-center gap-3 px-4 py-3 hover:bg-surface/50 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink text-sm truncate">{category.name}</p>
                  <p className="text-xs text-ink-muted">{category.product_count || 0} productos</p>
                </div>
                <div className="flex items-center gap-1">
                  <motion.button
                    type="button"
                    onClick={() => handleEdit(category)}
                    disabled={isPending}
                    className="p-2 rounded-sm text-ink-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                    whileHover={{ backgroundColor: 'var(--color-surface)' }}
                    transition={{ duration: 0.2 }}
                    aria-label={`Editar ${category.name}`}
                  >
                    <Edit size={16} aria-hidden="true" />
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => handleDelete(category)}
                    disabled={isPending}
                    className="p-2 rounded-sm text-ink-secondary disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                    whileHover={{ backgroundColor: 'var(--color-destructive-bg)', color: 'var(--color-destructive)' }}
                    transition={{ duration: 0.2 }}
                    aria-label={`Eliminar ${category.name}`}
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
            totalItems={categories.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </motion.div>
      )}
    </div>
  )
}
