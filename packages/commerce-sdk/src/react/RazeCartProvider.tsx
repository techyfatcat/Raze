"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type {
  CartItem,
} from "../types";


/* -------------------------------------------------------------------------- */
/* Context type                                                               */
/* -------------------------------------------------------------------------- */

type RazeCartContextType = {

  items: CartItem[];

  addItem: (
    item: CartItem
  ) => void;

  removeItem: (
    productId: string
  ) => void;

  clearCart: () => void;

};


/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

const RazeCartContext =
  createContext<RazeCartContextType | null>(
    null
  );


/* -------------------------------------------------------------------------- */
/* Provider                                                                   */
/* -------------------------------------------------------------------------- */

export function RazeCartProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [
    items,
    setItems,
  ] = useState<CartItem[]>([]);


  /* ---------------------------------------------------------------------- */
  /* Add item                                                               */
  /* ---------------------------------------------------------------------- */

  function addItem(
    item: CartItem
  ) {

    if (
      !item.productId ||
      item.quantity <= 0
    ) {
      return;
    }


    setItems(prev => {

      const existing =
        prev.find(
          cartItem =>
            cartItem.productId ===
            item.productId
        );


      if (existing) {

        return prev.map(
          cartItem =>

            cartItem.productId ===
            item.productId

              ? {
                  ...cartItem,

                  quantity:
                    cartItem.quantity +
                    item.quantity,
                }

              : cartItem
        );

      }


      return [
        ...prev,
        item,
      ];

    });

  }


  /* ---------------------------------------------------------------------- */
  /* Remove item                                                            */
  /* ---------------------------------------------------------------------- */

  function removeItem(
    productId: string
  ) {

    setItems(prev =>
      prev.filter(
        item =>
          item.productId !==
          productId
      )
    );

  }


  /* ---------------------------------------------------------------------- */
  /* Clear cart                                                             */
  /* ---------------------------------------------------------------------- */

  function clearCart() {

    setItems([]);

  }


  /* ---------------------------------------------------------------------- */
  /* Provider                                                               */
  /* ---------------------------------------------------------------------- */

  return (

    <RazeCartContext.Provider
      value={{
        items,

        addItem,

        removeItem,

        clearCart,
      }}
    >

      {children}

    </RazeCartContext.Provider>

  );

}


/* -------------------------------------------------------------------------- */
/* Hook                                                                       */
/* -------------------------------------------------------------------------- */

export function useRazeCart() {

  const cart =
    useContext(
      RazeCartContext
    );


  if (!cart) {

    throw new Error(
      "useRazeCart must be used inside RazeCartProvider"
    );

  }


  return cart;

}