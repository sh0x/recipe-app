# CLAUDE.md

This repository actively uses AI assistants (Claude, ChatGPT, Cursor, etc.) to help build RecipeBook.  
This file describes how AI collaborators should behave when generating code, docs, or suggestions.

---

## Goals

- Stay consistent with **our schema, style, and architecture**.  
- Prioritize **clarity and maintainability** over cleverness.  
- Respect the **phase-based roadmap** (see `docs/PLANNING.md` and `docs/TASKS.md`).  
- Never overwrite or discard context unless explicitly asked.

---

## Ground Rules

1. **Never invent hidden dependencies**.  
   - Use only what’s in `package.json` or explicitly approved.  
   - If you need a new package, suggest it first.

2. **Follow our repo structure**  
   - `apps/web` = Next.js app  
   - `packages/db` = Prisma schema/migrations  
   - `packages/editor` = block editor  
   - `packages/ui` = reusable components  
   - `packages/types` = shared TS types  

3. **Output format matters**  
   - For patches: always use `git apply`-ready unified diff format.  
   - For new files: show full file content.  
   - For edits: show only minimal diff.

4. **Schema is canonical**  
   - All new features must align with the Prisma schema in `packages/db/schema.prisma`.  
   - Import/export JSON + MDX are contracts — don’t drift.

5. **Tests**  
   - Always add a minimal test when adding new logic.  
   - Unit tests live in `__tests__` near the code.

---

## Interaction Guidelines

- **Be explicit**: always explain reasoning, not just code.  
- **Offer options**: if multiple approaches exist, outline tradeoffs.  
- **Ask first**: if uncertain, ask before generating large patches.  
- **Stay in sync**: check `main` branch context before suggesting big changes.  

---

## Example Tasks

- Add a new block type to editor → update schema + UI + MDX import/export.  
- Add print-friendly template → new route + minimal CSS-in-JS.  
- Add import validation → update Zod schema and JSON Schema.

---

## Out of Scope

- Auth/Stripe/Marketplace (Phase 3+) unless explicitly requested.  
- Experimental libraries that don’t match stack (stick to Next.js, Prisma, tRPC, Tailwind, etc.).  

---

## Tone

- Treat this repo as a professional, growing product.  
- Code should look like it belongs in a modern SaaS codebase.  
- Prefer concise explanations and clear action steps.

---

## Coding Standards

Follow these rules by default. If a change requires breaking a rule, explain why in the PR description.

### Architecture & Code Quality
- **DRY**: Prefer extracting shared logic into small functions/components/hooks.
- **Separation of concerns**: No business logic in React components if it can live in a lib/hook.
- **Small PRs**: Ship incremental, testable slices. Avoid “mega” PRs.
- **Types first**: Strong TypeScript types; no `any`. Add/extend types in `packages/types` where shared.

### Styling & UI
- **No inline styles** (except one-off print CSS or dynamic JS-driven styles).  
  Use Tailwind classes or minimal CSS modules.
- **Tailwind preferred**: Compose utility classes; avoid long unreadable chains (extract to components).
- **Design tokens**: Respect theme tokens (colors, radii, spacing). Don’t hardcode values.
- **Accessibility**: Semantic HTML, keyboard focus, `aria-*` as needed. Links vs buttons correctly.

### Components
- **Server Components by default** in Next App Router; opt into `"use client"` only when needed.
- **File co-location**: Component + small test + small CSS (if any) live together.
- **Props**: Keep minimal; prefer explicit props over “bag of props”. Document with TS types/JSDoc.
- **Data fetching**: Server components or server actions where possible; avoid client fetching unless necessary.

### Data & Domain
- **Schema is the source of truth** (`packages/db/schema.prisma`). DB writes go through typed functions.
- **Versioning**: Recipes are versioned; don’t mutate old versions. Add new version instead.
- **Import/Export contracts**: Match JSON/MDX formats in `docs/PLANNING.md`. Don’t drift.

### Error Handling & UX
- **Fail-fast in API**: Validate inputs (Zod). Return typed, actionable errors.
- **User feedback**: Toasts for success/fail on mutations (import/export/save).
- **Logging**: Use structured logs server-side; keep noisy logs out of client.

### Testing
- **Unit tests for logic**: Parsing, validation, scaling math, import/export.
- **Smoke tests**: Route renders (recipe page, print page) at least once.
- **No snapshot testing for large components** unless specifically valuable.

### Performance
- **Avoid N+1** in Prisma (use `include` wisely).
- **Cache**: Use Next data caching where stable; revalidate appropriately.
- **Images**: Use `next/image` when we add images; set sizes.

### Git & CI
- **Conventional commits**: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
- **PR title** mirrors commit type; include a 1–2 line context + “How tested”.
- **CI must pass**: typecheck, build, tests, lint.

### Do / Don’t

**Do**
- Extract reusable UI into `packages/ui` (e.g., `RecipeCard`, `IngredientGroup`).
- Extract pure logic into `src/lib/**` (e.g., MDX parse/serialize, scaling).
- Keep client components minimal; move heavy logic server-side.

**Don’t**
- Don’t put inline styles or styled-jsx in server components.
- Don’t import unapproved deps; propose them first.
- Don’t mix data access directly in big components; wrap in functions.

*This CLAUDE.md is a living document. Update as workflows evolve.*

