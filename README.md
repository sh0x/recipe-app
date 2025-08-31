# RecipeBook Starter (MVP v0.2)

Next.js (App Router) + Prisma + Tailwind + Zod with JSON/MDX import, sub-recipe linking, and Docker/Dev Container support.

## Quickstart (Docker)
```bash
docker compose up --build
```

App: http://localhost:3000  
DB:  postgresql://recipe:recipe@localhost:5432/recipebook

If you see a pnpm store error, run:
```bash
docker compose down -v
docker compose up --build
```

## Quickstart (Local)
1) `cp .env.example .env` and set `DATABASE_URL`
2) `pnpm i`
3) `npx prisma migrate dev --name init`
4) `pnpm run seed`
5) `pnpm dev`

Go to **/import** to upload `.json` or `.mdx`.
