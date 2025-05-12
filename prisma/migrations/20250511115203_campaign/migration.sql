-- AlterTable
ALTER TABLE "CampaignEntry" ADD COLUMN     "maxAttemptsReached" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "CampaignQRCode" ADD COLUMN     "answerHash" TEXT,
ADD COLUMN     "attemptCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "clue" TEXT;

-- AlterTable
ALTER TABLE "CampaignUser" ADD COLUMN     "currentStage" "Stage" NOT NULL DEFAULT 'BROWN',
ADD COLUMN     "totalPoints" INTEGER NOT NULL DEFAULT 0;
