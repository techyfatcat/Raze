import { prisma } from "../lib/prisma.js";


import {
  MockPaymentProvider,
} from "../payments/mock-payment.provider.js";


import {
  RazorpayPaymentProvider,
} from "../payments/razorpay-payment.provider.js";



function getPaymentProvider(){


  if(
    process.env.PAYMENT_PROVIDER === "razorpay"
  ){

    return new RazorpayPaymentProvider();

  }


  return new MockPaymentProvider();

}





export async function createPaymentOrder(
  orderId:string,
  agentActionId:string
){


  const order =
    await prisma.order.findUnique({

      where:{
        id:orderId,
      },

    });



  if(!order){

    throw new Error(
      "Order not found"
    );

  }




  const provider =
    getPaymentProvider();




  const providerOrder =
  await provider.createOrder({

    amount:
      order.amount,

    currency:
      order.currency,

    receipt:
      `order_${order.id}`,

  });





  await prisma.order.update({

    where:{
      id:orderId,
    },

    data:{

      razorpayOrderId:
        providerOrder.providerOrderId,

    },

  });






  const payment =
    await prisma.payment.create({

      data:{

        orderId,

        amount:
          order.amount,

        currency:
          order.currency,

        status:
          "CREATED",

      },

    });






  return {


    paymentId:
      payment.id,


    providerOrderId:
      providerOrder.providerOrderId,


    order,


    amount:
      order.amount,


    currency:
      order.currency,


  };


}