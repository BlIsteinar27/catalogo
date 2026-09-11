import { ProductForm } from '@/components/dashboard/product-form'

export default function NewProductPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Nuevo producto</h1>
        <p className="text-sm text-ink-muted mt-0.5">Completa los datos del producto</p>
      </div>
      <ProductForm />
    </div>
  )
}
