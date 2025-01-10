import { Discount } from '@prisma/client';
import IUseCase from '.';
import { IUpdateDiscountDTO } from '../../domain/dtos';
import { ResponseCodes } from '../../domain/enums/responseCode';
import AppError from '../../domain/value-objects/appError';
import { ReturnValue } from '../../domain/value-objects/returnValue';
import { validateUpdateDiscount } from '../../utils/joi';
import { discountUpdated } from '../../utils/kafkaTopics.json';
import logger from '../../utils/logger';
import IMessageBroker from '../providers/messageBroker';
import IRepository from '../repositories';

export default class UpdateDiscountUseCase
    implements
    IUseCase<[string, IUpdateDiscountDTO], ReturnValue<Discount | null>> {
    constructor(
        private readonly repository: IRepository,
        private readonly providers: { messageBroker: IMessageBroker }
    ) { }

    async execute(
        id: string,
        data: IUpdateDiscountDTO
    ): Promise<ReturnValue<Discount | null>> {
        // Validate update data
        await validateUpdateDiscount(data);

        // Ensure discount exists
        const found = await this.repository.findOne({ where: { id } });

        if (!found) {
            return new ReturnValue(
                false,
                'Discount not found',
                null,
                new AppError('Discount not found', ResponseCodes.NotFound)
            );
        }

        // Update discount
        const updated = await this.repository.update({
            where: { id },
            data: {
                name: data?.name || found.name,
                description: data?.description || found.description,
                isActive: data?.isActive,
                isDeleted: data?.isDeleted
            },
        });

        // Publish kafka message
        try {
            this.providers.messageBroker.publish({
                topic: discountUpdated,
                message: JSON.stringify(updated),
            });
        } catch (error) {
            logger.error((error as Error).message, error);
        }

        return new ReturnValue(true, 'Discount updated', updated);
    }
}
