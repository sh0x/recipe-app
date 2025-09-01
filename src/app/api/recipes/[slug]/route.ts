import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const recipe = await db.recipe.findFirst({
      where: { slug }, 
      orderBy: { version: 'desc' },
      include: { ingredients: true, steps: true, components: true, media: true, book: true }
    });

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
