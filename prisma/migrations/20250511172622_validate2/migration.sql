/*
  Warnings:

  - A unique constraint covering the columns `[agentId]` on the table `CampaignUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `agentId` to the `CampaignUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CampaignUser" ADD COLUMN     "agentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CampaignUser_agentId_key" ON "CampaignUser"("agentId");
