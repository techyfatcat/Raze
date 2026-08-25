"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useRaze,
} from "./RazeProvider";

import {
  useRazeCart,
} from "./RazeCartProvider";

import type {
  Product,
  PaymentResponse,
  RazeMessage,
} from "../types";


type CheckoutItem = Product & {
  quantity: number;
};

type CheckoutState = {
  orderId: string;
  payment: PaymentResponse;
  items: CheckoutItem[];
};

function RazeIcon({
  size = 18,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2.5L14.15 9.85L21.5 12L14.15 14.15L12 21.5L9.85 14.15L2.5 12L9.85 9.85L12 2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}


function UserIcon({
  size = 17,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="8"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M5.5 20C6.15 15.9 8.35 13.7 12 13.7C15.65 13.7 17.85 15.9 18.5 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}


function SendIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M21 3L10.7 13.3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M21 3L14.4 21L10.7 13.3L3 9.6L21 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function CloseIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}


export function RazeAssistant() {

  const {
  client,
  onAddToCart,
  chat,
  onCheckout,
  createOrder,
  requestPayment,
  approvePayment,
  createPayment,
} = useRaze();

  const {
 items: cartItems,
 addItem,
 removeItem,
 updateQuantity,
 clearCart,
} = useRazeCart();


  const [
    open,
    setOpen,
  ] = useState(false);


  const [
    input,
    setInput,
  ] = useState("");


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    addedProducts,
    setAddedProducts,
  ] = useState<Set<string>>(
    new Set()
  );


  const [
    messages,
    setMessages,
  ] = useState<RazeMessage[]>([
    {
      role: "assistant",

      content:
        "Hi 👋 How can I help you today?",

      action:
        "NONE",
    },
  ]);


  const messagesEndRef =
    useRef<HTMLDivElement | null>(
      null
    );


  const inputRef =
    useRef<HTMLTextAreaElement | null>(
      null
    );

  const checkoutTimerRef =
    useRef<number | null>(null);

  const [
    checkout,
    setCheckout,
  ] = useState<CheckoutState | null>(
    null
  );

  const [
    checkoutCountdown,
    setCheckoutCountdown,
  ] = useState(5);


  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [
    messages,
    loading,
  ]);


  useEffect(() => {

    if (!open) {
      return;
    }


    const timer =
      window.setTimeout(() => {

        inputRef.current?.focus();

      }, 150);


    return () =>
      window.clearTimeout(timer);

  }, [
    open,
  ]);


  useEffect(() => {
    return () => {
      if (checkoutTimerRef.current !== null) {
        window.clearInterval(
          checkoutTimerRef.current
        );
      }
    };
  }, []);


  function formatMoney(
    amount: number,
    currency = "INR"
  ) {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }
    ).format(amount);
  }


  function startCheckoutCountdown(
    payment: PaymentResponse
  ) {
    if (checkoutTimerRef.current !== null) {
      window.clearInterval(
        checkoutTimerRef.current
      );
    }

    setCheckoutCountdown(5);

    let remaining = 5;

    checkoutTimerRef.current =
      window.setInterval(() => {
        remaining -= 1;

        setCheckoutCountdown(
          remaining
        );

        if (remaining <= 0) {
          if (
            checkoutTimerRef.current !== null
          ) {
            window.clearInterval(
              checkoutTimerRef.current
            );

            checkoutTimerRef.current =
              null;
          }

          openRazorpay(payment);
        }
      }, 1000);
  }


  function cancelCheckout() {
    if (checkoutTimerRef.current !== null) {
      window.clearInterval(
        checkoutTimerRef.current
      );

      checkoutTimerRef.current = null;
    }

    setCheckout(null);
    setCheckoutCountdown(5);
  }


  function openRazorpay(payment: PaymentResponse) {

    const Razorpay =
      (window as any).Razorpay;

    if (!Razorpay) {
      console.error(
        "Razorpay SDK not loaded"
      );

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content:
            "Payment checkout could not be loaded. Please try again.",
          action: "NONE",
        },
      ]);

      return;
    }

    if (
      !payment.key ||
      !payment.providerOrderId
    ) {
      console.error(
        "Invalid Razorpay payment response:",
        payment
      );

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content:
            "Payment details are incomplete. Please try again.",
          action: "NONE",
        },
      ]);

      return;
    }

    const options = {
      key:
        payment.key,

      // Raze stores INR amounts in rupees.
      // Razorpay Checkout expects the smallest currency unit.
      amount:
        payment.amount * 100,

      currency:
        payment.currency ?? "INR",

      order_id:
        payment.providerOrderId,

      name:
        "Raze Store",

      description:
        "AI Checkout",

      handler:
        async function (
          response: any
        ) {

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

            cancelCheckout();

            clearCart();

            setMessages(prev => [
              ...prev,
              {
                role:
                  "assistant",
                content:
                  "Payment successful 🎉 Your order has been confirmed.",
                action:
                  "NONE",
              },
            ]);

          }
          catch(error) {

            console.error(
              "Payment verification failed",
              error
            );

            setMessages(prev => [
              ...prev,
              {
                role:
                  "assistant",
                content:
                  "Payment was received, but I couldn't verify it yet. Please check your order status.",
                action:
                  "NONE",
              },
            ]);

          }

        },

      modal: {

        ondismiss() {

          cancelCheckout();

          setMessages(prev => [
            ...prev,
            {
              role:
                "assistant",

              content:
                "Payment cancelled.",

              action:
                "NONE",

            },
          ]);

        },

      },

    };


    const razorpay =
      new Razorpay(options);

    // Close the Raze checkout overlay before opening
    // Razorpay so the two modals do not stack.
    setCheckout(null);

    razorpay.open();

  }


  async function send() {

    const text =
      input.trim();


    if (
      !text ||
      loading
    ) {
      return;
    }


    const userMessage:
      RazeMessage = {

      role:
        "user",

      content:
        text,

    };


    setMessages(prev => [

      ...prev,

      userMessage,

    ]);


    setInput("");

    setLoading(true);


    try {

      const response =
        await chat(
          text,
          messages
        );


      const assistantMessage:
        RazeMessage = {

        role:
          "assistant",

        content:
          response.message,

        products:
          response.products ?? [],

        action:
          response.action ?? "NONE",

      };


      setMessages(prev => [

        ...prev,

        assistantMessage,

      ]);



      if (
        response.action ===
        "ADD_TO_CART"
      ) {

        const productId =
          response.productId;


        const quantity =
          response.quantity ?? 1;


        if (
          productId &&
          quantity > 0
        ) {

          addItem({

            productId,

            quantity,

          });

        }

      }


      /*
       * ------------------------------------------
       * REMOVE FROM CART
       * ------------------------------------------
       */

      if (
        response.action ===
        "REMOVE_FROM_CART"
      ) {

        const productId =
          response.productId;


        if (productId) {

          removeItem(
            productId
          );

        }

      }


      /*
       * ------------------------------------------
       * UPDATE CART
       * ------------------------------------------
       */

      if (
        response.action ===
        "UPDATE_CART"
      ) {

        const productId =
          response.productId;


        const quantity =
          response.quantity;


        if (
          productId &&
          typeof quantity ===
          "number"
        ) {

          updateQuantity(

            productId,

            quantity

          );

        }

      }


      /*
       * ------------------------------------------
       * CLEAR CART
       * ------------------------------------------
       */

      if (
        response.action ===
        "CLEAR_CART"
      ) {

        clearCart();

      }


      /*
       * ------------------------------------------
       * CHECKOUT
       * ------------------------------------------
       */

      if (
        response.action ===
        "CHECKOUT"
      ) {

        try {

          if (!cartItems.length) {

            setMessages(prev => [
              ...prev,
              {
                role:
                  "assistant",
                content:
                  "Your cart is empty. Add some products before checkout.",
                action:
                  "NONE",
              },
            ]);

            return;

          }


          /*
           * Load current product details before creating
           * the order so the checkout screen can display
           * trusted item names and prices.
           */

          const checkoutItems =
            await Promise.all(
              cartItems.map(
                async item => {

                  const result =
                    await client.getProduct(
                      item.productId
                    );

                  return {
                    ...result.product,
                    quantity:
                      item.quantity,
                  };

                }
              )
            );


          const order =
            await createOrder(
              cartItems
            );


          const paymentRequest =
            await requestPayment(
              order.order.id,
              "Customer initiated checkout through Raze AI"
            );


          await approvePayment(
            paymentRequest.actionId
          );


          const payment =
            await createPayment(
              order.order.id,
              paymentRequest.actionId
            );


          setCheckout({
            orderId:
              order.order.id,

            payment,

            items:
              checkoutItems,
          });

          startCheckoutCountdown(
            payment
          );

        }
        catch(error) {

          console.error(
            "Checkout failed:",
            error
          );


          setMessages(prev => [
            ...prev,
            {
              role:
                "assistant",
              content:
                "I couldn't start checkout. Please try again.",
              action:
                "NONE",
            },
          ]);

        }

      }

    }
    catch (error) {

      console.error(
        "Raze AI Error:",
        error
      );


      setMessages(prev => [

        ...prev,

        {

          role:
            "assistant",

          content:
            "Sorry, something went wrong. Please try again.",

          action:
            "NONE",

        },

      ]);

    }
    finally {

      setLoading(false);

    }

  }


  function handleKeyDown(
    event:
      React.KeyboardEvent<HTMLTextAreaElement>
  ) {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      send();

    }

  }


  return (
    <>

      <div className="rz-root">

        {!open && (

          <button
            type="button"
            aria-label="Open Raze AI"
            className="rz-launcher"
            onClick={() =>
              setOpen(true)
            }
          >

            <RazeIcon
              size={22}
            />

          </button>

        )}

        {open && (

          <div className="rz-window">


            <div className="rz-header">




              <div className="rz-header-info">

                <div className="rz-title">
                  Raze
                </div>

                <div className="rz-subtitle">
                  AI Shopping Assistant
                </div>

              </div>


              <button
                type="button"
                aria-label="Close Raze"
                className="rz-close"
                onClick={() =>
                  setOpen(false)
                }
              >

                <CloseIcon />

              </button>

            </div>

            <div className="rz-messages">

              <div className="rz-message-list">

                {messages.map(
                  (
                    message,
                    index
                  ) => {

                    const isUser =
                      message.role === "user";


                    return (

                      <div
                        key={index}
                        className={
                          isUser
                            ? "rz-message-row rz-user-row"
                            : "rz-message-row"
                        }
                      >


                        {!isUser && (

                          <div className="rz-avatar rz-raze-avatar">

                            <RazeIcon
                              size={14}
                            />

                          </div>

                        )}


                        <div className="rz-message-content">


                          <div
                            className={
                              isUser
                                ? "rz-bubble rz-user-bubble"
                                : "rz-bubble rz-assistant-bubble"
                            }
                          >

                            {message.content}

                          </div>


                          {/* PRODUCT RESULTS */}

                          {message.products &&
                            message.products.length > 0 && (

                              <div className="rz-products">

                                {message.products.map(
                                  (
                                    product: Product
                                  ) => (

                                    <div
                                      key={
                                        product.id
                                      }
                                      className="rz-product"
                                    >

                                      <div className="rz-product-name">
                                        {product.name}
                                      </div>


                                      <div className="rz-product-price">

                                        {product.currency ?? "₹"}
                                        {product.price}

                                      </div>




                                      <button
                                        type="button"
                                        className="rz-cart-button"
                                        onClick={() => {
                                          addItem({
                                            productId: product.id,
                                            quantity: 1,
                                          });

                                          onAddToCart?.(product);

                                          setAddedProducts(prev => {
                                            const next = new Set(prev);
                                            next.add(product.id);
                                            return next;
                                          });
                                        }}
                                      >
                                        {addedProducts.has(product.id)
                                          ? "Added ✓"
                                          : "Add to cart"}
                                      </button>



                                    </div>

                                  )
                                )}

                              </div>

                            )}

                        </div>


                        {isUser && (

                          <div className="rz-avatar rz-user-avatar">

                            <UserIcon />

                          </div>

                        )}

                      </div>

                    );

                  }
                )}


                {/* TYPING */}

                {loading && (

                  <div className="rz-message-row">

                    <div className="rz-avatar rz-raze-avatar">

                      <RazeIcon
                        size={14}
                      />

                    </div>


                    <div className="rz-typing">

                      <span />
                      <span />
                      <span />

                    </div>

                  </div>

                )}


                <div
                  ref={messagesEndRef}
                />

              </div>

            </div>


            {/* ---------------------------------------------
                INPUT
            --------------------------------------------- */}

            <div className="rz-input-area">

              <div className="rz-input-container">

                <textarea
                  ref={inputRef}
                  value={input}
                  rows={2}
                  disabled={loading}
                  placeholder="Ask Raze anything..."
                  className="rz-input"
                  onChange={event =>
                    setInput(
                      event.target.value
                    )
                  }
                  onKeyDown={
                    handleKeyDown
                  }
                />


                <button
                  type="button"
                  aria-label="Send message"
                  disabled={
                    loading ||
                    !input.trim()
                  }
                  className="rz-send"
                  onClick={send}
                >

                  <SendIcon />

                </button>

              </div>


              <div className="rz-disclaimer">

                Raze can make mistakes. Check important information.

              </div>

            </div>

          </div>

        )}

        {checkout && (
          <div className="rz-checkout-backdrop">

            <div
              className="rz-checkout-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="rz-checkout-title"
            >

              <div className="rz-checkout-header">

                <div>
                  <div className="rz-checkout-eyebrow">
                    RAZE CHECKOUT
                  </div>

                  <div
                    id="rz-checkout-title"
                    className="rz-checkout-title"
                  >
                    Review your order
                  </div>

                  <div className="rz-checkout-subtitle">
                    Your secure payment is ready.
                  </div>
                </div>

                <button
                  type="button"
                  className="rz-checkout-close"
                  onClick={cancelCheckout}
                  aria-label="Cancel checkout"
                >
                  <CloseIcon />
                </button>

              </div>


              <div className="rz-checkout-items">

                {checkout.items.map(
                  item => (

                    <div
                      key={item.id}
                      className="rz-checkout-item"
                    >

                      <div className="rz-checkout-item-info">

                        <div className="rz-checkout-item-name">
                          {item.name}
                        </div>

                        <div className="rz-checkout-item-meta">
                          Qty {item.quantity}
                        </div>

                      </div>

                      <div className="rz-checkout-item-price">
                        {formatMoney(
                          item.price *
                            item.quantity,
                          checkout.payment.currency
                        )}
                      </div>

                    </div>

                  )
                )}

              </div>


              <div className="rz-checkout-total">

                <span>
                  Total
                </span>

                <strong>
                  {formatMoney(
                    checkout.payment.amount,
                    checkout.payment.currency
                  )}
                </strong>

              </div>


              <div className="rz-checkout-payment">

                <div className="rz-checkout-lock">
                  <span>✓</span>
                </div>

                <div>

                  <div className="rz-checkout-payment-title">
                    Secure payment
                  </div>

                  <div className="rz-checkout-payment-copy">
                    Redirecting to Razorpay in{" "}
                    <strong>
                      {checkoutCountdown}s
                    </strong>
                  </div>

                </div>

              </div>


              <button
                type="button"
                className="rz-checkout-cancel"
                onClick={cancelCheckout}
              >
                Cancel
              </button>

            </div>

          </div>
        )}
      </div>

      <style>
        {`

          /* ---------------------------------------------
             ROOT
          --------------------------------------------- */

          .rz-root {
            position: fixed !important;
            right: 24px !important;
            bottom: 24px !important;
            z-index: 2147483647 !important;
            font-family:
              Inter,
              ui-sans-serif,
              system-ui,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              sans-serif !important;
            box-sizing: border-box !important;
          }


          .rz-root *,
          .rz-root *::before,
          .rz-root *::after {
            box-sizing: border-box !important;
          }


          /* ---------------------------------------------
             LAUNCHER
          --------------------------------------------- */

          .rz-launcher {
            position: relative !important;

            display: flex !important;
            align-items: center !important;
            justify-content: center !important;

            width: 58px !important;
            height: 58px !important;

            padding: 0 !important;
            margin: 0 !important;

            border: 1px solid
              rgba(255,255,255,.22) !important;

            border-radius: 50% !important;

            background:
              rgba(10,10,10,.96) !important;

            color: white !important;

            cursor: pointer !important;

            box-shadow:
              0 12px 35px
              rgba(0,0,0,.20),
              inset 0 1px 0
              rgba(255,255,255,.12) !important;

            transition:
              transform .2s ease,
              box-shadow .2s ease !important;
          }


          .rz-launcher:hover {
            transform: translateY(-2px)
              scale(1.04) !important;

            box-shadow:
              0 16px 42px
              rgba(0,0,0,.25) !important;
          }


          .rz-launcher:active {
            transform: scale(.96) !important;
          }


          /* ---------------------------------------------
             WINDOW
          --------------------------------------------- */

          .rz-window {
            position: relative !important;

            display: flex !important;
            flex-direction: column !important;

            width: 480px !important;
            height: 680px !important;

            max-width:
              calc(100vw - 32px) !important;

            max-height:
              calc(100vh - 32px) !important;

            overflow: hidden !important;

            border:
              1px solid
              rgba(0,0,0,.08) !important;

            border-radius: 28px !important;

            background:
              rgba(255,255,255,.88) !important;

            box-shadow:
              0 30px 90px
              rgba(0,0,0,.20),
              0 8px 30px
              rgba(0,0,0,.08) !important;

            backdrop-filter:
              blur(30px)
              saturate(150%) !important;

            -webkit-backdrop-filter:
              blur(30px)
              saturate(150%) !important;

            animation:
              rz-window-in
              .24s
              cubic-bezier(.16,1,.3,1)
              both !important;
          }


          /* ---------------------------------------------
             HEADER
          --------------------------------------------- */

          .rz-header {
            flex-shrink: 0 !important;

            display: flex !important;
            align-items: center !important;

            width: 100% !important;

            min-height: 78px !important;

            padding:
              16px 18px !important;

            border-bottom:
              1px solid
              rgba(0,0,0,.07) !important;
          }


          .rz-header-icon {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;

            width: 42px !important;
            height: 42px !important;

            flex-shrink: 0 !important;

            border-radius: 13px !important;

            background:
              #0a0a0a !important;

            color:
              white !important;
          }


          .rz-header-info {
            min-width: 0 !important;
            flex: 1 !important;

            margin-left: 12px !important;
          }


          .rz-title {
            font-size: 15px !important;
            line-height: 20px !important;
            font-weight: 600 !important;
            letter-spacing: -.01em !important;
            color: #111 !important;
          }


          .rz-subtitle {
            margin-top: 2px !important;

            font-size: 12px !important;
            line-height: 17px !important;

            color:
              #8a8a8a !important;
          }


          .rz-close {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;

            width: 38px !important;
            height: 38px !important;

            padding: 0 !important;
            margin: 0 !important;

            border: 0 !important;
            border-radius: 50% !important;

            background:
              transparent !important;

            color:
              #999 !important;

            cursor: pointer !important;

            transition:
              background .18s ease,
              color .18s ease !important;
          }


          .rz-close:hover {
            background:
              rgba(0,0,0,.06) !important;

            color:
              #111 !important;
          }


          /* ---------------------------------------------
             MESSAGES
          --------------------------------------------- */

          .rz-messages {
            flex: 1 1 auto !important;

            min-height: 0 !important;

            width: 100% !important;

            overflow-y: auto !important;
            overflow-x: hidden !important;

            padding:
              24px 20px !important;

            scrollbar-width: thin !important;
            scrollbar-color:
              rgba(0,0,0,.12)
              transparent !important;
          }


          .rz-messages::-webkit-scrollbar {
            width: 5px !important;
          }


          .rz-messages::-webkit-scrollbar-track {
            background: transparent !important;
          }


          .rz-messages::-webkit-scrollbar-thumb {
            border-radius: 99px !important;
            background:
              rgba(0,0,0,.12) !important;
          }


          .rz-message-list {
            display: flex !important;
            flex-direction: column !important;

            width: 100% !important;

            gap: 20px !important;
          }


          .rz-message-row {
            display: flex !important;
            align-items: flex-start !important;

            width: 100% !important;

            gap: 10px !important;

            animation:
              rz-message-in
              .2s
              ease both !important;
          }


          .rz-user-row {
            justify-content: flex-end !important;
          }


          /* ---------------------------------------------
             AVATARS
          --------------------------------------------- */

          .rz-avatar {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;

            width: 32px !important;
            height: 32px !important;

            flex-shrink: 0 !important;

            border-radius: 50% !important;
          }


          .rz-raze-avatar {
            background:
              #0a0a0a !important;

            color:
              white !important;
          }


          .rz-user-avatar {
            background:
              #f4f4f4 !important;

            border:
              1px solid
              rgba(0,0,0,.08) !important;

            color:
              #555 !important;
          }


          /* ---------------------------------------------
             MESSAGE CONTENT
          --------------------------------------------- */

          .rz-message-content {
            min-width: 0 !important;

            max-width: 78% !important;
          }


          .rz-bubble {
            display: block !important;

            padding:
              11px 15px !important;

            border-radius: 19px !important;

            font-size: 14px !important;
            line-height: 1.55 !important;

            word-break:
              break-word !important;
          }


          .rz-assistant-bubble {
            color:
              #252525 !important;

            background:
              rgba(0,0,0,.045) !important;

            border-bottom-left-radius:
              6px !important;
          }


          .rz-user-bubble {
            color:
              white !important;

            background:
              #111 !important;

            border-bottom-right-radius:
              6px !important;
          }


          /* ---------------------------------------------
             PRODUCTS
          --------------------------------------------- */

          .rz-products {
            display: flex !important;
            flex-direction: column !important;

            gap: 8px !important;

            margin-top: 9px !important;
          }


          .rz-product {
            width: 100% !important;

            padding: 14px !important;

            border:
              1px solid
              rgba(0,0,0,.08) !important;

            border-radius: 17px !important;

            background:
              rgba(255,255,255,.75) !important;

            box-shadow:
              0 4px 15px
              rgba(0,0,0,.04) !important;
          }


          .rz-product-name {
            font-size: 13px !important;
            line-height: 19px !important;

            font-weight: 600 !important;

            color:
              #151515 !important;
          }


          .rz-product-price {
            margin-top: 4px !important;

            font-size: 13px !important;

            color:
              #777 !important;
          }


          .rz-cart-button {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;

  width: 100% !important;

  margin-top: 11px !important;
  padding: 9px 14px !important;

  border: 0 !important;
  border-radius: 999px !important;

  background: #111 !important;
  color: white !important;

  font-size: 12px !important;
  font-weight: 500 !important;

  cursor: pointer !important;

  transition:
    transform .18s ease,
    background .18s ease !important;
}

.rz-cart-button:hover {
  background: #2a2a2a !important;
  transform: translateY(-1px) !important;
}

.rz-cart-button:active {
  transform: scale(.98) !important;
}

          /* ---------------------------------------------
             TYPING
          --------------------------------------------- */

          .rz-typing {
            display: flex !important;
            align-items: center !important;

            height: 39px !important;

            padding:
              0 15px !important;

            gap: 4px !important;

            border-radius: 19px !important;

            border-bottom-left-radius:
              6px !important;

            background:
              rgba(0,0,0,.045) !important;
          }


          .rz-typing span {
            display: block !important;

            width: 5px !important;
            height: 5px !important;

            border-radius: 50% !important;

            background:
              #777 !important;

            animation:
              rz-dot
              1.1s
              infinite
              ease-in-out !important;
          }


          .rz-typing span:nth-child(2) {
            animation-delay:
              .15s !important;
          }


          .rz-typing span:nth-child(3) {
            animation-delay:
              .3s !important;
          }


          /* ---------------------------------------------
             INPUT
          --------------------------------------------- */

          .rz-input-area {
            flex-shrink: 0 !important;

            width: 100% !important;

            padding:
              10px 18px 17px !important;
          }


          .rz-input-container {
            position: relative !important;

            display: flex !important;
            align-items: flex-end !important;

            width: 100% !important;

            min-height: 82px !important;

            padding:
              7px !important;

            border:
              1px solid
              rgba(0,0,0,.10) !important;

            border-radius:
              22px !important;

            background:
              rgba(255,255,255,.78) !important;

            box-shadow:
              0 7px 25px
              rgba(0,0,0,.055) !important;

            backdrop-filter:
              blur(15px) !important;

            -webkit-backdrop-filter:
              blur(15px) !important;

            transition:
              border-color .2s ease,
              box-shadow .2s ease !important;
          }


          .rz-input-container:focus-within {
            border-color:
              rgba(0,0,0,.20) !important;

            box-shadow:
              0 9px 30px
              rgba(0,0,0,.09) !important;
          }


          .rz-input {
            display: block !important;

            width: 100% !important;
            min-width: 0 !important;

            min-height: 66px !important;

            resize: none !important;

            padding:
              12px 54px 10px 14px !important;

            margin: 0 !important;

            border: 0 !important;
            outline: 0 !important;

            background:
              transparent !important;

            color:
              #111 !important;

            font-family: inherit !important;

            font-size: 14px !important;
            line-height: 22px !important;
          }


          .rz-input::placeholder {
            color:
              #999 !important;
          }


          .rz-send {
            position: absolute !important;

            right: 8px !important;
            bottom: 8px !important;

            display: flex !important;
            align-items: center !important;
            justify-content: center !important;

            width: 42px !important;
            height: 42px !important;

            padding: 0 !important;
            margin: 0 !important;

            border: 0 !important;
            border-radius: 50% !important;

            background:
              #111 !important;

            color:
              white !important;

            cursor: pointer !important;

            transition:
              transform .18s ease,
              background .18s ease,
              opacity .18s ease !important;
          }


          .rz-send:hover:not(:disabled) {
            transform: scale(1.05) !important;

            background:
              #292929 !important;
          }


          .rz-send:active:not(:disabled) {
            transform: scale(.94) !important;
          }


          .rz-send:disabled {
            opacity:
              .25 !important;

            cursor:
              not-allowed !important;
          }


          .rz-disclaimer {
            margin-top:
              7px !important;

            text-align:
              center !important;

            font-size:
              10px !important;

            line-height:
              15px !important;

            color:
              #a0a0a0 !important;
          }


          /* ---------------------------------------------
             CHECKOUT
          --------------------------------------------- */

          .rz-checkout-backdrop {
            position: fixed !important;
            inset: 0 !important;
            z-index: 2147483647 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 24px !important;
            background:
              rgba(0,0,0,.38) !important;
            backdrop-filter:
              blur(10px) !important;
            -webkit-backdrop-filter:
              blur(10px) !important;
          }


          .rz-checkout-card {
            width: 430px !important;
            max-width: 100% !important;
            max-height:
              calc(100vh - 48px) !important;
            overflow-y: auto !important;
            padding: 26px !important;
            border:
              1px solid
              rgba(0,0,0,.08) !important;
            border-radius: 26px !important;
            background:
              rgba(255,255,255,.96) !important;
            box-shadow:
              0 35px 100px
              rgba(0,0,0,.25) !important;
            animation:
              rz-checkout-in
              .24s
              cubic-bezier(.16,1,.3,1)
              both !important;
          }


          .rz-checkout-header {
            display: flex !important;
            align-items: flex-start !important;
            justify-content: space-between !important;
            gap: 16px !important;
          }


          .rz-checkout-eyebrow {
            font-size: 10px !important;
            line-height: 14px !important;
            font-weight: 700 !important;
            letter-spacing: .12em !important;
            color: #888 !important;
          }


          .rz-checkout-title {
            margin-top: 5px !important;
            font-size: 22px !important;
            line-height: 29px !important;
            font-weight: 650 !important;
            letter-spacing: -.03em !important;
            color: #111 !important;
          }


          .rz-checkout-subtitle {
            margin-top: 4px !important;
            font-size: 13px !important;
            line-height: 19px !important;
            color: #888 !important;
          }


          .rz-checkout-close {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 36px !important;
            height: 36px !important;
            flex-shrink: 0 !important;
            border: 0 !important;
            border-radius: 50% !important;
            background:
              #f4f4f4 !important;
            color: #555 !important;
            cursor: pointer !important;
          }


          .rz-checkout-items {
            display: flex !important;
            flex-direction: column !important;
            gap: 10px !important;
            margin-top: 25px !important;
          }


          .rz-checkout-item {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 16px !important;
            padding: 14px 0 !important;
            border-bottom:
              1px solid
              rgba(0,0,0,.07) !important;
          }


          .rz-checkout-item-info {
            min-width: 0 !important;
          }


          .rz-checkout-item-name {
            font-size: 14px !important;
            line-height: 20px !important;
            font-weight: 600 !important;
            color: #171717 !important;
          }


          .rz-checkout-item-meta {
            margin-top: 3px !important;
            font-size: 12px !important;
            line-height: 17px !important;
            color: #8a8a8a !important;
          }


          .rz-checkout-item-price {
            flex-shrink: 0 !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            color: #171717 !important;
          }


          .rz-checkout-total {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            margin-top: 20px !important;
            padding-top: 4px !important;
            font-size: 14px !important;
            color: #777 !important;
          }


          .rz-checkout-total strong {
            font-size: 20px !important;
            color: #111 !important;
            letter-spacing: -.02em !important;
          }


          .rz-checkout-payment {
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            margin-top: 24px !important;
            padding: 15px !important;
            border-radius: 17px !important;
            background:
              #f7f7f7 !important;
          }


          .rz-checkout-lock {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 36px !important;
            height: 36px !important;
            flex-shrink: 0 !important;
            border-radius: 50% !important;
            background: #111 !important;
            color: white !important;
            font-size: 14px !important;
            font-weight: 700 !important;
          }


          .rz-checkout-payment-title {
            font-size: 13px !important;
            line-height: 18px !important;
            font-weight: 600 !important;
            color: #222 !important;
          }


          .rz-checkout-payment-copy {
            margin-top: 2px !important;
            font-size: 12px !important;
            line-height: 17px !important;
            color: #888 !important;
          }


          .rz-checkout-payment-copy strong {
            color: #111 !important;
          }


          .rz-checkout-cancel {
            width: 100% !important;
            margin-top: 14px !important;
            padding: 12px 16px !important;
            border:
              1px solid
              rgba(0,0,0,.10) !important;
            border-radius: 999px !important;
            background: white !important;
            color: #555 !important;
            font-size: 13px !important;
            font-weight: 500 !important;
            cursor: pointer !important;
          }


          .rz-checkout-cancel:hover {
            background: #f7f7f7 !important;
            color: #111 !important;
          }


          /* ---------------------------------------------
             ANIMATIONS
          --------------------------------------------- */


          @keyframes rz-checkout-in {

            from {
              opacity: 0;
              transform:
                translateY(14px)
                scale(.97);
            }

            to {
              opacity: 1;
              transform:
                translateY(0)
                scale(1);
            }

          }


          @keyframes rz-window-in {

            from {
              opacity: 0;

              transform:
                translateY(18px)
                scale(.97);
            }

            to {
              opacity: 1;

              transform:
                translateY(0)
                scale(1);
            }

          }


          @keyframes rz-message-in {

            from {
              opacity: 0;

              transform:
                translateY(7px);
            }

            to {
              opacity: 1;

              transform:
                translateY(0);
            }

          }


          @keyframes rz-dot {

            0%,
            60%,
            100% {
              opacity: .25;
              transform:
                translateY(0);
            }

            30% {
              opacity: .8;
              transform:
                translateY(-2px);
            }

          }


          /* ---------------------------------------------
             MOBILE
          --------------------------------------------- */

          @media (max-width: 640px) {

            .rz-root {
              right: 14px !important;
              bottom: 14px !important;
            }


            .rz-window {
              width:
                calc(100vw - 28px) !important;

              max-width:
                calc(100vw - 28px) !important;

              height:
                calc(100vh - 28px) !important;

              max-height:
                calc(100vh - 28px) !important;

              border-radius:
                24px !important;
            }

          }


          @media (max-width: 640px) {

            .rz-checkout-backdrop {
              padding: 14px !important;
            }

            .rz-checkout-card {
              width: 100% !important;
              border-radius: 22px !important;
              padding: 22px !important;
            }

          }


          /* ---------------------------------------------
             REDUCED MOTION
          --------------------------------------------- */

          @media (prefers-reduced-motion: reduce) {

            .rz-window,
            .rz-message-row,
            .rz-typing span {
              animation: none !important;
            }

          }

        `}
      </style>

    </>
  );
}