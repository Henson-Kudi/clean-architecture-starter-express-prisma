import { Discount } from '@prisma/client';
import IUseCase from '.';
import { ReturnValue } from '../../domain/value-objects/returnValue';
import IRepository from '../repositories';

export default class GetDiscountUserCase
  implements IUseCase<[string], ReturnValue<Discount | null>>
{
  constructor(private readonly repository: IRepository) {}

  async execute(id: string): Promise<ReturnValue<Discount | null>> {
    const discount = await this.repository.findOne({ where: { id } });

    return new ReturnValue(true, 'Success', discount);
  }
}
