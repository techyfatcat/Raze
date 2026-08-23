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

  onCheckout?: (
    items: CartItem[]
  ) => void;

};


const RazeContext =
  createContext<RazeContextType | null>(null);


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

  onCheckout?: (
    items: CartItem[]
  ) => void;

  children: ReactNode;

}) {


  const client = useMemo(() => {

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


      chat: async (
        message: string,
        history: RazeMessage[] = []
      ) => {

        /*
         * History is currently kept at the
         * provider level so the SDK API is
         * ready for conversational chat.
         *
         * The current RazeClient.chat()
         * accepts only the message.
         */

        void history;

        return client.chat(message);

      },


      createOrder: (
        items: CartItem[]
      ) => {

        return client.createOrder(items);

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

      onAddToCart,

      onCheckout,

    ]);


  return (

    <RazeContext.Provider
      value={value}
    >

      <RazeCartProvider>

        {children}

      </RazeCartProvider>

    </RazeContext.Provider>

  );

}


export function useRaze() {

  const context =
    useContext(RazeContext);


  if (!context) {

    throw new Error(
      "useRaze must be used inside RazeProvider"
    );

  }


  return context;

}