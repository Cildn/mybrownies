/*
  Warnings:

  - You are about to drop the column `sessionId` on the `CampaignEntry` table. All the data in the column will be lost.
  - You are about to drop the `CampainSession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CampaignEntry" DROP CONSTRAINT "CampaignEntry_sessionId_fkey";

-- AlterTable
ALTER TABLE "CampaignEntry" DROP COLUMN "sessionId";

-- DropTable
DROP TABLE "CampainSession";
