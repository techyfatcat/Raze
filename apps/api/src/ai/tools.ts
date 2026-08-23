import {
  Type,
  type Tool,
} from "@google/genai";


export const geminiTools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "searchProducts",

        description:
          "Search products from merchant catalog based on customer requirements",

        parameters: {
          type: Type.OBJECT,

          properties: {
            query: {
              type: Type.STRING,

              description:
                "Product search query",
            },
          },

          required: [
            "query",
          ],
        },
      },
    ],
  },
];