import {
  RazeProvider,
} from "@raze/commerce-sdk/react";

import {
  RazeAssistant,
} from "@raze/commerce-sdk/react";


import type {
  Metadata,
} from "next";


import "./globals.css";


export const metadata: Metadata = {
  title: "RazeStore",
  description: "AI Commerce Demo",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (

    <html lang="en">

      <body>


        <RazeProvider

          merchantId={
            process.env.NEXT_PUBLIC_RAZE_MERCHANT_ID!
          }

          apiUrl={
            process.env.NEXT_PUBLIC_RAZE_API_URL
          }

        >

          {children}


          <RazeAssistant/>


        </RazeProvider>


      </body>

    </html>

  );

}