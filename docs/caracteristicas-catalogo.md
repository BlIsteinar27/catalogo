# Características del Catálogo

Inventario completo de funcionalidades y stack técnico para presupuesto del proyecto.

---

## Resume el alcance del producto

Catálogo de e-commerce público con panel administrativo privado.

Los visitantes pueden explorar productos, filtrar, ordenar, agregar al carrito y solicitar pedido por WhatsApp.

El administrador gestiona productos, categorías e imágenes mediante autenticación con magic link.

---

## Navega el catálogo público

Página de inicio con listado paginado de 12 productos por página.

Filtro por categorías mediante chips animados con `layoutId`.

Barra de búsqueda en tiempo real por nombre, descripción y categoría, con icono animado y botón de limpiar.

Filtro de rango de precios con inputs mínimo/máximo, badge de moneda y track visual animado.

Ordenamiento por nombre A-Z/Z-A, precio ascendente/descendente y más recientes.

Paginación con controles anterior/siguiente y contador de resultados.

Grid responsive de 2 a 4 columnas según breakpoint.

---

## Explora el detalle de producto

Página individual `/producto/[id]` con imagen, nombre, descripción, categoría, precio y stock.

Zoom de imagen en overlay con animaciones de entrada/salida y foco accesible.

Visualización dual de precio: moneda activa destacada y moneda alternativa secundaria.

Indicadores de disponibilidad y badge "Nuevo" para productos creados en los últimos 7 días.

Botón para compartir producto vía Web Share API o copiar al portapapeles.

CTA sticky en mobile y botón desktop para agregar al carrito, con estados hover/tap animados.

---

## Gestiona el carrito de compras

Botón flotante con contador animado y badge de cantidad.

Drawer lateral glass con lista de ítems, cantidades, total y botón de pedido por WhatsApp.

Incrementar, decrementar, eliminar ítems individuales y vaciar carrito completo.

Persistencia del carrito en `localStorage` con validación de schema y recuperación ante datos corruptos.

Generación automática de mensaje de WhatsApp con ítems, cantidades y total en moneda seleccionada.

Trampa de foco, cierre con Escape y restauración de foco para accesibilidad.

El carrito se oculta en rutas privadas (`/dashboard`, `/login`) para evitar contexto incorrecto.

---

## Administra productos y categorías

CRUD completo de productos desde `/dashboard`: listado, crear, editar y eliminar.

Formulario de producto con nombre, descripción, precios USD/EUR, categoría, stock e imagen.

Selector de categoría existente o creación de categoría nueva inline.

Subida de imágenes a Supabase Storage con validación de tipo, extensión y tamaño máximo de 10 MB.

Eliminación de imagen huérfana al actualizar o borrar un producto.

Tabla de productos responsive con vista desktop y tarjetas mobile.

Gestión de categorías: crear, renombrar y eliminar, con reasignación a "General" al eliminar.

Validaciones de negocio: nombres, descripciones, precios, categorías y archivos.

---

## Accede al panel de control

Autenticación sin contraseña mediante magic link enviado por email.

Protección de rutas `/dashboard/*` mediante `requireAuth`.

Sidebar de navegación con links a productos, nuevo producto y categorías.

Botón de cerrar sesión con redirección automática a `/login`.

Toasts de éxito y error para feedback de operaciones.

---

## Usa la base de datos y storage

Base de datos en Supabase con dos tablas principales: `products` y `categories`.

Tabla `products` con UUID, nombre, descripción, precios USD/EUR, imagen, categoría, stock y timestamps.

Tabla `categories` con nombre como clave natural y relación FK desde productos con cascade.

Bucket público `product-images` en Supabase Storage para archivos de producto.

Políticas RLS para lectura pública y mutaciones solo por usuarios autenticados.

Índices en categoría, stock y fecha de creación para rendimiento.

Revalidación de caché Next.js tras creación, edición, eliminación y cambios de categoría.

---

## Aprovecha el diseño y la experiencia

Diseño híbrido editorial + glassmorphism con tipografía DM Sans y Fraunces.

Sistema de tokens CSS personalizado para colores, superficies glass, bordes y sombras.

Animaciones con Motion: microinteracciones, stagger lists, AnimatePresence, springs y layout transitions.

Responsive mobile-first con breakpoints para sm, md y lg.

Accesibilidad: focus rings visibles, atributos ARIA, manejo de foco en modales y drawer, contraste cuidado.

Skeletons y estados de carga en catálogo, detalle y dashboard.

---

## Despliega en infraestructura serverless

Aplicación Next.js 16 con App Router, React 19 y React Compiler activado.

TypeScript en todo el proyecto.

Tailwind CSS 4 con configuración `@theme` y PostCSS.

Despliegue en Vercel con `next build`.

Server actions para mutations, server components para data fetching y client components para interactividad.

Separación de archivos `-server.tsx` y `-client.tsx` para claridad de responsabilidades.

API route `/api/keepalive` para ping periódico a Supabase con protección por `CRON_SECRET`.

---

## Mantén la seguridad y calidad

Validación de UUIDs, redirecciones y nombres de archivo en server actions.

Uso de `service role key` solo para operaciones de storage controladas por server actions.

Logging centralizado de errores y advertencias sin exponer secrets.

ESLint con `eslint-config-next` para calidad de código.

Cache components habilitado y revalidación selectiva de paths.

Manejo de errores con `ActionResult<T>` y mensajes amigables para el usuario.
