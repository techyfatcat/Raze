import { prisma } from "../lib/prisma.js";

interface CreateProductInput {
  merchantId: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  inventory?: number;
  attributes?: Record<string, any>;
}

export async function createProduct(input: CreateProductInput) {
  return prisma.product.create({
    data: {
      merchantId: input.merchantId,
      name: input.name,
      description: input.description,
      price: input.price,
      category: input.category,
      inventory: input.inventory ?? 0,
      attributes: input.attributes,
    },
  });
}

export async function getMerchantProducts(merchantId: string) {
  return prisma.product.findMany({
    where: {
      merchantId,
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}