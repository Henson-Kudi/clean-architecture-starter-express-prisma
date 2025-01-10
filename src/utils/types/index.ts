export type CreatedOrder = {
  id: string;
  serialNumber: number;
  refNumber: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  totalAmount: number;
  discount?: number;
  discountId?: string;
  currency?: string;
  status?: string;
  createdAt: string;
  updatedAt?: string;
  orderItems: Array<Record<string, unknown>>;
  paymentId?: string;
  shippingAddress: Record<string, unknown>;
};

export type KafkaMessageControllerHandler<T = unknown> = (
  data: T
) => Promise<void> | void;
