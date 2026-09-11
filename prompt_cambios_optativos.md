# Prompt: Cambios Optativos — Template Catálogo Clonable

> Pásale este prompt a tu agente de IA DESPUÉS de haber ejecutado Cambios Críticos e Importantes, y de haber cerrado al menos 1 venta. Estos cambios mejoran el producto pero NO bloquean la venta inicial.

## Contexto del Proyecto

E-commerce product catalog en Next.js 16 + Supabase + Vercel. El template ya es funcional para el cliente no técnico (auth por password, USD único, formulario simplificado, checkout a WhatsApp). Ahora se busca agregar valor diferencial para justificar precios mayores ($80+) o reducir soporte a largo plazo.

---

## Instrucciones de Ejecución

### 1. Variables de Tema Centralizadas

**Qué hacer:**
- Agrupar colores primarios, secundarios, fondos y glassmorphism en un solo archivo de configuración CSS o TS.
- Permitir cambiar el color de marca del negocio editando 3-5 variables, no buscando en 15 archivos.

**Implementación sugerida:**
- En `src/app/globals.css` o nuevo `src/styles/theme.css`, definir:
  ```css
  :root {
    --brand-primary: #0f172a;
    --brand-accent: #3b82f6;
    --glass-bg: rgba(255, 255, 255, 0.1);
    --glass-border: rgba(255, 255, 255, 0.2);
  }
  ```
- Reemplazar todos los colores hardcodeados en componentes por `var(--brand-primary)`, etc.
- Documentar en `docs/THEME.md` cómo cambiar el color de marca.

**Archivos a modificar:**
- `src/app/globals.css`
- Componentes con colores hardcodeados (header, buttons, badges)
- `docs/THEME.md` (nuevo)

**Criterio de aceptación:**
- Cambiar `--brand-primary` en un solo archivo cambia el color dominante de TODO el sitio.

---

### 2. Página de Ayuda en el Dashboard

**Qué hacer:**
- Crear ruta `/dashboard/ayuda` accesible desde el sidebar.
- Contenido en 3 secciones con screenshots o ilustraciones simples:
  1. **"Cómo agregar un producto"** — paso a paso con screenshots del panel.
  2. **"Cómo cambiar el logo o nombre del negocio"** — explicar variables de entorno (o si ya es editable desde el dashboard, mostrar dónde).
  3. **"Cómo actualizar precios"** — mostrar edición rápida desde el listado de productos.
- Usar lenguaje de dueño de negocio, no técnico. Sin mencionar Supabase, Vercel, ni GitHub.

**Archivos a modificar:**
- `src/app/dashboard/ayuda/page.tsx`
- `src/components/layout/sidebar.tsx` — agregar link a Ayuda

**Criterio de aceptación:**
- Un cliente puede resolver dudas básicas sin escribirte.

---

### 3. Edición Rápida de Precios desde el Listado

**Qué hacer:**
- En la tabla/lista de productos del dashboard (`/dashboard`), agregar un botón de edición inline o un modal rápido para cambiar solo el precio sin entrar a la página completa de edición.
- Esto es útil para negocios que ajustan precios frecuentemente (ej. ferreterías con variación del dólar).

**Archivos a modificar:**
- `src/components/dashboard/product-table.tsx` o lista de productos
- `src/server/products.admin.ts` — agregar server action `updateProductPrice(id, price)`

**Criterio de aceptación:**
- Cambiar precio de un producto toma <10 segundos desde el listado.

---

### 4. Feature Flag para Reactivar Dual Currency

**Qué hacer:**
- En lugar de comentar/borrar el código de dual currency, convertirlo en feature flag.
- Variable de entorno: `NEXT_PUBLIC_ENABLE_DUAL_CURRENCY=false` (default).
- Cuando sea `true`, mostrar el toggle USD/EUR y permitir almacenar ambos precios.

**Archivos a modificar:**
- `src/lib/site-config.ts` — leer feature flag
- `src/contexts/currency.tsx` — activar/desactivar según flag
- `src/components/layout/header.tsx` — mostrar toggle condicionalmente

**Criterio de aceptación:**
- Cambiar `NEXT_PUBLIC_ENABLE_DUAL_CURRENCY=true` reactiva EUR sin tocar código.

---

### 5. Analytics Básico de Visitas

**Qué hacer:**
- Integrar Vercel Analytics (gratis, una línea en layout) o Google Analytics 4 (si el cliente lo solicita).
- Mostrar en el dashboard un contador de visitas del catálogo público.
- Alternativa simple: agregar una tabla `page_views` en Supabase y un server action que incremente en cada carga de `/`. Mostrar el total en `/dashboard`.

**Archivos a modificar:**
- `src/app/layout.tsx` — Vercel Analytics script
- O `src/app/page.tsx` — incrementar contador
- `src/app/dashboard/page.tsx` — mostrar visitas

**Criterio de aceptación:**
- El cliente ve cuántas personas visitan su catálogo.

---

### 6. Modo "Mantenimiento" o "Pausa"

**Qué hacer:**
- Variable de entorno `NEXT_PUBLIC_MAINTENANCE_MODE=false`.
- Cuando `true`, el catálogo público muestra un mensaje: *"Catálogo en actualización. Vuelve pronto."* en lugar de productos.
- El dashboard sigue funcionando para que el admin actualice precios sin que los clientes vean productos desactualizados.

**Archivos a modificar:**
- `src/app/page.tsx` — verificar flag antes de renderizar grid
- `.env.example` — documentar variable

**Criterio de aceptación:**
- Activar maintenance mode oculta el catálogo público sin desplegar código nuevo.

---

### 7. Exportar Productos a CSV

**Qué hacer:**
- Botón en el dashboard: "Descargar inventario".
- Exporta todos los productos a CSV con columnas: Nombre, Precio, Categoría, Stock, Descripción.
- Útil para backups o para clientes que quieren llevar control en Excel paralelo.

**Archivos a modificar:**
- `src/app/dashboard/page.tsx` — agregar botón
- `src/server/products.admin.ts` — agregar `exportProductsToCSV()`

**Criterio de aceptación:**
- CSV descargable con un click, formato legible en Excel.

---

## Reglas de Trabajo del Agente

1. **Match existing conventions** — lee archivos circundantes antes de editar.
2. **Minimal diffs** — no refactorices código no relacionado.
3. **No agregar dependencias pesadas** — preferir soluciones nativas o server actions.
4. **Build verification** — ejecutar `npm run build` al final y confirmar éxito.

## Output Esperado

El template evoluciona de "$48 MVP" a "$80+ producto" con:
- Personalización de marca sin tocar código.
- Menos soporte post-venta (ayuda inline, edición rápida).
- Features diferenciadoras (analytics, export CSV, maintenance mode).
