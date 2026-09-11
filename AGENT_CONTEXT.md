# Catalogo — AI Agent Context

> Paste this file into Gemini (or any LLM) before asking questions about this codebase.
> Generated from README + codebase knowledge graph (429 nodes, 868 edges). English for token efficiency.

## What This Is

E-commerce **product catalog** with admin dashboard. Public storefront + private admin panel.

**Checkout model:** no payment gateway. Cart → pre-filled WhatsApp message → customer completes order offline with the business.

**Business type:** showcase catalog (agnostic niche: retail, B2B, menu, etc.). Dual currency USD/EUR.

## Stack

| Layer     | Tech                                          |
| --------- | --------------------------------------------- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Backend   | Supabase (Postgres, Auth, Storage)            |
| Styling   | Tailwind CSS 4, Motion (animations)           |
| Deploy    | Vercel (+ cron keepalive)                     |

## Architecture Map

```
src/
├── app/              # Routes (public + dashboard + API)
│   ├── page.tsx              → catalog home
│   ├── producto/[id]/        → product detail
│   ├── dashboard/            → admin CRUD (protected)
│   ├── login/                → magic-link auth
│   └── api/auth/callback     → auth callback (validates redirect)
│       api/keepalive         → Supabase session ping (cron)
├── components/
│   ├── catalog/      → filters, grid, cards, search, sort
│   ├── cart/         → provider, drawer, WhatsApp checkout
│   ├── dashboard/    → forms, table, image upload, categories
│   ├── layout/       → header, sidebar
│   └── ui/           → button, input, select, toast, badge…
├── contexts/         → currency (USD/EUR toggle)
├── lib/
│   ├── supabase/     → client.ts (browser), server.ts (SSR), types.ts
│   ├── auth.ts       → getCurrentUser(), requireAuth()
│   ├── utils.ts      → cn(), formatPrice(), formatCurrency(), WhatsApp msg
│   └── validations.ts
└── server/           # Server actions (mutations + public reads)
    ├── products.admin.ts   → create/update/delete (auth required)
    ├── products.public.ts  → public product queries
    ├── categories.ts       → category CRUD
    ├── storage.ts          → image upload/delete (product-images bucket)
    ├── auth.ts             → signOut
    ├── cache.ts            → revalidatePath helpers
    └── keepalive.ts        → ping Supabase
```

## Core Abstractions (graph hubs)

These are the highest-connectivity nodes — changes here ripple across the app:

1. **`createClient()`** — Supabase client factory; bridges auth, dashboard, categories, login
2. **`Product`** (type) — bridges catalog UI, server actions, dashboard forms
3. **`getCurrentUser()` / `requireAuth()`** — session gate for protected routes & mutations
4. **`formatCurrency()` / `formatPrice()` / `useCurrencyDisplay()`** — dual-currency display
5. **`ActionResult<T>`** — standard server action return type (`{ ok, data } | { ok: false, error }`)
6. **`CartProvider`** — client-side cart state (localStorage, not server)

No import cycles detected.

## Mandatory Patterns

### Server / Client split

- `page.tsx` — entry + Suspense boundary
- `*-server.tsx` — data fetching, server-only logic
- `*-client.tsx` — interactivity, hooks, Motion

### Server actions

- Return `ActionResult<T>`, never throw to client
- Call `requireAuth()` before any mutation
- Validate inputs (UUIDs, redirect URLs, file types)
- Use `src/server/cache.ts` for revalidation after admin changes

### Auth & security

- **Magic link** email auth (no passwords)
- **Route protection:** `src/proxy.ts` guards `/dashboard/*`; unauthenticated → `/login`
- **Callback safety:** `api/auth/callback` validates `next` param (no open redirects)
- **RLS** on Supabase tables; service role only for storage ops
- **Image rules:** `product-images` bucket only; max 10 MB; orphan cleanup on update/delete

### Styling

- Mobile-first, editorial + glassmorphism design
- Fonts: DM Sans (body) + Fraunces (display)
- Glass tokens: `--color-glass`, `--shadow-glass`, backdrop-blur on floating UI
- Motion: micro-interactions (hover/tap), AnimatePresence, stagger lists

## Feature Domains

### Public catalog (`/`)

- Paginated grid (12/page), category chips, search, price range, sort dropdown
- Price filter: empty by default, NOT persisted; range clamped to catalog min/max
- Currency toggle in header (USD/EUR) — affects all displayed prices

### Product detail (`/producto/[id]`)

- Image zoom, dual price display, stock badge, "New" badge (<7 days)
- Share via Web Share API or clipboard

### Cart (client-only)

- Persisted in `localStorage` via `CartProvider`
- Hidden on `/dashboard` and `/login`
- WhatsApp checkout: `buildWhatsAppMessage()` → `wa.me/<NEXT_PUBLIC_WHATSAPP_NUMBER>`

### Admin dashboard (`/dashboard`)

- Product CRUD: list, create (`/nuevo`), edit (`/editar/[id]`)
- Category manager (`/dashboard/categorias`)
- Image upload to Supabase Storage
- `ensureCategoryExists()` before product insert/update (FK safety)

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY      # storage ops only
NEXT_PUBLIC_SITE_URL           # magic link redirect base
NEXT_PUBLIC_WHATSAPP_NUMBER
CRON_SECRET                      # protects /api/keepalive
DISABLE_AUTH_PROTECTION=true     # dev only — bypasses dashboard guard
```

## Database Setup

Run SQL scripts in order: `docs/sql/01-create-products-table.sql` → `02-rls-policies.sql` → `03-storage-bucket.sql`

Key tables: `products`, `categories`. RLS enforced. Categories cascade on delete.

## Commands

```bash
npm run dev      # localhost:3000
npm run build    # production build (always verify changes)
npm run lint     # ESLint
```

## Agent Working Rules

When modifying this codebase:

1. **Match existing conventions** — read surrounding files before editing
2. **Minimal diffs** — don't refactor unrelated code
3. **Frontend** → `src/app/**`, `src/components/**`
4. **Backend** → `src/server/**`, `src/lib/**` (non-UI)
5. **Never** commit `.env`, secrets, or create junk docs (`REPORTE_*`, `RESUMEN_*`)
6. **Secure by default** — validate redirects, uploads, deletes, action inputs
7. **Hydration-safe** — use `useMounted()` / `useSyncExternalStore` for client-only state

## Known Constraints & Edge Cases

- Cart is browser-only; no server-side cart sync
- No payment processing — do not add Stripe/PayPal unless explicitly requested
- Dual currency is display-layer; both USD and EUR stored per product
- `useMounted()` required for components reading `localStorage` on first render
- Category must exist before product FK insert
- Image delete only after product delete succeeds; URL must belong to `product-images` bucket

## Docs Reference (deeper detail if needed)

| File                               | Content                                           |
| ---------------------------------- | ------------------------------------------------- |
| `README.md`                        | Full setup, UI component inventory, design tokens |
| `AGENTS.md`                        | Multi-agent orchestration rules                   |
| `docs/logica-negocio.md`           | Business logic, purchase flow, admin rules        |
| `docs/caracteristicas-catalogo.md` | Complete feature inventory                        |
| `docs/sql/`                        | Database schema + RLS + storage                   |
| `graphify-out/graph.html`          | Interactive codebase graph (local only)           |

## Quick Mental Model

```
Visitor → browse/filter → add to cart (localStorage) → WhatsApp order
Admin   → magic link login → dashboard CRUD → Supabase (RLS) + Storage
Bridge nodes: Product (data model) · createClient() (Supabase) · ActionResult (errors)
```
