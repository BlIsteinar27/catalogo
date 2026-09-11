# Graph Report - catalogo  (2026-08-16)

## Corpus Check
- 118 files · ~54,232 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 773 nodes · 1138 edges · 43 communities (37 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f2a4a9e5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- createClient
- utils.ts
- dependencies
- products.public.ts
- Catálogo de Productos
- Catalog Filters & Search
- button.tsx
- Template Clonable Catálogo — Plan de Implementación
- compilerOptions
- Cambios Optativos Template — Plan de Implementación
- Plan Maestro de Correcciones - Catálogo
- Cambios Importantes Template — Plan de Implementación
- Catalogo — AI Agent Context
- app/page-client.tsx
- Devin Rule Creator
- Flujo de Clonación por Cliente
- Agent Architecture Rewrite Implementation Plan
- Frontend Engineer Agent
- Project Quality Guardrails
- Backend Engineer Agent
- Pendientes - Fix de Bugs Frontend
- Instrucciones de Ejecución
- Características del Catálogo
- Contexto del Proyecto — Catálogo de Productos
- Instrucciones de Ejecución
- Instrucciones de Ejecución
- After Action Review (AAR)
- Correcciones Pendientes del Catálogo — Implementation Plan
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

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 30 edges
2. `Product` - 16 edges
3. `compilerOptions` - 16 edges
4. `cn()` - 15 edges
5. `getCurrentUser()` - 14 edges
6. `formatCurrency()` - 14 edges
7. `formatPrice()` - 14 edges
8. `Frontend Engineer Agent` - 14 edges
9. `Catalogo — AI Agent Context` - 14 edges
10. `Backend Engineer Agent` - 13 edges

## Surprising Connections (you probably didn't know these)
- `HomePage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/page.tsx → src/lib/supabase/server.ts
- `sendMagicLink()` --calls--> `createClient()`  [EXTRACTED]
  src/server/auth.ts → src/lib/supabase/server.ts
- `ProductDetailClient()` --calls--> `useCart()`  [EXTRACTED]
  src/app/producto/[id]/page-client.tsx → src/components/cart/cart-provider.tsx
- `ProductDetailClient()` --calls--> `formatCurrency()`  [EXTRACTED]
  src/app/producto/[id]/page-client.tsx → src/lib/utils.ts
- `ProductDetailClient()` --calls--> `formatPrice()`  [EXTRACTED]
  src/app/producto/[id]/page-client.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (43 total, 6 thin omitted)

### Community 0 - "createClient"
Cohesion: 0.06
Nodes (63): GET(), validateRedirect(), GET(), CategoriesClient(), CategoryStats, CategoriesServer(), DashboardLayout(), CategoryManager() (+55 more)

### Community 1 - "utils.ts"
Cohesion: 0.07
Nodes (48): dmSans, fraunces, metadata, CatalogClient(), pageVariants, sectionVariants, CartButton(), CartDrawer() (+40 more)

### Community 2 - "dependencies"
Cohesion: 0.04
Nodes (46): babel-plugin-react-compiler, clsx, eslint, eslint-config-next, lucide-react, motion, next, dependencies (+38 more)

### Community 3 - "products.public.ts"
Cohesion: 0.11
Nodes (14): EditProductServer(), DashboardServer(), HomePage(), CatalogServer(), ProductDetailClient(), ProductDetailServer(), Header(), MotionLink (+6 more)

### Community 4 - "Catálogo de Productos"
Cohesion: 0.05
Nodes (36): Agent Guardrails, Agent Registry, Bug Fix, Common Workflows, Decision Rules, Feature, Key Patterns, Manager Surface (+28 more)

### Community 5 - "Catalog Filters & Search"
Cohesion: 0.06
Nodes (35): 1.1 Tipo de Operación, 1.2 Monetización, 1. Modelo de Negocio, 2.1 Navegación del Catálogo, 2.2 Interacción con Productos, 2.3 Carrito de Compras, 2.4 Checkout por WhatsApp, 2. Flujo de Compra (Usuario Final) (+27 more)

### Community 6 - "button.tsx"
Cohesion: 0.08
Nodes (23): LoginClient(), Mode, MotionLink, DashboardSidebar(), MotionLink, navItems, Button, ButtonProps (+15 more)

### Community 7 - "Template Clonable Catálogo — Plan de Implementación"
Cohesion: 0.06
Nodes (30): Estructura de Archivos, FASE 1: Eliminar Datos Mock y Resetear Estado Base, FASE 2: Unificar SQL de Setup en un Solo Archivo, FASE 3: Centralizar Configuración del Negocio en Variables de Entorno, FASE 4: Simplificar Moneda a USD Único, FASE 5: Reemplazar Magic Link por Email + Contraseña, FASE 6: Eliminar DISABLE_AUTH_PROTECTION, RESUMEN DE CAMBIOS (+22 more)

### Community 8 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 9 - "Cambios Optativos Template — Plan de Implementación"
Cohesion: 0.08
Nodes (25): Cambios Optativos Template — Plan de Implementación, Estructura de Archivos, FASE 1: Variables de Tema Centralizadas, FASE 2: Página de Ayuda en el Dashboard, FASE 3: Edición Rápida de Precios, FASE 4: Feature Flag para Dual Currency, FASE 5: Analytics Básico, FASE 6: Modo Mantenimiento (+17 more)

### Community 10 - "Plan Maestro de Correcciones - Catálogo"
Cohesion: 0.08
Nodes (24): 1.1 Renombrar `src/proxy.ts` → `src/middleware.ts`, 1.2 Validar `next` en callback de auth, 1.3 Validar `validateProductPrice` estrictamente, 1. Seguridad Crítica (primero), 2.1 Imágenes huérfanas en Storage, 2.2 Revalidar `/producto/${id}` en `deleteProduct`, 2.3 `PriceFilter` - no requiere cambios, 2.4 Navegación con `Link` en el logo (+16 more)

### Community 11 - "Cambios Importantes Template — Plan de Implementación"
Cohesion: 0.08
Nodes (23): Cambios Importantes Template — Plan de Implementación, Estructura de Archivos, FASE 1: Simplificar Formulario de Producto, FASE 2: Placeholder de Imagen Robusto, FASE 3: Flujo de Imagen Simplificado, FASE 4: Página de Dashboard con Resumen, FASE 5: Mensaje de WhatsApp Mejorado, FASE 6: Documento de Clonación (+15 more)

### Community 12 - "Catalogo — AI Agent Context"
Cohesion: 0.09
Nodes (22): Admin dashboard (`/dashboard`), Agent Working Rules, Architecture Map, Auth & security, Cart (client-only), Catalogo — AI Agent Context, Commands, Core Abstractions (graph hubs) (+14 more)

### Community 13 - "app/page-client.tsx"
Cohesion: 0.11
Nodes (17): CategoryFilter(), CategoryFilterProps, PriceFilter(), PriceFilterProps, cardVariants, gridVariants, ProductGrid(), MotionSearch (+9 more)

### Community 14 - "Devin Rule Creator"
Cohesion: 0.11
Nodes (18): 1. Rule formats and locations, 2. Rule frontmatter, 3. Writing rules, 4. AGENTS.md format, 5. Creation workflow, 6. Output templates, 7. Examples, 8. Common mistakes to avoid (+10 more)

### Community 15 - "Flujo de Clonación por Cliente"
Cohesion: 0.11
Nodes (18): 1. GitHub: Crear repositorio para el cliente, 2. Supabase: Crear proyecto y ejecutar setup, 3. Vercel: Importar y configurar, 4. Auth: Registrar usuario admin, 5. Entrega al cliente, Checklist de Calidad Antes de Entrega, Día 1: Verificación, Día 7+: Handoff completo (+10 more)

### Community 16 - "Agent Architecture Rewrite Implementation Plan"
Cohesion: 0.12
Nodes (16): Agent Architecture Rewrite Implementation Plan, Execution Handoff, Phase 1: Rewrite `system-prompt.md` and `AGENTS.md`, Phase 2: Reduce agents to 2 specialists, Phase 3: Move technical details to skills, Phase 4: Verify and validate, Self-Review Checklist, Task 1: Rewrite `.devin/rules/system-prompt.md` (+8 more)

### Community 17 - "Frontend Engineer Agent"
Cohesion: 0.13
Nodes (14): Accessibility, Architecture Rules, Component Rules, Currency & Catalog, File Structure, Forms & Interactions, Frontend Engineer Agent, Gotchas (+6 more)

### Community 18 - "Project Quality Guardrails"
Cohesion: 0.13
Nodes (14): After Action Review, Component & Logic Checks, Core Principles, File Uploads / Storage (`src/server/storage.ts`), Output Format, Plan Creation Checklist, Project Quality Guardrails, Redirects (`src/app/api/auth/callback/route.ts`) (+6 more)

### Community 19 - "Backend Engineer Agent"
Cohesion: 0.14
Nodes (13): Auth & Security, Backend Engineer Agent, Category Rules, File Structure, Gotchas, Product CRUD Rules, Role, Server Action Rules (+5 more)

### Community 20 - "Pendientes - Fix de Bugs Frontend"
Cohesion: 0.14
Nodes (13): 1. Error de TypeScript en `sort-dropdown.tsx`, 2. Manejo de errores robusto en `src/server/products.ts`, 3. Estado vacío en catálogo (`page-client.tsx`), 4. Error de hidratación en `CartButton` (carrito), 5. Recrear `src/components/catalog/share-button.tsx` ✅ RESUELTO, Archivo creado, Archivos modificados en esta sesión, Completado ✅ (+5 more)

### Community 21 - "Instrucciones de Ejecución"
Cohesion: 0.15
Nodes (12): 1. Variables de Tema Centralizadas, 2. Página de Ayuda en el Dashboard, 3. Edición Rápida de Precios desde el Listado, 4. Feature Flag para Reactivar Dual Currency, 5. Analytics Básico de Visitas, 6. Modo "Mantenimiento" o "Pausa", 7. Exportar Productos a CSV, Contexto del Proyecto (+4 more)

### Community 22 - "Características del Catálogo"
Cohesion: 0.17
Nodes (11): Accede al panel de control, Administra productos y categorías, Aprovecha el diseño y la experiencia, Características del Catálogo, Despliega en infraestructura serverless, Explora el detalle de producto, Gestiona el carrito de compras, Mantén la seguridad y calidad (+3 more)

### Community 23 - "Contexto del Proyecto — Catálogo de Productos"
Cohesion: 0.17
Nodes (11): Arquitectura de Alto Nivel, Contexto del Proyecto — Catálogo de Productos, Funcionalidades Principales, Manejo de Datos en Desarrollo, Migraciones, Notas Importantes, Para el administrador, Para el usuario final (+3 more)

### Community 24 - "Instrucciones de Ejecución"
Cohesion: 0.17
Nodes (11): 1. Eliminar Datos Mock y Resetear Estado Base, 2. Unificar SQL de Setup en un Solo Archivo, 3. Centralizar Configuración del Negocio en Variables de Entorno, 4. Simplificar Moneda a USD Único, 5. Reemplazar Magic Link por Email + Contraseña, 6. Eliminar `DISABLE_AUTH_PROTECTION`, Contexto del Proyecto, Instrucciones de Ejecución (+3 more)

### Community 25 - "Instrucciones de Ejecución"
Cohesion: 0.17
Nodes (11): 1. Simplificar Formulario de Producto en el Dashboard, 2. Placeholder de Imagen Robusto, 3. Flujo de Imagen Simplificado en el Dashboard, 4. Página de Inicio del Dashboard con Resumen, 5. Mensaje de Checkout a WhatsApp Mejorado, 6. README de Clonación de 5 Pasos (Documento Interno), Contexto del Proyecto, Instrucciones de Ejecución (+3 more)

### Community 26 - "After Action Review (AAR)"
Cohesion: 0.18
Nodes (10): 1. Intención — What was supposed to happen?, 2. Realidad — What actually happened?, 3. Causalidad — Why did it happen?, 4. Acción — What will we do differently?, After Action Review (AAR), Example, Output Format, Rules (+2 more)

### Community 27 - "Correcciones Pendientes del Catálogo — Implementation Plan"
Cohesion: 0.20
Nodes (9): Correcciones Pendientes del Catálogo — Implementation Plan, File Structure, Self-Review, Task 1: `updateProduct` — eliminar imagen huérfana, Task 2: `deleteProduct` — revalidar `/producto/${id}`, Task 3: `ImageZoom` — restaurar foco con `setTimeout`, Task 4: `ProductTable` — deshabilitar todos los botones de eliminar + spinner, Task 5: `isNewProduct` — precisar JSDoc (+1 more)

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

## Knowledge Gaps
- **419 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+414 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `products.public.ts`, `button.tsx`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `Product` connect `utils.ts` to `createClient`, `products.public.ts`, `app/page-client.tsx`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `Button` connect `button.tsx` to `createClient`, `utils.ts`, `app/page-client.tsx`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _419 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.06192259675405743 - nodes in this community are weakly interconnected._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06542443064182195 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._