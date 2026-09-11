# Catálogo de Productos

Catálogo de e-commerce con panel administrativo, diseñado para pequeñas y medianas empresas.

**Diseño**: Interfaz híbrida editorial + glassmorphism con minimalismo cálido, tipografía distintiva, espacios generosos y efectos de vidrio esmerilado en elementos flotantes.

---

## Stack Tecnológico

- **Next.js 16**: Framework de React con App Router
- **React 19**: Biblioteca de UI con React Compiler
- **TypeScript**: Tipado estático
- **Supabase**: Backend as a Service (base de datos, auth, storage)
- **Tailwind CSS 4**: Framework de CSS utility-first
- **Motion**: Biblioteca de animaciones para React
- **Lucide React**: Iconos
- **SweetAlert2**: Alertas modales personalizadas

## Arquitectura Multi-Agent

Este proyecto utiliza una arquitectura de agentes especializados coordinados por un orchestrator:

- **root/orchestrator**: Coordinador global
- **frontend-engineer**: Componentes React/Next.js, Tailwind y Motion
- **backend-engineer**: Server actions, Supabase, auth y storage

Para más detalles, consulta [AGENTS.md](./AGENTS.md).

---

## Características Principales

### Catálogo Público

- Navegación por categorías con chips animados
- Búsqueda en tiempo real por nombre, descripción y categoría
- Filtro de rango de precios con track visual
- Ordenamiento por nombre, precio y fecha
- Paginación con 12 productos por página
- Grid responsive de 2 a 4 columnas
- Vista de detalle de producto con zoom de imagen
- Badge "Nuevo" para productos recientes (7 días)
- Indicadores de disponibilidad

### Carrito de Compras

- Botón flotante con contador animado
- Drawer lateral glass con lista de ítems
- Incrementar, decrementar y eliminar ítems
- Persistencia en localStorage
- Checkout automático a WhatsApp
- Mensaje pre-formateado con ítems y total

### Panel Administrativo

- Autenticación con magic link (sin contraseña)
- CRUD completo de productos
- Gestión de categorías
- Subida de imágenes a Supabase Storage
- Validación de tipos y tamaños
- Tabla responsive (desktop/mobile)
- Protección de rutas con RLS

### Sistema de Monedas

- Toggle entre USD y EUR
- Visualización dual de precios
- Conversión automática en carrito
- Badge de moneda activa en header

## Configuración Inicial

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd catalogo
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Supabase

