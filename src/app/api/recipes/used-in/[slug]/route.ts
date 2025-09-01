import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // Get all recipes that use this component, ordered by slug then version desc
    const allRecipes = await db.recipe.findMany({
      where: {
        components: {
          some: {
            targetSlug: slug
          }
        }
      },
      include: { 
        components: {
          where: {
            targetSlug: slug
          }
        }
      },
      orderBy: [{ slug: 'asc' }, { version: 'desc' }]
    });

    console.log(`API: Found ${allRecipes.length} total recipes for component ${slug}`);

    // Group by slug and take only the latest version
    const latestBySlug = new Map<string, typeof allRecipes[number]>();
    
    console.log(`API: Processing ${allRecipes.length} recipes for deduplication...`);
    
    for (const recipe of allRecipes) {
      const existing = latestBySlug.get(recipe.slug);
      console.log(`API: Processing ${recipe.slug} v${recipe.version} (ID: ${recipe.id})`);
      
      if (!existing) {
        latestBySlug.set(recipe.slug, recipe);
        console.log(`API: First time seeing ${recipe.slug}, setting v${recipe.version}`);
      } else if (recipe.version > existing.version) {
        latestBySlug.set(recipe.slug, recipe);
        console.log(`API: ${recipe.slug} v${recipe.version} is newer than v${existing.version}, updating`);
      } else {
        console.log(`API: ${recipe.slug} v${recipe.version} is older than v${existing.version}, keeping existing`);
      }
    }

    // Debug: Log what we have in the map
    console.log(`API: Final map contents:`);
    for (const [slug, recipe] of latestBySlug.entries()) {
      console.log(`  ${slug}: v${recipe.version} (ID: ${recipe.id})`);
    }

    const result = Array.from(latestBySlug.values()).sort((a, b) => a.title.localeCompare(b.title));
    
    console.log(`API: Returning ${result.length} unique latest versions`);
    console.log(`API: Result slugs:`, result.map(r => `${r.slug} v${r.version}`));
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching used-in recipes:', error);
    return NextResponse.json({ 
      error: error?.message || 'Failed to fetch used-in recipes' 
    }, { status: 500 });
  }
}
