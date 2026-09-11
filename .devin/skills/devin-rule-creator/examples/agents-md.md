# Component Guidelines

When working with components in this directory:

- Use functional components with hooks.
- Follow the naming convention:
  - Components: `ComponentName.tsx`
  - Hooks: `useHookName.ts`
- Each component should have a corresponding test file: `ComponentName.test.tsx`.
- Export components as named exports, not default exports.

## File Structure

Each component folder should contain:

- The main component file.
- A test file.
- A styles file (if needed).
- An `index.ts` for re-exports.
