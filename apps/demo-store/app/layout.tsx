import type {
  Metadata,
} from "next";

import "./globals.css";

import RazeStoreProvider from "../components/RazeStoreProvider";


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

        <script
          src="https://checkout.razorpay.com/v1/checkout.js"
        />

        <RazeStoreProvider>

          {children}

        </RazeStoreProvider>

      </body>

    </html>

  );

}