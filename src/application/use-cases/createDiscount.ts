import { Discount } from "@prisma/client";
import IUseCase from ".";
import { ICreateDiscountDTO } from "../../domain/dtos";
import { ResponseCodes } from "../../domain/enums/responseCode";
import AppError from "../../domain/value-objects/appError";
import { ReturnValue } from "../../domain/value-objects/returnValue";
import { validateCreateDiscount } from "../../utils/joi";
import { discountCreated } from "../../utils/kafkaTopics.json";
import logger from "../../utils/logger";
import IMessageBroker from "../providers/messageBroker";
import IRepository from "../repositories";

export default class CreateDiscountUseCase implements IUseCase<[ICreateDiscountDTO], ReturnValue<Discount>> {
    constructor(private readonly repository: IRepository, private readonly providers: { messageBroker: IMessageBroker }) { }
    async execute(...[data]: [ICreateDiscountDTO]): Promise<ReturnValue<Discount>> {
        await validateCreateDiscount(data)

        // Ensure coupon does not already exist (If created with coupon)
        if (data.couponCode) {
            const found = await this.repository.findOne({ where: { couponCode: data.couponCode } })

            if (found) {
                throw new AppError("Coupon already exists", ResponseCodes.BadRequest)
            }
        }

        // Create discount
        const discount = await this.repository.create({
            data: {
                ...data,
                validFrom: new Date(data.validFrom),
                validUntil: new Date(data.validUntil)
            }
        })

        // Publish message
        try {
            this.providers.messageBroker.publish({
                message: JSON.stringify(discount),
                topic: discountCreated
            })
        } catch (err) {
            logger.error((err as Error).message, err)
        }

        return new ReturnValue(true, 'Discount created', discount)
    }

}