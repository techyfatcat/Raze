import crypto from "node:crypto";
import type {
  CreatePaymentOrderInput,
  PaymentOrder,
  PaymentProvider,
  VerifyPaymentInput,
} from "./payment-provider.js";

const MOCK_SECRET =
  process.env.MOCK_PAYMENT_SECRET ?? "raze-local-secret";

export class MockPaymentProvider implements PaymentProvider {
  async createOrder(
    input: CreatePaymentOrderInput
  ): Promise<PaymentOrder> {
    return {
      providerOrderId: `mock_order_${crypto.randomUUID()}`,
      amount: input.amount,
      currency: input.currency,
    };
  }

  async verifyPayment(
    input: VerifyPaymentInput
  ): Promise<boolean> {
    const expectedSignature = crypto
      .createHmac("sha256", MOCK_SECRET)
      .update(
        `${input.providerOrderId}|${input.paymentId}`
      )
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(input.signature)
    );
  }

  generateTestPayment(
    providerOrderId: string
  ) {
    const paymentId = `mock_payment_${crypto.randomUUID()}`;

    const signature = crypto
      .createHmac("sha256", MOCK_SECRET)
      .update(
        `${providerOrderId}|${paymentId}`
      )
      .digest("hex");

    return {
      paymentId,
      signature,
    };
  }
}