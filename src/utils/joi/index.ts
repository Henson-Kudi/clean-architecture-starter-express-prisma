import { DiscountConditionType, DiscountType } from '@prisma/client'
import Joi from 'joi'


const ProductTypeJSONSchema = Joi.object({
    ids: Joi.array().items(Joi.string()).optional(),
    minPrice: Joi.number().positive().optional(),
    maxPrice: Joi.number().positive().optional(),
    brands: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).optional(),
    categories: Joi.array().items(Joi.string()).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    minCreatedAt: Joi.alternatives().try(Joi.date(), Joi.string(), Joi.number()).optional(),
    maxCreatedAt: Joi.alternatives().try(Joi.date(), Joi.string(), Joi.number()).optional()
})

const OrderTypeJSONSchema = Joi.object({
    minOrdersCount: Joi.number().positive().optional(),
    maxOrdersCount: Joi.number().positive().optional(),
    minNetAmount: Joi.number().positive().optional(),
    maxNetAmount: Joi.number().positive().optional(),
})

const UserTypeJSONSchema = Joi.object({
    userSegment: Joi.string().valid(['VIP', 'NEW', 'NORMAL']).optional(),
})

const CreateDiscountSchema = Joi.object({
    type: Joi.string().valid([...Object.values(DiscountType)]).required(),
    couponCode: Joi.string().optional(),
    value: Joi.number().positive().required(),
    conditionType: Joi.string().valid([...Object.values(DiscountConditionType)]).required(),
    conditions: Joi.alternatives().try(ProductTypeJSONSchema, OrderTypeJSONSchema, UserTypeJSONSchema).required(),
    isActive: Joi.boolean().optional(),
    validFrom: Joi.alternatives().try(Joi.date(), Joi.string(), Joi.number()).required(),
    validUntil: Joi.alternatives().try(Joi.date(), Joi.string(), Joi.number()).required(),
    usageLimit: Joi.number().positive().optional(),
    autoApply: Joi.boolean().required(),
    createdBy: Joi.string().required(),
})

const UpdateDiscountSchema = Joi.object({
    type: Joi.string().valid([...Object.values(DiscountType)]).optional(),
    couponCode: Joi.string().optional(),
    value: Joi.number().positive().optional(),
    conditionType: Joi.string().valid([...Object.values(DiscountConditionType)]).optional(),
    conditions: Joi.alternatives().try(ProductTypeJSONSchema, OrderTypeJSONSchema, UserTypeJSONSchema).optional(),
    isActive: Joi.boolean().optional(),
    isDeleted: Joi.boolean().optional(),
    validFrom: Joi.alternatives().try(Joi.date(), Joi.string(), Joi.number()).optional(),
    validUntil: Joi.alternatives().try(Joi.date(), Joi.string(), Joi.number()).optional(),
    usageLimit: Joi.number().positive().optional(),
    usageCount: Joi.number().positive().optional(),
    autoApply: Joi.boolean().optional(),
    lastModifiedBy: Joi.string().required(),
})

export function validateCreateDiscount(data: unknown) {
    return CreateDiscountSchema.validateAsync(data, { abortEarly: false })
}

export function validateUpdateDiscount(data: unknown) {
    return UpdateDiscountSchema.validateAsync(data, { abortEarly: false })
}


