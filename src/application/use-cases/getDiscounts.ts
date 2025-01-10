import { Discount } from '@prisma/client';
import IUseCase from '.';
import {
  IFindDiscountDTO,
  IFindDiscountOptions,
  IPaginationOptions,
} from '../../domain/dtos';
import { ReturnValueWithPagination } from '../../domain/value-objects/returnValue';
import IRepository from '../repositories';
import setupPagination from './helpers/setupPagination';
import setupDiscountsQuery from './helpers/setupDiscountQuery';

export default class GetDiscountsUserCase
  implements
    IUseCase<
      [IFindDiscountDTO, IPaginationOptions?],
      ReturnValueWithPagination<Discount[]>
    >
{
  constructor(private readonly repository: IRepository) {}
  async execute(
    filter: IFindDiscountDTO,
    options?: IFindDiscountOptions
  ): Promise<ReturnValueWithPagination<Discount[]>> {
    const query = setupDiscountsQuery(filter);
    const pagination = setupPagination(options);

    const total = await this.repository.count({ where: query });

    const discounts = await this.repository.find({
      where: query,
      take: pagination.limit,
      skip: pagination.skip,
      include: { conditions: true, appliedOrders: options?.withAppliedOrders },
    });

    return new ReturnValueWithPagination(true, 'Success', {
      data: discounts,
      ...pagination,
      total,
    });
  }
}
