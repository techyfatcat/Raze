import {
  GoogleGenAI,
} from "@google/genai";

import type {
  AIProvider,
  AIRequest,
} from "./ai-provider.js";

import {
  geminiTools,
} from "./tools.js";

import {
  searchProductsTool,
  getProductByIdTool,
} from "../agent/tools/catalog.tool.js";


const client =
  new GoogleGenAI({
    apiKey:
      process.env.GEMINI_API_KEY!,
  });


function cleanResponse(
  text: string
) {

  return text
    .replace(/[#*_]/g, "")
    .replace(/\n+/g, " ")
    .trim();

}


function fallbackResponse() {

  return JSON.stringify({

    message:
      "I can help you find products, manage your cart, compare options, and guide you through checkout. What would you like to do?",

    action:
      "NONE",

  });

}


export class GeminiProvider
  implements AIProvider {


  async generateResponse({
    system,
    messages,
    merchantId,
    cart,
  }: AIRequest): Promise<string> {


    try {


      if (!messages.length) {

        return fallbackResponse();

      }


      const lastMessage =
        messages[
          messages.length - 1
        ];


      if (
        !lastMessage?.content?.trim()
      ) {

        return fallbackResponse();

      }


      const chat =
        client.chats.create({

          model:
            "gemini-3.6-flash",

          config: {

            systemInstruction:
              system,

            tools:
              geminiTools,

          },

          history:
            messages
              .slice(0, -1)
              .map(message => ({

                role:
                  message.role === "assistant"
                    ? "model"
                    : "user",

                parts: [

                  {
                    text:
                      message.content,
                  },

                ],

              })),

        });


      let response =
        await chat.sendMessage({

          message:
            lastMessage.content,

        });


      /*
       * Gemini can perform multiple tool calls
       * for a single user request.
       *
       * Example:
       *
       * "add headphones to cart"
       *
       * searchProducts
       *       ↓
       * addToCart
       *
       * We therefore keep processing tool calls
       * until Gemini gives us a final response.
       */

      let searchedProducts: any[] = [];


      for (
        let attempt = 0;
        attempt < 5;
        attempt++
      ) {


        const functionCall =
          response.functionCalls?.[0];


        /*
         * ------------------------------------------
         * NO MORE TOOL CALLS
         * ------------------------------------------
         */

        if (!functionCall) {

          const text =
            cleanResponse(
              response.text ?? ""
            );


          if (!text) {

            /*
             * If we performed a product search but
             * Gemini returned no text, still give the
             * frontend a useful response.
             */

            if (
              searchedProducts.length
            ) {

              return JSON.stringify({

                message:
                  "I found some products that match your request.",

                products:
                  searchedProducts,

                action:
                  "SHOW_PRODUCTS",

              });

            }


            return fallbackResponse();

          }


          /*
           * If the last completed operation was a
           * product search, return the products to
           * the frontend.
           */

          if (
            searchedProducts.length
          ) {

            return JSON.stringify({

              message:
                text,

              products:
                searchedProducts,

              action:
                "SHOW_PRODUCTS",

            });

          }


          return JSON.stringify({

            message:
              text,

            action:
              "NONE",

          });

        }


        console.log(
          "AI TOOL CALL:",
          functionCall.name,
          functionCall.args
        );


        /*
         * ------------------------------------------
         * SEARCH PRODUCTS
         * ------------------------------------------
         */

        if (
          functionCall.name ===
          "searchProducts"
        ) {


          const args =
            functionCall.args as {

              query?: string;

            };


          const query =
            args?.query?.trim();


          if (!query) {

            return fallbackResponse();

          }


          const products =
            await searchProductsTool({

              merchantId,

              query,

            });


          searchedProducts =
            products;


          /*
           * Send the actual database result back
           * to Gemini.
           *
           * Gemini may now decide to:
           *
           * - show the products
           * - add one to cart
           * - remove something
           * - update quantity
           * - checkout
           */

          response =
            await chat.sendMessage({

              message: [

                {

                  functionResponse: {

                    name:
                      "searchProducts",

                    response: {

                      products,

                    },

                  },

                },

              ],

            });


          /*
           * IMPORTANT:
           *
           * Do NOT return here.
           *
           * Gemini may have another function call,
           * such as addToCart.
           */

          continue;

        }


        /*
         * ------------------------------------------
         * ADD TO CART
         * ------------------------------------------
         */

        if (
          functionCall.name ===
          "addToCart"
        ) {


          const args =
            functionCall.args as {

              productId?: string;

              quantity?: number;

            };


          const productId =
            args?.productId?.trim();


          const quantity =
            Number.isInteger(
              args?.quantity
            ) &&
            (args.quantity ?? 0) > 0

              ? args.quantity!

              : 1;


          if (!productId) {

            return JSON.stringify({

              message:
                "I need to know which product you'd like me to add.",

              action:
                "NONE",

            });

          }


          /*
           * Never trust the product ID from Gemini
           * without checking the merchant catalog.
           */

          const product =
            await getProductByIdTool({

              merchantId,

              productId,

            });


          if (!product) {

            return JSON.stringify({

              message:
                "I couldn't find that product in the merchant catalog.",

              action:
                "NONE",

            });

          }


          return JSON.stringify({

            message:
              quantity === 1

                ? `${product.name} has been added to your cart.`

                : `${quantity} ${product.name} have been added to your cart.`,

            action:
              "ADD_TO_CART",

            productId:
              product.id,

            quantity,

          });

        }


        /*
         * ------------------------------------------
         * REMOVE FROM CART
         * ------------------------------------------
         */

        if (
          functionCall.name ===
          "removeFromCart"
        ) {


          const args =
            functionCall.args as {

              productId?: string;

            };


          const productId =
            args?.productId?.trim();


          if (!productId) {

            return JSON.stringify({

              message:
                "I need to know which product you'd like me to remove.",

              action:
                "NONE",

            });

          }


          const cartItem =
            cart.find(
              item =>
                item.productId ===
                productId
            );


          if (!cartItem) {

            return JSON.stringify({

              message:
                "That product isn't currently in your cart.",

              action:
                "NONE",

            });

          }


          return JSON.stringify({

            message:
              "I've removed that product from your cart.",

            action:
              "REMOVE_FROM_CART",

            productId,

          });

        }


        /*
         * ------------------------------------------
         * UPDATE CART QUANTITY
         * ------------------------------------------
         */

        if (
          functionCall.name ===
          "updateCartQuantity"
        ) {


          const args =
            functionCall.args as {

              productId?: string;

              quantity?: number;

            };


          const productId =
            args?.productId?.trim();


          const quantity =
            args?.quantity;


          if (
            !productId ||
            !Number.isInteger(quantity) ||
            quantity! < 0
          ) {

            return JSON.stringify({

              message:
                "Please provide a valid product and quantity.",

              action:
                "NONE",

            });

          }


          const cartItem =
            cart.find(
              item =>
                item.productId ===
                productId
            );


          if (!cartItem) {

            return JSON.stringify({

              message:
                "That product isn't currently in your cart.",

              action:
                "NONE",

            });

          }


          return JSON.stringify({

            message:
              quantity === 0

                ? "I've removed that product from your cart."

                : `I've updated the quantity to ${quantity}.`,

            action:
              "UPDATE_CART",

            productId,

            quantity,

          });

        }


        /*
         * ------------------------------------------
         * CLEAR CART
         * ------------------------------------------
         */

        if (
          functionCall.name ===
          "clearCart"
        ) {


          if (!cart.length) {

            return JSON.stringify({

              message:
                "Your cart is already empty.",

              action:
                "NONE",

            });

          }


          return JSON.stringify({

            message:
              "I've cleared your cart.",

            action:
              "CLEAR_CART",

          });

        }


        /*
         * ------------------------------------------
         * CHECKOUT
         * ------------------------------------------
         */

        if (
          functionCall.name ===
          "checkout"
        ) {


          if (!cart.length) {

            return JSON.stringify({

              message:
                "Your cart is empty. Add some products before checking out.",

              action:
                "NONE",

            });

          }


          return JSON.stringify({

            message:
              "You're ready to checkout. I'll start your checkout securely.",

            action:
              "CHECKOUT",

          });

        }


        /*
         * ------------------------------------------
         * UNKNOWN TOOL
         * ------------------------------------------
         */

        console.warn(
          "Unknown Gemini tool:",
          functionCall.name
        );


        return fallbackResponse();

      }


      /*
       * Gemini should normally finish before this.
       * The limit prevents an accidental infinite
       * tool-call loop.
       */

      console.warn(
        "Gemini exceeded maximum tool-call attempts."
      );


      return fallbackResponse();

    }


    catch (error) {

      console.error(
        "Gemini provider error:",
        error
      );


      return fallbackResponse();

    }

  }

}