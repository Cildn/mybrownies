-- CreateEnum
CREATE TYPE "Stage" AS ENUM ('BROWN', 'BLUE', 'GREEN', 'YELLOW', 'RED', 'NEON');

-- CreateEnum
CREATE TYPE "Source" AS ENUM ('OFFLINE', 'ONLINE');

-- CreateEnum
CREATE TYPE "QRSource" AS ENUM ('OFFLINE', 'ONLINE');

-- CreateTable
CREATE TABLE "ProductType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "percentageRate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ProductType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "displayId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "additionalInfo" TEXT,
    "typeId" TEXT,
    "discountRate" INTEGER NOT NULL DEFAULT 0,
    "brand" TEXT,
    "stock" INTEGER NOT NULL,
    "categoryId" TEXT NOT NULL,
    "images" TEXT[],
    "videos" TEXT[],
    "materials" TEXT[],
    "sizes" TEXT[],
    "prices" DOUBLE PRECISION[],
    "colors" TEXT[],
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "searchText" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "displayId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "additionalInfo" TEXT,
    "discountRate" INTEGER,
    "images" TEXT[],
    "videos" TEXT[],
    "price" DOUBLE PRECISION NOT NULL,
    "categoryId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'complete',
    "productVariants" TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "searchText" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "displayId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "productCounter" INTEGER NOT NULL DEFAULT 0,
    "collectionCounter" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT NOT NULL,
    "video" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "productId" TEXT,
    "collectionId" TEXT,
    "quantity" INTEGER NOT NULL,
    "selectedColorIndex" INTEGER NOT NULL,
    "selectedSizeIndex" INTEGER NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "displayId" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT,
    "collectionId" TEXT,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productVariants" TEXT NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "otp" TEXT,
    "otpExpiry" TIMESTAMP(3),
    "otpRequestCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteConfig" (
    "id" TEXT NOT NULL DEFAULT 'site-settings',
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "liveMode" BOOLEAN NOT NULL DEFAULT true,
    "heroVideo" TEXT DEFAULT '',
    "monthlyTarget" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "serviceFee" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "categoryCounter" INTEGER NOT NULL DEFAULT 0,
    "orderCounter" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SiteConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "folder" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mimeType" TEXT NOT NULL,
    "dimensions" TEXT,
    "duration" INTEGER,
    "tags" TEXT[],

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CampaignUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignEntry" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "stage" "Stage" NOT NULL,
    "clueGiven" BOOLEAN NOT NULL DEFAULT false,
    "reward" DOUBLE PRECISION NOT NULL,
    "qrCodeRef" TEXT NOT NULL,
    "source" "Source" NOT NULL,
    "mintedFrom" TEXT,
    "rewardLevel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isFirstMint" BOOLEAN NOT NULL DEFAULT false,
    "attemptCount" INTEGER NOT NULL DEFAULT 1,
    "userId" TEXT,

    CONSTRAINT "CampaignEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignQRCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "color" "Stage" NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "source" "QRSource" NOT NULL,
    "productId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "campaignEntryId" TEXT,

    CONSTRAINT "CampaignQRCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductCollections" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductCollections_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignUser_email_key" ON "CampaignUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignEntry_agentId_key" ON "CampaignEntry"("agentId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignEntry_qrCodeRef_key" ON "CampaignEntry"("qrCodeRef");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignQRCode_code_key" ON "CampaignQRCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignQRCode_campaignEntryId_key" ON "CampaignQRCode"("campaignEntryId");

-- CreateIndex
CREATE INDEX "_ProductCollections_B_index" ON "_ProductCollections"("B");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ProductType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignEntry" ADD CONSTRAINT "CampaignEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "CampaignUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignQRCode" ADD CONSTRAINT "CampaignQRCode_campaignEntryId_fkey" FOREIGN KEY ("campaignEntryId") REFERENCES "CampaignEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductCollections" ADD CONSTRAINT "_ProductCollections_A_fkey" FOREIGN KEY ("A") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductCollections" ADD CONSTRAINT "_ProductCollections_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
