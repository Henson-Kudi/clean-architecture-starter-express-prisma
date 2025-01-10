/*
  Warnings:

  - The values [FIXED] on the enum `DiscountType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `conditionType` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `conditions` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `lastModifiedBy` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `usageCount` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `validFrom` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `validUntil` on the `Discount` table. All the data in the column will be lost.
  - You are about to alter the column `value` on the `Discount` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - A unique constraint covering the columns `[couponCode]` on the table `Discount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `discountStrategy` to the `Discount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Discount` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ConditionType" AS ENUM ('MINIMUM_PURCHASE', 'CART_QUANTITY', 'PRODUCT_CATEGORY', 'USER_GROUP', 'FIRST_PURCHASE', 'TIME_OF_DAY', 'DAY_OF_WEEK');

-- CreateEnum
CREATE TYPE "ConditionOperator" AS ENUM ('EQUALS', 'GREATER_THAN', 'LESS_THAN', 'IN', 'NOT_IN', 'BETWEEN');

-- CreateEnum
CREATE TYPE "BulkDiscountStrategy" AS ENUM ('OVERRIDE', 'STACK', 'SKIP_EXISTING');

-- CreateEnum
CREATE TYPE "DiscountStrategy" AS ENUM ('BULK_PRODUCT', 'COUPON');

-- AlterEnum
BEGIN;
CREATE TYPE "DiscountType_new" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT', 'BUY_X_GET_Y', 'FREE_SHIPPING');
ALTER TABLE "Discount" ALTER COLUMN "type" TYPE "DiscountType_new" USING ("type"::text::"DiscountType_new");
ALTER TYPE "DiscountType" RENAME TO "DiscountType_old";
ALTER TYPE "DiscountType_new" RENAME TO "DiscountType";
DROP TYPE "DiscountType_old";
COMMIT;

-- DropIndex
DROP INDEX "Discount_isActive_validFrom_validUntil_idx";

-- DropIndex
DROP INDEX "Discount_name_key";

-- AlterTable
ALTER TABLE "Discount" DROP COLUMN "conditionType",
DROP COLUMN "conditions",
DROP COLUMN "createdBy",
DROP COLUMN "lastModifiedBy",
DROP COLUMN "usageCount",
DROP COLUMN "validFrom",
DROP COLUMN "validUntil",
ADD COLUMN     "bulkDiscountStrategy" "BulkDiscountStrategy",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "discountStrategy" "DiscountStrategy" NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "filterRules" JSONB,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "usedCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "value" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "autoApply" DROP NOT NULL;

-- CreateTable
CREATE TABLE "DiscountCondition" (
    "id" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,
    "type" "ConditionType" NOT NULL,
    "operator" "ConditionOperator" NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscountCondition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductDiscount" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductDiscount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDiscount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDiscount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductDiscount_productId_discountId_key" ON "ProductDiscount"("productId", "discountId");

-- CreateIndex
CREATE UNIQUE INDEX "UserDiscount_userId_discountId_key" ON "UserDiscount"("userId", "discountId");

-- CreateIndex
CREATE UNIQUE INDEX "Discount_couponCode_key" ON "Discount"("couponCode");

-- AddForeignKey
ALTER TABLE "DiscountCondition" ADD CONSTRAINT "DiscountCondition_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "Discount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDiscount" ADD CONSTRAINT "ProductDiscount_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "Discount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDiscount" ADD CONSTRAINT "UserDiscount_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "Discount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
