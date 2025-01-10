import { OrderItemDTO } from '../../../../../domain/dtos';
import logger from '../../../../../utils/logger';
import {
  CreatedOrder,
  KafkaMessageControllerHandler,
} from '../../../../../utils/types';
import service from '../../../../../application/services';

const handleOrderCreatedEvent: KafkaMessageControllerHandler<CreatedOrder> =
  async function (data: CreatedOrder): Promise<void> {
    try {
      if (data?.discountId && data?.userId) {
        const discount = await service.getDiscount(data.discountId);

        if (discount.success && discount.data && discount.data?.couponCode) {
          await service.applyDiscount(discount.data.couponCode, {
            id: data.id,
            discountId: data.discountId,
            currency: data.currency ?? '',
            userId: data.userId,
            totalAmount: data.totalAmount,
            discount: data.discount ?? 0,
            orderItems: data.orderItems as OrderItemDTO[],
          });

          logger.info(`Coupon applied successfully for order ${data.id}`);
        }
      }
    } catch (err) {
      logger.error((err as Error).message, err);
    }
  };

export default handleOrderCreatedEvent;
