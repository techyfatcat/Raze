import {
  GoogleGenerativeAI,
} from "@google/generative-ai";

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
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY!
  );


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


    const model =
      client.getGenerativeModel({

        model: "gemini-2.0-flash",

        systemInstruction: system,

        tools: geminiTools,

      });



    const chat =
      model.startChat({

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
                  text: message.content,
                },
              ],

            })),

      });



    const last =
      messages[messages.length - 1];



    const result =
      await chat.sendMessage(
        last.content
      );


    const response =
      result.response;



    const functionCall =
      response.functionCalls()?.[0];



    if (functionCall) {


      if (
        functionCall.name ===
        "searchProducts"
      ) {


        const products =
          await searchProductsTool({

            merchantId,

            query:
                  String(
                      (
                          functionCall.args as {
                              query: string;
                          }
                      ).query
                  ),

          });



        const toolResult =
          await chat.sendMessage([
            {
              functionResponse: {

                name:
                  "searchProducts",

                response: {
                  products,
                },

              },
            },
          ]);



        return toolResult.response.text();

      }

    }



    return response.text();

  }

}