'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage(){
  const [recipes, setRecipes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch recipes based on search query
  useEffect(() => {
    async function fetchRecipes() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedQuery) {
          params.append('q', debouncedQuery);
        }
        const response = await fetch(`/api/recipes/search?${params}`);
        if (response.ok) {
          const data = await response.json();
          setRecipes(data);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, [debouncedQuery]);

  return (
    <main className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">All Recipes (latest)</h2>
        
        <div>
          <input
            type="text"
            placeholder="Search recipes by title, ingredients, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input w-full"
          />
        </div>

        {loading && (
          <div className="text-center text-gray-500">Searching...</div>
        )}
      </div>

      <div className="grid gap-3">
        {recipes.map(r => (
          <Link key={r.id} href={`/recipes/${r.slug}`} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{r.title}</div>
                <div className="text-sm text-gray-500">{r.slug} — v{r.version}</div>
                {r.description && (
                  <div className="text-sm text-gray-600 mt-1 line-clamp-2">{r.description}</div>
                )}
              </div>
              <div className="text-sm text-gray-500">{r.yieldQty ? `${r.yieldQty} ${r.yieldUnit ?? ''}` : ''}</div>
            </div>
          </Link>
        ))}
      </div>

      {!loading && recipes.length === 0 && debouncedQuery && (
        <div className="text-center text-gray-500">
          No recipes found for "{debouncedQuery}"
        </div>
      )}
    </main>
  );
}
