import { Prisma } from '@prisma/client';
import { IFindDiscountDTO } from '../../../domain/dtos';
import moment from 'moment';

export default function setupDiscountsQuery(
  filter?: IFindDiscountDTO
): Prisma.DiscountWhereInput {
  const query: Prisma.DiscountWhereInput = {
    isDeleted: false,
  };

  if (filter?.startDate) {
    const q: { lte?: Date; gte?: Date } = {};

    if (filter?.startDate?.max && moment(filter?.startDate?.max).isValid()) {
      q.lte = moment(filter?.startDate?.max).toDate();
    }
    if (filter?.startDate?.min && moment(filter?.startDate?.min).isValid()) {
      q.gte = moment(filter?.startDate?.min).toDate();
    }

    Object.keys(q).length > 0 && (query.startDate = q);
  }

  if (filter?.endDate) {
    const q: { lte?: Date; gte?: Date } = {};

    if (filter?.endDate?.max && moment(filter?.endDate?.max).isValid()) {
      q.lte = moment(filter?.endDate?.max).toDate();
    }
    if (filter?.endDate?.min && moment(filter?.endDate?.min).isValid()) {
      q.gte = moment(filter?.endDate?.min).toDate();
    }

    Object.keys(q).length > 0 && (query.endDate = q);
  }

  if (filter?.isActive != undefined) query.isActive = filter?.isActive;

  if (filter?.isDeleted != undefined) query.isDeleted = filter?.isDeleted;

  if (filter?.autoApply != undefined) query.autoApply = filter?.autoApply;

  if (filter?.discountStrategy)
    query.discountStrategy = filter?.discountStrategy;

  if (filter?.name)
    query.name = { contains: filter?.name, mode: 'insensitive' };

  if (filter?.type)
    query.type = Array.isArray(filter?.type)
      ? { in: filter?.type }
      : filter?.type;

  if (filter?.usageLimit) {
    const q: { lte?: number; gte?: number } = {};

    if (filter?.usageLimit?.max) q.lte = filter?.usageLimit?.max;
    if (filter?.usageLimit?.min) q.gte = filter?.usageLimit?.min;

    Object.keys(q).length > 0 && (query.usageLimit = q);
  }

  if (filter?.usedCount) {
    const q: { lte?: number; gte?: number } = {};

    if (filter?.usedCount?.max) q.lte = filter?.usedCount?.max;
    if (filter?.usedCount?.min) q.gte = filter?.usedCount?.min;

    Object.keys(q).length > 0 && (query.usedCount = q);
  }

  if (filter?.couponCode)
    query.couponCode = { equals: filter?.couponCode, mode: 'insensitive' };

  if (filter?.type)
    query.type = Array.isArray(filter?.type)
      ? { in: filter?.type }
      : filter?.type;

  return query;
}
