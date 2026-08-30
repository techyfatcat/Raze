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

export async function createProduct(
  input: CreateProductInput
) {
  if (!input.merchantId) {
    throw new Error("merchantId is required");
  }

  if (!input.name?.trim()) {
    throw new Error("Product name is required");
  }

  if (
    typeof input.price !== "number" ||
    !Number.isFinite(input.price) ||
    input.price < 0
  ) {
    throw new Error(
      "Price must be a valid non-negative number"
    );
  }

  const inventory =
    input.inventory ?? 0;

  if (
    !Number.isInteger(inventory) ||
    inventory < 0
  ) {
    throw new Error(
      "Inventory must be a non-negative integer"
    );
  }

  const merchant =
    await prisma.merchant.findUnique({
      where: {
        id: input.merchantId,
      },
      select: {
        id: true,
      },
    });

  if (!merchant) {
    throw new Error("Merchant not found");
  }

  return prisma.product.create({
    data: {
      merchantId: input.merchantId,
      name: input.name.trim(),
      description:
        input.description?.trim() || undefined,
      price: input.price,
      category:
        input.category?.trim() || undefined,
      inventory,
      attributes: input.attributes,
    },
  });
}

export async function getMerchantProducts(
  merchantId: string
) {
  if (!merchantId) {
    throw new Error("merchantId is required");
  }

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