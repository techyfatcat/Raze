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
                "Product search query. Include useful attributes such as product type, brand, category, color, or features.",

            },

          },

          required: [
            "query",
          ],

        },

      },


      {
        name:
          "addToCart",

        description:
          "Use when the customer explicitly asks to add a product to their cart. Only use a product ID when it is known from the merchant catalog or a previous product search.",

        parameters: {

          type:
            Type.OBJECT,

          properties: {

            productId: {

              type:
                Type.STRING,

              description:
                "The exact merchant product ID to add.",

            },

            quantity: {

              type:
                Type.INTEGER,

              description:
                "Number of units to add. Defaults to 1.",

            },

          },

          required: [
            "productId",
          ],

        },

      },


      {
        name:
          "removeFromCart",

        description:
          "Use when the customer asks to remove a specific product from their cart.",

        parameters: {

          type:
            Type.OBJECT,

          properties: {

            productId: {

              type:
                Type.STRING,

              description:
                "The exact merchant product ID to remove.",

            },

          },

          required: [
            "productId",
          ],

        },

      },


      {
        name:
          "updateCartQuantity",

        description:
          "Use when the customer asks to change the quantity of a product already in their cart.",

        parameters: {

          type:
            Type.OBJECT,

          properties: {

            productId: {

              type:
                Type.STRING,

              description:
                "The exact merchant product ID whose quantity should be changed.",

            },

            quantity: {

              type:
                Type.INTEGER,

              description:
                "The new total quantity for the product. Use 0 only when the customer wants the product removed.",

            },

          },

          required: [
            "productId",
            "quantity",
          ],

        },

      },


      {
        name:
          "clearCart",

        description:
          "Use when the customer explicitly asks to empty, clear, or remove everything from their cart.",

        parameters: {

          type:
            Type.OBJECT,

          properties: {},

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