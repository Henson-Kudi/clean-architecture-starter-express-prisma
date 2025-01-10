import { Discount } from '@prisma/client';
import { CouponService } from '../../../../application/services';
import { ReturnValueWithPagination } from '../../../../domain/value-objects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class GetDiscountsController
    implements IContoller<ReturnValueWithPagination<Discount[]>> {
    constructor(private readonly service: CouponService) { }

    handle(request: RequestObject) {
        return this.service.getDiscounts(request?.query?.filter, {
            ...(request.query?.options ?? {}),
            withAppliedOrders: request.query?.options?.withAppliedOrders === 'true',
            limit: Number(request.query?.options?.limit ?? 10),
            page: Number(request.query?.options?.page ?? 1),
        });
    }
}

export default new GetDiscountsController(new CouponService());
