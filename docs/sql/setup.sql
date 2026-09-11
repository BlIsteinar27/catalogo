-- Setup unificado para template clonable de catálogo
-- Ejecutar en Supabase SQL Editor
-- Este script es idempotente (usa IF NOT EXISTS donde es posible)

-- ============================================
-- TABLA CATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS public.categories (
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (name)
);

-- Habilitar RLS para categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para categories
-- Lectura pública
DROP POLICY IF EXISTS "categories_select_public" ON public.categories;
CREATE POLICY "categories_select_public"
  ON public.categories FOR SELECT
  TO anon, authenticated
  USING (true);

-- Solo authenticated puede insertar
DROP POLICY IF EXISTS "categories_insert_auth" ON public.categories;
CREATE POLICY "categories_insert_auth"
  ON public.categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Solo authenticated puede actualizar
DROP POLICY IF EXISTS "categories_update_auth" ON public.categories;
CREATE POLICY "categories_update_auth"
  ON public.categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Solo authenticated puede eliminar
DROP POLICY IF EXISTS "categories_delete_auth" ON public.categories;
CREATE POLICY "categories_delete_auth"
  ON public.categories FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- TABLA PRODUCTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.products (
  id          uuid NOT NULL DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  description text,
  price_usd   numeric NOT NULL CHECK (price_usd > 0::numeric),
  price_eur   numeric NOT NULL CHECK (price_eur > 0::numeric),
  image_url   text,
  category    text NOT NULL,
  in_stock    boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_category_fkey FOREIGN KEY (category) REFERENCES public.categories(name)
);

-- Índices para products
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON public.products (in_stock);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products (created_at DESC);

-- Habilitar RLS para products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para products
-- Lectura pública
DROP POLICY IF EXISTS "products_select_public" ON public.products;
CREATE POLICY "products_select_public"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (true);

-- Solo authenticated puede insertar
DROP POLICY IF EXISTS "products_insert_auth" ON public.products;
CREATE POLICY "products_insert_auth"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Solo authenticated puede actualizar
DROP POLICY IF EXISTS "products_update_auth" ON public.products;
CREATE POLICY "products_update_auth"
  ON public.products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Solo authenticated puede eliminar
DROP POLICY IF EXISTS "products_delete_auth" ON public.products;
CREATE POLICY "products_delete_auth"
  ON public.products FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- STORAGE BUCKET PARA IMÁGENES
-- ============================================
-- Insertar bucket si no existe
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage
-- Lectura pública
DROP POLICY IF EXISTS "product_images_select_public" ON storage.objects;
CREATE POLICY "product_images_select_public"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'product-images');

-- Solo authenticated puede subir
DROP POLICY IF EXISTS "product_images_insert_auth" ON storage.objects;
CREATE POLICY "product_images_insert_auth"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "product_images_update_auth" ON storage.objects;
CREATE POLICY "product_images_update_auth"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images');

-- Solo authenticated puede eliminar
DROP POLICY IF EXISTS "product_images_delete_auth" ON storage.objects;
CREATE POLICY "product_images_delete_auth"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');
