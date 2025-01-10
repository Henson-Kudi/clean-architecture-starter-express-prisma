import {
  BulkDiscountStrategy,
  ConditionOperator,
  ConditionType,
  DiscountStrategy,
  DiscountType,
} from '@prisma/client';
import Joi from 'joi';

const discountConditionSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(ConditionType))
    .required(),
  operator: Joi.string()
    .valid(...Object.values(ConditionOperator))
    .required(),
  value: Joi.string().required(),
});

const CreateDiscountSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional().allow('').allow(null),
  type: Joi.string()
    .valid(...[...Object.values(DiscountType)])
    .required(),
  value: Joi.number().positive().required(),
  isActive: Joi.boolean().optional().default(true),
  startDate: Joi.alternatives()
    .try(Joi.date(), Joi.string(), Joi.number())
    .required(),
  endDate: Joi.alternatives()
    .try(Joi.date(), Joi.string(), Joi.number())
    .required(),
  autoApply: Joi.boolean().optional().allow(null),
  discountStrategy: Joi.string()
    .valid(...[...Object.values(DiscountStrategy)])
    .required(),
  filterRules: Joi.object().optional().allow(null),
  bulkDiscountStrategy: Joi.string()
    .valid(...[...Object.values(BulkDiscountStrategy)])
    .optional(),
  couponCode: Joi.string().optional().allow(null),
  usageLimit: Joi.number().positive().optional().allow(null),
  usedCount: Joi.number().positive().optional().allow(null),
  conditions: Joi.array().items(discountConditionSchema).optional().allow(null),
  createdBy: Joi.string().required(),
});

const UpdateDiscountSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional().allow('').allow(null),
  lastUpdatedBy: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  isDeleted: Joi.boolean().optional(),
});

const DeactivateDiscountSchema = Joi.object({
  lastUpdatedBy: Joi.string().required(),
  ids: Joi.array().items(Joi.string().uuid()).required(),
});

const DeleteDiscountSchema = Joi.array().items(Joi.string().uuid()).required();

const ValidateDiscountSchema = Joi.object({
  couponCode: Joi.string().required(),
  discount: Joi.number().optional(),
  userId: Joi.string().required(),
  orderItems: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().required(),
        price: Joi.number().required(),
        total: Joi.number().required(),
        tax: Joi.number().optional(),
      })
    )
    .required(),
  totalAmount: Joi.number().positive().required(),
  currency: Joi.string().optional().allow('').allow(null),
});

export function validateCreateDiscount(data: unknown) {
  return CreateDiscountSchema.validateAsync(data, { abortEarly: false });
}

export function validateUpdateDiscount(data: unknown) {
  return UpdateDiscountSchema.validateAsync(data, { abortEarly: false });
}

export function validateDeactivateDiscount(data: unknown) {
  return DeactivateDiscountSchema.validateAsync(data, { abortEarly: false });
}

export function validateDeleteDiscount(data: unknown) {
  return DeleteDiscountSchema.validateAsync(data, { abortEarly: false });
}

export function validateValidateCoupon(data: unknown) {
  return ValidateDiscountSchema.validateAsync(data, { abortEarly: false });
}
