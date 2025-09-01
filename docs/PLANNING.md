# RecipeBook Planning

High-level planning notes for phases, goals, and priorities.

---

## Vision

RecipeBook is a **private-first digital cookbook** that grows into a **multi-creator marketplace**.  
Start simple (you + your tested winners), then scale to collaboration and eventually paid books.

---

## Phases

### Phase 1 — Single-user MVP
- Core schema (Prisma + Postgres)
- Import/export recipes (JSON + MDX)
- Print-friendly layouts
- Component recipes with `<ComponentRef>`
- Search, collections, arcs
- Basic PWA (offline read of recent recipes)

### Phase 2 — Collaboration
- User accounts (NextAuth)
- Multiple books per user
- Book visibility (PRIVATE, UNLISTED, PUBLIC)
- Share links with tokens
- Roles: Owner, Editor, Viewer
- Theme tokens + template layouts

### Phase 3 — Marketplace
- Multi-creator accounts
- Stripe Connect integration
- Public discoverability
- Theme + template marketplace
- Optional paywalls (per-recipe or per-book)

---

## Guiding Principles

1. **Private-first** — Your recipes live with you; sharing is explicit.  
2. **Durable linking** — Slugs + versions mean links never break.  
3. **Import/export as contract** — JSON is canonical, MDX for humans.  
4. **Offline support** — Recipes available even when cooking without internet.  
5. **Incremental adoption** — Each phase is valuable on its own.

---

## Open Questions

- How much editing power in Phase 1? (Rich editor vs plain inputs)  
- Where to run first hosted DB? (Supabase vs Neon vs local only)  
- Should scaling math be MVP or Phase 2+?  

