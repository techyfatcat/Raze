import type { PaymentProvider } from "./payment-provider.js";
import { MockPaymentProvider } from "./mock-payment.provider.js";

const provider =
  process.env.PAYMENT_PROVIDER ?? "mock";

export function getPaymentProvider(): PaymentProvider {
  switch (provider) {
    case "mock":
      return new MockPaymentProvider();

    default:
      throw new Error(
        `Unsupported payment provider: ${provider}`
      );
  }
}