import {
  Type,
  type Tool,
} from "@google/genai";


export const geminiTools: Tool[] = [

  {
    functionDeclarations: [

      {
        name:
          "searchProducts",

        description:
          "Search products from the merchant catalog based on customer requirements.",

        parameters: {

          type:
            Type.OBJECT,

          properties: {

            query: {

              type:
                Type.STRING,

              description:
                "Product search query.",

            },

          },

          required: [
            "query",
          ],

        },

      },


      {
        name:
          "checkout",

        description:
          "Use when the customer clearly indicates that they are ready to checkout or proceed to payment.",

        parameters: {

          type:
            Type.OBJECT,

          properties: {},

        },

      },

    ],

  },

];