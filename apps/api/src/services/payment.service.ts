import { prisma } from "../lib/prisma.js";

import {
  getPaymentProvider,
} from "../payments/payment-provider.factory.js";





export async function createPaymentOrder(
  orderId: string,
  agentActionId: string
) {


  const action =
    await prisma.agentAction.findFirst({

      where: {

        id: agentActionId,

        action:
          "PAYMENT_REQUEST",

        agentType:
          "PAYMENT",

        status:
          "APPROVED",

      },

    });



  if (!action) {

    throw new Error(
      "Payment requires an approved customer authorization"
    );

  }







  const order =
    await prisma.order.findUnique({

      where: {

        id: orderId,

      },

    });





  if (!order) {

    throw new Error(
      "Order not found"
    );

  }







  if (order.status !== "PENDING") {

    throw new Error(
      "Order is not payable"
    );

  }








  const metadata =
    action.metadata;



  if (
    !metadata ||
    typeof metadata !== "object" ||
    Array.isArray(metadata)
  ) {

    throw new Error(
      "Invalid payment authorization"
    );

  }







  const authorizedOrderId =
    (
      metadata as {
        orderId?: unknown
      }
    ).orderId;





  if (authorizedOrderId !== order.id) {

    throw new Error(
      "Payment authorization does not match order"
    );

  }







  if (action.amount !== order.amount) {

    throw new Error(
      "Authorized amount does not match order amount"
    );

  }







  /*
    If Razorpay order already exists
    return existing details
  */

  if (order.razorpayOrderId) {


    return {

      order,

      providerOrderId:
        order.razorpayOrderId,


      key:
        process.env.RAZORPAY_KEY_ID,


      amount:
        order.amount,


      currency:
        order.currency,

    };


  }








  const provider =
    getPaymentProvider();







  const paymentOrder = await provider.createOrder({

  amount:
    order.amount,

  currency:
    order.currency,

  receipt:
    order.id,

  metadata:{
    razeOrderId: order.id,
    merchantId: order.merchantId,
  },

});






  await prisma.order.update({

    where: {

      id: order.id,

    },

    data: {

      razorpayOrderId:
        paymentOrder.providerOrderId,


      status:
        "PROCESSING",

    },

  });







  return {

    order,


    providerOrderId:
      paymentOrder.providerOrderId,


    key:
      paymentOrder.key,


    amount:
      paymentOrder.amount,


    currency:
      paymentOrder.currency,


  };

}









export async function verifyPayment(

  orderId: string,

  providerOrderId: string,

  paymentId: string,

  signature: string

) {



  const order =
    await prisma.order.findUnique({

      where: {

        id: orderId,

      },

      include: {

        payments: true,

      },

    });







  if (!order) {

    throw new Error(
      "Order not found"
    );

  }







  if (
    order.razorpayOrderId !==
    providerOrderId
  ) {

    throw new Error(
      "Payment order mismatch"
    );

  }







  if (order.status === "PAID") {

    return {

      alreadyPaid:
        true,

      order,

    };

  }








  const provider =
    getPaymentProvider();





  const valid =
    await provider.verifyPayment({

      providerOrderId,

      paymentId,

      signature,

    });







  if (!valid) {

    throw new Error(
      "Invalid payment signature"
    );

  }








  const payment =
    order.payments.find(
      p =>
        p.status !== "SUCCESS"
    );







  if (!payment) {

    throw new Error(
      "Payment record not found"
    );

  }








  await prisma.$transaction([


    prisma.order.update({

      where: {

        id: order.id,

      },

      data: {

        status:
          "PAID",

      },

    }),





    prisma.payment.update({

      where: {

        id: payment.id,

      },

      data: {

        status:
          "SUCCESS",


        razorpayPaymentId:
          paymentId,

      },

    }),





    prisma.auditLog.create({

      data: {

        merchantId:
          order.merchantId,


        actionType:
          "PAYMENT_SUCCESS",


        description:
          "Payment successfully verified",


        agentType:
          "PAYMENT",


        amount:
          order.amount,


        metadata: {

          orderId:
            order.id,


          providerOrderId,


          paymentId,

        },

      },

    }),


  ]);







  return {

    alreadyPaid:
      false,


    orderId:
      order.id,


    status:
      "PAID",

  };


}