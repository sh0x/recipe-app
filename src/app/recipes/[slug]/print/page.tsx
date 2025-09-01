'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import InlineComponent from '@/components/InlineComponent';

export default function RecipePrintPage({ params }: { params: { slug: string } }){
  const { slug } = params;
  const [recipe, setRecipe] = useState<any>(null);
  const [usedInRecipes, setUsedInRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        // Fetch the recipe
        const recipeResponse = await fetch(`/api/recipes/${slug}`);
        if (recipeResponse.ok) {
          const recipeData = await recipeResponse.json();
          setRecipe(recipeData);
        }

        // Fetch recipes that use this recipe as a component
        const usedInResponse = await fetch(`/api/recipes/used-in/${slug}`);
        if (usedInResponse.ok) {
          const usedInData = await usedInResponse.json();
          
          // Deduplicate to get only latest versions
          const latestBySlug = new Map();
          for (const recipe of usedInData) {
            const existing = latestBySlug.get(recipe.slug);
            if (!existing || recipe.version > existing.version) {
              latestBySlug.set(recipe.slug, recipe);
            }
          }
          
          setUsedInRecipes(Array.from(latestBySlug.values()));
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipe();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (!recipe) return <div>Not found.</div>;

  const grouped = recipe.ingredients.reduce((acc: Record<string, typeof recipe.ingredients>, ing) => {
    const key = ing.groupName ?? 'Ingredients'; (acc[key] ||= []).push(ing as any); return acc;
  }, {});

  return (
    <div className="print-optimized">
      <style jsx>{`
        @media print {
          body { margin: 0; padding: 0; }
          .print-optimized { 
            max-width: none; 
            margin: 0; 
            padding: 0.5in; 
            font-size: 12px; 
            line-height: 1.3;
          }
          .no-print { display: none !important; }
          .page-break { page-break-before: always; }
          .avoid-break { page-break-inside: avoid; }
        }
        .print-optimized {
          max-width: 8.5in;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Times New Roman', serif;
        }
        .recipe-header {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #000;
          padding-bottom: 10px;
        }
        .recipe-title {
          font-size: 24px;
          font-weight: bold;
          margin: 0;
        }
        .recipe-meta {
          font-size: 14px;
          color: #666;
          margin: 5px 0;
        }
        .recipe-yield {
          font-size: 14px;
          font-weight: bold;
        }
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-top: 20px;
        }
        .ingredients-section {
          border: 1px solid #ccc;
          padding: 15px;
          border-radius: 5px;
        }
        .ingredient-group {
          margin-bottom: 15px;
        }
        .group-title {
          font-weight: bold;
          font-size: 16px;
          border-bottom: 1px solid #ccc;
          padding-bottom: 5px;
          margin-bottom: 8px;
        }
        .ingredient-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .ingredient-item {
          margin-bottom: 3px;
          font-size: 14px;
        }
        .ingredient-qty {
          font-weight: bold;
        }
        .steps-section {
          border: 1px solid #ccc;
          padding: 15px;
          border-radius: 5px;
        }
        .steps-title {
          font-weight: bold;
          font-size: 16px;
          border-bottom: 1px solid #ccc;
          padding-bottom: 5px;
          margin-bottom: 10px;
        }
        .steps-list {
          list-style: decimal;
          padding-left: 20px;
          margin: 0;
        }
        .step-item {
          margin-bottom: 8px;
          font-size: 14px;
        }
        .step-timer {
          color: #666;
          font-style: italic;
        }
        .components-section {
          margin-top: 20px;
          border: 1px solid #ccc;
          padding: 15px;
          border-radius: 5px;
        }
        .components-title {
          font-weight: bold;
          font-size: 16px;
          border-bottom: 1px solid #ccc;
          padding-bottom: 5px;
          margin-bottom: 10px;
        }
        .component-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .component-item {
          margin-bottom: 3px;
          font-size: 14px;
        }
        .inline-component {
          border-left: 2px solid #ccc;
          padding-left: 15px;
          margin: 10px 0;
        }
        .inline-component-title {
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 8px;
        }
        .inline-ingredients {
          margin-bottom: 10px;
        }
        .inline-ingredient-group {
          margin-bottom: 8px;
        }
        .inline-group-title {
          font-weight: bold;
          font-size: 12px;
          border-bottom: 1px solid #ccc;
          padding-bottom: 3px;
          margin-bottom: 5px;
        }
        .inline-ingredient-item {
          font-size: 12px;
          margin-bottom: 2px;
        }
        .inline-steps {
          font-size: 12px;
        }
        .inline-steps-title {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .back-link {
          position: fixed;
          top: 20px;
          left: 20px;
          background: #fff;
          border: 1px solid #ccc;
          padding: 10px 15px;
          border-radius: 5px;
          text-decoration: none;
          color: #333;
          font-size: 14px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>

      <Link href={`/recipes/${recipe.slug}`} className="back-link no-print">
        ← Back to Recipe
      </Link>

      <div className="recipe-header">
        <h1 className="recipe-title">{recipe.title}</h1>
        <div className="recipe-meta">{recipe.slug} — v{recipe.version}</div>
        {recipe.yieldQty && (
          <div className="recipe-yield">Yield: {recipe.yieldQty} {recipe.yieldUnit ?? ''}</div>
        )}
      </div>

      <div className="content-grid">
        <div className="ingredients-section">
          <div className="steps-title">Ingredients</div>
          {Object.entries(grouped).map(([group, list]) => (
            <div key={group} className="ingredient-group">
              <div className="group-title">{group}</div>
              <ul className="ingredient-list">
                {list.sort((a,b)=>a.position-b.position).map(ing => (
                  <li key={ing.id} className="ingredient-item">
                    {ing.qty != null && (
                      <span className="ingredient-qty">{ing.qty} {ing.unit} </span>
                    )}
                    {ing.item}
                    {ing.prep && `, ${ing.prep}`}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="steps-section">
          <div className="steps-title">Instructions</div>
          <ol className="steps-list">
            {recipe.steps.sort((a,b)=>a.position-b.position).map(st => (
              <li key={st.id} className="step-item">
                {st.text}
                {st.timerSec && (
                  <span className="step-timer"> ({Math.round(st.timerSec/60)} min)</span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {recipe.components.length > 0 && (
        <div className="components-section">
          <div className="components-title">Components</div>
          <div className="component-list">
            {recipe.components.sort((a,b)=>a.position-b.position).map(c => (
              <InlineComponent
                key={c.id}
                targetSlug={c.targetSlug}
                scale={c.scale}
                includeMode={c.includeMode}
              />
            ))}
          </div>
        </div>
      )}

      {/* Used In Section */}
      {usedInRecipes.length > 0 && (
        <div className="components-section">
          <div className="components-title">Used In</div>
          <div className="component-list">
            {usedInRecipes.map(usedInRecipe => {
              const component = usedInRecipe.components?.find((c: any) => c.targetSlug === slug);
              return (
                <div key={usedInRecipe.id} className="component-item">
                  {usedInRecipe.title} × {component?.scale || 1} 
                  {component?.includeMode === 'INLINE' ? ' (inline)' : ' (link)'}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
