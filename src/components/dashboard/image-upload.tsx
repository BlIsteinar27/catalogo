'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { uploadProductImage } from '@/server/storage'
import { FILE_VALIDATIONS, validateFile } from '@/lib/validations'

export function ImageUpload({ value, onChange }: { value: string | null; onChange: (url: string | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    processFile(file)
  }

  const processFile = async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    const result = await uploadProductImage(formData)
    setLoading(false)

    if (result.success) {
      onChange(result.data)
      setError(null)
    } else {
      setError(result.error)
    }

    if (inputRef.current) inputRef.current.value = ''
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      setError(null)
      processFile(file)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-ink-secondary">Imagen del producto (opcional)</p>
      {value ? (
        <div className="relative aspect-square w-32 overflow-hidden rounded-lg border border-border">
          <Image src={value} alt="Imagen del producto" fill className="object-cover" sizes="128px" />
          <button type="button" onClick={() => onChange(null)}
            className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-destructive shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            aria-label="Eliminar imagen"
          >
            <X size={12} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          disabled={loading}
          className={`flex h-32 w-32 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
            isDragging
              ? 'border-brand bg-brand/5 text-brand'
              : 'border-border-strong text-ink-muted hover:border-brand hover:text-brand'
          } disabled:opacity-50`}
          aria-label="Subir imagen del producto"
        >
          {loading ? (
            <motion.div 
              className="h-5 w-5 rounded-full border-2 border-current border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          ) : (
            <>
              <Upload size={20} aria-hidden="true" />
              <span className="text-xs font-medium">Subir imagen</span>
              <span className="text-[10px] text-ink-muted">o arrastra aquí</span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={FILE_VALIDATIONS.ACCEPT_MIME_TYPES.join(',')}
        onChange={handleChange}
        className="sr-only"
        aria-label="Seleccionar archivo de imagen"
      />
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <ImageIcon size={12} />
          {error}
        </p>
      )}
      {!error && !value && (
        <p className="text-xs text-ink-muted">Máximo 5MB. JPG, PNG, WebP.</p>
      )}
    </div>
  )
}
