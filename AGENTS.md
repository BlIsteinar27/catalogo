# Multi-Agent Architecture - Catalogo

## Project Overview

- **Type**: E-commerce catalog
- **Stack**: Next.js 16, React 19, TypeScript, Supabase, Tailwind CSS, Motion
- **Complexity**: Medium
- **Pattern**: Orchestrator-Specialists (simplified)

## Philosophy

Based on Anthropic's agent design principles:

- Simplicity first: start simple, increase complexity only when needed.
- Workflows for well-defined tasks; agents for flexibility.
- Use skills for specialized knowledge instead of spawning subagents.
- Modular and evolvable design.

## Agent Registry

| ID  | Agent             | Role                                    | Writes                                 |
| --- | ----------------- | --------------------------------------- | -------------------------------------- |
| 0   | root Devin        | Orchestrator                            | -                                      |
| 1   | frontend-engineer | React/Next.js, Tailwind, Motion UI      | `src/app/**`, `src/components/**`      |
| 2   | backend-engineer  | Server actions, Supabase, auth, storage | `src/server/**`, `src/lib/**` (non-UI) |

## Decision Rules

- Feature development → frontend-engineer + backend-engineer in parallel.
- UI-only work → frontend-engineer.
- Database/Supabase/security work → backend-engineer.
- Bug fixes → relevant engineer, sequential.
- Code review → use `react-code-review-ts` skill, not agents.

## Manager Surface

- **Orchestrator**: root Devin agent
- **Max parallel tasks**: 2
- **Timeout**: 300s
- **Failover**: retry up to 3, then escalate to root.

## Key Patterns

- **Server/Client**: `page.tsx` with Suspense; `*-server.tsx` for data; `*-client.tsx` for UI.
- **Errors**: `ActionResult<T>` for server actions; user-friendly messages; `logger` for errors.
- **Styling**: Tailwind CSS; mobile-first; Motion for micro-interactions.
- **Database**: Supabase; RLS; `requireAuth()` before mutations; validate inputs.

## Common Workflows

### Feature

1. User requests feature.
2. Root agent dispatches frontend + backend in parallel.
3. Frontend engineer builds UI; backend engineer builds data layer.
4. Verify with `npm run lint` and `npm run build`.

### Bug Fix

1. User reports bug.
2. Root agent dispatches the relevant engineer.
3. Fix, verify, complete.

## Skills

| Domain       | Skills                                                                                                                                   |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend     | `nextjs-server-client-separation`, `react-component-fundamentals-ts`, `react-actions-ts`, `tailwind-orchestrator`, `motion-orchestrator` |
| Backend      | `supabase`, `supabase-postgres-best-practices`, `react-actions-ts`                                                                       |
| Project-wide | `project-quality-guardrails`, `after-action-review`, `secure-product-crud`                                                               |

## Agent Guardrails

1. Activate `project-quality-guardrails` before plans, subagents, or security-critical code.
2. Verify before acting: use `find_file_by_name`, `read`, `grep`.
3. Complete every task before marking done.
4. No garbage files: one `docs/plan-*.md` per plan. No `REPORTE_*.md`, `RESUMEN_*.md`, `*-CORREGIDO.md`.
5. Validate plans against actual code before proposing changes.
6. Secure by default: validate redirects, uploads, deletes, and server action inputs.
7. Clean up temporary files after subagents.
8. Run an After Action Review (`after-action-review`) if the user points out an error.
