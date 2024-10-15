import { Prisma } from "@prisma/client";
import { IFindDiscountDTO } from "../../../domain/dtos";

export default function setupDiscountsQuery(filter: IFindDiscountDTO): Prisma.DiscountWhereInput {
    const query: Prisma.DiscountWhereInput = {
        isDeleted: false,
        validFrom: { lte: new Date() },
        validUntil: { gte: new Date() },

    }

    if (filter.isActive === false) query.isActive = false
    if (filter.isActive) query.isActive = true

    if (filter.conditionType) query.conditionType = Array.isArray(filter.conditionType) ? { in: filter.conditionType } : filter.conditionType

    if (filter.couponCode) query.couponCode = { contains: filter.couponCode, mode: 'insensitive' }

    if (filter.type) query.type = Array.isArray(filter.type) ? { in: filter.type } : filter.type
    
    return query
}