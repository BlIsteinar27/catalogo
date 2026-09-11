import { notFound } from "next/navigation";
import { getProductById } from "@/server/products.public";
import { Header } from "@/components/layout/header";
import { createClient } from "@/lib/supabase/server";
import { ProductDetailClient } from "./page-client";

export async function ProductDetailServer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [
    product,
    {
      data: { user },
    },
  ] = await Promise.all([
    getProductById(id),
    (await createClient()).auth.getUser(),
  ]);
  if (!product) notFound();
  return (
    <>
      <Header isLoggedIn={!!user} />
      <ProductDetailClient product={product} />
    </>
  );
}
