import { Message } from 'node-rdkafka';
import logger from '../../../../utils/logger';
import { subscriptions } from '../../../../utils/kafkaTopics.json';
import { KafkaMessageControllerHandler } from '../../../../utils/types';
import handleOrderCreatedEvent from './handlers/orderCreatedEvent';

const handlers: {
  [key: string]: KafkaMessageControllerHandler<any>;
} = {
  [subscriptions.orderCreated]: handleOrderCreatedEvent,
};

export class KafkaMessageController {
  constructor() {}

  public async handle(message: Message): Promise<void> {
    try {
      const messageValue = message?.value?.toString();

      if (!messageValue) {
        return;
      }

      const jsonValue = JSON.parse(messageValue);

      const handler = handlers[message.topic];

      if (!handler) {
        logger.warn(`No handler found for topic ${message.topic}`);
        return;
      }

      await handler(jsonValue);
    } catch (err) {
      logger.error((err as Error).message, err);
    }
  }
}

export default new KafkaMessageController();
