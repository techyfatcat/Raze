import type {
  CartItem,
  Product,
  RazeConfig,
  PaymentRequest,
  PaymentResponse,
  RazeMessage,
} from "./types";


const DEFAULT_API_URL =
  "http://localhost:5000";


export class RazeClient {

  private readonly merchantId: string;

  private readonly apiUrl: string;


  constructor(
    config: RazeConfig
  ) {

    this.merchantId =
      config.merchantId;


    this.apiUrl =
      config.apiUrl?.replace(/\/$/, "")
      ??
      DEFAULT_API_URL;

  }


  private async request<T>(
    path: string,
    options?: RequestInit
  ): Promise<T> {

    const response =
      await fetch(
        `${this.apiUrl}${path}`,
        {

          ...options,

          headers: {

            "Content-Type":
              "application/json",

            ...(options?.headers ?? {}),

          },

        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data?.message ??
        "Raze API request failed"
      );

    }


    return data;

  }


  async getCatalog() {

    return this.request<{

      success: boolean;

      products: Product[];

    }>(
      `/api/catalog/${this.merchantId}/catalog`
    );

  }


  /*
   * ======================================================
   * AI CHAT
   * ======================================================
   *
   * The current cart is sent alongside the conversation.
   *
   * Only productId + quantity are sent.
   * Prices are NEVER trusted from the client.
   */

  async chat(
    message: string,
    history: RazeMessage[] = [],
    cart: CartItem[] = []
  ) {

    return this.request<{

      success: boolean;

      message: string;

      products?: Product[];

      action:
        | "SHOW_PRODUCTS"
        | "ADD_TO_CART"
        | "CHECKOUT"
        | "NONE";

    }>(
      "/api/agent/chat",
      {

        method: "POST",

        body: JSON.stringify({

          merchantId:
            this.merchantId,

          messages: [

            ...history,

            {

              role: "user",

              content: message,

            },

          ],

          cart: cart.map(
            item => ({

              productId:
                item.productId,

              quantity:
                item.quantity,

            })
          ),

        }),

      }
    );

  }


  /*
   * ======================================================
   * CREATE ORDER
   * ======================================================
   */

  async createOrder(
    items: CartItem[]
  ) {

    return this.request<{

      success: boolean;

      order: {

        id: string;

        amount: number;

        currency: string;

        status: string;

      };

    }>(
      "/api/orders",
      {

        method: "POST",

        body: JSON.stringify({

          merchantId:
            this.merchantId,

          items,

        }),

      }
    );

  }


  /*
   * ======================================================
   * REQUEST PAYMENT AUTHORIZATION
   * ======================================================
   */

  async requestPayment(
    orderId: string,
    reason: string
  ): Promise<PaymentRequest> {

    const response =
      await this.request<{

        success: boolean;

        action: {

          id: string;

          amount: number;

          status: string;

        };

      }>(
        "/api/agent-actions/payment-request",
        {

          method: "POST",

          body: JSON.stringify({

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


  /*
   * ======================================================
   * GET PRODUCT
   * ======================================================
   */

  async getProduct(
    productId: string
  ) {

    return this.request<{

      success: boolean;

      product: Product;

    }>(
      `/api/catalog/${this.merchantId}/product/${productId}`
    );

  }


  /*
   * ======================================================
   * APPROVE PAYMENT
   * ======================================================
   */

  async approvePayment(
    actionId: string
  ) {

    return this.request(

      `/api/agent-actions/${actionId}/approve`,

      {

        method: "POST",

      }

    );

  }


  /*
   * ======================================================
   * VERIFY PAYMENT
   * ======================================================
   */

  async verifyPayment(
    data: {

      orderId: string;

      providerOrderId: string;

      paymentId: string;

      signature: string;

    }
  ) {

    return this.request(

      "/api/payments/verify",

      {

        method: "POST",

        body: JSON.stringify(data),

      }

    );

  }


  /*
   * ======================================================
   * CREATE PAYMENT
   * ======================================================
   */

  async createPayment(
    orderId: string,
    actionId: string
  ): Promise<PaymentResponse> {

    return this.request<PaymentResponse>(

      "/api/payments/create",

      {

        method: "POST",

        body: JSON.stringify({

          orderId,

          agentActionId:
            actionId,

        }),

      }

    );

  }

}