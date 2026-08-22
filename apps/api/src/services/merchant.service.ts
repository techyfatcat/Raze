import { prisma } from "../lib/prisma.js";

interface CreateMerchantInput {
  name: string;
  slug: string;
  description?: string;
  currency?: string;
}

export async function createMerchant(input: CreateMerchantInput) {
  return prisma.merchant.create({
    data: {
      name: input.name,
      slug: input.slug,
      description: input.description,
      currency: input.currency ?? "INR",
    },
  });
}

export async function getMerchantById(id: string) {
  return prisma.merchant.findUnique({
    where: { id },
    include: {
      products: {
        where: {
          isActive: true,
        },
      },
    },
  });
}