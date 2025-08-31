import { z } from 'zod';

export const UnitSystem = z.enum(['US','METRIC']);
export const RecipeKind = z.enum(['TOP_LEVEL','COMPONENT']);
export const IncludeMode = z.enum(['LINK','INLINE']);
export const RecipeStatus = z.enum(['DRAFT','PUBLISHED','ARCHIVED']);

export const RecipeRef = z.object({
  book: z.string(),
  slug: z.string(),
  version: z.number().int().positive().nullable().optional()
});

export const IngredientLine = z.object({
  group: z.string().nullable().optional(),
  qty: z.union([z.number(), z.string(), z.null()]).optional(),
  unit: z.string().nullable().optional(),
  item: z.string(),
  prep: z.string().nullable().optional(),
  optional: z.boolean().optional().default(false),
  notes: z.string().nullable().optional(),
  position: z.number().int()
});

export const Step = z.object({
  position: z.number().int(),
  text: z.string(),
  timerSec: z.number().int().nullable().optional()
});

export const ComponentEdge = z.object({
  position: z.number().int(),
  target: RecipeRef,
  scale: z.number().positive(),
  include: IncludeMode,
  notes: z.string().nullable().optional()
});

export const Media = z.object({
  kind: z.string(),
  url: z.string().url(),
  alt: z.string().nullable().optional(),
  position: z.number().int()
});

export const RecipeDoc = z.object({
  book: z.string(),
  slug: z.string(),
  kind: RecipeKind,
  title: z.string(),
  subtitle: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  yield: z.object({ qty: z.number().nullable().optional(), unit: z.string().nullable().optional() }).nullable().optional(),
  unitSystem: UnitSystem,
  times: z.object({ prepMin: z.number().int().nullable().optional(), cookMin: z.number().int().nullable().optional(), totalMin: z.number().int().nullable().optional() }).nullable().optional(),
  tags: z.array(z.string()).default([]),
  ingredients: z.array(IngredientLine),
  steps: z.array(Step),
  components: z.array(ComponentEdge).default([]),
  media: z.array(Media).default([]),
  status: RecipeStatus.default('PUBLISHED'),
  version: z.number().int().positive()
});
export type RecipeDoc = z.infer<typeof RecipeDoc>;
