// This file should be used to define interfaces for external service providers like password manager, cacheManager, message brokers, etc
import {
  MessageHandler,
  MessageSubscriptionParams,
  PublishMessageParams,
} from '../../domain/dtos/messageBroker';

export default interface IMessageBroker {
  publish(params: PublishMessageParams): void;
  subscribe(params: MessageSubscriptionParams, callback: MessageHandler): void;
}
