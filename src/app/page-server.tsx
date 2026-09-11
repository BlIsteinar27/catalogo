import { getProducts, getCategories } from "@/server/products.public";
import { CatalogClient } from "./page-client";

export async function CatalogServer() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  return <CatalogClient products={products} categories={categories} />;
}
