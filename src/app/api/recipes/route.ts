import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    // Get or create the default book
    const book = await db.book.upsert({
      where: { slug: 'winners' },
      create: { slug: 'winners', title: 'Winners', visibility: 'PRIVATE' },
      update: {}
    });

    // Check if recipe already exists
    const existing = await db.recipe.findFirst({
      where: { bookId: book.id, slug: body.slug }
    });

    if (existing) {
      return NextResponse.json({ error: 'Recipe with this slug already exists' }, { status: 400 });
    }

    // Create the recipe
    const recipe = await db.recipe.create({
      data: {
        bookId: book.id,
        slug: body.slug,
        kind: 'TOP_LEVEL',
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        yieldQty: body.yieldQty,
        yieldUnit: body.yieldUnit,
        unitSystem: 'US',
        prepMin: body.prepMin,
        cookMin: body.cookMin,
        totalMin: (body.prepMin || 0) + (body.cookMin || 0),
        status: 'PUBLISHED',
        version: 1,
        ingredients: {
          create: body.ingredients?.map((ing: any, index: number) => ({
            groupName: ing.groupName || 'Ingredients',
            qty: ing.qty,
            unit: ing.unit,
            item: ing.item,
            prep: ing.prep,
            optional: false,
            notes: null,
            position: ing.position || index + 1,
          })) || []
        },
        steps: {
          create: body.steps?.map((step: any, index: number) => ({
            text: step.text,
            timerSec: step.timerSec,
            position: step.position || index + 1,
          })) || []
        },
        components: {
          create: body.components?.map((comp: any, index: number) => ({
            targetBook: 'winners',
            targetSlug: comp.targetSlug,
            targetVersion: null,
            scale: comp.scale || 1,
            includeMode: comp.includeMode || 'LINK',
            notes: null,
            position: comp.position || index + 1,
          })) || []
        },
        media: {
          create: []
        }
      },
      include: {
        ingredients: true,
        steps: true,
        components: true
      }
    });

    return NextResponse.json({
      ok: true,
      slug: recipe.slug,
      version: recipe.version,
      id: recipe.id
    });

  } catch (error: any) {
    console.error('Error creating recipe:', error);
    return NextResponse.json({ 
      error: error?.message || 'Failed to create recipe' 
    }, { status: 500 });
  }
}


