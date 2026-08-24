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
      "I can help you find products, compare options, and guide you through checkout. What are you looking for?",

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


      const functionCall =
        response.functionCalls?.[0];


      /*
       * ----------------------------------------
       * PRODUCT SEARCH
       * ----------------------------------------
       */

      if (
        functionCall?.name ===
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


        console.log(
          "AI TOOL CALL:",
          functionCall.name,
          args
        );


        const products =
          await searchProductsTool({

            merchantId,

            query,

          });


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


        const message =
          cleanResponse(
            response.text ?? ""
          );


        return JSON.stringify({

          message:
            message ||
            (
              products.length
                ? "I found some products that match your request."
                : "I couldn't find products matching that request."
            ),

          products,

          action:
            "SHOW_PRODUCTS",

        });

      }


      /*
       * ----------------------------------------
       * CHECKOUT
       * ----------------------------------------
       */

      if (
        functionCall?.name ===
        "checkout"
      ) {


        console.log(
          "AI TOOL CALL:",
          functionCall.name
        );


        return JSON.stringify({

          message:
            "You're ready to checkout. I'll open your cart so you can review your order and continue securely.",

          action:
            "CHECKOUT",

        });

      }


      /*
       * ----------------------------------------
       * NORMAL CONVERSATION
       * ----------------------------------------
       */

      const text =
        cleanResponse(
          response.text ?? ""
        );


      if (!text) {

        return fallbackResponse();

      }


      return JSON.stringify({

        message:
          text,

        action:
          "NONE",

      });

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