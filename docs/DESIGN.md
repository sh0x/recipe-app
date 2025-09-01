# RecipeBook PRD  

**Project**: RecipeBook — “Tested Winners”  
**Owner**: Jason Long  
**Date**: 2025-09-01  
**Version**: v1.0  

---

## 1. Overview  

RecipeBook is a private-first recipe book web app designed for fast creation, linking, and navigation of tested recipes. It supports recipes that embed other recipes (sub-recipes), has print-friendly views, and evolves into a multi-creator marketplace where creators can theme, sell, and share books.  

---

## 2. Goals  

- Centralize “winner” recipes in a modern, easy-to-update format.  
- Support **recipe linking** (components, sub-recipes).  
- Provide **import/export** (JSON + MDX).  
- Offer **beautiful print layouts**.  
- Build a roadmap to expand from personal → collaborative → marketplace.  

---

## 3. Non-goals (for now)  

- Automated nutrition calculation.  
- Complex user analytics or social features.  
- Native mobile app (PWA covers basic offline use).  

---

## 4. Target Users  

- **Phase 1 (MVP)**: Individual home cooks (Jason).  
- **Phase 2**: Friends, family, collaborators.  
- **Phase 3**: Recipe creators selling curated cookbooks.  

---

## 5. Phased Implementation  

### Phase 1 — Single-user MVP (You-only)  

**Features**  
- Create/edit recipes.  
- Component recipes (sub-recipes) with scaling.  
- Linking: `<ComponentRef />` between recipes.  
- Print mode: condensed print view.  
- Import/export (JSON + MDX).  
- PWA basics (offline cache for recent items).  
- Seed system: preload known “winner” recipes.  

**Success Criteria**  
- Jason can add 20+ recipes, including linked ones.  
- Can print a recipe in clean format.  
- Can import/export without data loss.  

---

### Phase 2 — Collaboration  

**Features**  
- User accounts (NextAuth: email/OAuth).  
- Multiple books per user.  
- Book-level visibility: PRIVATE, UNLISTED, PUBLIC.  
- Share links (tokenized guest access).  
- Roles: Owner, Editor, Viewer.  
- Collections and arcs (multi-recipe flows).  
- Theming (basic tokens for fonts/colors).  

**Success Criteria**  
- Jason can share a recipe book privately with friends.  
- Collaborators can add/edit recipes in shared books.  
- Print and links work seamlessly in shared mode.  

---

### Phase 3 — Marketplace  

**Features**  
- Multi-creator tenant accounts.  
- Themes/templates marketplace.  
- Stripe Connect for paid books.  
- Per-book or per-recipe paywalls.  
- Public discoverability (search, browse).  

**Success Criteria**  
- Any creator can design and sell a themed book.  
- Users can browse, preview, and purchase books.  
- Revenue flows via Stripe Connect.  

---

## 6. Tech Stack  

- **Frontend**: Next.js (App Router), Tailwind.  
- **Backend**: Prisma + Postgres.  
- **Storage**: S3/R2 (media).  
- **Auth**: NextAuth.  
- **PWA**: next-pwa + Workbox.  
- **Editor**: TipTap/Lexical block editor.  
- **CI/CD**: GitHub Actions.  

---

## 7. Risks & Mitigations  

- **Data migration** (recipes evolving schema). → Use Prisma migrations + versioned imports.  
- **Offline caching complexity**. → Cache last N recipes, fallback to online for rest.  
- **Marketplace payments overhead.** → Defer until Phase 3, use Stripe Connect templates.  

---

## 8. Milestones & Timeline  

- **M1: Phase 1 MVP (2–3 sprints)**  
  - Core schema, recipe CRUD, import/export, print view.  

- **M2: Phase 2 Collab (4–6 sprints)**  
  - Auth, sharing, roles, collections/arcs, themes.  

- **M3: Phase 3 Marketplace (6–8 sprints)**  
  - Multi-tenant, templates/themes store, Stripe Connect.  

---
