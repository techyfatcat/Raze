import { prisma } from "../../lib/prisma.js";


export async function searchProductsTool({
  merchantId,
  query,
}: {
  merchantId: string;
  query: string;
}) {

  const products =
    await prisma.product.findMany({
      where:{
        merchantId,
        isActive:true,
        OR:[
          {
            name:{
              contains:query,
              mode:"insensitive",
            },
          },
          {
            category:{
              contains:query,
              mode:"insensitive",
            },
          },
        ],
      },
      take:5,
    });


  return products;
}