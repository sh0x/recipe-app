🌱 1. Variations (“Recipe DNA”)

Branching Recipes: A parent recipe can spawn variations — like “Crispy Tofu (base)” with children: Crispy Tofu Sichuan-Style, Crispy Tofu Za’atar, Crispy Tofu Lemon-Herb.

Delta Editing: Instead of duplicating the whole recipe, variations store only the differences (e.g. “swap spice blend”, “change marinade”). Cleaner DB + UI.

Quick Toggle: User can flip through variations on one screen (like tabs: Base, Asian, Mediterranean, Fusion).

Version Tree UI: Think git branching, but for recipes — visualize how one recipe evolves into spinoffs.

🔗 2. Interactive Arcs / Menus

Arcs as Narratives: “Day 1: Carnitas” → “Day 2: Carnitas Bowls” → “Day 3: Enchiladas Rojas.” Authors can tell a story with food.

Smart Leftovers: Arc builder can tag a recipe’s outputs as “leftover” → link into the next recipe. System shows expected re-use (like, “reserve 1 cup beans for tomorrow”).

Guided Mode: An arc could become an interactive “plan,” stepping the cook through each day with reminders.

Marketplace Angle: Imagine YouTube chefs publishing arcs: “3 Days of Tofu,” “5 Nights of Oaxaca,” etc.

🎭 3. Personalization / Play

Flavor Packs: Apply a “theme” to a base recipe (like skins in a game): Mexican, Mediterranean, Korean. The system auto-swaps spice blends or sauces.

Sliders: UI for adjusting heat, richness, time → app suggests modifications (swap chili, skip sauce, halve simmer time).

Diet Filters: Toggle “vegetarian / gluten-free” → recipe rewrites with component swaps.

📖 4. Author / Reader UX

Interactive Book Mode: Readers navigate like a choose-your-own-adventure book. “Want to take this carnitas into tacos, or into rice bowls?”

Embedded Video + Steps: Import YouTube/TikTok chapters directly into recipe steps.

Smart Print: Print view auto-condenses just today’s plan or whole arc, optimized for shopping lists.

🛠 5. Utility Features

Ingredient Intelligence:

Auto-detect pantry overlap across an arc → smart grocery list.

Show “what else can I make with the same base spice blend or beans.”

Scaling Magic:

Scale not just yields, but arcs. Ex: “4 people → 2 days of carnitas arc.”

Seasonal Mode:

Tag recipes as “in season” with your local produce calendar (like Zone 9 for you).

🔮 Differentiation vs Big Players

Paprika/NYT Cooking/Whisk are basically static collections.

You’d be: dynamic recipes + branching arcs + variation system.

Think “GitHub for food” (fork, branch, remix).


# UTILITY

🥘 Home Cook Utility First — Roadmap
1. Variations (Recipe DNA Lite)

Allow recipes to have child variations.

Store only differences (ingredients swapped, steps added/removed, spice blend changed).

UI: toggle between Base and Variation.

➡️ Use case: Crispy Tofu (base) → Crispy Tofu Sichuan-Style → Crispy Tofu Lemon-Herb.

2. Arcs (Smart Leftovers)

Arcs = sequence of recipes with “leftover reuse.”

Mark outputs from Day 1 as inputs for Day 2.

App auto-tracks “reserve 1 cup beans” → Day 2 knows you already cooked beans.

➡️ Use case: Carnitas → Burrito Bowls → Enchiladas Rojas.

3. Ingredient Intelligence

Shopping list groups overlapping ingredients across recipes in an arc.

“Smart reuse” suggestions:

You added “parsley” → app shows which other recipes use parsley.

Cook beans once, split into multiple recipes.

➡️ Use case: One bag Rancho Gordo beans → salad, stew, soup across 3 days.

4. Print & Plan

Print per-day view (just today’s recipes + leftover notes).

Print whole arc view (condensed grocery + all recipes).

Calendar export (Day 1, Day 2…).

5. Command Palette + Search

Cmd/Ctrl-K: quickly pull up any recipe.

Search filters: by tag, ingredient, time.

Arcs searchable too.

🔮 Phase 1 Killer Differentiator

You’re not just collecting recipes → you’re building cooking strategies (variations + arcs) that actually reflect how real people cook:

Make once, reuse smartly.

Branch recipes without duplicating them.

Print/plan seamlessly.

👉 Suggestion: we start MVP of arcs + leftover linkage, because that’s already how you cook IRL. Then we layer variations (branching tofu, branching beans).

Do you want me to sketch a mini-spec just for arcs + leftovers so we can start coding it right away?

You said:
that sounds great yup! lets do this
ChatGPT said:

Heck yes—let’s ship Arcs + Smart Leftovers (MVP).
Here’s a tight, implementation-ready mini-spec you can drop into a PR and start coding.

