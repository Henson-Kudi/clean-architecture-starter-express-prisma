import {
    ICreateDiscountDTO,
    IFindDiscountDTO,
    IFindDiscountOptions,
    IPaginationOptions,
    IUpdateDiscountDTO,
    OrderContext,
} from '../../domain/dtos';
import database from '../../infrastructure/database';
import messageBroker from '../../infrastructure/providers/messageBroker';
import Repository from '../../infrastructure/repositories';
import ApplyCouponUseCase from '../use-cases/applyCoupon';
import CreateDiscountUseCase from '../use-cases/createDiscount';
import DeactivateDiscountsUseCase from '../use-cases/deactivateDiscount.ts';
import DeleteDiscountsUseCase from '../use-cases/deleteDiscount';
import GetDiscountUserCase from '../use-cases/getDiscount';
import GetDiscountsUserCase from '../use-cases/getDiscounts';
import UpdateDiscountUseCase from '../use-cases/updateDiscount';
import ValidateCouponUseCase from '../use-cases/validateCoupon';

// This file should bring your usecases together. eg: userService could be a combination of all user related use cases
export class CouponService {
    constructor() { }

    repo = new Repository(database.discount);

    messageQueueBroker = messageBroker;

    createDiscount(data: ICreateDiscountDTO) {
        return new CreateDiscountUseCase(this.repo, {
            messageBroker: this.messageQueueBroker,
        }).execute(data);
    }

    deactivateDiscounts(ids: string[], userId: string) {
        return new DeactivateDiscountsUseCase(this.repo, {
            messageBroker: this.messageQueueBroker,
        }).execute(ids, userId);
    }

    deleteDiscounts(id: string[]) {
        return new DeleteDiscountsUseCase(this.repo, {
            messageBroker: this.messageQueueBroker,
        }).execute(id);
    }

    getDiscounts(filter: IFindDiscountDTO, options?: IFindDiscountOptions) {
        return new GetDiscountsUserCase(this.repo).execute(filter, options);
    }

    getDiscount(id: string) {
        return new GetDiscountUserCase(this.repo).execute(id);
    }

    updateDiscount(id: string, data: IUpdateDiscountDTO) {
        return new UpdateDiscountUseCase(this.repo, {
            messageBroker: this.messageQueueBroker,
        }).execute(id, data);
    }

    validateDiscount(couponCode: string, context: OrderContext) {
        return new ValidateCouponUseCase(this.repo).execute(couponCode, context);
    }

    applyDiscount(couponCode: string, context: OrderContext) {
        return new ApplyCouponUseCase(this.repo, this.messageQueueBroker).execute(
            couponCode,
            context
        );
    }
}

export default new CouponService();
