'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface InlineComponentProps {
  targetSlug: string;
  scale: number;
  includeMode: 'LINK' | 'INLINE';
}

interface ComponentRecipe {
  id: string;
  title: string;
  ingredients: Array<{
    groupName: string | null;
    qty: number | null;
    unit: string | null;
    item: string;
    prep: string | null;
    position: number;
  }>;
  steps: Array<{
    text: string;
    timerSec: number | null;
    position: number;
  }>;
}

export default function InlineComponent({ targetSlug, scale, includeMode }: InlineComponentProps) {
  const [recipe, setRecipe] = useState<ComponentRecipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (includeMode === 'INLINE') {
      fetchComponentRecipe();
    }
  }, [targetSlug, includeMode]);

  const fetchComponentRecipe = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/recipes/${targetSlug}`);
      if (response.ok) {
        const data = await response.json();
        setRecipe(data);
      } else {
        setError('Component recipe not found');
      }
    } catch (err) {
      setError('Failed to load component recipe');
    } finally {
      setLoading(false);
    }
  };

  if (includeMode === 'LINK') {
    return (
      <span className="text-sm">
        Uses <Link className="underline" href={`/recipes/${targetSlug}`}>{targetSlug}</Link> × {scale}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="text-sm text-gray-500">
        Loading {targetSlug}...
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="text-sm text-red-500">
        Error loading {targetSlug}: {error || 'Not found'}
      </div>
    );
  }

  // Group ingredients by group name
  const groupedIngredients = recipe.ingredients.reduce((acc: Record<string, typeof recipe.ingredients>, ing) => {
    const key = ing.groupName ?? 'Ingredients';
    (acc[key] ||= []).push(ing);
    return acc;
  }, {});

  return (
    <div className="border-l-2 border-gray-200 pl-4 my-4">
      <div className="text-sm font-medium text-gray-700 mb-2">
        {recipe.title} × {scale}
      </div>
      
      {/* Scaled Ingredients */}
      <div className="space-y-2 mb-3">
        {Object.entries(groupedIngredients).map(([group, ingredients]) => (
          <div key={group}>
            <div className="text-xs font-medium text-gray-600">{group}</div>
            <ul className="text-xs space-y-1">
              {ingredients.sort((a, b) => a.position - b.position).map((ing, index) => (
                <li key={index} className="text-gray-700">
                  {ing.qty != null ? (
                    <span className="font-medium">{(ing.qty * scale).toFixed(ing.qty % 1 === 0 ? 0 : 1)} {ing.unit} </span>
                  ) : null}
                  {ing.item}
                  {ing.prep ? <span className="text-gray-500">, {ing.prep}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Scaled Steps */}
      <div className="text-xs">
        <div className="font-medium text-gray-600 mb-1">Steps:</div>
        <ol className="list-decimal ml-4 space-y-1">
          {recipe.steps.sort((a, b) => a.position - b.position).map((step, index) => (
            <li key={index} className="text-gray-700">
              {step.text}
              {step.timerSec && (
                <span className="text-gray-500"> ({Math.round(step.timerSec / 60)} min)</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}