Arcs + Smart Leftovers — Mini Spec (MVP)
Goals

Plan multi-day sequences of recipes (“arcs”).

Explicitly reserve leftovers from Day N and re-use them in Day N+1.

Get a condensed shopping list and per-day print views.

Data model (Prisma)
1) New models
model Arc {
  id        String      @id @default(cuid())
  bookId    String
  book      Book        @relation(fields: [bookId], references: [id])
  slug      String
  title     String
  summary   String?
  days      ArcDay[]
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  @@unique([bookId, slug])
}

model ArcDay {
  id        String      @id @default(cuid())
  arcId     String
  arc       Arc         @relation(fields: [arcId], references: [id])
  index     Int         // 1-based day number
  notes     String?
  items     ArcItem[]   // recipes scheduled on this day

  @@unique([arcId, index])
}

model ArcItem {
  id         String     @id @default(cuid())
  arcDayId   String
  arcDay     ArcDay     @relation(fields: [arcDayId], references: [id])

  // Target recipe ref
  bookId     String
  recipeSlug String
  version    Int?       // optional lock
  scale      Float      @default(1)

  // Optional instance-level tweaks
  notes      String?

  // Leftover linkage
  // e.g., this item CONSUMES “black-beans” from Day 1 and PRODUCES “shredded-pork” for later
  produces   ArcStock[] @relation("Produces")
  consumes   ArcUse[]   @relation("Consumes")
}

model ArcStock {
  id        String   @id @default(cuid())
  itemId    String
  item      ArcItem  @relation("Produces", fields: [itemId], references: [id])
  key       String   // stable slug, e.g., "black-beans", "garlic-mojo"
  label     String   // human label shown in UI
  qty       Float?   // optional
  unit      String?  // optional
  notes     String?
}

model ArcUse {
  id        String   @id @default(cuid())
  itemId    String
  item      ArcItem  @relation("Consumes", fields: [itemId], references: [id])
  key       String   // must match an ArcStock.key produced on or before previous day(s)
  qty       Float?
  unit      String?
  notes     String?
}


Why this shape?

Arc → ArcDay → ArcItem keeps days ordered and items grouped.

ArcStock/ArcUse make leftover flows explicit and queryable.

Keys (e.g., "black-beans") let you reuse from any prior day, not just the day immediately before.

Derived behaviors

Validation (server-side):

Every ArcUse.key must match a ArcStock.key from a previous day (not future).

Optionally: warn (not error) if total use.qty > total prior stock.qty.

Shopping list:

Base = sum of ingredients of all ArcItem recipes (scaled).

Subtract ingredients covered by consumed leftovers (if the consumed stock represents already-cooked items that include those ingredients).

MVP simplification: just list stocks to produce on Day N and stocks consumed on Day N+1. (Full ingredient subtraction logic can come later.)

Print:

/arcs/[slug]/print prints either (a) whole arc, or (b) a ?day=2 focused print.

Each day prints: items (recipes), “Produce today” (stocks), “Consume today” (uses), and notes.

API surface (MVP)

GET /api/arcs/:slug → arc + days + items + stocks/uses (for UI + print).

POST /api/arcs → create arc (with days).

PUT /api/arcs/:id → upsert arc, days, items (accept a single JSON payload).

GET /api/arcs/:slug/shopping-list → returns normalized list: { name, qty?, unit?, day }[].

(Optional) GET /api/arcs → list arcs for a book.

Payload shape for upsert (MVP):

type ArcUpsert = {
  bookSlug: string;
  slug: string;
  title: string;
  summary?: string;
  days: Array<{
    index: number; // 1..N
    notes?: string;
    items: Array<{
      bookSlug: string;
      recipeSlug: string;
      version?: number | null;
      scale?: number;
      notes?: string;
      produces?: Array<{ key: string; label: string; qty?: number; unit?: string; notes?: string }>;
      consumes?: Array<{ key: string; qty?: number; unit?: string; notes?: string }>;
    }>;
  }>;
};

UI (MVP)
Pages

GET /arcs — list arcs (title, days, quick actions).

GET /arcs/[slug] — detail view:

Day tabs (Day 1, Day 2, …).

For each day:

Items → link to recipe pages; show scale ×.

“Produce today” panel (stocks).

“Consume today” panel (uses), with badges linking back to the producing day.

GET /arcs/[slug]/print[?day=N] — printer-friendly layout.

GET /arcs/new — quick creator (see below).

Creator (MVP-first)

Quick Builder at /arcs/new:

Book selector (if multiple later; default single book now).

Title, slug (auto from title).

Repeater for Days:

Repeater for Items:

Recipe picker (combobox fetching recipes by slug/title).

Scale (0.25×, 0.5×, 1×, 2×).

“Produces” repeater: key, label, qty/unit, notes.

