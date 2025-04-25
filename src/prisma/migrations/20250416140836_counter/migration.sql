-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "collectionCounter" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "productCounter" INTEGER NOT NULL DEFAULT 0;
