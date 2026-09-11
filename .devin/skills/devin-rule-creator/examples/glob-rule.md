---
trigger: glob
description: "React component conventions for TSX files"
globs:
  - "src/components/**/*.tsx"
  - "src/components/**/*.ts"
---

# React Component Conventions

## File Structure

- Name component files with PascalCase: `UserCard.tsx`.
- Name hook files with camelCase and `use` prefix: `useUser.ts`.
- Co-locate tests and styles next to the component when possible.

## Component Rules

- Use functional components with hooks.
- Keep components focused on a single responsibility.
- Extract complex logic into custom hooks.
- Use named exports for reusable components unless a default export is required by the router.
