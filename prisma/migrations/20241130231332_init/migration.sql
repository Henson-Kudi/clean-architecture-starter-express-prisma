/*
  Warnings:

  - You are about to drop the `ProductDiscount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserDiscount` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductDiscount" DROP CONSTRAINT "ProductDiscount_discountId_fkey";

-- DropForeignKey
ALTER TABLE "UserDiscount" DROP CONSTRAINT "UserDiscount_discountId_fkey";

-- DropTable
DROP TABLE "ProductDiscount";

-- DropTable
DROP TABLE "UserDiscount";

-- CreateTable
CREATE TABLE "DiscountOrder" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscountOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DiscountOrder_userId_orderId_discountId_idx" ON "DiscountOrder"("userId", "orderId", "discountId");

-- CreateIndex
CREATE INDEX "DiscountOrder_userId_idx" ON "DiscountOrder"("userId");

-- CreateIndex
CREATE INDEX "DiscountOrder_discountId_idx" ON "DiscountOrder"("discountId");

-- CreateIndex
CREATE INDEX "DiscountOrder_orderId_idx" ON "DiscountOrder"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscountOrder_orderId_discountId_key" ON "DiscountOrder"("orderId", "discountId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscountOrder_userId_discountId_key" ON "DiscountOrder"("userId", "discountId");

-- AddForeignKey
ALTER TABLE "DiscountOrder" ADD CONSTRAINT "DiscountOrder_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "Discount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
