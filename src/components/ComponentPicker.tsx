'use client';

import { useState, useEffect } from 'react';

interface Recipe {
  id: string;
  slug: string;
  title: string;
  description?: string;
}

interface ComponentPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function ComponentPicker({ value, onChange, placeholder = "Search recipes..." }: ComponentPickerProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Recipe[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Search recipes as user types
  useEffect(() => {
    if (query.length > 1) {
      setLoading(true);
      searchRecipes(query)
        .then(setResults)
        .finally(() => setLoading(false));
    } else {
      setResults([]);
    }
  }, [query]);

  const searchRecipes = async (searchQuery: string): Promise<Recipe[]> => {
    try {
      const response = await fetch(`/api/recipes/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        return data.slice(0, 10); // Limit to 10 results
      }
      return [];
    } catch (error) {
      console.error('Error searching recipes:', error);
      return [];
    }
  };

  const handleSelect = (recipe: Recipe) => {
    onChange(recipe.slug);
    setQuery(recipe.title);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange(newValue); // Allow manual entry
    setIsOpen(true);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleBlur = () => {
    // Delay closing to allow clicks on results
    setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query || value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="input w-full"
      />
      
      {isOpen && (query.length > 1 || results.length > 0) && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-3 text-center text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            <div>
              {results.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => handleSelect(recipe)}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-900">{recipe.title}</div>
                  <div className="text-sm text-gray-500">{recipe.slug}</div>
                  {recipe.description && (
                    <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {recipe.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : query.length > 1 ? (
            <div className="p-3 text-center text-gray-500">No recipes found</div>
          ) : null}
        </div>
      )}
    </div>
  );
}

