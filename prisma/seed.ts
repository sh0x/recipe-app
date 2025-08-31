import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function main(){
  const book = await db.book.upsert({
    where: { slug: 'winners' },
    update: {},
    create: { slug: 'winners', title: 'Tested Winners' },
    update: {}
  });

  await db.recipe.upsert({
    where: {
      bookId_slug_version: {
        bookId: book.id,
        slug: 'carnitas-confit',
        version: 1,
      },
    },
    update: {}, // nothing to change if exists
    create: {
      bookId: book.id, slug: 'garlic-mojo', kind: 'COMPONENT',
      title: 'Garlic Mojo', description: 'Citrusy garlicky oil for drizzling.',
      status: 'PUBLISHED', version: 1,
      ingredients: {
        create: [
          { item: 'garlic', qty: 6, unit: 'clove', prep: 'smashed', position: 1 },
          { item: 'olive oil', qty: 120, unit: 'ml', position: 2 },
          { item: 'lime juice', qty: 2, unit: 'tbsp', position: 3 },
          { item: 'salt', qty: 1, unit: 'tsp', position: 4 }
        ]
      },
      steps: { create: [
        { text: 'Gently warm garlic in oil until fragrant; cool; add lime and salt.', position: 1 }
      ] }
    }
  });

  await db.recipe.upsert({
    where: {
      bookId_slug_version: {
        bookId: book.id,
        slug: 'carnitas-confit',
        version: 1,
      },
    },
    update: {}, // nothing to change if exists
    create: {
      bookId: book.id, slug: 'carnitas-confit', kind: 'TOP_LEVEL',
      title: 'Confit-Style Carnitas',
      description: 'Pork shoulder gently confited in lard, then broiled crisp.',
      status: 'PUBLISHED', version: 1, unitSystem: 'US',
      yieldQty: 12, yieldUnit: 'tacos',
      prepMin: 20, cookMin: 150, totalMin: 170,
      ingredients: {
        create: [
          { groupName: 'Pork', qty: 4, unit: 'lb', item: 'pork shoulder', prep: 'large chunks', position: 1 },
          { groupName: 'Pork', item: 'orange', prep: 'peel only', position: 2 },
          { groupName: 'Pork', item: 'onion', prep: 'quartered', position: 3 },
          { groupName: 'Aromatics', qty: 6, unit: 'clove', item: 'garlic', prep: 'smashed', position: 4 },
          { groupName: 'Aromatics', qty: 2, unit: '', item: 'bay leaves', position: 5 },
          { groupName: 'Fat', item: 'lard', prep: 'enough to cover', position: 6 }
        ]
      },
      steps: { create: [
        { text: 'Simmer pork low in lard with aromatics until tender but not shredded.', timerSec: 7200, position: 1 },
        { text: 'Broil to crisp edges just before serving.', timerSec: 300, position: 2 }
      ] },
      components: { create: [
        { targetBook: 'winners', targetSlug: 'garlic-mojo', scale: 1, includeMode: 'LINK', position: 1 }
      ] }
    }
  });

  console.log('Seed complete');
}

main().finally(()=>db.$disconnect());
