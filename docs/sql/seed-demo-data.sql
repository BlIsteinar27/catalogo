-- Seeder de datos demo para catálogo
-- 6 categorías que cubren diferentes nichos de negocio
-- 21 productos con precios en USD
-- Ejecutar en Supabase SQL Editor después de setup.sql

-- ============================================
-- CATEGORÍAS (6 nichos de negocio diferentes)
-- ============================================
INSERT INTO public.categories (name) VALUES
  ('Combos de Ingredientes'),      -- Para negocios de comida/restaurantes
  ('Ropa y Accesorios'),            -- Tiendas de ropa
  ('Electrónica y Tecnología'),    -- Electrónica
  ('Ferretería y Herramientas'),    -- Ferreterías
  ('Alimentos y Despensa'),         -- Bodegones
  ('Materiales de Construcción')   -- Materiales de construcción
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- PRODUCTOS (21 productos distribuidos)
-- ============================================

-- Combos de Ingredientes (4 productos)
INSERT INTO public.products (name, description, price_usd, price_eur, category, in_stock) VALUES
  ('Combo Perros Calientes Premium', 'Incluye: 10 panes para perro, 500g salchicha premium, 200g salsa tártara, 100g mostaza, 50g cebolla picada, 50g tomate picado. Suficiente para 10 perros completos.', 12.50, 11.50, 'Combos de Ingredientes', true),
  ('Combo Hamburguesas Clásicas', 'Incluye: 8 panes de hamburguesa, 600g carne molida premium, 200g queso cheddar, 150g lechuga, 100g tomate, 100g cebolla, 80g ketchup, 80g mostaza. Para 8 hamburguesas completas.', 18.00, 16.50, 'Combos de Ingredientes', true),
  ('Combo Pizza Casera', 'Incluye: 4 masas de pizza pre-cocidas, 400g salsa de tomate, 300g mozzarella, 100g pepperoni, 80g champiñones, 60g aceitunas. Para 4 pizzas medianas.', 15.00, 13.80, 'Combos de Ingredientes', true),
  ('Combo Tacos Mexicanos', 'Incluye: 12 tortillas de maíz, 400g carne asada, 200g guacamole, 150g pico de gallo, 100g crema, 80g queso cotija. Para 12 tacos.', 14.00, 12.90, 'Combos de Ingredientes', true);

-- Ropa y Accesorios (4 productos)
INSERT INTO public.products (name, description, price_usd, price_eur, category, in_stock) VALUES
  ('Camiseta Básica Algodón Premium', 'Camiseta 100% algodón premium, corte moderno, disponible en tallas S, M, L, XL. Lavable a máquina, no encoge.', 8.99, 8.30, 'Ropa y Accesorios', true),
  ('Pantalón Jeans Clásico', 'Jeans de corte recto, denim resistente, 5 bolsillos, cierre metálico duradero. Tallas 28-36.', 24.99, 23.00, 'Ropa y Accesorios', true),
  ('Zapatillas Urbanas Ligeras', 'Zapatillas para uso diario, suela acolchada, transpirables, ideales para caminar largas distancias. Tallas 35-44.', 35.00, 32.20, 'Ropa y Accesorios', true),
  ('Gorra Básica Ajustable', 'Gorra de algodón con cierre ajustable, diseño clásico, disponible en negro, blanco, gris y azul.', 7.50, 6.90, 'Ropa y Accesorios', true);

-- Electrónica y Tecnología (3 productos)
INSERT INTO public.products (name, description, price_usd, price_eur, category, in_stock) VALUES
  ('Auriculares Bluetooth Inalámbricos', 'Auriculares con cancelación de ruido, 20 horas de batería, micrófono integrado, carga USB-C.', 29.99, 27.60, 'Electrónica y Tecnología', true),
  ('Cargador Rápido USB-C 20W', 'Cargador rápido compatible con iOS y Android, protección contra sobrecarga, diseño compacto.', 12.99, 11.90, 'Electrónica y Tecnología', true),
  ('Power Bank 10000mAh', 'Batería externa compacta, 2 puertos USB, carga rápida, indicador LED de nivel, ideal para viajes.', 22.50, 20.70, 'Electrónica y Tecnología', true);

-- Ferretería y Herramientas (4 productos)
INSERT INTO public.products (name, description, price_usd, price_eur, category, in_stock) VALUES
  ('Kit Herramientas Básicas 12 Piezas', 'Incluye: destornilladores Phillips y plano, alicates, martillo, cinta métrica, llaves ajustables, nivel, todo en maletín organizador.', 45.00, 41.40, 'Ferretería y Herramientas', true),
  ('Taladro Percutor 18V', 'Taladro inalámbrico con batería recargable, 2 velocidades, luz LED, maletín de transporte, bits incluidos.', 89.99, 82.80, 'Ferretería y Herramientas', true),
  ('Set Llaves Mixtas 8 Piezas', 'Llaves combinadas (extremo abierto y de caja) en tamaños 6mm-13mm, cromo vanadio, resistencia industrial.', 28.00, 25.80, 'Ferretería y Herramientas', true),
  ('Cinta Métrica 5 Metros', 'Cinta métrica profesional, bloqueo automático, carcasa de goma anti-golpes, marca de fracción.', 7.99, 7.35, 'Ferretería y Herramientas', true);

-- Alimentos y Despensa (3 productos)
INSERT INTO public.products (name, description, price_usd, price_eur, category, in_stock) VALUES
  ('Arroz Premium 5kg', 'Arroz de grano largo, cosecha reciente, envasado al vacío, ideal para consumo familiar.', 8.50, 7.80, 'Alimentos y Despensa', true),
  ('Aceite Vegetal 3L', 'Aceite vegetal rico en omega-3, certificado sin transgénicos, botella PET reciclable.', 11.99, 11.00, 'Alimentos y Despensa', true),
  ('Pasta de Tomate 500g', 'Pasta de tomate 100% natural, sin conservantes, ideal para salsas y guisos.', 2.50, 2.30, 'Alimentos y Despensa', true);

-- Materiales de Construcción (3 productos)
INSERT INTO public.products (name, description, price_usd, price_eur, category, in_stock) VALUES
  ('Cemento Portland 50kg', 'Cemento de alta resistencia para construcción general, adherencia superior, curado rápido.', 12.00, 11.00, 'Materiales de Construcción', true),
  ('Ladrillo Cerámico x100', 'Ladrillos cerámicos estándar 20x10x5cm, para muros y divisiones, alta durabilidad.', 45.00, 41.40, 'Materiales de Construcción', true),
  ('Varilla Corrugada 1/2" x6m', 'Varilla de acero corrugado para refuerzo estructural, certificación ISO, alta resistencia a tensión.', 8.50, 7.80, 'Materiales de Construcción', true);

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Verificar categorías creadas
SELECT 'Categorías creadas:' as info;
SELECT * FROM public.categories ORDER BY name;

-- Verificar productos creados
SELECT 'Productos creados:' as info;
SELECT 
  p.name,
  p.description,
  p.price_usd,
  p.category,
  c.name as category_name,
  p.in_stock
FROM public.products p
LEFT JOIN public.categories c ON p.category = c.name
ORDER BY c.name, p.name;

-- Contar productos por categoría
SELECT 'Distribución de productos:' as info;
SELECT 
  c.name as category,
  COUNT(p.id) as product_count
FROM public.categories c
LEFT JOIN public.products p ON c.name = p.category
GROUP BY c.name
ORDER BY c.name;
