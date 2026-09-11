'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ImageUpload } from './image-upload'
import { getCategories } from "@/server/products.public";
import { createProduct, updateProduct } from "@/server/products.admin";
import { showSuccess, showError, showActionConfirm } from '@/lib/alerts'
import { PRODUCT_VALIDATIONS, ERROR_MESSAGES, validateProductPayload } from '@/lib/validations'
import type { Product, ProductInsert } from '@/lib/supabase/types'

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [isNewCategory, setIsNewCategory] = useState(false)
  
  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [priceUsd, setPriceUsd] = useState(String(product?.price_usd ?? ''))
  const [category, setCategory] = useState(product?.category ?? '')
  const [imageUrl, setImageUrl] = useState<string | null>(product?.image_url ?? null)
  const [inStock, setInStock] = useState(product?.in_stock ?? true)

  // Cargar categorías existentes
  useEffect(() => {
    let isMounted = true
    getCategories()
      .then((cats) => {
        if (isMounted) setCategories(cats)
      })
      .catch(() => {
        // Las categorías son un campo auxiliar; si falla la carga,
        // el formulario sigue siendo usable con el input manual
      })
    return () => {
      isMounted = false
    }
  }, [])

  // Verificar si hay cambios para confirmar cancelación
  const hasChanges = () => {
    if (!product) {
      return name.trim() || description.trim() || priceUsd || category || imageUrl || inStock !== true
    }
    return (
      name !== product.name ||
      description !== (product.description ?? '') ||
      Number(priceUsd) !== product.price_usd ||
      category !== product.category ||
      imageUrl !== (product.image_url ?? null) ||
      inStock !== product.in_stock
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmedName = name.trim()
    const trimmedDescription = description.trim()
    const trimmedCategory = category.trim()
    const isEditing = Boolean(product)

    // Payload simplificado para USD único
    const payload: ProductInsert = {
      name: trimmedName,
      description: trimmedDescription || null,
      price_usd: Number(priceUsd),
      price_eur: Number(priceUsd), // Mismo valor para EUR (legacy field)
      category: trimmedCategory,
      in_stock: inStock,
      image_url: imageUrl,
    }

    const validationError = validateProductPayload(payload, !isEditing)
    if (validationError) {
      setError(validationError)
      return
    }

    startTransition(async () => {
      try {
        const result = product
          ? await updateProduct(product.id, payload)
          : await createProduct(payload)
        
        if (!result.success) {
          setError(result.error)
        } else {
          showSuccess(
            product ? ERROR_MESSAGES.SUCCESS_UPDATE : ERROR_MESSAGES.SUCCESS_CREATE
          )
          setTimeout(() => router.push('/dashboard'), 500)
        }
      } catch (err) {
        if (err instanceof Error) {
          if (err.message.includes('fetch') || err.message.includes('network')) {
            setError(ERROR_MESSAGES.NETWORK_ERROR)
          } else if (err.message.includes('timeout')) {
            setError(ERROR_MESSAGES.TIMEOUT_ERROR)
          } else {
            setError(ERROR_MESSAGES.UNKNOWN_ERROR)
          }
        } else {
          setError(ERROR_MESSAGES.UNKNOWN_ERROR)
        }
      }
    })
  }

  const handleCancel = async () => {
    if (hasChanges()) {
      const confirmed = await showActionConfirm(
        'Cancelar cambios',
        'Hay cambios sin guardar. ¿Estás seguro de que deseas cancelar?',
        'Sí, cancelar'
      )
      if (confirmed) {
        router.back()
      }
    } else {
      router.back()
    }
  }

  const categoryOptions = [
    ...categories.map((cat) => ({ value: cat, label: cat })),
    { value: '__new__', label: '+ Nueva categoría' },
  ]

  const handleCategoryChange = (value: string) => {
    if (value === '__new__') {
      setIsNewCategory(true)
      setCategory('')
    } else {
      setIsNewCategory(false)
      setCategory(value)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-xl">
      <ImageUpload value={imageUrl} onChange={setImageUrl} />
      
      <Input
        id="name"
        label="Nombre del producto *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ej: Martillo de carpintero"
        required
        maxLength={PRODUCT_VALIDATIONS.NAME.MAX_LENGTH}
        error={!name.trim() && error?.includes('nombre') ? 'El nombre es requerido' : undefined}
      />
      
      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-ink-secondary">
          Descripción (opcional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe brevemente el producto..."
          rows={3}
          maxLength={PRODUCT_VALIDATIONS.DESCRIPTION.MAX_LENGTH}
          className="w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-placeholder focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand resize-none"
        />
        <p className="text-xs text-ink-muted text-right">
          {description.length}/{PRODUCT_VALIDATIONS.DESCRIPTION.MAX_LENGTH}
        </p>
      </div>
      
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 mt-3 text-ink font-medium z-10 flex items-center h-full">$</span>
        <Input
          id="price_usd"
          label="Precio *"
          type="number"
          step="0.01"
          min={PRODUCT_VALIDATIONS.PRICE.MIN}
          max={PRODUCT_VALIDATIONS.PRICE.MAX}
          value={priceUsd}
          onChange={(e) => setPriceUsd(e.target.value)}
          placeholder="0.00"
          required
          className="pl-10"
          error={!priceUsd && error?.includes('precio') ? 'El precio es requerido' : undefined}
        />
      </div>
      
      {isNewCategory ? (
        <div className="flex flex-col gap-1.5">
          <Input
            id="category"
            label="Nueva categoría *"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Nombre de la nueva categoría"
            maxLength={PRODUCT_VALIDATIONS.CATEGORY.MAX_LENGTH}
            error={!category.trim() && error?.includes('categoría') ? 'La categoría es requerida' : undefined}
          />
          <motion.button
            type="button"
            onClick={() => {
              setIsNewCategory(false)
              setCategory(categories[0] || '')
            }}
            className="text-xs text-ink-muted underline"
            whileHover={{ color: 'var(--color-brand)' }}
            transition={{ duration: 0.2 }}
          >
            Cancelar y seleccionar categoría existente
          </motion.button>
        </div>
      ) : (
        <Select
          id="category"
          label="Categoría *"
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          options={categoryOptions}
          error={!category && error?.includes('categoría') ? 'La categoría es requerida' : undefined}
        />
      )}

      <Switch
        checked={inStock}
        onCheckedChange={setInStock}
        label="Producto disponible"
      />
      
      {error && (
        <p className="rounded-md bg-destructive-bg px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      
      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={isPending}>
          {product ? 'Guardar cambios' : 'Crear producto'}
        </Button>
        <Button type="button" variant="secondary" onClick={handleCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
