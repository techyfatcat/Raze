"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRaze,
  useRazeCart,
} from "@raze/commerce-sdk/react";

import type {
  Product,
  PaymentRequest,
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


export default function CartDrawer() {

  const {
    client,
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
    paymentRequest,
    setPaymentRequest,
  ] = useState<PaymentRequest | null>(null);


  const [
    processingPayment,
    setProcessingPayment,
  ] = useState(false);

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




  /*
   * Checkout
   */
  async function checkout() {

    if (
      !items.length ||
      processingPayment
    ) {
      return;
    }


    try {

      setProcessingPayment(true);


      const order =
        await client.createOrder(
          items
        );


      const payment =
        await client.requestPayment(

          order.order.id,

          "Order checkout"

        );


      setPaymentRequest(
        payment
      );

    }
    catch (error) {

      console.error(
        "Checkout error",
        error
      );

    }
    finally {

      setProcessingPayment(false);

    }

  }




  /*
   * Approve AI payment request
   * and open Razorpay Checkout
   */
  async function approvePayment() {

    if (!paymentRequest) {
      return;
    }


    try {

      setProcessingPayment(true);


      /*
       * User approves AI payment action
       */
      await client.approvePayment(
        paymentRequest.actionId
      );


      /*
       * Creates Razorpay order
       */
      const payment =
        await client.createPayment(

          paymentRequest.orderId,

          paymentRequest.actionId

        );


      const options = {

        key:
          payment.key,


        amount:
          payment.amount * 100,


        currency:
          payment.currency,


        name:
          "Raze Store",


        description:
          "AI Commerce Payment",


        order_id:
          payment.providerOrderId,


        handler:
          async function(response: any) {

            try {

              await client.verifyPayment({

                orderId:
                  payment.orderId,


                providerOrderId:
                  response.razorpay_order_id,


                paymentId:
                  response.razorpay_payment_id,


                signature:
                  response.razorpay_signature,

              });


              alert(
                "Payment successful 🎉"
              );


              clearCart();


              setPaymentRequest(
                null
              );


              setOpen(
                false
              );

            }
            catch (error) {

              console.error(
                "Verification error",
                error
              );

            }

          },


        theme: {

          color:
            "#000000",

        },

      };


      const razorpay =
        new window.Razorpay(
          options
        );


      razorpay.open();

    }
    catch (error) {

      console.error(
        "Payment error",
        error
      );

    }
    finally {

      setProcessingPayment(
        false
      );

    }

  }




  return (

    <>


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

            onClick={
              event =>
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
                    : `${itemCount} ${
                        itemCount === 1
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

                        {/* Product visual */}

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



                        {/* Product info */}

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
                                    .toLocaleString("en-IN")
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
                                `Remove ${
                                  product?.name ??
                                  "product"
                                }`
                              }

                            >

                              <Trash2
                                size={16}
                              />

                            </button>

                          </div>



                          {/* Quantity */}

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




            {/* =====================
                FOOTER
            ====================== */}

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




      {/* =========================
          PAYMENT APPROVAL MODAL
      ========================== */}

      {paymentRequest && (

        <div

          className="
            fixed
            inset-0
            z-[100]
            bg-black/40
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
          "

        >

          <div

            className="
              w-full
              max-w-md
              bg-white
              rounded-3xl
              shadow-2xl
              p-7
            "

          >

            <div

              className="
                flex
                items-start
                justify-between
              "

            >

              <div>

                <p

                  className="
                    text-xs
                    uppercase
                    tracking-widest
                    text-neutral-400
                  "

                >

                  Raze AI

                </p>


                <h2

                  className="
                    mt-1
                    text-xl
                    font-semibold
                  "

                >

                  Payment Approval

                </h2>

              </div>


              <button

                onClick={() =>
                  setPaymentRequest(
                    null
                  )
                }

                disabled={
                  processingPayment
                }

                className="
                  h-9
                  w-9
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-neutral-400
                  hover:bg-neutral-100
                  transition
                "

              >

                <X
                  size={18}
                />

              </button>

            </div>


            <div

              className="
                mt-6
                rounded-2xl
                bg-neutral-50
                p-5
              "

            >

              <p

                className="
                  text-sm
                  text-neutral-500
                "

              >

                Raze wants your permission
                to proceed with this payment.

              </p>


              <div

                className="
                  mt-4
                  flex
                  items-end
                  justify-between
                "

              >

                <span
                  className="
                    text-sm
                    text-neutral-500
                  "
                >

                  Amount

                </span>


                <span

                  className="
                    text-2xl
                    font-semibold
                  "

                >

                  ₹
                  {paymentRequest.amount
                    .toLocaleString("en-IN")
                  }

                </span>

              </div>

            </div>


            <button

              onClick={
                approvePayment
              }

              disabled={
                processingPayment
              }

              className="
                mt-6
                w-full
                h-12
                rounded-full
                bg-black
                text-white
                font-medium
                hover:bg-neutral-800
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "

            >

              {processingPayment
                ? "Opening secure checkout..."
                : "Approve & Continue"
              }

            </button>


            <p

              className="
                mt-4
                text-center
                text-xs
                text-neutral-400
              "

            >

              You will be redirected to
              Razorpay's secure checkout.

            </p>

          </div>

        </div>

      )}

    </>

  );

}