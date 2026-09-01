import { prisma } from "../lib/prisma.js";

export async function getMerchantAnalytics(
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

  const [
    orders,
    products,
    customers,
    payments,
    agentActions,
    campaigns,
  ] = await Promise.all([
    prisma.order.findMany({
      where: {
        merchantId,
      },
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        customerId: true,
        createdAt: true,
        items: {
          select: {
            productId: true,
            quantity: true,
            price: true,
            product: {
              select: {
                id: true,
                name: true,
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.product.findMany({
      where: {
        merchantId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        category: true,
        price: true,
        inventory: true,
        createdAt: true,
      },
    }),

    prisma.customer.findMany({
      where: {
        merchantId,
      },
      select: {
        id: true,
        createdAt: true,
      },
    }),

    prisma.payment.findMany({
      where: {
        order: {
          merchantId,
        },
      },
      select: {
        id: true,
        amount: true,
        status: true,
        createdAt: true,
      },
    }),

    prisma.agentAction.findMany({
      where: {
        merchantId,
      },
      select: {
        id: true,
        agentType: true,
        action: true,
        status: true,
        amount: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.campaign.findMany({
      where: {
        merchantId,
      },
      select: {
        id: true,
        name: true,
        status: true,
        expectedRevenue: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  /*
   * --------------------------------------------------
   * ORDER METRICS
   * --------------------------------------------------
   */

  const totalOrders = orders.length;

  const paidOrders = orders.filter(
    (order) => order.status === "PAID"
  );

  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING"
  );

  const failedOrders = orders.filter(
    (order) => order.status === "FAILED"
  );

  const cancelledOrders = orders.filter(
    (order) => order.status === "CANCELLED"
  );

  const totalRevenue = paidOrders.reduce(
    (total, order) =>
      total + order.amount,
    0
  );

  const averageOrderValue =
    paidOrders.length > 0
      ? Math.round(
          totalRevenue /
            paidOrders.length
        )
      : 0;

  /*
   * --------------------------------------------------
   * PAYMENT METRICS
   * --------------------------------------------------
   */

  const successfulPayments =
    payments.filter(
      (payment) =>
        payment.status === "SUCCESS"
    );

  const failedPayments =
    payments.filter(
      (payment) =>
        payment.status === "FAILED"
    );

  /*
   * --------------------------------------------------
   * PRODUCT PERFORMANCE
   * --------------------------------------------------
   */

  const productMap = new Map<
    string,
    {
      id: string;
      name: string;
      category: string | null;
      unitsSold: number;
      revenue: number;
    }
  >();

  for (const order of paidOrders) {
    for (const item of order.items) {
      const existing =
        productMap.get(
          item.productId
        );

      if (existing) {
        existing.unitsSold +=
          item.quantity;

        existing.revenue +=
          item.price *
          item.quantity;
      } else {
        productMap.set(
          item.productId,
          {
            id: item.productId,
            name:
              item.product.name,
            category:
              item.product.category,
            unitsSold:
              item.quantity,
            revenue:
              item.price *
              item.quantity,
          }
        );
      }
    }
  }

  const topProducts = Array.from(
    productMap.values()
  )
    .sort(
      (a, b) =>
        b.revenue - a.revenue
    )
    .slice(0, 10);

  const soldProductIds =
    new Set(
      productMap.keys()
    );

  const lowPerformingProducts =
    products
      .filter(
        (product) =>
          !soldProductIds.has(
            product.id
          )
      )
      .map((product) => ({
        id: product.id,
        name: product.name,
        category:
          product.category,
        price: product.price,
        inventory:
          product.inventory,
      }))
      .slice(0, 10);

  /*
   * --------------------------------------------------
   * REVENUE TREND
   * --------------------------------------------------
   *
   * Last 30 days.
   */

  const now = new Date();

  const revenueTrend = Array.from(
    { length: 30 },
    (_, index) => {
      const date = new Date(now);

      date.setHours(
        0,
        0,
        0,
        0
      );

      date.setDate(
        now.getDate() -
          (29 - index)
      );

      return {
        date:
          date
            .toISOString()
            .slice(0, 10),
        revenue: 0,
        orders: 0,
      };
    }
  );

  const trendMap =
    new Map(
      revenueTrend.map(
        (item) => [
          item.date,
          item,
        ]
      )
    );

  for (const order of paidOrders) {
    const date =
      new Date(order.createdAt)
        .toISOString()
        .slice(0, 10);

    const entry =
      trendMap.get(date);

    if (entry) {
      entry.revenue +=
        order.amount;

      entry.orders += 1;
    }
  }

  /*
   * --------------------------------------------------
   * CUSTOMER METRICS
   * --------------------------------------------------
   */

  const customersWithOrders =
    new Set(
      orders
        .filter(
          (order) =>
            order.customerId
        )
        .map(
          (order) =>
            order.customerId
        )
    );

  const customerRevenue =
    new Map<
      string,
      number
    >();

  for (const order of paidOrders) {
    if (!order.customerId) {
      continue;
    }

    customerRevenue.set(
      order.customerId,
      (customerRevenue.get(
        order.customerId
      ) ?? 0) +
        order.amount
    );
  }

  const topCustomers =
    Array.from(
      customerRevenue.entries()
    )
      .map(
        ([
          customerId,
          revenue,
        ]) => ({
          customerId,
          revenue,
        })
      )
      .sort(
        (a, b) =>
          b.revenue -
          a.revenue
      )
      .slice(0, 10);

  /*
   * --------------------------------------------------
   * AI AGENT METRICS
   * --------------------------------------------------
   */

  const completedAgentActions =
    agentActions.filter(
      (action) =>
        action.status ===
        "COMPLETED"
    );

  const proposedAgentActions =
    agentActions.filter(
      (action) =>
        action.status ===
        "PROPOSED"
    );

  const failedAgentActions =
    agentActions.filter(
      (action) =>
        action.status ===
        "FAILED"
    );

  const agentRevenue =
    completedAgentActions.reduce(
      (total, action) =>
        total +
        (action.amount ?? 0),
      0
    );

  /*
   * --------------------------------------------------
   * CAMPAIGN METRICS
   * --------------------------------------------------
   */

  const activeCampaigns =
    campaigns.filter(
      (campaign) =>
        campaign.status ===
        "ACTIVE"
    );

  const completedCampaigns =
    campaigns.filter(
      (campaign) =>
        campaign.status ===
        "COMPLETED"
    );

  const expectedCampaignRevenue =
    campaigns.reduce(
      (total, campaign) =>
        total +
        (campaign.expectedRevenue ??
          0),
      0
    );

  return {
    merchant,

    overview: {
      totalRevenue,
      totalOrders,
      paidOrders:
        paidOrders.length,
      pendingOrders:
        pendingOrders.length,
      failedOrders:
        failedOrders.length,
      cancelledOrders:
        cancelledOrders.length,
      averageOrderValue,

      totalProducts:
        products.length,

      totalCustomers:
        customers.length,

      customersWithOrders:
        customersWithOrders.size,
    },

    payments: {
      total:
        payments.length,
      successful:
        successfulPayments.length,
      failed:
        failedPayments.length,
    },

    revenueTrend,

    products: {
      top: topProducts,
      lowPerforming:
        lowPerformingProducts,
    },

    customers: {
      top:
        topCustomers,
    },

    agents: {
      total:
        agentActions.length,
      completed:
        completedAgentActions.length,
      proposed:
        proposedAgentActions.length,
      failed:
        failedAgentActions.length,
      attributedRevenue:
        agentRevenue,
    },

    campaigns: {
      total:
        campaigns.length,
      active:
        activeCampaigns.length,
      completed:
        completedCampaigns.length,
      expectedRevenue:
        expectedCampaignRevenue,
    },
  };
}