Crea un proyecto en [Supabase](https://supabase.com) y ejecuta el script SQL:

```bash
# Ejecuta el contenido de docs/sql/setup.sql en el SQL Editor de Supabase
```

Este script crea:

- Tabla `products` con datos de producto
- Tabla `categories` con relación FK
- Bucket `product-images` para almacenamiento
- Políticas RLS para seguridad
- Índices para rendimiento

### 4. Configurar variables de entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
NEXT_PUBLIC_SITE_URL=tu_url_de_produccion
NEXT_PUBLIC_WHATSAPP_NUMBER=tu_numero_whatsapp
NEXT_PUBLIC_DEFAULT_CURRENCY=USD
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
CRON_SECRET=token_secreto
```

---

## Ejecutar el Proyecto

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Producción

```bash
npm run build
npm start
```

---

## Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── api/               # API routes (keepalive, auth callback)
│   ├── dashboard/         # Panel administrativo protegido
│   ├── login/             # Página de login
│   ├── producto/          # Detalle de producto
│   └── page.tsx           # Página principal del catálogo
├── components/            # Componentes React
│   ├── cart/              # Sistema de carrito
│   ├── catalog/           # Componentes del catálogo
│   ├── dashboard/         # Componentes del dashboard
│   ├── layout/            # Layout compartidos
│   └── ui/                # Componentes base reutilizables
├── lib/                   # Utilidades y helpers
│   ├── supabase/          # Cliente de Supabase
│   ├── auth.ts            # Helpers de autenticación
│   ├── utils.ts           # Funciones utilitarias
│   └── validations.ts     # Validaciones de schema
├── server/                # Server actions
│   ├── auth.ts            # Acciones de autenticación
│   ├── cache.ts           # Helpers de revalidación
│   ├── categories.ts      # Acciones de categorías
│   ├── products.admin.ts  # CRUD de productos
│   └── products.public.ts # Lectura pública de productos
└── proxy.ts               # Middleware de protección de rutas
```

---

## Patrones de Desarrollo

### Separación Server/Client

- `-server.tsx`: Componentes de servidor (data fetching, lógica de servidor)
- `-client.tsx`: Componentes de cliente (interactividad, estado)
- `page.tsx`: Punto de entrada con Suspense

### Manejo de Errores

- Usa el tipo `ActionResult<T>` para server actions
- Implementa bloques try-catch apropiados
- Retorna mensajes de error amigables
- Logging centralizado sin exponer secrets

### Estilos

- Usa Tailwind CSS v4 con sistema `@theme` para design tokens
- **Diseño híbrido editorial + glassmorphism**:
  - Minimalismo cálido con tipografía distintiva (DM Sans + Fraunces)
  - Espacios generosos y producto-first
  - Efectos glass sutiles en elementos flotantes (header, dropdowns, drawer)
  - Sombras refinadas (`shadow-glass`, `shadow-glass-lg`) para profundidad
  - Textura de ruido sutil en el fondo para calidez
- **Sistema de tokens**:
  - `--color-glass`: Superficies translúcidas (rgba(255, 255, 255, 0.72))
  - `--color-glass-border`: Bordes sutiles (rgba(0, 0, 0, 0.06))
  - `--shadow-glass`: Sombras para elementos glass
  - `--shadow-glass-lg`: Sombras más pronunciadas para elementos elevados
- **Animaciones con Motion**:
  - Microinteracciones (hover, tap, scale)
  - Transiciones suaves con spring physics
  - Animaciones escalonadas (stagger) para listas
  - AnimatePresence para entradas/salidas
  - Layout animations para cambios de posición
- **Diseño responsive mobile-first**
- **Accesibilidad**: Focus states claros, ARIA attributes, contraste WCAG

### Base de Datos

- Usa Supabase para todas las operaciones de datos
- Implementa políticas RLS para seguridad
- Agrega índices para rendimiento
- Revalidación de caché tras mutations

### Autenticación y Protección de Rutas

- **Magic Link**: Autenticación basada en email con magic links (sin contraseña)
- **Header dinámico**: Muestra "Dashboard" cuando el usuario está autenticado, "Iniciar sesión" cuando no
- **Protección de rutas**: El dashboard (`/dashboard` y subrutas) está protegido por `src/proxy.ts` y `requireAuth()` en `src/lib/auth.ts`
- **Validación en server actions**: Las mutaciones de datos verifican sesión antes de ejecutarse
- **Redirección automática**: Usuarios no autenticados que intentan acceder al dashboard son redirigidos a `/login`
- **Callback seguro**: `api/auth/callback` valida el parámetro `next` para evitar redirecciones abiertas

### Sistema de Filtros del Catálogo

- **Filtro de precio inteligente**:
  - Inputs vacíos por defecto (interacción explícita del usuario)
  - Rango limitado dinámicamente a precios reales del catálogo
  - No persiste en localStorage (reset al recargar)
  - Track visual muestra rango completo o seleccionado
  - Indicadores de moneda ($/€) para claridad inmediata
- **Filtro de categoría**: Chips con animaciones glass y layoutId
- **Barra de búsqueda**: Filtrado en tiempo real con iconos animados
- **Ordenamiento**: Dropdown glass con animación de chevron
- **Contador de resultados**: Muestra productos que coinciden con filtros

---

## Seguridad

- Validación de UUIDs, redirecciones y nombres de archivo
- Uso de `service role key` solo en server actions controlados
- Políticas RLS para lectura pública y mutaciones autenticadas
- Protección contra redirecciones abiertas en auth callback
- Validación de tipos y tamaños en subida de imágenes
- Sanitización de inputs en server actions

---

## Mejoras Recientes

- **Categorías antes de mutaciones**: `createProduct` y `updateProduct` aseguran la categoría antes del insert/update
- **Eliminación segura de imágenes**: `deleteProduct` borra la imagen solo después de eliminar el producto
- **Middleware modernizado**: `src/proxy.ts` sigue la convención de Next.js 16
- **Redirección segura**: `api/auth/callback` valida el parámetro `next`
- **Revalidación centralizada**: `src/server/cache.ts` agrupa llamadas a `revalidatePath`
- **Hydration robusto**: `useMounted` usa `useSyncExternalStore`
- **ImageZoom accesible**: Trampa de foco, manejo de Escape, restauración de foco
- **PriceFilter optimizado**: Sin efectos innecesarios, estado derivado en render

---

## Scripts Disponibles

- `npm run dev`: Inicia servidor de desarrollo
- `npm run build`: Construye para producción
- `npm start`: Inicia servidor de producción
- `npm run lint`: Ejecuta ESLint

---

## Deployment

El despliegue recomendado es en [Vercel](https://vercel.com):

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

Para despliegues múltiples (por cliente), consulta [docs/FLUJO_CLONACION.md](./docs/FLUJO_CLONACION.md).

---

## Documentación Adicional

- [AGENTS.md](./AGENTS.md): Arquitectura multi-agent del proyecto
- [docs/caracteristicas-catalogo.md](./docs/caracteristicas-catalogo.md): Inventario completo de funcionalidades
- [docs/FLUJO_CLONACION.md](./docs/FLUJO_CLONACION.md): Guía de clonación para nuevos clientes
- [docs/sql/setup.sql](./docs/sql/setup.sql): Script de configuración de base de datos

---

## Recursos

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de Motion](https://motion.dev)
