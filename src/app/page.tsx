import { Suspense } from "react";
import { CatalogServer } from "./page-server";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/header";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_SKELETON_COUNT = 12;

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Header isLoggedIn={!!user} />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Suspense
          fallback={
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: DEFAULT_SKELETON_COUNT }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <CatalogServer />
        </Suspense>
      </main>
    </>
  );
}
