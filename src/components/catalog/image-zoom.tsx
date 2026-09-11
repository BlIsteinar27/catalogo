'use client'

import Image from 'next/image'
import { X, ZoomIn } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect, useRef } from 'react'

const MotionZoomIn = motion(ZoomIn)

interface ImageZoomProps {
  src: string
  alt: string
  sizes?: string
  priority?: boolean
}

export function ImageZoom({ src, alt, sizes, priority }: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const triggerButtonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousActiveElementRef = useRef<HTMLElement | null>(null)

  const handleOverlayClick = () => {
    setIsZoomed(false)
  }

  const handleCloseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsZoomed(false)
  }

  useEffect(() => {
    if (!isZoomed) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsZoomed(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isZoomed])

  useEffect(() => {
    if (isZoomed) {
      previousActiveElementRef.current = document.activeElement as HTMLElement
      dialogRef.current?.focus()
    } else {
      if (triggerButtonRef.current && document.body.contains(triggerButtonRef.current)) {
        triggerButtonRef.current.focus()
      }
    }
  }, [isZoomed])

  useEffect(() => {
    if (!isZoomed || !dialogRef.current) return

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusableElements = dialogRef.current!.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )

      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleTab)
    return () => document.removeEventListener('keydown', handleTab)
  }, [isZoomed])

  return (
    <>
      <motion.button
        ref={triggerButtonRef}
        className="relative h-full w-full cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsZoomed(true)}
        type="button"
        aria-label="Ampliar imagen"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={sizes}
          priority={priority}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <MotionZoomIn size={32} className="text-white drop-shadow-lg" whileHover={{ scale: 1.1 }} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isZoomed && (
          <>
            {/* Overlay: clickeable, cierra al hacer click */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleOverlayClick}
              className="fixed inset-0 z-50 bg-black/90"
              aria-hidden="true"
            />

            {/* Contenido: contiene la imagen y el botón X */}
            <motion.div
              ref={dialogRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Imagen ampliada"
                className="relative h-full max-w-4xl max-h-[90vh] w-full pointer-events-auto"
              >
                <button
                  ref={closeButtonRef}
                  onClick={handleCloseClick}
                  className="absolute top-1 right-1 z-50 rounded-full bg-glass p-2 text-white hover:bg-glass-border transition-colors backdrop-blur-md border border-glass-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/90"
                  type="button"
                  aria-label="Cerrar imagen ampliada"
                >
                  <X size={24} />
                </button>
                <div className="relative h-full w-full">
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 64rem"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
