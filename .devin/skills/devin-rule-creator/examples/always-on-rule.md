---
trigger: always_on
description: "Project-wide TypeScript and code quality standards"
---

# Coding Standards

## TypeScript

- Use TypeScript for all new source files.
- Enable strict mode and avoid implicit `any`.
- Prefer interfaces over type aliases for object shapes.

## Code Style

- Use `const` by default; use `let` only when reassignment is needed.
- Avoid `var` entirely.
- Use async/await instead of raw `.then()` chains.
- Keep functions small and focused on a single responsibility.

## Error Handling

- Validate inputs at function boundaries.
- Return typed errors instead of throwing when the caller expects a result.
- Log unexpected errors with `console.error` before returning a fallback.
