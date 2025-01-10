import { Prisma } from '@prisma/client';
import { CouponService } from '../../../../application/services';
import { ReturnValue } from '../../../../domain/value-objects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class DeleteDiscountsController
  implements IContoller<ReturnValue<Prisma.BatchPayload>>
{
  constructor(private readonly service: CouponService) {}

  handle(request: RequestObject) {
    return this.service.deleteDiscounts([...(request.body?.data ?? [])]);
  }
}

export default new DeleteDiscountsController(new CouponService());
