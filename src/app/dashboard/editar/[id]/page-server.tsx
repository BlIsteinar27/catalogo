import { notFound } from "next/navigation";
import { getProductById } from "@/server/products.public";
import { ProductForm } from "@/components/dashboard/product-form";

export async function EditProductServer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Editar producto</h1>
        <p className="text-sm text-ink-muted mt-0.5">{product.name}</p>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
