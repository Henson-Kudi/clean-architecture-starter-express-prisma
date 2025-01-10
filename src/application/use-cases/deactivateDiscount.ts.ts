import { Prisma } from '@prisma/client';
import IUseCase from '.';
import IRepository from '../repositories';
import { ReturnValue } from '../../domain/value-objects/returnValue';
import IMessageBroker from '../providers/messageBroker';
import logger from '../../utils/logger';
import { discountsDeactivated } from '../../utils/kafkaTopics.json';
import { validateDeactivateDiscount } from '../../utils/joi';

export default class DeactivateDiscountsUseCase
  implements IUseCase<[string[], string], ReturnValue<Prisma.BatchPayload>>
{
  constructor(
    private readonly repository: IRepository,
    private readonly providers: { messageBroker: IMessageBroker }
  ) {}

  async execute(
    ids: string[],
    userId: string
  ): Promise<ReturnValue<Prisma.BatchPayload>> {
    await validateDeactivateDiscount({
      ids,
      lastUpdatedBy: userId,
    });

    const deletRes = await this.repository.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        isActive: false,
        lastUpdatedBy: userId,
      },
    });

    try {
      this.providers.messageBroker.publish({
        topic: discountsDeactivated,
        message: JSON.stringify({ ids }),
      });
    } catch (err) {
      logger.error((err as Error).message, err);
    }

    return new ReturnValue(true, 'Discounts deactivated', deletRes);
  }
}
