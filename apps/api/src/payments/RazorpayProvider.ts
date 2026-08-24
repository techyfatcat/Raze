import Razorpay from "razorpay";


export class RazorpayProvider {


  private client:Razorpay;


  constructor(){


    this.client =
      new Razorpay({

        key_id:
          process.env.RAZORPAY_KEY_ID!,


        key_secret:
          process.env.RAZORPAY_KEY_SECRET!,

      });


  }




  async createOrder({

    amount,

    currency,

  }:{

    amount:number;

    currency:string;

  }){


    return this.client.orders.create({

      amount:
        amount * 100,


      currency,


    });


  }



}