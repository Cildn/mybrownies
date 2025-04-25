/*
  Warnings:

  - You are about to drop the column `productVariants` on the `CartItem` table. All the data in the column will be lost.
  - Added the required column `selectedColorIndex` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "productVariants",
ADD COLUMN     "selectedColorIndex" INTEGER NOT NULL;
