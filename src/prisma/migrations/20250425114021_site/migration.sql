/*
  Warnings:

  - You are about to drop the column `categoryImages` on the `SiteConfig` table. All the data in the column will be lost.
  - You are about to drop the column `disabledPages` on the `SiteConfig` table. All the data in the column will be lost.
  - You are about to drop the column `featuredProducts` on the `SiteConfig` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SiteConfig" DROP COLUMN "categoryImages",
DROP COLUMN "disabledPages",
DROP COLUMN "featuredProducts";
