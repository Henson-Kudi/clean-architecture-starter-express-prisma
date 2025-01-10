import {
  ConditionOperator,
  ConditionType,
  Discount,
  DiscountCondition,
  DiscountOrder,
  DiscountStrategy,
} from '@prisma/client';
import IUseCase from '.';
import { ReturnValue } from '../../domain/value-objects/returnValue';
import IRepository from '../repositories';
import { OrderContext } from '../../domain/dtos';
import { validateValidateCoupon } from '../../utils/joi';
import AppError from '../../domain/value-objects/appError';
import { ResponseCodes } from '../../domain/enums/responseCode';

export default class ValidateCouponUseCase
  implements
    IUseCase<
      [string, OrderContext /**Schema for customer cart items */],
      ReturnValue<Discount | null>
    >
{
  constructor(private readonly repository: IRepository) {}

  async execute(
    couponCode: string,
    context: OrderContext
  ): Promise<ReturnValue<Discount | null>> {
    await validateValidateCoupon({ couponCode, ...context });
    // Ensure couponCode exists and is valid
    const coupon = await this.repository.findOne<{
      // appliedProducts?: ProductDiscount[],
      conditions?: DiscountCondition[];
      appliedOrders: DiscountOrder[];
    }>({
      where: {
        couponCode,
        isActive: true,
        isDeleted: false,
        startDate: { lte: new Date() }, // Valid from date is less than or equal to current date
        endDate: { gte: new Date() }, // Valid to date is greater than or equal to current date
        discountStrategy: DiscountStrategy.COUPON,
      },
      include: {
        appliedOrders: {
          where: {
            userId: context.userId,
          },
        },
        conditions: true,
      },
    });

    if (!coupon) return new ReturnValue(false, 'Invalid coupon code', null);

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return new ReturnValue(false, 'Coupon usage limit reached', null);
    }

    // if coupon is already used by user, then return coupon already used
    if (coupon?.appliedOrders.length > 0) {
      return new ReturnValue(false, 'Coupon already used by user', null);
    }

    // Apply coupon code logic
    for (const condition of coupon.conditions ?? []) {
      if (!(await this.validateCondition(condition, context))) {
        return new ReturnValue(
          false,
          `Condition not met: ${condition.type}`,
          null,
          new AppError(
            `Condition not met: ${condition.type}`,
            ResponseCodes.BadRequest
          )
        );
      }
    }

    return new ReturnValue(true, 'Coupon validated', coupon);
  }

  private async validateCondition(
    condition: DiscountCondition,
    context: OrderContext
  ): Promise<boolean> {
    const value = condition.value;

    switch (condition.type) {
      case ConditionType.MINIMUM_PURCHASE:
        if (isNaN(Number(value))) {
          return false;
        }
        return this.validateDefault(
          context.totalAmount,
          Number(value),
          condition.operator
        );

      case ConditionType.CART_QUANTITY:
        if (isNaN(Number(value))) {
          return false;
        }
        return this.validateDefault(
          context.orderItems?.reduce(
            (a, b) => a.quantity + b.quantity,
            0 as any
          ),
          Number(value),
          condition.operator
        );

      case ConditionType.DAY_OF_WEEK:
        return this.validateDefault(
          new Date().getDay(),
          condition.value,
          condition.operator
        );

      case ConditionType.FIRST_PURCHASE:
        return this.validateDefault(
          await this.repository.count({
            where: {
              appliedOrders: {
                some: {
                  userId: context.userId,
                },
              },
            },
          }),
          value,
          condition.operator
        );

      case ConditionType.TIME_OF_DAY:
        return this.validateDefault(
          new Date().getHours(),
          value,
          condition.operator
        );

      case ConditionType.USER_GROUP:
        if (!context.userId) {
          return false;
        }

        return this.validateUserGroup('premium', value, condition.operator);
      // Add other condition validations
      default:
        return false;
    }
  }

  private async validateDefault(
    totalAmount: number,
    value: unknown,
    operator: string
  ): Promise<boolean> {
    switch (operator) {
      case ConditionOperator.GREATER_THAN:
        return !isNaN(Number(value)) && totalAmount > Number(value);

      case ConditionOperator.GREATER_THAN_EQUAL:
        return !isNaN(Number(value)) && totalAmount >= Number(value);

      case ConditionOperator.LESS_THAN:
        return !isNaN(Number(value)) && totalAmount < Number(value);

      case ConditionOperator.LESS_THAN_EQUAL:
        return !isNaN(Number(value)) && totalAmount <= Number(value);

      case ConditionOperator.EQUALS:
        return !isNaN(Number(value)) && totalAmount === Number(value);

      case ConditionOperator.IN:
        return Array.isArray(value) && value.includes(totalAmount);

      case ConditionOperator.NOT_IN:
        return Array.isArray(value) && !value.includes(totalAmount);

      case ConditionOperator.BETWEEN:
        return (
          Array.isArray(value) &&
          value.length === 2 &&
          totalAmount >= Number(value[0]) &&
          totalAmount <= Number(value[1])
        );

      default:
        return false;
    }
  }

  private async validateUserGroup(
    group: string,
    value: unknown,
    operator: string
  ): Promise<boolean> {
    throw new Error(`Method not implemented. ${group + value + operator}`);
  }
}
