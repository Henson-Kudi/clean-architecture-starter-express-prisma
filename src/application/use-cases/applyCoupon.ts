import { Discount } from '@prisma/client';
import IUseCase from '.';
import { OrderContext } from '../../domain/dtos';
import { ReturnValue } from '../../domain/value-objects/returnValue';
import IRepository from '../repositories';
import ValidateCouponUseCase from './validateCoupon';
import IMessageBroker from '../providers/messageBroker';
import { discountApplied } from '../../utils/kafkaTopics.json';
import logger from '../../utils/logger';

export default class ApplyCouponUseCase
  implements IUseCase<[string, OrderContext], ReturnValue<Discount | null>>
{
  constructor(
    private readonly repository: IRepository,
    private readonly messageBroker: IMessageBroker
  ) {}
  async execute(
    couponCode: string,
    context: OrderContext
  ): Promise<ReturnValue<Discount | null>> {
    const valid = await new ValidateCouponUseCase(this.repository).execute(
      couponCode,
      context
    );

    if (!valid.success) {
      return valid;
    }

    // we have to apply the discount here
    const updated = await this.repository.update({
      where: { couponCode },
      data: {
        appliedOrders: {
          create: {
            orderId: context.id,
            userId: context.userId,
          },
        },
        usedCount: {
          increment: 1,
        },
      },
    });

    if (!updated) {
      return new ReturnValue(false, 'Coupon not found', null);
    }

    try {
      this.messageBroker.publish({
        topic: discountApplied,
        message: JSON.stringify({
          discountId: updated.id,
          userId: context.userId,
          couponCode,
        }),
      });
    } catch (err) {
      logger.error((err as Error).message, err);
    }

    return valid;
  }
}
