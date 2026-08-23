import type {
  CartItem,
  Product,
  RazeConfig,
  PaymentRequest,
  RazeMessage,
} from "./types";


const DEFAULT_API_URL =
  "http://localhost:5000";



export class RazeClient {


  private readonly merchantId:string;

  private readonly apiUrl:string;



  constructor(
    config:RazeConfig
  ){

    this.merchantId =
      config.merchantId;


    this.apiUrl =
      config.apiUrl?.replace(/\/$/,"")
      ??
      DEFAULT_API_URL;

  }





  private async request<T>(
    path:string,
    options?:RequestInit
  ):Promise<T>{


    const response =
      await fetch(
        `${this.apiUrl}${path}`,
        {

          ...options,

          headers:{
            "Content-Type":
              "application/json",

            ...(options?.headers ?? {}),

          },

        }
      );



    const data =
      await response.json();



    if(!response.ok){

      throw new Error(
        data?.message ??
        "Raze API request failed"
      );

    }



    return data;

  }







  async getCatalog(){


    return this.request<{

      success:boolean;

      products:Product[];

    }>(

      `/api/catalog/${this.merchantId}/catalog`

    );

  }








  async chat(
    message:string,
    history:RazeMessage[] = []
  ){


    return this.request<{

      success:boolean;

      message:string;

      products?:Product[];

      action:
        | "SHOW_PRODUCTS"
        | "ADD_TO_CART"
        | "CHECKOUT"
        | "NONE";


    }>("/api/agent/chat",{


      method:"POST",


      body:JSON.stringify({


        merchantId:
          this.merchantId,


        messages:[

          ...history,


          {

            role:"user",

            content:message,

          }

        ],


      }),


    });


  }









  async createOrder(
    items:CartItem[]
  ){


    return this.request<{

      success:boolean;

      order:{

        id:string;

        amount:number;

        currency:string;

        status:string;

      };


    }>("/api/orders",{


      method:"POST",


      body:JSON.stringify({


        merchantId:
          this.merchantId,


        items,


      }),


    });


  }









  async requestPayment(
    orderId:string,
    reason:string
  ):Promise<PaymentRequest>{


    const response =
      await this.request<{

        success:boolean;

        action:{

          id:string;

          amount:number;

          status:string;

        };


      }>(
        "/api/agent-actions/payment-request",
        {


          method:"POST",


          body:JSON.stringify({


            merchantId:
              this.merchantId,


            orderId,


            reason,


          }),


        }
      );



    return {


      orderId,


      actionId:
        response.action.id,


      amount:
        response.action.amount,


      currency:
        "INR",


      reason,


    };


  }








  async approvePayment(
    actionId:string
  ){


    return this.request(

      `/api/agent-actions/${actionId}/approve`,

      {

        method:"POST",

      }

    );


  }








  async createPayment(
    orderId:string,
    actionId:string
  ){


    return this.request(

      "/api/payments/create",

      {


        method:"POST",


        body:JSON.stringify({

          orderId,


          agentActionId:
            actionId,


        }),

      }

    );


  }


}