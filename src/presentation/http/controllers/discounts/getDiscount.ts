import { Discount } from '@prisma/client';
import { CouponService } from '../../../../application/services';
import { ReturnValue } from '../../../../domain/value-objects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';
import AppError from '../../../../domain/value-objects/appError';
import { ResponseCodes } from '../../../../domain/enums/responseCode';

export class GetDiscountController
  implements IContoller<ReturnValue<Discount | null>>
{
  constructor(private readonly service: CouponService) {}

  handle(request: RequestObject) {
    if (!request.params.id) {
      return Promise.reject(
        new AppError('id is required', ResponseCodes.BadRequest)
      );
    }

    return this.service.getDiscount(request?.params.id);
  }
}

export default new GetDiscountController(new CouponService());
