'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}: PaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const canGoBack = currentPage > 1
  const canGoForward = currentPage < totalPages

  const handlePrevious = () => {
    if (canGoBack) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (canGoForward) {
      onPageChange(currentPage + 1)
    }
  }

  const handlePageClick = (page: number) => {
    onPageChange(page)
  }

  // Generar números de página a mostrar
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Lógica para mostrar páginas con elipsis
      if (currentPage <= 3) {
        // Inicio: 1 2 3 4 ... n
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Final: 1 ... n-3 n-2 n-1 n
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Medio: 1 ... current-1 current current+1 ... n
        pages.push(1)
        pages.push('...')
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="border-t border-border bg-surface-elevated px-4 py-3">
      {/* Desktop y Tablet */}
      <div className="hidden sm:flex items-center justify-between">
        <p className="text-sm text-ink-secondary">
          Mostrando <span className="font-medium text-ink">{startItem}</span> a{' '}
          <span className="font-medium text-ink">{endItem}</span> de{' '}
          <span className="font-medium text-ink">{totalItems}</span> resultados
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevious}
            disabled={!canGoBack}
            className="p-2 rounded-sm text-ink-secondary disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 hover:bg-surface transition-colors"
            aria-label="Página anterior"
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>

          <div className="flex items-center gap-1">
            {pageNumbers.map((page, index) => {
              if (page === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-3 py-1.5 text-sm text-ink-secondary"
                    aria-hidden="true"
                  >
                    ...
                  </span>
                )
              }

              const isActive = page === currentPage
              return (
                <button
                  key={page}
                  onClick={() => handlePageClick(page as number)}
                  className={`min-w-[2.5rem] px-3 py-1.5 text-sm font-medium rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 transition-colors ${
                    isActive
                      ? 'bg-brand text-white'
                      : 'text-ink-secondary hover:bg-surface'
                  }`}
                  aria-label={`Ir a página ${page}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {page}
                </button>
              )
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={!canGoForward}
            className="p-2 rounded-sm text-ink-secondary disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 hover:bg-surface transition-colors"
            aria-label="Página siguiente"
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Móvil */}
      <div className="flex sm:hidden items-center justify-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={!canGoBack}
          className="p-2 rounded-sm text-ink-secondary disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 hover:bg-surface transition-colors"
          aria-label="Página anterior"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>

        <p className="text-sm text-ink-secondary">
          Página <span className="font-medium text-ink">{currentPage}</span> de{' '}
          <span className="font-medium text-ink">{totalPages}</span>
        </p>

        <button
          onClick={handleNext}
          disabled={!canGoForward}
          className="p-2 rounded-sm text-ink-secondary disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 hover:bg-surface transition-colors"
          aria-label="Página siguiente"
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
