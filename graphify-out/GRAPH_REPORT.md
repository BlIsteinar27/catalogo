# Graph Report - demo-catalogo  (2026-08-21)

## Corpus Check
- 112 files · ~39,117 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 720 nodes · 1113 edges · 40 communities (34 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5b4ffe3a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- types.ts
- Reporte de Bug: Botón de Cerrar en ImageZoom No Responde Consistentemente
- devDependencies
- app/page-client.tsx
- Catálogo de Productos
- dependencies
- Problema del Filtro de Rango de Precios - Contexto Completo
- product-form.tsx
- createClient
- compilerOptions
- Instrucciones de Implementación
- skeleton.tsx
- toast.tsx
- Catalogo — AI Agent Context
- Devin Rule Creator
- Flujo de Clonación por Cliente
- Frontend Engineer Agent
- Project Quality Guardrails
- Backend Engineer Agent
- Instrucciones de Ejecución
- Características del Catálogo
- After Action Review (AAR)
- Secure Product CRUD
- Coding Standards
- API Design
- Core Reasoning & Execution
- React Component Conventions
- Release Checklist
- Component Guidelines
- proxy.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- vercel.json
- SweetAlert2 Avanzado
- SweetAlert2 Básico
- SweetAlert2 con React

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 30 edges
2. `Product` - 16 edges
3. `cn()` - 16 edges
4. `compilerOptions` - 16 edges
5. `formatCurrency()` - 15 edges
6. `getCurrentUser()` - 14 edges
7. `formatPrice()` - 14 edges
8. `Frontend Engineer Agent` - 14 edges
9. `Catalogo — AI Agent Context` - 14 edges
10. `Backend Engineer Agent` - 13 edges

## Surprising Connections (you probably didn't know these)
- `EditProductServer()` --calls--> `getProductById()`  [EXTRACTED]
  src/app/dashboard/editar/[id]/page-server.tsx → src/server/products.public.ts
- `DashboardClient()` --calls--> `formatCurrency()`  [EXTRACTED]
  src/app/dashboard/page-client.tsx → src/lib/utils.ts
- `DashboardClient()` --calls--> `deleteProduct()`  [EXTRACTED]
  src/app/dashboard/page-client.tsx → src/server/products.admin.ts
- `DashboardServer()` --calls--> `getProducts()`  [EXTRACTED]
  src/app/dashboard/page-server.tsx → src/server/products.public.ts
- `CatalogClient()` --calls--> `formatPrice()`  [EXTRACTED]
  src/app/page-client.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (40 total, 6 thin omitted)

### Community 0 - "types.ts"
Cohesion: 0.06
Nodes (54): dmSans, fraunces, metadata, pageVariants, ProductDetailClient(), sectionVariants, CartButton(), CartDrawer() (+46 more)

### Community 1 - "Reporte de Bug: Botón de Cerrar en ImageZoom No Responde Consistentemente"
Cohesion: 0.06
Nodes (30): 1. Timeouts en Focus Management, 2. Múltiples onClick Handlers, 3. stopPropagation en Imagen, 4. Complejidad de Trampa de Foco, 5. Estructura del Overlay, Animaciones Activas, Análisis Comparativo de Componentes, Archivos Relacionados (+22 more)

### Community 2 - "devDependencies"
Cohesion: 0.07
Nodes (27): babel-plugin-react-compiler, eslint, eslint-config-next, devDependencies, babel-plugin-react-compiler, eslint, eslint-config-next, tailwindcss (+19 more)

### Community 3 - "app/page-client.tsx"
Cohesion: 0.13
Nodes (15): CatalogClient(), CategoryFilter(), CategoryFilterProps, PriceFilter(), PriceFilterProps, MotionSearch, MotionX, SearchBar() (+7 more)

### Community 4 - "Catálogo de Productos"
Cohesion: 0.05
Nodes (36): Agent Guardrails, Agent Registry, Bug Fix, Common Workflows, Decision Rules, Feature, Key Patterns, Manager Surface (+28 more)

### Community 5 - "dependencies"
Cohesion: 0.10
Nodes (21): clsx, lucide-react, motion, next, dependencies, clsx, lucide-react, motion (+13 more)

### Community 6 - "Problema del Filtro de Rango de Precios - Contexto Completo"
Cohesion: 0.07
Nodes (27): 1. Edición Completamente Libre, 1. Validación Restrictiva Basada en Precios del Catálogo, 2. Sin Validación Intrusiva, 2. Validación Intrusiva en onBlur, 3. Comportamiento Natural al Vaciar, 3. Valores por Defecto Incoherentes, 4. Rango de Precios Lógico, 5. Filtrado Pasivo (+19 more)

### Community 7 - "product-form.tsx"
Cohesion: 0.06
Nodes (37): CategoryStats, EditProductServer(), DashboardClient(), LoginClient(), Mode, MotionLink, CategoryManager(), CategoryManagerProps (+29 more)

### Community 8 - "createClient"
Cohesion: 0.08
Nodes (51): GET(), validateRedirect(), GET(), DashboardLayout(), HomePage(), CatalogServer(), ProductDetailServer(), ImageUpload() (+43 more)

### Community 9 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 10 - "Instrucciones de Implementación"
Cohesion: 0.10
Nodes (19): 1. Reestructurar el DOM del overlay, 2. Cambiar el botón de cerrar a `<button>` normal, 3. Eliminar `stopPropagation` de la imagen, 4. Simplificar el focus management, 5. Simplificar la trampa de foco, 6. Mantener la API del componente, 7. Preservar el trigger original, 8. Preservar el comportamiento de la imagen ampliada (+11 more)

### Community 11 - "skeleton.tsx"
Cohesion: 0.15
Nodes (7): CategoriesClient(), CategoriesServer(), DashboardServer(), ProductCardSkeleton(), Skeleton(), getCategoryListWithProductCount(), getCategoryStats()

### Community 12 - "toast.tsx"
Cohesion: 0.29
Nodes (5): Toast, ToastContext, ToastContextType, ToastProvider(), ToastType

### Community 13 - "Catalogo — AI Agent Context"
Cohesion: 0.09
Nodes (22): Admin dashboard (`/dashboard`), Agent Working Rules, Architecture Map, Auth & security, Cart (client-only), Catalogo — AI Agent Context, Commands, Core Abstractions (graph hubs) (+14 more)

### Community 14 - "Devin Rule Creator"
Cohesion: 0.11
Nodes (18): 1. Rule formats and locations, 2. Rule frontmatter, 3. Writing rules, 4. AGENTS.md format, 5. Creation workflow, 6. Output templates, 7. Examples, 8. Common mistakes to avoid (+10 more)

### Community 15 - "Flujo de Clonación por Cliente"
Cohesion: 0.11
Nodes (18): 1. GitHub: Crear repositorio para el cliente, 2. Supabase: Crear proyecto y ejecutar setup, 3. Vercel: Importar y configurar, 4. Auth: Registrar usuario admin, 5. Entrega al cliente, Checklist de Calidad Antes de Entrega, Día 1: Verificación, Día 7+: Handoff completo (+10 more)

### Community 17 - "Frontend Engineer Agent"
Cohesion: 0.13
Nodes (14): Accessibility, Architecture Rules, Component Rules, Currency & Catalog, File Structure, Forms & Interactions, Frontend Engineer Agent, Gotchas (+6 more)

### Community 18 - "Project Quality Guardrails"
Cohesion: 0.13
Nodes (14): After Action Review, Component & Logic Checks, Core Principles, File Uploads / Storage (`src/server/storage.ts`), Output Format, Plan Creation Checklist, Project Quality Guardrails, Redirects (`src/app/api/auth/callback/route.ts`) (+6 more)

### Community 19 - "Backend Engineer Agent"
Cohesion: 0.14
Nodes (13): Auth & Security, Backend Engineer Agent, Category Rules, File Structure, Gotchas, Product CRUD Rules, Role, Server Action Rules (+5 more)

### Community 21 - "Instrucciones de Ejecución"
Cohesion: 0.15
Nodes (12): 1. Variables de Tema Centralizadas, 2. Página de Ayuda en el Dashboard, 3. Edición Rápida de Precios desde el Listado, 4. Feature Flag para Reactivar Dual Currency, 5. Analytics Básico de Visitas, 6. Modo "Mantenimiento" o "Pausa", 7. Exportar Productos a CSV, Contexto del Proyecto (+4 more)

### Community 22 - "Características del Catálogo"
Cohesion: 0.17
Nodes (11): Accede al panel de control, Administra productos y categorías, Aprovecha el diseño y la experiencia, Características del Catálogo, Despliega en infraestructura serverless, Explora el detalle de producto, Gestiona el carrito de compras, Mantén la seguridad y calidad (+3 more)

### Community 26 - "After Action Review (AAR)"
Cohesion: 0.18
Nodes (10): 1. Intención — What was supposed to happen?, 2. Realidad — What actually happened?, 3. Causalidad — Why did it happen?, 4. Acción — What will we do differently?, After Action Review (AAR), Example, Output Format, Rules (+2 more)

### Community 28 - "Secure Product CRUD"
Cohesion: 0.29
Nodes (6): Auth Model, Product CRUD Edge Cases, Protected Surfaces, Quick Checklist, Secure Product CRUD, Server/Client Split

### Community 29 - "Coding Standards"
Cohesion: 0.40
Nodes (4): Code Style, Coding Standards, Error Handling, TypeScript

### Community 30 - "API Design"
Cohesion: 0.40
Nodes (4): API Design, Response Format, Security, Validation

### Community 31 - "Core Reasoning & Execution"
Cohesion: 0.50
Nodes (3): Core Reasoning & Execution, Execution Loop, Quality

### Community 32 - "React Component Conventions"
Cohesion: 0.50
Nodes (3): Component Rules, File Structure, React Component Conventions

### Community 33 - "Release Checklist"
Cohesion: 0.50
Nodes (3): Deployment, Pre-release, Release Checklist

### Community 44 - "SweetAlert2 Avanzado"
Cohesion: 0.06
Nodes (30): Alerta con Async/Await, Async en preConfirm, Custom CSS, Custom Timer, Custom Width y Padding, Customización de Apariencia, Eventos, Footer (+22 more)

### Community 45 - "SweetAlert2 Básico"
Cohesion: 0.09
Nodes (22): Alerta Simple, Configuración Básica de Botones, Confirmación Básica, Confirmación con dos botones, Confirmación con promesa, Error Básico, Error con detalle, Error (Error) (+14 more)

### Community 46 - "SweetAlert2 con React"
Cohesion: 0.11
Nodes (18): Componente con Server Actions (usando el helper del proyecto), Componente con Server Actions (usando Swal directamente), Configuración Básica, Contexto de React con SweetAlert, Hook Personalizado para Alertas (usando el helper del proyecto), HTML en Contenido, Instalación, Integración con HTML en Alertas (+10 more)

## Knowledge Gaps
- **385 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+380 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `skeleton.tsx`, `product-form.tsx`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `Product` connect `types.ts` to `createClient`, `app/page-client.tsx`, `product-form.tsx`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `cn()` connect `product-form.tsx` to `createClient`, `types.ts`, `app/page-client.tsx`, `skeleton.tsx`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _385 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05960705960705961 - nodes in this community are weakly interconnected._
- **Should `Reporte de Bug: Botón de Cerrar en ImageZoom No Responde Consistentemente` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._