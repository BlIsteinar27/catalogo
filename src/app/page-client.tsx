"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductGrid } from "@/components/catalog/product-grid";
import { CategoryFilter } from "@/components/catalog/category-filter";
import { SearchBar } from "@/components/catalog/search-bar";
import {
  SortDropdown,
  type SortOption,
} from "@/components/catalog/sort-dropdown";
import { PriceFilter } from "@/components/catalog/price-filter";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/supabase/types";

const PAGE_SIZE = 12;

export function CatalogClient({
  products,
  categories,
}: {
  products: Product[];
  categories: string[];
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const priceRange = useMemo(() => {
    if (products.length === 0) return [0, 0] as [number, number];
    const prices = products.map((p) => formatPrice(p)); // No currency param
    return [Math.min(...prices), Math.max(...prices)] as [number, number];
  }, [products]);

  const [priceFilter, setPriceFilter] = useState<[number, number] | null>(null);

  useEffect(() => {
    setPriceFilter(null);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selected, searchQuery, sortBy, priceFilter]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selected !== null) {
      result = result.filter((p) => p.category === selected);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query),
      );
    }

   
if (priceFilter) {
  const [filterMin, filterMax] = priceFilter;
  result = result.filter((p) => {
    const price = formatPrice(p);
    // Pasivo: el producto simplemente debe estar dentro del rango que el usuario definió.
    // Si el rango es más amplio que el catálogo, todos los productos pasan.
    // Si es más restrictivo, solo pasan los que calzan.
    return price >= filterMin && price <= filterMax;
  });
}

    result.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return formatPrice(a) - formatPrice(b); // No currency param
        case "price-desc":
          return formatPrice(b) - formatPrice(a); // No currency param
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        default:
          return 0;
      }
    });

    return result;
  }, [products, selected, searchQuery, sortBy, priceFilter]);

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <SortDropdown value={sortBy} onChange={setSortBy} />
      </div>

      <CategoryFilter
        categories={categories}
        selected={selected}
        onChange={setSelected}
      />

      <PriceFilter
        minPrice={priceRange[0]}
        maxPrice={priceRange[1]}
        value={priceFilter}
        onChange={setPriceFilter}
      />

      <div className="flex items-center justify-between gap-4 py-2 border-b border-border">
        <p className="text-sm text-ink-secondary">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "producto" : "productos"}
        </p>

        {totalPages > 1 && (
          <>
            {/* Desktop/Tablet */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-sm text-ink-secondary disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 hover:bg-surface transition-colors"
                aria-label="Página anterior"
              >
                <ChevronLeft size={16} aria-hidden="true" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`min-w-[2rem] px-2 py-1 text-sm font-medium rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 transition-colors ${
                        isActive
                          ? 'bg-brand text-white'
                          : 'text-ink-secondary hover:bg-surface'
                      }`}
                      aria-label={`Ir a página ${pageNum}`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-sm text-ink-secondary disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 hover:bg-surface transition-colors"
                aria-label="Página siguiente"
              >
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>

            {/* Móvil */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-sm text-ink-secondary disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 hover:bg-surface transition-colors"
                aria-label="Página anterior"
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>

              <p className="text-sm text-ink-secondary">
                <span className="font-medium text-ink">{currentPage}</span> de{' '}
                <span className="font-medium text-ink">{totalPages}</span>
              </p>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-sm text-ink-secondary disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 hover:bg-surface transition-colors"
                aria-label="Página siguiente"
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
          </>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium text-ink">
            No hay productos publicados aún.
          </p>
          <p className="text-sm text-ink-muted mt-2">
            {products.length === 0
              ? "El catálogo está vacío. Vuelve pronto."
              : "Intenta ajustar los filtros de búsqueda."}
          </p>
        </div>
      ) : (
        <ProductGrid products={paginatedProducts} />
      )}
    </div>
  );
}
