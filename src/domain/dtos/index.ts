import {
    BulkDiscountStrategy,
    ConditionOperator,
    ConditionType,
    DiscountStrategy,
    DiscountType,
} from '@prisma/client';

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

export type OrderTypeJSONQuery = {
    //this still needs to be worked
    minNetAmount?: number;
    maxNetAmount?: number;
};

export type UserTypeJSONQuery = {
    //this still needs to be worked
    userSegments?: ('VIP' | 'NEW' | 'NORMAL')[]; // this still needs to be decided. Will be based on customer demographics
    minOrdersCount?: number; // This is to verify that the user must have a minimum number of orders to be eligible for discount at checkout
    maxOrdersCount?: number; // This is to verify that the user must have placed a certain number of orders in order to be eligible for this discount
};

export type ShippingTypeJSONQuery = {
    //this still needs to be worked
    minNumberOfItems?: number;
    minNetAmount?: number;
};

export type DiscountCondition = {
    type: ConditionType;
    operator: ConditionOperator;
    value: string;
};

// DISCOUNT TYPES
export type ICreateDiscountDTO = {
    name: string;
    description?: string;
    type: DiscountType;
    value: number;
    isActive: boolean;
    startDate: string | Date | number;
    endDate: string | Date | number;
    autoApply?: boolean;
    discountStrategy: DiscountStrategy;
    filterRules?: Record<string, unknown>;
    bulkDiscountStrategy?: BulkDiscountStrategy;
    couponCode?: string;
    usageLimit?: number;
    usedCount?: number;
    conditions?: DiscountCondition[];

    createdBy: string;
};

export type IUpdateDiscountDTO = {
    name?: string;
    description?: string;
    lastUpdatedBy: string;
    isActive?: boolean;
    isDeleted?: boolean;
};

export type IFindDiscountDTO = {
    name?: string;
    type?: DiscountType | DiscountType[];
    isActive?: boolean;
    isDeleted?: boolean;
    startDate: { min?: string | Date | number; max?: string | Date | number };
    endDate: { min?: string | Date | number; max?: string | Date | number };
    autoApply?: boolean;
    discountStrategy?: DiscountStrategy;
    couponCode?: string;
    usageLimit?: { min?: number; max?: number };
    usedCount?: { min?: number; max?: number };
};

export type IFindDiscountOptions = {
    withAppliedOrders?: boolean;
} & IPaginationOptions;

// Options
export type IPaginationOptions = {
    page?: number;
    limit?: number;
};

// Context for placing orders.
export type OrderItemDTO = {
    productId: string;
    quantity: number;
    price: number;
    total: number;
    tax: number;
};

export type OrderContext = {
    id: string;
    discountId: string;
    userId: string;
    totalAmount: number;
    discount: number;
    currency: string;
    orderItems: OrderItemDTO[];
};
