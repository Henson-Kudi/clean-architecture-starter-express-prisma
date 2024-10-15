/*
  Warnings:

  - You are about to drop the `DiscountAppliesTo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `conditionType` to the `Discount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conditions` to the `Discount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `Discount` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DiscountAppliesTo" DROP CONSTRAINT "DiscountAppliesTo_discountId_fkey";

-- AlterTable
ALTER TABLE "Discount" ADD COLUMN     "conditionType" TEXT NOT NULL,
ADD COLUMN     "conditions" JSONB NOT NULL,
ADD COLUMN     "couponCode" TEXT,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastModifiedBy" TEXT;

-- DropTable
DROP TABLE "DiscountAppliesTo";
