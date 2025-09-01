import { db } from '@/lib/db';
import Link from 'next/link';

export default async function RecipePage({ params }: { params: { slug: string } }){
  const { slug } = params;
  const recipe = await db.recipe.findFirst({
    where: { slug }, orderBy: { version: 'desc' },
    include: { ingredients: true, steps: true, components: true, media: true, book: true }
  });
  if (!recipe) return <div>Not found.</div>;

  const grouped = recipe.ingredients.reduce((acc: Record<string, typeof recipe.ingredients>, ing) => {
    const key = ing.groupName ?? 'Ingredients'; (acc[key] ||= []).push(ing as any); return acc;
  }, {});

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{recipe.title}</h2>
          <div className="text-sm text-gray-500">{recipe.slug} — v{recipe.version}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">{recipe.yieldQty ? `${recipe.yieldQty} ${recipe.yieldUnit ?? ''}` : ''}</div>
          <Link href={`/recipes/${recipe.slug}/print`} className="btn">Print</Link>
        </div>
      </div>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {Object.entries(grouped).map(([group, list]) => (
            <div key={group} className="card">
              <div className="font-medium mb-2">{group}</div>
              <ul className="space-y-1">
                {list.sort((a,b)=>a.position-b.position).map(ing => (
                  <li key={ing.id} className="text-sm">
                    {ing.qty != null ? <><strong>{ing.qty}</strong> {ing.unit} </> : null}{ing.item}{ing.prep ? `, ${ing.prep}` : ''}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="card">
            <div className="font-medium mb-2">Steps</div>
            <ol className="list-decimal ml-5 space-y-2">
              {recipe.steps.sort((a,b)=>a.position-b.position).map(st => (
                <li key={st.id} className="text-sm">
                  {st.text} {st.timerSec ? <span className="text-gray-500">({Math.round(st.timerSec/60)} min)</span> : null}
                </li>
              ))}
            </ol>
          </div>

          {recipe.components.length ? (
            <div className="card">
              <div className="font-medium mb-2">Components</div>
              <ul className="space-y-1">
                {recipe.components.sort((a,b)=>a.position-b.position).map(c => (
                  <li key={c.id} className="text-sm">
                    Uses <Link className="underline" href={`/recipes/${c.targetSlug}`}>{c.targetSlug}</Link> × {c.scale} ({c.includeMode})
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      {recipe.media.length ? (
        <section className="space-y-2">
          <div className="font-medium">Media</div>
          <div className="grid grid-cols-2 gap-3">
            {recipe.media.sort((a,b)=>a.position-b.position).map(m => (
              <img key={m.id} src={m.url} alt={m.alt ?? ''} className="rounded-lg border" />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
