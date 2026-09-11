---
name: project-quality-guardrails
description: "Project-specific guardrails for the Catalogo app. Activate before plans, subagents, security-critical code, or architectural decisions."
triggers:
  - user
  - model
---

# Project Quality Guardrails

These guardrails apply to the Catalogo project (Next.js 16 + React 19 + TypeScript + Supabase + Tailwind + Motion).

## When to Use

Activate before:
- Creating an implementation plan.
- Spawning subagents.
- Modifying security-critical code (auth, redirects, validation, storage).
- Refactoring components or utilities.
- Touching `src/server/`, `src/lib/`, `src/app/`, `src/components/`.

## Core Principles

1. **Verify before acting** — Use `find_file_by_name`, `read`, `grep`.
2. **Complete every task** — Finish all parts before marking done.
3. **No garbage files** — One `docs/plan-*.md` per plan. No `REPORTE_*.md`, `RESUMEN_*.md`, `*-CORREGIDO.md`.
4. **Validate before proposing** — Read the code before proposing moves or removals.
5. **Security is not optional** — Redirects, uploads, storage deletes, and auth callbacks must be validated strictly.

## Plan Creation Checklist

Before presenting a plan:
- [ ] I read the affected files.
- [ ] I verified the problem exists.
- [ ] I considered side effects and edge cases.
- [ ] I checked for existing helpers/utilities to reuse.
- [ ] I did not propose removing/moving code without knowing its usage.
- [ ] The plan lists concrete files and changes.
- [ ] The plan has a clear order of execution.

## Subagent Rules

1. **One output file per subagent** — `docs/plan-*.md` only.
2. **Verify the output** — Read the generated file and ensure it is complete.
3. **Do not lose corrections** — If a review subagent finds issues, dispatch another to apply fixes.
4. **Clean up** — Delete temporary files after consolidating.

## Security Validation Checklist

### Redirects (`src/app/api/auth/callback/route.ts`)

- `next` must be a relative path starting with `/`.
- Reject `//`, `%2F%2F`, `@`, null bytes, CRLF, backslashes, `../`.
- Fall back to `/dashboard`.

### File Uploads / Storage (`src/server/storage.ts`)

- Validate extension and MIME type against the allowlist.
- Validate file size (10MB max).
- Validate the image URL belongs to `product-images`.
- Prevent path traversal in filenames.
- Do not delete old files before the new data is persisted.

### Server Actions (`src/server/*.ts`)

- Verify auth before mutating data.
- Validate inputs with `validateProductPayload` or equivalent.
- Return `ActionResult<T>` consistently.
- Revalidate affected paths after mutations.
- Clean up old resources AFTER the mutation succeeds.

## Component & Logic Checks

- Do not break HTML structure to force desktop/mobile into one component.
- Do not rely on `router.refresh()` alone for client-side tables.
- Do not add `useEffect` without importing it.
- Do not use `motion.a` for internal navigation; use `Link` or `motion(Link)`.
- Do not hide focusable elements with `aria-hidden` or `tabIndex={-1}` unless decorative.
- Do not create orphan resources.

## Validation Reference

- `src/lib/validations.ts` — product, category, file, price validation.
- `src/lib/utils.ts` — `formatCurrency`, `formatPrice`, `cn`.
- `src/lib/auth.ts` — `getCurrentUser`, `requireAuth`.
- `src/server/storage.ts` — file upload/delete rules.

## Verification Before Completion

1. Run `npm run lint` and `npm run build`.
2. Read the files you changed.
3. Check that no temporary files were left.
4. Update the todo list to reflect the real state.

## Output Format

Plans live in `docs/plan-<feature-or-fix>.md`. Consolidate multiple plans into one file or clearly numbered `docs/plan-<part>.md`.

## After Action Review

If a mistake is found or the user points out a missing deliverable:
1. Stop execution.
2. Activate `after-action-review`.
3. Answer the 4 questions (intent, reality, cause, action).
4. Fix the issue.
5. Update this skill or `AGENTS.md` if the root cause is a missing guardrail.
