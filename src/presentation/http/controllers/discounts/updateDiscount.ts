import { Discount } from '@prisma/client';
import { CouponService } from '../../../../application/services';
import { ReturnValue } from '../../../../domain/value-objects/returnValue';
import RequestObject from '../../../../utils/types/requestObject';
import IContoller from '../Icontroller';

export class UpdateDiscountController
    implements IContoller<ReturnValue<Discount | null>> {
    constructor(private readonly service: CouponService) { }

    handle(request: RequestObject) {
        const lastUpdatedBy =
            request.headers?.['user-id'] ||
            request.headers?.['userid'] ||
            request?.headers?.userId;

        if (!request.params.id) {
            return Promise.resolve(new ReturnValue(false, 'Invalid request', null));
        }

        console.log(request.body)

        return this.service.updateDiscount(request.params.id, {
            lastUpdatedBy,
            ...request.body,
        });
    }
}

export default new UpdateDiscountController(new CouponService());
