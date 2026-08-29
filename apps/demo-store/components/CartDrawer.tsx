"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";

import {
  useRaze,
  useRazeCart,
} from "@raze/commerce-sdk/react";

import type {
  Product,
} from "@raze/commerce-sdk";

import {
  ShoppingCart,
  X,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  PackageOpen,
  ShieldCheck,
} from "lucide-react";


/* =========================================================
   CART DRAWER REF
========================================================= */

export type CartDrawerRef = {
  open: () => void;
  checkout: () => void;
};


/* =========================================================
   CART DRAWER
========================================================= */

const CartDrawer = forwardRef<CartDrawerRef>(
  function CartDrawer(_, ref) {

    const {
      client,
      startCheckout,
    } = useRaze();


    const {
      items,
      updateQuantity,
      removeItem,
      clearCart,
      itemCount,
    } = useRazeCart();


    const [
      open,
      setOpen,
    ] = useState(false);


    const [
      products,
      setProducts,
    ] = useState<Record<string, Product>>({});


    const [
      processingPayment,
      setProcessingPayment,
    ] = useState(false);





    /* =====================================================
       LOAD CART PRODUCTS
    ===================================================== */

    useEffect(() => {

      async function loadProducts() {

        const data: Record<string, Product> = {};


        for (const item of items) {

          try {

            const response =
              await client.getProduct(
                item.productId
              );


            data[item.productId] =
              response.product;

          }

          catch (error) {

            console.error(
              "Cart product error",
              error
            );

          }

        }


        setProducts(data);

      }


      if (items.length) {

        loadProducts();

      }

      else {

        setProducts({});

      }

    }, [
      items,
      client,
    ]);


    /* =====================================================
       SUBTOTAL
    ===================================================== */

    const subtotal =
      useMemo(() => {

        return items.reduce(
          (total, item) => {

            const product =
              products[item.productId];


            if (!product) {
              return total;
            }


            return (
              total +
              product.price *
              item.quantity
            );

          },
          0
        );

      }, [
        items,
        products,
      ]);


    /* =====================================================
       CREATE ORDER + REQUEST PAYMENT
    ===================================================== */

    async function checkout() {

      if (
        !items.length ||
        processingPayment
      ) {
        return;
      }


      try {

        setProcessingPayment(true);

        setOpen(false);

        await startCheckout();

      }

      catch (error) {

        console.error(
          "Checkout error",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Unable to start checkout"
        );

      }

      finally {

        setProcessingPayment(false);

      }

    }




    /* =====================================================
       RENDER
    ===================================================== */

    return (

      <>

        {/* =================================================
            CART BUTTON
        ================================================= */}

        <button

          onClick={() =>
            setOpen(true)
          }

          className="
            flex
            items-center
            gap-2
            text-sm
            text-neutral-700
            hover:text-black
            transition
          "

        >

          <ShoppingCart
            size={18}
            strokeWidth={1.8}
          />


          <span>
            Cart
          </span>


          {itemCount > 0 && (

            <span

              className="
                min-w-5
                h-5
                px-1
                rounded-full
                bg-black
                text-white
                flex
                items-center
                justify-center
                text-[11px]
                font-medium
              "

            >

              {itemCount}

            </span>

          )}

        </button>


        {/* =================================================
            CART MODAL
        ================================================= */}

        {open && (

          <div

            className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              bg-black/35
              backdrop-blur-sm
              p-4
            "

            onClick={() =>
              setOpen(false)
            }

          >

            <div

              onClick={event =>
                event.stopPropagation()
              }

              className="
                w-full
                max-w-xl
                max-h-[90vh]
                bg-white
                rounded-3xl
                shadow-2xl
                overflow-hidden
                flex
                flex-col
              "

            >

              {/* HEADER */}

              <div

                className="
                  flex
                  items-center
                  justify-between
                  px-7
                  py-6
                  border-b
                  border-neutral-100
                "

              >

                <div>

                  <h2

                    className="
                      text-xl
                      font-semibold
                      tracking-tight
                    "

                  >

                    Your Cart

                  </h2>


                  <p

                    className="
                      mt-1
                      text-sm
                      text-neutral-500
                    "

                  >

                    {itemCount === 0
                      ? ""
                      : `${itemCount} ${itemCount === 1
                        ? "item"
                        : "items"
                      }`
                    }

                  </p>

                </div>


                <button

                  onClick={() =>
                    setOpen(false)
                  }

                  className="
                    h-9
                    w-9
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-neutral-500
                    hover:bg-neutral-100
                    hover:text-black
                    transition
                  "

                  aria-label="Close cart"

                >

                  <X
                    size={19}
                  />

                </button>

              </div>


              {/* CART CONTENT */}

              <div

                className="
                  flex-1
                  overflow-y-auto
                  px-7
                  py-6
                "

              >

                {items.length === 0 ? (

                  <div

                    className="
                      min-h-[300px]
                      flex
                      flex-col
                      items-center
                      justify-center
                      text-center
                    "

                  >

                    <div

                      className="
                        h-16
                        w-16
                        rounded-full
                        bg-neutral-100
                        flex
                        items-center
                        justify-center
                        mb-5
                      "

                    >

                      <PackageOpen
                        size={28}
                        className="text-neutral-500"
                      />

                    </div>


                    <h3

                      className="
                        text-lg
                        font-medium
                      "

                    >

                      Cart is empty

                    </h3>


                    <p

                      className="
                        mt-2
                        text-sm
                        text-neutral-500
                        max-w-xs
                      "

                    >

                      Add some products and
                      they'll appear here.

                    </p>

                  </div>

                ) : (

                  <div
                    className="
                      space-y-3
                    "
                  >

                    {items.map(item => {

                      const product =
                        products[
                        item.productId
                        ];


                      return (

                        <div

                          key={
                            item.productId
                          }

                          className="
                            rounded-2xl
                            border
                            border-neutral-200
                            p-4
                            flex
                            gap-4
                          "

                        >

                          {/* PRODUCT VISUAL */}

                          <div

                            className="
                              h-20
                              w-20
                              shrink-0
                              rounded-xl
                              bg-neutral-100
                              flex
                              items-center
                              justify-center
                              overflow-hidden
                            "

                          >

                            <span
                              className="
    text-xs
    text-neutral-400
  "
                            >
                              Product
                            </span>



                          </div>


                          {/* PRODUCT INFO */}

                          <div

                            className="
                              flex-1
                              min-w-0
                            "

                          >

                            <div

                              className="
                                flex
                                justify-between
                                gap-3
                              "

                            >

                              <div>

                                <h3

                                  className="
                                    font-medium
                                    truncate
                                  "

                                >

                                  {product
                                    ? product.name
                                    : "Loading..."
                                  }

                                </h3>


                                {product && (

                                  <p

                                    className="
                                      mt-1
                                      text-sm
                                      text-neutral-500
                                    "

                                  >

                                    ₹
                                    {product.price
                                      .toLocaleString(
                                        "en-IN"
                                      )
                                    }

                                  </p>

                                )}

                              </div>


                              <button

                                onClick={() =>
                                  removeItem(
                                    item.productId
                                  )
                                }

                                className="
                                  h-8
                                  w-8
                                  shrink-0
                                  rounded-full
                                  flex
                                  items-center
                                  justify-center
                                  text-neutral-400
                                  hover:bg-red-50
                                  hover:text-red-500
                                  transition
                                "

                                aria-label={
                                  `Remove ${product?.name ??
                                  "product"
                                  }`
                                }

                              >

                                <Trash2
                                  size={16}
                                />

                              </button>

                            </div>


                            {/* QUANTITY */}

                            <div

                              className="
                                mt-4
                                flex
                                items-center
                                justify-between
                              "

                            >

                              <div

                                className="
                                  flex
                                  items-center
                                  rounded-full
                                  border
                                  border-neutral-200
                                  overflow-hidden
                                "

                              >

                                <button

                                  onClick={() =>
                                    updateQuantity(
                                      item.productId,
                                      item.quantity - 1
                                    )
                                  }

                                  className="
                                    h-8
                                    w-8
                                    flex
                                    items-center
                                    justify-center
                                    hover:bg-neutral-100
                                    transition
                                  "

                                  aria-label="Decrease quantity"

                                >

                                  <Minus
                                    size={14}
                                  />

                                </button>


                                <span

                                  className="
                                    w-8
                                    text-center
                                    text-sm
                                    font-medium
                                  "

                                >

                                  {item.quantity}

                                </span>


                                <button

                                  onClick={() =>
                                    updateQuantity(
                                      item.productId,
                                      item.quantity + 1
                                    )
                                  }

                                  className="
                                    h-8
                                    w-8
                                    flex
                                    items-center
                                    justify-center
                                    hover:bg-neutral-100
                                    transition
                                  "

                                  aria-label="Increase quantity"

                                >

                                  <Plus
                                    size={14}
                                  />

                                </button>

                              </div>


                              {product && (

                                <p

                                  className="
                                    text-sm
                                    font-medium
                                  "

                                >

                                  ₹
                                  {(
                                    product.price *
                                    item.quantity
                                  ).toLocaleString(
                                    "en-IN"
                                  )}

                                </p>

                              )}

                            </div>

                          </div>

                        </div>

                      );

                    })}

                  </div>

                )}

              </div>


              {/* FOOTER */}

              {items.length > 0 && (

                <div

                  className="
                    border-t
                    border-neutral-100
                    px-7
                    py-6
                  "

                >

                  <div

                    className="
                      flex
                      items-center
                      justify-between
                      mb-4
                    "

                  >

                    <span

                      className="
                        text-sm
                        text-neutral-500
                      "

                    >

                      Subtotal

                    </span>


                    <span

                      className="
                        text-xl
                        font-semibold
                      "

                    >

                      ₹
                      {subtotal.toLocaleString(
                        "en-IN"
                      )}

                    </span>

                  </div>


                  <button

                    onClick={checkout}

                    disabled={
                      processingPayment ||
                      items.length === 0
                    }

                    className="
                      w-full
                      h-12
                      rounded-full
                      bg-black
                      text-white
                      flex
                      items-center
                      justify-center
                      gap-2
                      font-medium
                      hover:bg-neutral-800
                      transition
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "

                  >

                    {processingPayment
                      ? "Processing..."
                      : "Proceed to Checkout"
                    }


                    {!processingPayment && (

                      <ArrowRight
                        size={17}
                      />

                    )}

                  </button>


                  <div

                    className="
                      mt-4
                      flex
                      items-center
                      justify-center
                      gap-2
                      text-xs
                      text-neutral-400
                    "

                  >

                    <ShieldCheck
                      size={14}
                    />

                    Secure checkout powered by Raze

                  </div>

                </div>

              )}

            </div>

          </div>

        )}




      </>

    );

  }
);


CartDrawer.displayName =
  "CartDrawer";


export default CartDrawer;