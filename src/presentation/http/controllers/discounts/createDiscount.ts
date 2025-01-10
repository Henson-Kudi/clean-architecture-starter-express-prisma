import { Discount } from '@prisma/client';
import { CouponService } from '../../../../application/services';
import { ReturnValue } from '../../../../domain/value-objects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class CreateDiscountController
  implements IContoller<ReturnValue<Discount>>
{
  constructor(private readonly service: CouponService) {}

  handle(request: RequestObject) {
    const createdBy =
      request.headers?.['user-id'] ||
      request.headers?.['userid'] ||
      request?.headers?.userId;

    return this.service.createDiscount({
      createdBy,
      ...request.body,
    });
  }
}

export default new CreateDiscountController(new CouponService());
