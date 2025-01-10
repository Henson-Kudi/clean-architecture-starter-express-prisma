import { Prisma } from '@prisma/client';
import { CouponService } from '../../../../application/services';
import { ReturnValue } from '../../../../domain/value-objects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class DeactivateDiscountsController
  implements IContoller<ReturnValue<Prisma.BatchPayload>>
{
  constructor(private readonly service: CouponService) {}

  handle(request: RequestObject) {
    const lastUpdatedBy =
      request.headers?.['user-id'] || request.headers?.['userid'];

    return this.service.deactivateDiscounts(
      [...(request.body?.data ?? [])],
      lastUpdatedBy
    );
  }
}

export default new DeactivateDiscountsController(new CouponService());
