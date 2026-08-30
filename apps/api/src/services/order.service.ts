import { prisma } from "../lib/prisma.js";

interface CreateOrderItemInput {
  productId: string;
  quantity: number;
}

interface CreateOrderInput {
  merchantId: string;
  customerId?: string;
  items: CreateOrderItemInput[];
}

export async function createOrder(input: CreateOrderInput) {
  if (!input.merchantId) {
    throw new Error("merchantId is required");
  }

  if (!input.items || input.items.length === 0) {
    throw new Error("Order must contain at least one item");
  }

  for (const item of input.items) {
    if (!item.productId) {
      throw new Error("productId is required");
    }

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error("Quantity must be a positive integer");
    }
  }

  const merchant = await prisma.merchant.findUnique({
    where: {
      id: input.merchantId,
    },
  });

  if (!merchant) {
    throw new Error("Merchant not found");
  }

  if (input.customerId) {
    const customer = await prisma.customer.findFirst({
      where: {
        id: input.customerId,
        merchantId: input.merchantId,
      },
    });

    if (!customer) {
      throw new Error("Customer not found");
    }
  }

  const productIds = [
    ...new Set(input.items.map((item) => item.productId)),
  ];

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
      merchantId: input.merchantId,
      isActive: true,
    },
  });

  if (products.length !== productIds.length) {
    throw new Error(
      "One or more products are unavailable"
    );
  }

  const productMap = new Map(
    products.map((product) => [product.id, product])
  );

  let totalAmount = 0;

  const orderItems = input.items.map((item) => {
    const product = productMap.get(item.productId);

    if (!product) {
      throw new Error(
        `Product ${item.productId} not found`
      );
    }

    if (product.inventory < item.quantity) {
      throw new Error(
        `Insufficient inventory for ${product.name}`
      );
    }

    const itemTotal = product.price * item.quantity;

    totalAmount += itemTotal;

    return {
      productId: product.id,
      quantity: item.quantity,
      price: product.price,
    };
  });

  const order = await prisma.$transaction(
    async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          merchantId: input.merchantId,
          customerId: input.customerId,
          amount: totalAmount,
          currency: merchant.currency,
          status: "PENDING",

          items: {
            create: orderItems,
          },
        },

        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      await tx.payment.create({
        data: {
          orderId: createdOrder.id,
          amount: totalAmount,
          currency: merchant.currency,
          status: "CREATED",
        },
      });

      await tx.auditLog.create({
        data: {
          merchantId: input.merchantId,
          actionType: "ORDER_CREATED",
          description:
            "Order created successfully",
          amount: totalAmount,
          metadata: {
            orderId: createdOrder.id,
            customerId:
              input.customerId ?? null,
            itemCount: orderItems.length,
          },
        },
      });

      return createdOrder;
    }
  );

  return order;
}

export async function getMerchantOrders(
  merchantId: string
) {
  if (!merchantId) {
    throw new Error("merchantId is required");
  }

  const merchant = await prisma.merchant.findUnique({
    where: {
      id: merchantId,
    },
    select: {
      id: true,
      name: true,
      currency: true,
    },
  });

  if (!merchant) {
    throw new Error("Merchant not found");
  }

  const orders = await prisma.order.findMany({
    where: {
      merchantId,
    },

    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      amount: true,
      currency: true,
      status: true,
      createdAt: true,

      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      items: {
        select: {
          id: true,
          quantity: true,
          price: true,

          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return {
    merchant,
    orders,
  };
}