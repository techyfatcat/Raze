"use client";

import {
  RazeProvider,
  RazeAssistant,
} from "@raze/commerce-sdk/react";

import CartDrawer from "./CartDrawer";


export default function RazeStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {

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

    >

      {children}

      <RazeAssistant />

      <CartDrawer />

    </RazeProvider>

  );

}