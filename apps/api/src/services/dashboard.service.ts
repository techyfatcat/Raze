import { prisma } from "../lib/prisma.js";

export async function getMerchantDashboard(
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
            slug: true,
            currency: true,
        },
    });

    if (!merchant) {
        throw new Error("Merchant not found");
    }

    /*
     * --------------------------------------------------
     * BASIC COUNTS
     * --------------------------------------------------
     */

    const [
        totalOrders,
        paidOrders,
        failedOrders,
        totalProducts,
        activeProducts,
        pendingAgentActions,
        completedAgentActions,
        totalCampaigns,
    ] = await Promise.all([
        prisma.order.count({
            where: {
                merchantId,
            },
        }),

        prisma.order.count({
            where: {
                merchantId,
                status: "PAID",
            },
        }),

        prisma.order.count({
            where: {
                merchantId,
                status: "FAILED",
            },
        }),

        prisma.product.count({
            where: {
                merchantId,
            },
        }),

        prisma.product.count({
            where: {
                merchantId,
                isActive: true,
            },
        }),

        prisma.agentAction.count({
            where: {
                merchantId,
                status: "PROPOSED",
            },
        }),

        prisma.agentAction.count({
            where: {
                merchantId,
                status: "COMPLETED",
            },
        }),

        prisma.campaign.count({
            where: {
                merchantId,
            },
        }),
    ]);

    /*
     * --------------------------------------------------
     * REVENUE
     * --------------------------------------------------
     */

    const revenueResult =
        await prisma.order.aggregate({
            where: {
                merchantId,
                status: "PAID",
            },
            _sum: {
                amount: true,
            },
        });

    const revenue =
        revenueResult._sum.amount ?? 0;

    /*
     * --------------------------------------------------
     * RECENT ORDERS
     * --------------------------------------------------
     */

    const recentOrders =
        await prisma.order.findMany({
            where: {
                merchantId,
            },

            orderBy: {
                createdAt: "desc",
            },

            take: 10,

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

    /*
     * --------------------------------------------------
     * AGENT ACTIVITY
     * --------------------------------------------------
     */

    const agentActivity =
        await prisma.agentAction.findMany({
            where: {
                merchantId,
            },

            orderBy: {
                createdAt: "desc",
            },

            take: 10,

            select: {
                id: true,
                agentType: true,
                action: true,
                reason: true,
                amount: true,
                status: true,
                approvedBy: true,
                metadata: true,
                createdAt: true,
            },
        });

    /*
     * --------------------------------------------------
     * REVENUE TREND - LAST 7 DAYS
     * --------------------------------------------------
     *
     * We aggregate paid orders in application code
     * so this remains database-provider independent.
     */

    const sevenDaysAgo =
        new Date();

    sevenDaysAgo.setDate(
        sevenDaysAgo.getDate() - 6
    );

    sevenDaysAgo.setHours(
        0,
        0,
        0,
        0
    );

    const paidOrdersForTrend =
        await prisma.order.findMany({

            where: {
                merchantId,
                status: "PAID",
                createdAt: {
                    gte: sevenDaysAgo,
                },
            },

            select: {
                amount: true,
                createdAt: true,
            },

            orderBy: {
                createdAt: "asc",
            },
        });

    const revenueTrend =
        Array.from(
            { length: 7 },
            (_, index) => {
                const date =
                    new Date(sevenDaysAgo);

                date.setDate(
                    date.getDate() + index
                );

                const dateKey =
                    date.toISOString().slice(0, 10);

                return {
                    date: dateKey,
                    revenue: 0,
                    orders: 0,
                };
            }
        );

    for (const order of paidOrdersForTrend) {
        const dateKey =
            order.createdAt
                .toISOString()
                .slice(0, 10);

        const day =
            revenueTrend.find(
                item =>
                    item.date === dateKey
            );

        if (day) {
            day.revenue += order.amount;
            day.orders += 1;
        }
    }

    /*
     * --------------------------------------------------
     * INVENTORY
     * --------------------------------------------------
     */

    const lowStockProducts =
        await prisma.product.findMany({
            where: {
                merchantId,
                isActive: true,
                inventory: {
                    lte: 5,
                },
            },

            orderBy: {
                inventory: "asc",
            },

            take: 10,

            select: {
                id: true,
                name: true,
                price: true,
                inventory: true,
                category: true,
            },
        });

    /*
     * --------------------------------------------------
     * RESPONSE
     * --------------------------------------------------
     */

    return {
        merchant,

        overview: {
            revenue,
            totalOrders,
            paidOrders,
            failedOrders,

            conversionRate:
                totalOrders > 0
                    ? Number(
                        (
                            (paidOrders /
                                totalOrders) *
                            100
                        ).toFixed(2)
                    )
                    : 0,

            totalProducts,
            activeProducts,

            pendingAgentActions,
            completedAgentActions,

            totalCampaigns,
        },

        revenueTrend,

        recentOrders,

        agentActivity,

        lowStockProducts,
    };
}