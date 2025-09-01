# AGENTS.md

This repo welcomes contributions from AI assistants (ChatGPT, Claude, Cursor Copilot, etc.).  
Agents must follow the same standards and workflows as human contributors to ensure clean, consistent, and reviewable code.

---

## 🎯 Purpose

- Help build the RecipeBook app in phases (see `PLANNING.md` and `TASKS.md`).
- Accelerate feature development (schema updates, UI components, import/export flows, CI/CD).
- Maintain quality, readability, and security of the codebase.

---

## ✅ Allowed Actions

- Implement features from `PLANNING.md` / `TASKS.md`.
- Create and update Prisma schema (`packages/db/schema.prisma`).
- Add Next.js pages, components, hooks, and utilities in `apps/web`.
- Extend or refactor shared packages (`packages/ui`, `packages/editor`, `packages/types`).
- Add tests and update documentation (`README.md`, `*.md` guides).
- Update CI workflows if broken or missing steps.

---

## ❌ Forbidden Actions

- Never commit to `main` directly — always open a PR.
- Do not include secrets, API keys, or `.env` values in commits.
- Avoid dependency upgrades unless explicitly requested.
- Do not overwrite unrelated files when patching.
- Don’t introduce inline CSS — use Tailwind classes or theme tokens.
- Don’t duplicate logic (respect DRY).

---

## 🛠 Standards

- **Code style**: ESLint + Prettier (`pnpm lint && pnpm format`).
- **Principles**: DRY, SOLID, KISS.
- **Styling**: TailwindCSS + theme tokens, no inline styles.
- **Database**: All schema changes go through Prisma migrations.
- **Types**: Use TypeScript everywhere; no `any` unless justified.
- **Commits**: Conventional commits style.

Examples:
- `feat: add recipe print view`
- `fix: correct schema relation for components`
- `chore: update CI workflow for pnpm`

---

## 📂 Repo Conventions

- **apps/web** → Next.js App Router
- **packages/ui** → Themeable UI components
- **packages/editor** → Block editor & MDX serialization
- **packages/db** → Prisma schema & migrations
- **packages/types** → Shared TS types

---

## 🔄 Workflow

1. Create a feature branch (`feat/*`, `fix/*`, `chore/*`).
2. Make scoped, reviewable changes.
3. Run:
   ```bash
   pnpm lint
   pnpm format
   pnpm build
   pnpm test

