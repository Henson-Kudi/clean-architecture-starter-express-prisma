import startExpressServer from './presentation/express';
import messageBroker from './infrastructure/providers/messageBroker';
import { subscriptions } from './utils/kafkaTopics.json';
import KafkaMessageController from './presentation/http/controllers/kafka';

export default async function startServer() {
  startExpressServer();
  messageBroker.subscribe(
    [...Object.values(subscriptions)],
    KafkaMessageController.handle
  );
}
