"use client";

import {
  createContext,
  useContext,
  useMemo,
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
    | "CHECKOUT"
    | "NONE";
};


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


/*
 * ======================================================
 * INTERNAL PROVIDER
 * ======================================================
 *
 * This component is inside RazeCartProvider,
 * so it can safely access the current cart.
 */

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


  const value =
    useMemo<RazeContextType>(() => ({

      client,


      getCatalog: () => {

        return client.getCatalog();

      },


      /*
       * ------------------------------------------
       * AI CHAT
       * ------------------------------------------
       *
       * The current cart is automatically sent
       * to the backend.
       */

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