export interface CreatePaymentOrderInput {
  amount: number;
  currency: string;
  receipt: string;
  metadata?: Record<string, string>;
}

export interface PaymentOrder {
  providerOrderId: string;
  amount: number;
  currency: string;
}

export interface VerifyPaymentInput {
  providerOrderId: string;
  paymentId: string;
  signature: string;
}

export interface PaymentProvider {
  createOrder(
    input: CreatePaymentOrderInput
  ): Promise<PaymentOrder>;

  verifyPayment(
    input: VerifyPaymentInput
  ): Promise<boolean>;
}