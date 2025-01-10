import { Discount } from '@prisma/client';
import { ReturnValue } from '../../../../domain/value-objects/returnValue';
import IContoller from '../Icontroller';
import RequestObject from '../../../../utils/types/requestObject';
import { CouponService } from '../../../../application/services';

export class ValidateDiscoutnController
  implements IContoller<ReturnValue<Discount | null>>
{
  constructor(private readonly service: CouponService) {}

  handle(request: RequestObject): Promise<ReturnValue<Discount | null>> {
    const userId = request.headers?.['user-id'] || request.headers?.['userid'];

    return this.service.validateDiscount(request.body?.couponCode, {
      userId,
      ...request.body,
    });
  }
}

export default new ValidateDiscoutnController(new CouponService());
