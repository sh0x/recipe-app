import matter from 'gray-matter';
import { PrismaClient } from '@prisma/client';
import { RecipeDoc as RecipeDocSchema } from './schema';
import { parseFractionToNumber } from './utils';

const db = new PrismaClient();

export async function parseJson(text: string){
  const obj = JSON.parse(text);
  return RecipeDocSchema.parse(obj);
}

export async function parseMdx(text: string){
  const fm = matter(text);
  const data: any = fm.data;
  const body = fm.content;

  const base: any = {
    book: data.book ?? 'winners',
    slug: data.slug,
    kind: data.kind ?? 'TOP_LEVEL',
    title: data.title,
    subtitle: data.subtitle ?? null,
    description: data.description ?? null,
    yield: data.yield ?? null,
    unitSystem: data.unitSystem ?? 'US',
    times: { prepMin: data.prepMin ?? null, cookMin: data.cookMin ?? null, totalMin: data.totalMin ?? null },
    tags: Array.isArray(data.tags) ? data.tags : [],
    ingredients: [], steps: [], components: [], media: [],
    status: data.status ?? 'PUBLISHED',
    version: data.version ?? 1
  };

  const lines = body.split(/\r?\n/);
  let i = 0, posIng = 1, posStep = 1, posComp = 1, posMedia = 1;

  while (i < lines.length) {
    const line = lines[i].trim();

    const igOpen = line.match(/^<IngredientGroup\s+title=\"([^\"]+)\"\s*>\s*$/);
    if (igOpen) {
      const group = igOpen[1]; i++;
      while (i < lines.length && !lines[i].trim().startsWith("</IngredientGroup>")) {
        const l = lines[i].trim();
        const m = l.match(/^-\s+(.+)$/);
        if (m) {
          const txt = m[1];
          const parts = txt.split(',');
          const first = parts[0].trim();
          const prep = parts.slice(1).join(',').trim() || null;
          const tokens = first.split(/\s+/);
          let qty: any = null, unit: any = null, item = '';
          if (tokens.length >= 3 && (/^\d/.test(tokens[0]) || tokens[0].includes('/'))) {
            qty = parseFractionToNumber(tokens[0]);
            unit = tokens[1];
            item = tokens.slice(2).join(' ');
          } else if (tokens.length >= 2 && (/^\d/.test(tokens[0]) || tokens[0].includes('/'))) {
            qty = parseFractionToNumber(tokens[0]);
            unit = '';
            item = tokens.slice(1).join(' ');
          } else item = first;
          base.ingredients.push({ group, qty, unit, item, prep, position: posIng++ });
        }
        i++;
      }
      while (i < lines.length && !lines[i].trim().startsWith("</IngredientGroup>")) i++;
      i++; continue;
    }

    const stepOpen = line.match(/^<Step(?:\s+timer=\"(\d+)\"|)>(.*)<\/Step>$/);
    if (stepOpen) {
      const timer = stepOpen[1] ? parseInt(stepOpen[1],10) : null;
      const text = stepOpen[2].trim();
      base.steps.push({ position: posStep++, text, timerSec: timer });
      i++; continue;
    }

    const comp = line.match(/^<ComponentRef\s+([^>]+)\/>$/);
    if (comp) {
      const attrs = comp[1];
      const get = (k:string)=>{
        const m = attrs.match(new RegExp(k+ '\\s*=\\s*\\"([^\\"]+)\\"'));
        return m ? m[1] : null;
      };
      const book = get('book') || 'winners';
      const slug = get('slug');
      const scaleStr = get('scale') || '1';
      const include = get('include') || 'LINK';
      if (slug) base.components.push({ position: posComp++, target: { book, slug, version: null }, scale: parseFloat(scaleStr), include, notes: null });
      i++; continue;
    }

    const media = line.match(/^<Media\s+kind=\"([^\"]+)\"\s+src=\"([^\"]+)\"(?:\s+alt=\"([^\"]+)\")?\s*\/>$/);
    if (media) {
      base.media.push({ kind: media[1], url: media[2], alt: media[3] ?? null, position: posMedia++ });
      i++; continue;
    }

    i++;
  }

  return RecipeDocSchema.parse(base);
}

export async function upsertVersioned(doc: any, overwrite = false){
  const book = await db.book.upsert({
    where: { slug: doc.book },
    create: { slug: doc.book, title: doc.book.replace(/\b\w/g, (c:string)=>c.toUpperCase()) },
    update: {}
  });

  const existing = await db.recipe.findMany({
    where: { bookId: book.id, slug: doc.slug },
    orderBy: { version: 'desc' }, take: 1
  });
  let version = doc.version || 1;
  if (existing.length) version = overwrite ? existing[0].version : existing[0].version + 1;

  const created = await db.recipe.create({
    data: {
      bookId: book.id, slug: doc.slug, kind: doc.kind, title: doc.title,
      subtitle: doc.subtitle ?? undefined, description: doc.description ?? undefined,
      yieldQty: doc.yield?.qty ?? undefined, yieldUnit: doc.yield?.unit ?? undefined,
      unitSystem: doc.unitSystem, prepMin: doc.times?.prepMin ?? undefined, cookMin: doc.times?.cookMin ?? undefined, totalMin: doc.times?.totalMin ?? undefined,
      status: doc.status, version,
      ingredients: { create: doc.ingredients.map((ing:any)=>({ groupName: ing.group ?? undefined, qty: typeof ing.qty==='string'? parseFloat(ing.qty) : (ing.qty ?? undefined), unit: ing.unit ?? undefined, item: ing.item, prep: ing.prep ?? undefined, optional: ing.optional ?? false, notes: ing.notes ?? undefined, position: ing.position })) },
      steps: { create: doc.steps.map((st:any)=>({ text: st.text, timerSec: st.timerSec ?? undefined, position: st.position })) },
      components: { create: doc.components.map((c:any)=>({ targetBook: c.target.book, targetSlug: c.target.slug, targetVersion: c.target.version ?? undefined, scale: c.scale, includeMode: c.include, notes: c.notes ?? undefined, position: c.position })) },
      media: { create: doc.media.map((m:any)=>({ kind: m.kind, url: m.url, alt: m.alt ?? undefined, position: m.position })) }
    }
  });

  return created;
}
