import { prisma } from "../../lib/prisma.js";


export async function searchProductsTool({

  merchantId,

  query,

}: {

  merchantId: string;

  query: string;

}) {

  const cleanQuery =
    query.trim();


  if (!cleanQuery) {

    return [];

  }


  const products =
    await prisma.product.findMany({

      where: {

        merchantId,

        isActive: true,

        OR: [

          {

            name: {

              contains:
                cleanQuery,

              mode:
                "insensitive",

            },

          },

          {

            category: {

              contains:
                cleanQuery,

              mode:
                "insensitive",

            },

          },

        ],

      },

      take: 5,

    });


  return products;

}



export async function getProductByIdTool({

  merchantId,

  productId,

}: {

  merchantId: string;

  productId: string;

}) {

  const product =
    await prisma.product.findFirst({

      where: {

        id:
          productId,

        merchantId,

        isActive:
          true,

      },

    });


  return product;

}