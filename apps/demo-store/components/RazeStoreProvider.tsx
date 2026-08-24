"use client";

import {
  useRef,
} from "react";

import {
  RazeProvider,
  RazeAssistant,
} from "@raze/commerce-sdk/react";

import CartDrawer, {
  type CartDrawerRef,
} from "./CartDrawer";


export default function RazeStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const cartRef =
    useRef<CartDrawerRef>(null);


  function handleCheckout() {

    cartRef.current?.checkout();

  }


  return (

    <RazeProvider

      merchantId={
        process.env
          .NEXT_PUBLIC_RAZE_MERCHANT_ID!
      }

      apiUrl={
        process.env
          .NEXT_PUBLIC_RAZE_API_URL
      }

      onCheckout={
        handleCheckout
      }

    >

      {children}

      <RazeAssistant />

      <CartDrawer
        ref={cartRef}
      />

    </RazeProvider>

  );
}