“Consumes” repeater: key (autocomplete from previously produced keys), qty/unit, notes.

Validate button: runs server validation; shows warnings/errors inline.

Save → calls POST /api/arcs.

Command Palette

Add “Arc: New”, “Arc: Open …” actions.

Import/Export

JSON export: add GET /api/arcs/:slug/export returning the ArcUpsert structure above.

JSON import: add to the existing Import screen a new tab “Import Arc (JSON)”.

Minimal seed example
{
  "bookSlug": "winners",
  "slug": "carnitas-3-day",
  "title": "Carnitas: 3-Day Flow",
  "summary": "Cook once, riff twice.",
  "days": [
    {
      "index": 1,
      "items": [
        {
          "bookSlug": "winners",
          "recipeSlug": "carnitas-confit",
          "scale": 1,
          "produces": [
            { "key": "carnitas-meat", "label": "Shredded carnitas", "qty": 4, "unit": "cups" },
            { "key": "lard", "label": "Reserved lard", "qty": 2, "unit": "cups" }
          ]
        },
        {
          "bookSlug": "winners",
          "recipeSlug": "epazote-black-beans-epic",
          "scale": 1,
          "produces": [
            { "key": "black-beans", "label": "Cooked black beans", "qty": 4, "unit": "cups" }
          ]
        }
      ]
    },
    {
      "index": 2,
      "items": [
        {
          "bookSlug": "winners",
          "recipeSlug": "dragon-drip-bowl",
          "scale": 1,
          "consumes": [
            { "key": "carnitas-meat", "qty": 2, "unit": "cups" },
            { "key": "black-beans", "qty": 1, "unit": "cups" }
          ]
        }
      ]
    },
    {
      "index": 3,
      "items": [
        {
          "bookSlug": "winners",
          "recipeSlug": "enchiladas-rojas-pollo",
          "scale": 1,
          "consumes": [
            { "key": "carnitas-meat", "qty": 2, "unit": "cups" }
          ]
        }
      ]
    }
  ]
}

Incremental delivery plan (PR checklist)

Branch: feat/arcs-mvp

DB + Types

 Add models (Arc, ArcDay, ArcItem, ArcStock, ArcUse) to Prisma.

 pnpm prisma migrate dev -n arcs_mvp

 Add shared TS types for ArcUpsert, ArcView.

Server

 GET /api/arcs/:slug (load full nested structure).

 POST /api/arcs (upsert with validation).

 Validation: ensure consumes.key exists in prior days.

UI

 Pages: /arcs, /arcs/[slug], /arcs/new.

 Day Tabs UX; produce/consume panels.

 Recipe combobox (server-filtered) + scale input.

Print

 /arcs/[slug]/print whole arc.

 /arcs/[slug]/print?day=N per-day print.

Import/Export

 GET /api/arcs/:slug/export

 Import Arc (JSON) tab in existing Import UI.

Seeds

 Seed one small arc (like example above).

 Page list displays it and opens correctly.

CI

 Ensure migrations run (prisma migrate deploy) and build passes.

Validation logic (pseudo)
function validateArc(arc: ArcUpsert) {
  const produced = new Map<number, Set<string>>(); // dayIndex -> keys

  for (const day of arc.days.sort((a,b)=>a.index-b.index)) {
    const seen = new Set<string>();
    // Track produces
    for (const item of day.items) {
      for (const p of item.produces ?? []) {
        if (!p.key.match(/^[a-z0-9-]+$/)) throw new Error(`Invalid stock key: ${p.key}`);
        seen.add(p.key);
      }
    }
    produced.set(day.index, seen);

    // Validate consumes: must exist in any previous day
    const previousKeys = new Set<string>();
    for (const i of Array.from(produced.keys()).filter(k => k < day.index)) {
      for (const k of produced.get(i)!) previousKeys.add(k);
    }
    for (const item of day.items) {
      for (const c of item.consumes ?? []) {
        if (!previousKeys.has(c.key)) {
          throw new Error(`Consumes '${c.key}' on Day ${day.index} but it was never produced earlier`);
        }
      }
    }
  }
}


Future: optional qty reconciliation (sum produce.qty vs sum consume.qty) can warn if over-consumption.

UX Notes

Stocks and Uses show as chips on each ArcItem. Clicking a “consumes: black-beans” chip jumps to the day where it was produced.

In the Arc builder, the “Consumes key” field autocompletes from prior-day keys.

For now, no ingredient subtraction math — just clearly show produce/consume flows.

Future (not in MVP)

Auto grocery list math: derive reductions when consuming a stock whose source recipe’s ingredients are known (e.g., if you consume 2 cups of beans, subtract that portion of dried beans/water/aromatics from Day 2).

Leftover aging: warn if consuming a stock too many days later.

Calendar integration: export arc to calendar with reminders.
