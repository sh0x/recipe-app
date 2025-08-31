import { db } from '@/lib/db';
import Link from 'next/link';

export default async function HomePage(){
  const recipes = await db.recipe.findMany({ orderBy: [{ slug: 'asc' }, { version: 'desc' }] });
  const latestBySlug = new Map<string, typeof recipes[number]>();
  for (const r of recipes) if (!latestBySlug.has(r.slug)) latestBySlug.set(r.slug, r);
  return (
    <main className="space-y-4">
      <h2 className="text-xl font-semibold">All Recipes (latest)</h2>
      <div className="grid gap-3">
        {Array.from(latestBySlug.values()).map(r => (
          <Link key={r.id} href={`/recipes/${r.slug}`} className="card">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{r.title}</div>
                <div className="text-sm text-gray-500">{r.slug} — v{r.version}</div>
              </div>
              <div className="text-sm text-gray-500">{r.yieldQty ? `${r.yieldQty} ${r.yieldUnit ?? ''}` : ''}</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
