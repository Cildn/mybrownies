-- AlterTable
ALTER TABLE "Coupon" ADD COLUMN     "maxUses" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "usageCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "MintAttempt" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "badgeFrom" "BadgeType" NOT NULL,
    "badgeTo" "BadgeType" NOT NULL,
    "chance" DOUBLE PRECISION NOT NULL,
    "success" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MintAttempt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MintAttempt" ADD CONSTRAINT "MintAttempt_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "CampaignUser"("agentId") ON DELETE RESTRICT ON UPDATE CASCADE;
