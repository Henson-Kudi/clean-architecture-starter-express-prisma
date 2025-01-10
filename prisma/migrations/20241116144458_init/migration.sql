/*
  Warnings:

  - Added the required column `createdBy` to the `Discount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Discount" ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "lastUpdatedBy" TEXT;
