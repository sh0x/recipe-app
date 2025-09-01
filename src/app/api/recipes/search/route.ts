import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!query) {
      // If no query, return latest recipes
      const recipes = await db.recipe.findMany({ 
        orderBy: [{ slug: 'asc' }, { version: 'desc' }],
        take: limit,
        include: { ingredients: true }
      });
      
      const latestBySlug = new Map<string, typeof recipes[number]>();
      for (const r of recipes) if (!latestBySlug.has(r.slug)) latestBySlug.set(r.slug, r);
      
      return NextResponse.json(Array.from(latestBySlug.values()));
    }

    // Search recipes by title, slug, description, and ingredients
    const recipes = await db.recipe.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { slug: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { subtitle: { contains: query, mode: 'insensitive' } },
          {
            ingredients: {
              some: {
                item: { contains: query, mode: 'insensitive' }
              }
            }
          }
        ]
      },
      orderBy: [{ slug: 'asc' }, { version: 'desc' }],
      take: limit,
      include: { ingredients: true }
    });

    // Get latest version of each recipe
    const latestBySlug = new Map<string, typeof recipes[number]>();
    for (const r of recipes) if (!latestBySlug.has(r.slug)) latestBySlug.set(r.slug, r);

    return NextResponse.json(Array.from(latestBySlug.values()));
  } catch (error) {
    console.error('Error searching recipes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
