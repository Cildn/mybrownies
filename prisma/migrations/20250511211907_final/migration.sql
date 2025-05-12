/*
  Warnings:

  - You are about to drop the column `currentStage` on the `CampaignUser` table. All the data in the column will be lost.
  - You are about to drop the column `totalPoints` on the `CampaignUser` table. All the data in the column will be lost.
  - You are about to drop the `CampaignEntry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CampaignQRCode` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `agentId` on table `CampaignUser` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "BadgeType" AS ENUM ('BROWN', 'BLUE', 'GREEN', 'YELLOW', 'RED', 'NEON');

-- DropForeignKey
ALTER TABLE "CampaignEntry" DROP CONSTRAINT "CampaignEntry_userId_fkey";

-- DropForeignKey
ALTER TABLE "CampaignQRCode" DROP CONSTRAINT "CampaignQRCode_campaignEntryId_fkey";

-- DropIndex
DROP INDEX "CampaignUser_email_key";

-- AlterTable
ALTER TABLE "CampaignUser" DROP COLUMN "currentStage",
DROP COLUMN "totalPoints",
ADD COLUMN     "badge" "BadgeType" NOT NULL DEFAULT 'BROWN',
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stage" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "agentId" SET NOT NULL;

-- DropTable
DROP TABLE "CampaignEntry";

-- DropTable
DROP TABLE "CampaignQRCode";

-- DropEnum
DROP TYPE "QRSource";

-- DropEnum
DROP TYPE "Source";

-- DropEnum
DROP TYPE "Stage";

-- CreateTable
CREATE TABLE "QRCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "usedBy" TEXT,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QRCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clue" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "expiry" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BadgeUpgrade" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "badgeType" "BadgeType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BadgeUpgrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CampaignUserToClue" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CampaignUserToClue_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "QRCode_code_key" ON "QRCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");

-- CreateIndex
CREATE INDEX "_CampaignUserToClue_B_index" ON "_CampaignUserToClue"("B");

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "CampaignUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeUpgrade" ADD CONSTRAINT "BadgeUpgrade_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "CampaignUser"("agentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignUserToClue" ADD CONSTRAINT "_CampaignUserToClue_A_fkey" FOREIGN KEY ("A") REFERENCES "CampaignUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignUserToClue" ADD CONSTRAINT "_CampaignUserToClue_B_fkey" FOREIGN KEY ("B") REFERENCES "Clue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
