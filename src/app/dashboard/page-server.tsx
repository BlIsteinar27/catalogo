import { getProducts } from "@/server/products.public";
import { DashboardClient } from "./page-client";

export async function DashboardServer() {
  const products = await getProducts();
  return <DashboardClient products={products} />;
}
