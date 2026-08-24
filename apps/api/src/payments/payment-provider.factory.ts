import type { PaymentProvider } from "./payment-provider.js";

import {
  MockPaymentProvider,
} from "./mock-payment.provider.js";

import {
  RazorpayPaymentProvider,
} from "./razorpay-payment.provider.js";


export function getPaymentProvider(): PaymentProvider {

  const provider =
    process.env.PAYMENT_PROVIDER ?? "mock";


  switch (provider) {

    case "razorpay":
      return new RazorpayPaymentProvider();


    case "mock":
      return new MockPaymentProvider();


    default:
      throw new Error(
        `Unsupported payment provider: ${provider}`
      );

  }

}