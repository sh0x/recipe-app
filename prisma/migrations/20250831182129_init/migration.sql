-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PRIVATE', 'UNLISTED', 'PUBLIC');

-- CreateEnum
CREATE TYPE "RecipeKind" AS ENUM ('TOP_LEVEL', 'COMPONENT');

-- CreateEnum
CREATE TYPE "UnitSystem" AS ENUM ('METRIC', 'US');

-- CreateEnum
CREATE TYPE "RecipeStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "IncludeMode" AS ENUM ('LINK', 'INLINE');

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "visibility" "Visibility" NOT NULL DEFAULT 'PRIVATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "kind" "RecipeKind" NOT NULL DEFAULT 'TOP_LEVEL',
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "yieldQty" DOUBLE PRECISION,
    "yieldUnit" TEXT,
    "unitSystem" "UnitSystem" NOT NULL DEFAULT 'US',
    "prepMin" INTEGER,
    "cookMin" INTEGER,
    "totalMin" INTEGER,
    "status" "RecipeStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngredientLine" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "groupName" TEXT,
    "qty" DOUBLE PRECISION,
    "unit" TEXT,
    "item" TEXT NOT NULL,
    "prep" TEXT,
    "optional" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "position" INTEGER NOT NULL,

    CONSTRAINT "IngredientLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Step" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "timerSec" INTEGER,
    "position" INTEGER NOT NULL,

    CONSTRAINT "Step_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeComponent" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "targetBook" TEXT NOT NULL,
    "targetSlug" TEXT NOT NULL,
    "targetVersion" INTEGER,
    "scale" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "includeMode" "IncludeMode" NOT NULL DEFAULT 'LINK',
    "notes" TEXT,
    "position" INTEGER NOT NULL,

    CONSTRAINT "RecipeComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "position" INTEGER NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_slug_key" ON "Book"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_bookId_slug_version_key" ON "Recipe"("bookId", "slug", "version");

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientLine" ADD CONSTRAINT "IngredientLine_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Step" ADD CONSTRAINT "Step_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeComponent" ADD CONSTRAINT "RecipeComponent_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
