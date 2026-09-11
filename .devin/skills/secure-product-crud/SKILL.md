---
name: secure-product-crud
description: "Security-deep guidance for the Catalogo app: auth guards, product CRUD, and storage edge cases. Activate when adding, editing, or reviewing dashboard, server actions, product forms, storage, or auth code."
triggers:
  - user
  - model
---

# Secure Product CRUD

Security guidance for the Catalogo app (Next.js 16 + Supabase). Use alongside `backend-engineer`.

## Auth Model

- Magic-link only, via `supabase.auth.signInWithOtp` in `src/server/auth.ts`.
- `getCurrentUser()` in `src/lib/auth.ts` — returns `User | null`. Use inside server actions for graceful `ActionResult` errors.
- `requireAuth()` in `src/lib/auth.ts` — returns `User`, redirects to `/login`. Use in layouts/server components, not inside mutations.

## Protected Surfaces

- **Dashboard pages**: should be nested under `src/app/dashboard/layout.tsx` which calls `await requireAuth()`. Standalone admin routes must call it directly.
- **Server actions mutating data**: add `const user = await getCurrentUser(); if (!user) return { success: false, error: "No autorizado" }` as the first line inside the `try` block.
- **Header**: receives `isLoggedIn` from a server-fetched user. Never fetch the session client-side inside the header.
- **Upload gap**: `uploadProductImage` historically used `createServiceClient()` without an auth check. Add `getCurrentUser()` before uploading if you touch it.

## Product CRUD Edge Cases

- Reuse `Product`, `ProductInsert`, `ProductUpdate` from `src/lib/supabase/types.ts`.
- Every mutation returns `ActionResult<T>`; catch Supabase errors and log them.
- Call `revalidatePath('/')`, `revalidatePath('/dashboard')`, and `revalidatePath("/producto/${id}")` after successful mutations.
- Mirror `PRODUCT_VALIDATIONS` and `ERROR_MESSAGES` in `src/lib/validations.ts` for new fields.
- Delete old images only after the new reference is persisted.

## Server/Client Split

- `page.tsx` — entry with `<Suspense>`.
- `*-server.tsx` — async data + user gating.
- `*-client.tsx` — `use client`, state, forms, events.

## Quick Checklist

- [ ] Protected layout or direct `requireAuth()` call?
- [ ] Mutation checks `getCurrentUser()` before writing?
- [ ] Auth state passed from server, not guessed client-side?
- [ ] Payload types and validation helpers reused?
- [ ] Correct `revalidatePath()` calls after mutations?
- [ ] Old images deleted only after DB update succeeds?
