/*
  Warnings:

  - Made the column `agentId` on table `CampaignUser` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CampaignUser" ALTER COLUMN "agentId" SET NOT NULL;
