-- AlterTable
ALTER TABLE "CampaignEntry" ADD COLUMN     "sessionId" TEXT;

-- CreateTable
CREATE TABLE "CampainSession" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampainSession_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CampaignEntry" ADD CONSTRAINT "CampaignEntry_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "CampainSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
