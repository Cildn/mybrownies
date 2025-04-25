/*
  Warnings:

  - Added the required column `categoryCounter` to the `SiteConfig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SiteConfig" ADD COLUMN     "categoryCounter" INTEGER NOT NULL;
