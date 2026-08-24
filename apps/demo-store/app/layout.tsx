import {
  RazeProvider,
  RazeAssistant,
  RazeCartProvider,
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

        <script src="https://checkout.razorpay.com/v1/checkout.js" />


        <RazeProvider

          merchantId={
            process.env.NEXT_PUBLIC_RAZE_MERCHANT_ID!
          }

          apiUrl={
            process.env.NEXT_PUBLIC_RAZE_API_URL
          }

        >


          <RazeCartProvider>


            {children}


            <RazeAssistant/>


          </RazeCartProvider>


        </RazeProvider>


      </body>

    </html>

  );

}