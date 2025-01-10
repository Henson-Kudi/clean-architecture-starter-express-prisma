import { Prisma, Discount } from '@prisma/client';
import IRepository from '../../application/repositories';
import { DefaultArgs } from '@prisma/client/runtime/library';

// Implementation of all database repositories defined in application/repositories
export default class Repository implements IRepository {
  constructor(
    private readonly dataSource: Prisma.DiscountDelegate<DefaultArgs>
  ) {}
  count(query: Prisma.DiscountCountArgs): Promise<number> {
    return this.dataSource.count(query);
  }
  updateMany(
    params: Prisma.DiscountUpdateManyArgs
  ): Promise<Prisma.BatchPayload> {
    return this.dataSource.updateMany(params);
  }

  create(data: Prisma.DiscountCreateArgs): Promise<Discount> {
    return this.dataSource.create(data);
  }

  update(data: Prisma.DiscountUpdateArgs): Promise<Discount | null> {
    return this.dataSource.update(data);
  }

  delete(params: Prisma.DiscountDeleteArgs): Promise<Discount | null> {
    return this.dataSource.delete(params);
  }

  deleteMany(
    params: Prisma.DiscountDeleteManyArgs
  ): Promise<Prisma.BatchPayload> {
    return this.dataSource.deleteMany(params);
  }

  find(query: Prisma.DiscountFindManyArgs): Promise<Discount[]> {
    return this.dataSource.findMany(query);
  }

  findOne<Extend = unknown>(
    query: Prisma.DiscountFindUniqueArgs
  ): Promise<(Discount & Extend) | null> {
    return this.dataSource.findUnique(query) as Promise<
      (Discount & Extend) | null
    >;
  }
}
