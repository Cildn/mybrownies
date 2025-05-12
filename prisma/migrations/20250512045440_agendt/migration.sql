/*
  Warnings:

  - You are about to drop the column `userId` on the `Coupon` table. All the data in the column will be lost.
  - Added the required column `agentId` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Coupon" DROP CONSTRAINT "Coupon_userId_fkey";

-- AlterTable
ALTER TABLE "Coupon" DROP COLUMN "userId",
ADD COLUMN     "agentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "CampaignUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
