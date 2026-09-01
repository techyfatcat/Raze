import { prisma } from "../lib/prisma.js";

export async function getMerchantCustomers(
  merchantId: string
) {
  if (!merchantId) {
    throw new Error("merchantId is required");
  }

  const customers = await prisma.customer.findMany({
    where: {
      merchantId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          orders: true,
        },
      },
      orders: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          id: true,
          amount: true,
          currency: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });

  return customers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    createdAt: customer.createdAt,

    orderCount: customer._count.orders,

    lastOrder: customer.orders[0] ?? null,
  }));
}

export async function getCustomer(
  merchantId: string,
  customerId: string
) {
  if (!merchantId) {
    throw new Error("merchantId is required");
  }

  if (!customerId) {
    throw new Error("customerId is required");
  }

  const customer = await prisma.customer.findFirst({
    where: {
      id: customerId,
      merchantId,
    },
    include: {
      orders: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  category: true,
                },
              },
            },
          },
          payments: true,
        },
      },
    },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  const totalSpent = customer.orders
    .filter((order) => order.status === "PAID")
    .reduce(
      (total, order) => total + order.amount,
      0
    );

  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    createdAt: customer.createdAt,

    orderCount: customer.orders.length,

    totalSpent,

    lastOrder:
      customer.orders[0] ?? null,

    orders: customer.orders,
  };
}