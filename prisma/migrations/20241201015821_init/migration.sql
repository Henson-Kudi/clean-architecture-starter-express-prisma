-- DropForeignKey
ALTER TABLE "DiscountCondition" DROP CONSTRAINT "DiscountCondition_discountId_fkey";

-- DropForeignKey
ALTER TABLE "DiscountOrder" DROP CONSTRAINT "DiscountOrder_discountId_fkey";

-- AddForeignKey
ALTER TABLE "DiscountCondition" ADD CONSTRAINT "DiscountCondition_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "Discount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscountOrder" ADD CONSTRAINT "DiscountOrder_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "Discount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
