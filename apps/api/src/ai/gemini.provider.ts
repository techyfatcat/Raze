import {
  GoogleGenAI,
} from "@google/genai";

import type {
  AIProvider,
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
  text:string
){

  return text
    .replace(/[#*_]/g,"")
    .replace(/\n+/g," ")
    .trim();

}


export class GeminiProvider
implements AIProvider {


  async generateResponse({
    system,
    messages,
    merchantId,
  }: {
    system: string;

    messages: {
      role: string;
      content: string;
    }[];

    merchantId: string;
  }) {


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
            .map((message) => ({

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



    const last =
      messages[messages.length - 1];



    let response =
      await chat.sendMessage({

        message:
          last.content,

      });



    const functionCall =
      response.functionCalls?.[0];



    if (functionCall) {


      console.log(
        "AI TOOL CALL:",
        functionCall.name,
        functionCall.args
      );



      if (
        functionCall.name ===
        "searchProducts"
      ) {


        const args =
          functionCall.args as {
            query: string;
          };



        const products =
          await searchProductsTool({

            merchantId,

            query:
              args.query,

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



        return JSON.stringify({

  message:
    cleanResponse(
      response.text ?? ""
    ),

  products,

  action:
    "SHOW_PRODUCTS",

});

      }

    }



    return JSON.stringify({

  message:
    cleanResponse(
      response.text ?? ""
    ),

  action:
    "NONE",

});

  }

}