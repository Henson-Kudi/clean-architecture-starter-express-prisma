import { DiscountConditionType, DiscountType } from "@prisma/client";

// Define how data will be transfered (Query conditions for discounts)
export type ProductTypeJSONQuery = {
    ids?: string[];
    minPrice?: number;
    maxPrice?: number;
    brands?: string | string[];
    categories?: string[];
    tags?: string[];
    minCreatedAt?: Date | string | number;
    maxCreatedAt?: Date | string | number;
};

export type OrderTypeJSONQuery = { //this still needs to be worked
    minNetAmount?: number
    maxNetAmount?: number
}

export type UserTypeJSONQuery = { //this still needs to be worked
    userSegments?: ('VIP' | 'NEW' | 'NORMAL')[] // this still needs to be decided. Will be based on customer demographics
    minOrdersCount?: number // This is to verify that the user must have a minimum number of orders to be eligible for discount at checkout
    maxOrdersCount?: number // This is to verify that the user must have placed a certain number of orders in order to be eligible for this discount
}

export type ShippingTypeJSONQuery = { //this still needs to be worked
    minNumberOfItems?: number
    minNetAmount?: number
}

// DISCOUNT TYPES
export type ICreateDiscountDTO = {
    type: DiscountType
    couponCode?: string // product discounts do not require coupon code as they're applied automatically
    value: number
    conditionType: DiscountConditionType
    conditions: ProductTypeJSONQuery | OrderTypeJSONQuery | UserTypeJSONQuery | ShippingTypeJSONQuery
    isActive?: boolean
    validFrom: string | number | Date // date in utc
    validUntil: string | number | Date // date in utc
    usageLimit: number
    autoApply?: boolean
    createdBy: string
}

export type IUpdateDiscountDTO = {
    type?: DiscountType
    couponCode?: string
    value?: number
    conditionType?: DiscountConditionType
    conditions?: ProductTypeJSONQuery | OrderTypeJSONQuery | UserTypeJSONQuery
    isActive?: boolean
    isDeleted?: boolean
    validFrom?: string | number | Date // date in utc
    validUntil?: string | number | Date // date in utc
    usageLimit?: number
    usageCount?: number
    autoApply?: boolean
    lastModifiedBy: string
}

export type IFindDiscountDTO = {
    type: DiscountType | DiscountType[]
    couponCode?: string
    conditionType: DiscountConditionType | DiscountConditionType[]
    isActive: boolean
}

// Options
export type IPaginationOptions = {
    page?: number
    limit?: number
}