-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "productVariants" TEXT[];

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "productVariants" TEXT[];
