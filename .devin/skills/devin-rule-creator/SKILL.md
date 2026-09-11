---
name: devin-rule-creator
description: Creates, validates, and writes Devin Desktop / Cascade rules in `.devin/rules/`, `.windsurf/rules/`, or `AGENTS.md`. Use this skill whenever the user asks to create a rule, add a project rule, write a Cascade rule, or set up coding guidelines, conventions, or behavioral instructions for Devin. Also use when the user mentions rules, AGENTS.md, `.devin/rules`, `.windsurf/rules`, trigger, always_on, model_decision, glob, or manual.
---

# Devin Rule Creator

Create well-formed Devin Desktop / Cascade rules that are recognized immediately and work as intended.

This skill handles the full creation flow:
- Choose the correct rule format and location.
- Validate the rule name, trigger, and `globs`.
- Write the rule content in English (or the requested language).
- Stay within official size limits.
- Verify the generated file.

## 1. Rule formats and locations

| Format | Where it lives | Frontmatter | Best for |
|--------|----------------|-------------|----------|
| Devin workspace rule | `.devin/rules/<rule-name>.md` | Required | New projects, preferred location |
| Windsurf fallback rule | `.windsurf/rules/<rule-name>.md` | Required | Legacy compatibility |
| AGENTS.md | `AGENTS.md` (root or subdirectories) | None | Simple, directory-scoped conventions |
| Global rule | `~/.codeium/windsurf/memories/global_rules.md` | None | User-level global rules |
| Cursor import | `.cursor/rules/<rule-name>.mdc` | `description`, `globs`, `alwaysApply` | Imported from Cursor |

Prefer `.devin/rules/` whenever possible. It takes precedence over `.windsurf/rules/`.

## 2. Rule frontmatter

For `.devin/rules/*.md` and `.windsurf/rules/*.md`, the frontmatter must be at the top of the file, wrapped in `---`.

```markdown
---
trigger: always_on
description: "Short, specific summary of what this rule controls"
---
```

### Required and optional fields

| Field | Required | Description |
|-------|----------|-------------|
| `trigger` | Yes | Activation mode: `always_on`, `model_decision`, `glob`, `manual` |
| `description` | Strongly recommended | Short summary shown to the model. Required for `model_decision` to work well |
| `globs` | Required for `trigger: glob` | Glob pattern(s) that activate the rule |

### Trigger values

| Trigger | Effect | When to use |
|---------|--------|-------------|
| `always_on` | Rule content is included in every message | Universal conventions, project-wide standards |
| `model_decision` | Description is always visible; full content is loaded only when the model decides it is relevant | Context-specific guidance, avoid token waste |
| `glob` | Rule activates when matching files are read or edited | File-specific conventions (e.g., React components, tests) |
| `manual` | Rule is only used when the user invokes it with `@rule-name` | Rarely needed guidance, runbooks, reference material |

## 3. Writing rules

### Content rules

- Write rules in clear, imperative English by default.
- Be specific. Bad: "Write good code." Good: "Use TypeScript strict mode for all new files."
- Group related guidelines under headings.
- Use bullet points and short paragraphs.
- Include concrete examples when the rule is about code style or architecture.
- Keep the total rule under 12,000 characters for workspace rules and 6,000 for global rules.

### File naming

- Use lowercase, hyphen-separated names: `react-components.md`, `api-design.md`, `testing-standards.md`.
- Do not use spaces or special characters.

### `globs` patterns

When `trigger: glob` is used, the `globs` field must be present. It can be a single string or a YAML list.

```yaml
---
trigger: glob
description: "React component conventions"
globs:
  - "src/components/**/*.tsx"
  - "src/components/**/*.ts"
---
```

Common patterns:
- `**/*.tsx` — all TSX files
- `src/components/**` — everything under components
- `*.test.ts` — test files in the same directory
- `**/*.{ts,tsx}` — all TypeScript and TSX files

## 4. AGENTS.md format

`AGENTS.md` files do not use frontmatter. Their scope is determined by their location:

- Root `AGENTS.md` — always on, applies to the whole workspace.
- Subdirectory `AGENTS.md` — acts like `trigger: glob` for that directory and its children.

```markdown
# Component Guidelines

- Use functional components with hooks.
- Name files `ComponentName.tsx` and hooks `useHookName.ts`.
```

## 5. Creation workflow

1. **Identify the rule goal.** What behavior should Devin follow?
2. **Choose the right format.** Prefer `.devin/rules/<name>.md` for new rules. Use `AGENTS.md` for directory-scoped conventions.
3. **Validate inputs.**
   - Rule name: lowercase, hyphens, no spaces.
   - Trigger: one of `always_on`, `model_decision`, `glob`, `manual`.
   - If `glob`: `globs` must be present and not empty.
   - If `model_decision`: `description` must be present and specific.
   - Content length: workspace < 12,000 chars, global < 6,000 chars.
4. **Write the file.** Use the frontmatter template and the content rules above.
5. **Verify.** Read the file back to ensure the frontmatter is valid and the content is correct.

## 6. Output templates

### Always-on workspace rule

```markdown
---
trigger: always_on
description: "Project-wide TypeScript and coding conventions"
---

# Coding Standards

## TypeScript

- Use TypeScript for all new files.
- Enable strict mode and avoid implicit `any`.

## Code Style

- Prefer `const` and `let`; avoid `var`.
- Use async/await instead of raw promise chains.
```

### Model-decision rule

```markdown
---
trigger: model_decision
description: "Guidelines for designing and reviewing REST API endpoints"
---

# API Design

## Responses

- Always return JSON with a consistent envelope:
  ```json
  { "success": true, "data": {} }
  ```
- Use HTTP status codes correctly: 200, 201, 400, 401, 403, 404, 500.
```

### Glob rule

```markdown
---
trigger: glob
description: "React component conventions"
globs:
  - "src/components/**/*.tsx"
  - "src/components/**/*.ts"
---

# React Components

- Use functional components with hooks.
- Keep components small and focused on one responsibility.
- Co-locate styles with the component when using CSS modules.
```

### Manual rule

```markdown
---
trigger: manual
description: "Step-by-step release checklist"
---

# Release Checklist

1. Run the full test suite.
2. Update the changelog.
3. Create a version tag.
4. Deploy to staging and verify.
```

## 7. Examples

See the `examples/` folder for ready-to-use rule files:
- `always-on-rule.md`
- `model-decision-rule.md`
- `glob-rule.md`
- `manual-rule.md`
- `agents-md.md`

## 8. Common mistakes to avoid

- Do not use `trigger: agent` — it is not a valid Devin Desktop trigger.
- Do not put frontmatter in `AGENTS.md`.
- Do not forget `globs` when `trigger: glob`.
- Do not exceed 12,000 characters in a workspace rule.
- Do not write vague rules. Concrete examples and file paths are better than abstract advice.
