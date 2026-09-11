-- Script para truncar toda la base de datos
-- ⚠️ ADVERTENCIA: Este script eliminará TODOS los datos
-- - Trunca tablas products y categories
-- - Vacía el bucket product-images
-- Ejecutar en Supabase SQL Editor

-- ============================================
-- TRUNCAR TABLA PRODUCTS
-- ============================================
TRUNCATE TABLE public.products CASCADE;

-- ============================================
-- TRUNCAR TABLA CATEGORIES
-- ============================================
TRUNCATE TABLE public.categories CASCADE;

-- ============================================
-- VACIAR BUCKET PRODUCT-IMAGES
-- ============================================
-- Eliminar todos los objetos del bucket product-images
DELETE FROM storage.objects
WHERE bucket_id = 'product-images';

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Verificar que las tablas estén vacías
SELECT 'Productos en tabla (debe ser 0):' as info;
SELECT COUNT(*) as count FROM public.products;

SELECT 'Categorías en tabla (debe ser 0):' as info;
SELECT * FROM public.categories;

SELECT 'Archivos en bucket product-images (debe ser 0):' as info;
SELECT COUNT(*) as count FROM storage.objects WHERE bucket_id = 'product-images';

-- ============================================
-- ESTADO LIMPIO CONFIRMADO
-- ============================================
SELECT '✓ Base de datos truncada exitosamente' as status;
SELECT '✓ Bucket product-images vaciado' as status;
