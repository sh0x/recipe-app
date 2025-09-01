'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ComponentPicker from '@/components/ComponentPicker';

interface Ingredient {
  id: string;
  groupName: string;
  qty: string;
  unit: string;
  item: string;
  prep: string;
  position: number;
}

interface Step {
  id: string;
  text: string;
  timerSec: number | null;
  position: number;
}

interface Component {
  id: string;
  targetSlug: string;
  scale: number;
  includeMode: 'LINK' | 'INLINE';
  position: number;
}

export default function NewRecipePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [yieldQty, setYieldQty] = useState('');
  const [yieldUnit, setYieldUnit] = useState('');
  const [prepMin, setPrepMin] = useState('');
  const [cookMin, setCookMin] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [saving, setSaving] = useState(false);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug) {
      setSlug(generateSlug(value));
    }
  };

  const addIngredient = () => {
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      groupName: 'Ingredients',
      qty: '',
      unit: '',
      item: '',
      prep: '',
      position: ingredients.length + 1,
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: string | number) => {
    setIngredients(ingredients.map(ing => 
      ing.id === id ? { ...ing, [field]: value } : ing
    ));
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
    // Reorder positions
    setIngredients(prev => prev.map((ing, index) => ({ ...ing, position: index + 1 })));
  };

  const addStep = () => {
    const newStep: Step = {
      id: Date.now().toString(),
      text: '',
      timerSec: null,
      position: steps.length + 1,
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (id: string, field: keyof Step, value: string | number | null) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, [field]: value } : step
    ));
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id));
    // Reorder positions
    setSteps(prev => prev.map((step, index) => ({ ...step, position: index + 1 })));
  };

  const addComponent = () => {
    const newComponent: Component = {
      id: Date.now().toString(),
      targetSlug: '',
      scale: 1,
      includeMode: 'LINK',
      position: components.length + 1,
    };
    setComponents([...components, newComponent]);
  };

  const updateComponent = (id: string, field: keyof Component, value: string | number) => {
    setComponents(components.map(comp => 
      comp.id === id ? { ...comp, [field]: value } : comp
    ));
  };

  const removeComponent = (id: string) => {
    setComponents(components.filter(comp => comp.id !== id));
    // Reorder positions
    setComponents(prev => prev.map((comp, index) => ({ ...comp, position: index + 1 })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) return;

    setSaving(true);
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle: subtitle || undefined,
          description: description || undefined,
          slug,
          yieldQty: yieldQty ? parseFloat(yieldQty) : undefined,
          yieldUnit: yieldUnit || undefined,
          prepMin: prepMin ? parseInt(prepMin) : undefined,
          cookMin: cookMin ? parseInt(cookMin) : undefined,
          ingredients: ingredients.map(ing => ({
            groupName: ing.groupName,
            qty: ing.qty ? parseFloat(ing.qty) : undefined,
            unit: ing.unit,
            item: ing.item,
            prep: ing.prep || undefined,
            position: ing.position,
          })),
          steps: steps.map(step => ({
            text: step.text,
            timerSec: step.timerSec,
            position: step.position,
          })),
          components: components.map(comp => ({
            targetSlug: comp.targetSlug,
            scale: comp.scale,
            includeMode: comp.includeMode,
            position: comp.position,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/recipes/${data.slug}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      alert('Error saving recipe');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Create New Recipe</h1>
        <Link href="/" className="btn">Cancel</Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card space-y-4">
          <h2 className="text-lg font-medium">Basic Information</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="input w-full"
                placeholder="Recipe title"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Slug *</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="input w-full"
                placeholder="recipe-slug"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subtitle</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="input w-full"
              placeholder="Optional subtitle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input w-full"
              rows={3}
              placeholder="Brief description of the recipe"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium mb-1">Yield Quantity</label>
              <input
                type="number"
                value={yieldQty}
                onChange={(e) => setYieldQty(e.target.value)}
                className="input w-full"
                placeholder="4"
                step="0.1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Yield Unit</label>
              <input
                type="text"
                value={yieldUnit}
                onChange={(e) => setYieldUnit(e.target.value)}
                className="input w-full"
                placeholder="servings"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Prep Time (min)</label>
              <input
                type="number"
                value={prepMin}
                onChange={(e) => setPrepMin(e.target.value)}
                className="input w-full"
                placeholder="10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cook Time (min)</label>
            <input
              type="number"
              value={cookMin}
              onChange={(e) => setCookMin(e.target.value)}
              className="input w-full"
              placeholder="25"
            />
          </div>
        </div>

        {/* Ingredients */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Ingredients</h2>
            <button type="button" onClick={addIngredient} className="btn">Add Ingredient</button>
          </div>
          
          {ingredients.map((ingredient) => (
            <div key={ingredient.id} className="border rounded-lg p-4 space-y-3">
              <div className="grid gap-3 md:grid-cols-5">
                <div>
                  <label className="block text-sm font-medium mb-1">Group</label>
                  <input
                    type="text"
                    value={ingredient.groupName}
                    onChange={(e) => updateIngredient(ingredient.id, 'groupName', e.target.value)}
                    className="input w-full"
                    placeholder="Ingredients"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Qty</label>
                  <input
                    type="text"
                    value={ingredient.qty}
                    onChange={(e) => updateIngredient(ingredient.id, 'qty', e.target.value)}
                    className="input w-full"
                    placeholder="2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Unit</label>
                  <input
                    type="text"
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(ingredient.id, 'unit', e.target.value)}
                    className="input w-full"
                    placeholder="tbsp"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Item</label>
                  <input
                    type="text"
                    value={ingredient.item}
                    onChange={(e) => updateIngredient(ingredient.id, 'item', e.target.value)}
                    className="input w-full"
                    placeholder="olive oil"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Prep Notes</label>
                <input
                  type="text"
                  value={ingredient.prep}
                  onChange={(e) => updateIngredient(ingredient.id, 'prep', e.target.value)}
                  className="input w-full"
                  placeholder="finely chopped, optional"
                />
              </div>
              
              <button
                type="button"
                onClick={() => removeIngredient(ingredient.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove Ingredient
              </button>
            </div>
          ))}
        </div>

        {/* Steps */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Steps</h2>
            <button type="button" onClick={addStep} className="btn">Add Step</button>
          </div>
          
          {steps.map((step) => (
            <div key={step.id} className="border rounded-lg p-4 space-y-3">
              <div className="grid gap-3 md:grid-cols-4">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium mb-1">Step {step.position}</label>
                  <textarea
                    value={step.text}
                    onChange={(e) => updateStep(step.id, 'text', e.target.value)}
                    className="input w-full"
                    rows={2}
                    placeholder="Describe this step..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Timer (min)</label>
                  <input
                    type="number"
                    value={step.timerSec ? Math.round(step.timerSec / 60) : ''}
                    onChange={(e) => updateStep(step.id, 'timerSec', e.target.value ? parseInt(e.target.value) * 60 : null)}
                    className="input w-full"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => removeStep(step.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove Step
              </button>
            </div>
          ))}
        </div>

        {/* Components */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Component Recipes</h2>
            <button type="button" onClick={addComponent} className="btn">Add Component</button>
          </div>
          
          {components.map((component) => (
            <div key={component.id} className="border rounded-lg p-4 space-y-3">
              <div className="grid gap-3 md:grid-cols-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Recipe</label>
                  <ComponentPicker
                    value={component.targetSlug}
                    onChange={(value) => updateComponent(component.id, 'targetSlug', value)}
                    placeholder="Search for component recipe..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Scale</label>
                  <input
                    type="number"
                    value={component.scale}
                    onChange={(e) => updateComponent(component.id, 'scale', parseFloat(e.target.value))}
                    className="input w-full"
                    placeholder="1"
                    step="0.1"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Include Mode</label>
                  <select
                    value={component.includeMode}
                    onChange={(e) => updateComponent(component.id, 'includeMode', e.target.value as 'LINK' | 'INLINE')}
                    className="input w-full"
                  >
                    <option value="LINK">Link</option>
                    <option value="INLINE">Inline</option>
                  </select>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => removeComponent(component.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove Component
              </button>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link href="/" className="btn">Cancel</Link>
          <button type="submit" disabled={saving} className="btn bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Create Recipe'}
          </button>
        </div>
      </form>
    </main>
  );
}
