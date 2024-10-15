import { DiscountConditionType } from "@prisma/client";
import IUseCase from ".";
import { ReturnValue } from "../../domain/value-objects/returnValue";
import IRepository from "../repositories";
import { OrderTypeJSONQuery, ShippingTypeJSONQuery, UserTypeJSONQuery } from "../../domain/dtos";

export default class ApplyCouponCoseUseCase implements IUseCase<[string, any /**Schema for customer cart items */], ReturnValue> {
    constructor(private readonly repository: IRepository) { }
    async execute(couponCode: string, cart: any): Promise<ReturnValue<unknown>> {
        // Ensure couponCode exists and is valid
        const coupon = await this.repository.findOne({
            where: {
                couponCode,
                isActive: true,
                isDeleted: false,
                validFrom: { lte: new Date() }, // Valid from date is less than or equal to current date
                validUntil: { gte: new Date() }, // Valid to date is greater than or equal to current date
                conditionType: { not: DiscountConditionType.product_based },
            }
        })

        if (!coupon) return new ReturnValue(false, 'Invalid coupon code', null)

        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
            return new ReturnValue(false, 'Coupon usage limit reached', null)
        }

        // Apply coupon code logic
        if (coupon.conditionType === DiscountConditionType.customer_based) {
            const conditions = coupon.conditions as UserTypeJSONQuery
            const customer = cart.customer // Assuming cart has customer information
            if (conditions.maxOrdersCount || conditions.minOrdersCount) {
                // make query to orders service to count orders of a customer (grpc call)
                const customerOrdersCount = await fetch(`localhost:3000/api/v1/orders-service/orders/count?customer=${customer.id}`, { method: 'GET' }).then(async res => await res.json()) // replace with actual gRPC call

                if (conditions.maxOrdersCount && customerOrdersCount > conditions.maxOrdersCount) {
                    return new ReturnValue(false, 'Coupon usage limit reached', null)
                } else if (conditions.minOrdersCount && customerOrdersCount < conditions.minOrdersCount) {
                    return new ReturnValue(false, 'Coupon usage limit reached', null)
                }
            }

            if (conditions.userSegments && !conditions.userSegments.includes(customer.segment)) {
                return new ReturnValue(false, 'Coupon usage limit reached', null)
            }

        } else if (coupon.conditionType === DiscountConditionType.order_based) {
            // Apply product based coupon logic
            const conditions = coupon.conditions as OrderTypeJSONQuery
            if (conditions.maxNetAmount && cart.netAmount < conditions.maxNetAmount) {
                return new ReturnValue(false, 'Coupon usage limit reached', null)
            }
            if (conditions.minNetAmount && cart.netAmount > conditions.minNetAmount) {
                return new ReturnValue(false, 'Coupon usage limit reached', null)
            }
        } else if (coupon.conditionType === DiscountConditionType.shipping_based) {
            const conditions = coupon.conditions as ShippingTypeJSONQuery
            if (conditions.minNetAmount && cart.netAmount < conditions.minNetAmount) {
                return new ReturnValue(false, 'Coupon usage limit reached', null)
            }

            if (conditions.minNumberOfItems && conditions.minNumberOfItems > cart.items.length) {
                return new ReturnValue(false, 'Coupon usage limit reached', null)
            }
        }

        return new ReturnValue(true, 'Coupon applied successfully', coupon)
    }

}