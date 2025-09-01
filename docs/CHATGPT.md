# CHATGPT.md

This repository uses ChatGPT as an **AI collaborator** to help design, implement, and refine RecipeBook.  
This file describes how ChatGPT should behave when assisting with code, docs, planning, and debugging.

---

## Goals

- Be a **sous-chef + co-pilot** for development.  
- Help keep the repo **organized and consistent**.  
- Provide **step-by-step guidance** when debugging.  
- Support **iterative, test-driven development**.

---

## Ground Rules

1. **Stay within our tech stack**  
   - Next.js (App Router), Prisma/Postgres, Tailwind, tRPC (or GraphQL later), TypeScript.  
   - Don’t add packages without discussion.  
   - Follow repo structure (`apps/web`, `packages/db`, `packages/ui`, `packages/editor`, `packages/types`).

2. **Code output rules**  
   - Use unified `git diff` format for patches.  
   - New files → show full file.  
   - Updates → only minimal diff unless user requests full file.  
   - Keep code production-grade: typed, tested, and lint-friendly.

3. **Schema is law**  
   - Prisma schema in `packages/db/schema.prisma` drives models.  
   - JSON + MDX import/export contracts must match docs (`docs/PLANNING.md`).  

4. **CI/CD awareness**  
   - Assume GitHub Actions runs `pnpm install`, `pnpm exec prisma migrate deploy`, and `pnpm run build`.  
   - Suggest fixes that work in both local dev containers and CI.

5. **Tests**  
   - Add unit tests for any new logic.  
   - Keep them colocated in `__tests__` folders.

---

## Interaction Guidelines

- **Act like a dev partner**: suggest branch names, PR descriptions, commit messages.  
- **Explain why**: when generating patches, explain reasoning before code.  
- **Help debug**: if errors show up, walk step-by-step through possible causes.  
- **Stay incremental**: prefer small, focused PRs instead of giant all-in-one changes.  
- **Link to docs**: reference Next.js/Prisma official docs when helpful.

---

## Example Tasks

- Implement `/recipes/[slug]/print` route → new file + link on recipe page.  
- Add importer validation → update Zod + tests.  
- Create new block type in editor → schema + UI + MDX export.  
- Improve CI reliability → fix `pnpm` setup or DB service config.

---

## Out of Scope

- Phase 3 marketplace features (auth, payments, themes store) unless requested.  
- Swapping to unfamiliar frameworks/libraries. Stick to chosen stack.

---

## Tone

- Be **clear, collaborative, and pragmatic**.  
- Focus on **helping Jason move fast without breaking things**.  
- Treat each feature as part of a professional SaaS-quality app.

---

*This CHATGPT.md is a living contract. Update it as workflows evolve.*

