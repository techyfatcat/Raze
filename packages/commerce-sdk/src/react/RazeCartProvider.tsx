"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  CartItem,
} from "../types";


export type RazeCartContextType = {

  items: CartItem[];

  addItem: (
    item: CartItem
  ) => void;

  removeItem: (
    productId: string
  ) => void;

  updateQuantity: (
    productId: string,
    quantity: number
  ) => void;

  clearCart: () => void;

  getItemQuantity: (
    productId: string
  ) => number;

  itemCount: number;

};


const RazeCartContext =
  createContext<RazeCartContextType | null>(
    null
  );


export function RazeCartProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [
    items,
    setItems,
  ] = useState<CartItem[]>([]);


  /* -------------------------------------------------- */
  /* Add item                                           */
  /* -------------------------------------------------- */

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
          cartItem => {

            if (
              cartItem.productId !==
              item.productId
            ) {
              return cartItem;
            }


            return {

              ...cartItem,

              quantity:
                cartItem.quantity +
                item.quantity,

            };

          }
        );

      }


      return [
        ...prev,
        {
          productId:
            item.productId,

          quantity:
            item.quantity,
        },
      ];

    });

  }


  /* -------------------------------------------------- */
  /* Remove item                                        */
  /* -------------------------------------------------- */

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


  /* -------------------------------------------------- */
  /* Update quantity                                    */
  /* -------------------------------------------------- */

  function updateQuantity(
    productId: string,
    quantity: number
  ) {

    if (quantity <= 0) {

      removeItem(
        productId
      );

      return;

    }


    setItems(prev =>
      prev.map(item =>

        item.productId === productId

          ? {
              ...item,
              quantity,
            }

          : item

      )
    );

  }


  /* -------------------------------------------------- */
  /* Clear cart                                         */
  /* -------------------------------------------------- */

  function clearCart() {

    setItems([]);

  }


  /* -------------------------------------------------- */
  /* Get quantity                                       */
  /* -------------------------------------------------- */

  function getItemQuantity(
    productId: string
  ) {

    return (
      items.find(
        item =>
          item.productId ===
          productId
      )?.quantity ?? 0
    );

  }


  /* -------------------------------------------------- */
  /* Total item count                                   */
  /* -------------------------------------------------- */

  const itemCount =
    useMemo(() => {

      return items.reduce(
        (
          total,
          item
        ) =>
          total +
          item.quantity,

        0
      );

    }, [
      items,
    ]);


  const value =
    useMemo(
      () => ({

        items,

        addItem,

        removeItem,

        updateQuantity,

        clearCart,

        getItemQuantity,

        itemCount,

      }),
      [
        items,
        itemCount,
      ]
    );


  return (

    <RazeCartContext.Provider
      value={value}
    >

      {children}

    </RazeCartContext.Provider>

  );

}


/* -------------------------------------------------- */
/* Hook                                               */
/* -------------------------------------------------- */

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