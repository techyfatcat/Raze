"use client";

import {
  createContext,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

import {
  RazeClient,
} from "../client";

import type {
  Product,
  CartItem,
  PaymentRequest,
  RazeMessage,
} from "../types";

import {
  RazeCartProvider,
  useRazeCart,
} from "./RazeCartProvider";


type RazeChatResponse = {
  success: boolean;

  message: string;

  products?: Product[];

  action?:
    | "SHOW_PRODUCTS"
    | "ADD_TO_CART"
    | "REMOVE_FROM_CART"
    | "UPDATE_CART"
    | "CLEAR_CART"
    | "CHECKOUT"
    | "NONE";

  productId?: string;

  quantity?: number;
};


type CheckoutHandler =
  () => Promise<void>;


type RazeContextType = {

  client: RazeClient;

  getCatalog: () =>
    ReturnType<RazeClient["getCatalog"]>;

  chat: (
    message: string,
    history?: RazeMessage[]
  ) => Promise<RazeChatResponse>;

  createOrder: (
    items: CartItem[]
  ) =>
    ReturnType<RazeClient["createOrder"]>;

  requestPayment: (
    orderId: string,
    reason: string
  ) => Promise<PaymentRequest>;

  approvePayment: (
    actionId: string
  ) =>
    ReturnType<RazeClient["approvePayment"]>;

  createPayment: (
    orderId: string,
    actionId: string
  ) =>
    ReturnType<RazeClient["createPayment"]>;

  /*
   * Shared checkout entry point.
   *
   * RazeAssistant registers the actual checkout
   * implementation here.
   *
   * CartDrawer can then trigger the same checkout
   * flow without implementing its own payment UI.
   */
  registerCheckout: (
    handler: CheckoutHandler
  ) => () => void;

  startCheckout: () =>
    Promise<void>;

  onAddToCart?: (
    product: Product
  ) => void;

  onCheckout?: () => void;

};


const RazeContext =
  createContext<RazeContextType | null>(
    null
  );


export function RazeProvider({

  merchantId,

  apiUrl,

  onAddToCart,

  onCheckout,

  children,

}: {

  merchantId: string;

  apiUrl?: string;

  onAddToCart?: (
    product: Product
  ) => void;

  onCheckout?: () => void;

  children: ReactNode;

}) {

  return (

    <RazeCartProvider>

      <RazeProviderInner

        merchantId={
          merchantId
        }

        apiUrl={
          apiUrl
        }

        onAddToCart={
          onAddToCart
        }

        onCheckout={
          onCheckout
        }

      >

        {children}

      </RazeProviderInner>

    </RazeCartProvider>

  );

}


function RazeProviderInner({

  merchantId,

  apiUrl,

  onAddToCart,

  onCheckout,

  children,

}: {

  merchantId: string;

  apiUrl?: string;

  onAddToCart?: (
    product: Product
  ) => void;

  onCheckout?: () => void;

  children: ReactNode;

}) {


  const {
    items,
  } = useRazeCart();


  const client =
    useMemo(() => {

      return new RazeClient({

        merchantId,

        apiUrl,

      });

    }, [

      merchantId,

      apiUrl,

    ]);


  /*
   * --------------------------------------------------
   * SHARED CHECKOUT HANDLER
   * --------------------------------------------------
   *
   * RazeAssistant owns the actual checkout flow.
   *
   * This ref allows CartDrawer to invoke that same
   * flow without creating a second payment popup.
   */

  const checkoutHandlerRef =
    useRef<CheckoutHandler | null>(
      null
    );


  const value =
    useMemo<RazeContextType>(() => ({

      client,


      getCatalog: () => {

        return client.getCatalog();

      },


      chat: async (

        message: string,

        history:
          RazeMessage[] = []

      ) => {

        return client.chat(

          message,

          history,

          items

        );

      },


      createOrder: (
        orderItems: CartItem[]
      ) => {

        return client.createOrder(
          orderItems
        );

      },


      requestPayment: (

        orderId: string,

        reason: string

      ) => {

        return client.requestPayment(

          orderId,

          reason

        );

      },


      approvePayment: (
        actionId: string
      ) => {

        return client.approvePayment(
          actionId
        );

      },


      createPayment: (

        orderId: string,

        actionId: string

      ) => {

        return client.createPayment(

          orderId,

          actionId

        );

      },


      registerCheckout: (
        handler: CheckoutHandler
      ) => {

        checkoutHandlerRef.current =
          handler;


        return () => {

          if (
            checkoutHandlerRef.current ===
            handler
          ) {

            checkoutHandlerRef.current =
              null;

          }

        };

      },


      startCheckout: async () => {

        const handler =
          checkoutHandlerRef.current;


        if (!handler) {

          console.warn(
            "Raze checkout is not ready yet."
          );

          return;

        }


        await handler();

      },


      onAddToCart,

      onCheckout,

    }), [

      client,

      items,

      onAddToCart,

      onCheckout,

    ]);


  return (

    <RazeContext.Provider
      value={value}
    >

      {children}

    </RazeContext.Provider>

  );

}


export function useRaze() {

  const context =
    useContext(
      RazeContext
    );


  if (!context) {

    throw new Error(
      "useRaze must be used inside RazeProvider"
    );

  }


  return context;

}