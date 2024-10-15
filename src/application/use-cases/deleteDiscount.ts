import { Prisma } from "@prisma/client";
import IUseCase from ".";
import IRepository from "../repositories";
import { ReturnValue } from "../../domain/value-objects/returnValue";
import IMessageBroker from "../providers/messageBroker";
import logger from "../../utils/logger";
import { discountsDeleted } from "../../utils/kafkaTopics.json";

export default class DeleteDiscountsUseCase implements IUseCase<[string[]], ReturnValue<Prisma.BatchPayload>> {
    constructor(private readonly repository: IRepository, private readonly providers: { messageBroker: IMessageBroker }) { }

    async execute(ids: string[]): Promise<ReturnValue<Prisma.BatchPayload>> {

        const deletRes = await this.repository.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        });

        try {
            this.providers.messageBroker.publish({
                topic: discountsDeleted,
                message: JSON.stringify({ ids })
            });
        } catch (err) {
            logger.error((err as Error).message, err)
        }

        return new ReturnValue(true, 'Discounts deleted', deletRes)
    }
}