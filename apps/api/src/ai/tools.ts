import {
  SchemaType,
  type Tool,
} from "@google/generative-ai";


export const geminiTools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "searchProducts",

        description:
          "Search products from merchant catalog based on customer requirements",

        parameters: {
          type: SchemaType.OBJECT,

          properties: {
            query: {
              type: SchemaType.STRING,
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