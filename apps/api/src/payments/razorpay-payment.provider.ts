import Razorpay from "razorpay";

import type {
  CreatePaymentOrderInput,
  PaymentOrder,
  PaymentProvider,
  VerifyPaymentInput,
} from "./payment-provider.js";

import crypto from "node:crypto";


export class RazorpayPaymentProvider
implements PaymentProvider {


private razorpay:Razorpay;



constructor(){

this.razorpay =
new Razorpay({

key_id:
process.env.RAZORPAY_KEY_ID!,

key_secret:
process.env.RAZORPAY_KEY_SECRET!,

});

}



async createOrder(
input:CreatePaymentOrderInput
):Promise<PaymentOrder>{


const order =
await this.razorpay.orders.create({

amount:
input.amount * 100,

currency:
input.currency,

receipt:
`raze_${crypto.randomUUID()}`

});


return {

  providerOrderId:
    order.id as string,


  amount:
    input.amount,


  currency:
    input.currency,


  key:
    process.env.RAZORPAY_KEY_ID,

};
}





async verifyPayment(
input:VerifyPaymentInput
):Promise<boolean>{


const generatedSignature =
crypto
.createHmac(
"sha256",
process.env.RAZORPAY_KEY_SECRET!
)
.update(
`${input.providerOrderId}|${input.paymentId}`
)
.digest("hex");



return generatedSignature === input.signature;


}


}