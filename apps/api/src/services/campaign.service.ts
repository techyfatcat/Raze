import { prisma } from "../lib/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";

export type CampaignTarget = {
  type: "PRODUCT" | "SLOW_MOVING" | "CUSTOM";
  productId?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  days?: number;
  instruction?: string;
};

type CampaignStatus =
  | "DRAFT"
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED";

interface CreateCampaignInput {
  merchantId: string;
  name: string;
  description?: string;
  target: CampaignTarget;
  expectedRevenue?: number;
  status?: CampaignStatus;
}

interface UpdateCampaignInput {
  name?: string;
  description?: string;
  target?: CampaignTarget;
  expectedRevenue?: number;
  status?: CampaignStatus;
}

/*
 * --------------------------------------------------
 * HELPERS
 * --------------------------------------------------
 */

function validateTarget(target: CampaignTarget) {
  if (!target?.type) {
    throw new Error("Campaign target is required");
  }

  if (
    !["PRODUCT", "SLOW_MOVING", "CUSTOM"].includes(
      target.type
    )
  ) {
    throw new Error("Invalid campaign target");
  }

  if (
    target.type === "PRODUCT" &&
    !target.productId
  ) {
    throw new Error(
      "productId is required for product campaigns"
    );
  }

  if (
    target.type === "SLOW_MOVING" &&
    target.days !== undefined &&
    (!Number.isInteger(target.days) ||
      target.days <= 0)
  ) {
    throw new Error(
      "days must be a positive integer"
    );
  }

  if (
    target.type === "CUSTOM" &&
    !target.instruction?.trim()
  ) {
    throw new Error(
      "instruction is required for custom campaigns"
    );
  }
}

/*
 * --------------------------------------------------
 * CREATE CAMPAIGN
 * --------------------------------------------------
 */

export async function createCampaign(
  input: CreateCampaignInput
) {
  if (!input.merchantId) {
    throw new Error("merchantId is required");
  }

  if (!input.name?.trim()) {
    throw new Error("Campaign name is required");
  }

  validateTarget(input.target);

  const merchant =
    await prisma.merchant.findUnique({
      where: {
        id: input.merchantId,
      },
    });

  if (!merchant) {
    throw new Error("Merchant not found");
  }

  /*
   * If campaign targets a specific product,
   * make sure it belongs to this merchant.
   */

  if (input.target.productId) {
    const product =
      await prisma.product.findFirst({
        where: {
          id: input.target.productId,
          merchantId: input.merchantId,
          isActive: true,
        },
      });

    if (!product) {
      throw new Error(
        "Campaign product not found"
      );
    }
  }

  const campaign =
    await prisma.campaign.create({
      data: {
        merchantId: input.merchantId,

        name: input.name.trim(),

        description:
          input.description?.trim() || null,

        target:
          input.target as Prisma.InputJsonValue,

        status:
          input.status ?? "ACTIVE",

        expectedRevenue:
          input.expectedRevenue ?? null,
      },
    });

  await prisma.auditLog.create({
    data: {
      merchantId: input.merchantId,

      actionType: "CAMPAIGN_CREATED",

      description:
        `Campaign "${campaign.name}" created`,

      agentType: "GROWTH",

      metadata: {
        campaignId: campaign.id,
        target: input.target,
      },
    },
  });

  return campaign;
}

/*
 * --------------------------------------------------
 * GET MERCHANT CAMPAIGNS
 * --------------------------------------------------
 */

export async function getMerchantCampaigns(
  merchantId: string
) {
  if (!merchantId) {
    throw new Error("merchantId is required");
  }

  return prisma.campaign.findMany({
    where: {
      merchantId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

/*
 * --------------------------------------------------
 * GET SINGLE CAMPAIGN
 * --------------------------------------------------
 */

export async function getCampaign(
  merchantId: string,
  campaignId: string
) {
  if (!merchantId) {
    throw new Error("merchantId is required");
  }

  if (!campaignId) {
    throw new Error("campaignId is required");
  }

  const campaign =
    await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        merchantId,
      },
    });

  if (!campaign) {
    throw new Error("Campaign not found");
  }

  return campaign;
}

/*
 * --------------------------------------------------
 * UPDATE CAMPAIGN
 * --------------------------------------------------
 */

export async function updateCampaign(
  merchantId: string,
  campaignId: string,
  input: UpdateCampaignInput
) {
  if (!merchantId) {
    throw new Error("merchantId is required");
  }

  if (!campaignId) {
    throw new Error("campaignId is required");
  }

  const existing =
    await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        merchantId,
      },
    });

  if (!existing) {
    throw new Error("Campaign not found");
  }

  /*
   * Validate target only when it is being changed.
   */

  if (input.target) {
    validateTarget(input.target);

    if (input.target.productId) {
      const product =
        await prisma.product.findFirst({
          where: {
            id: input.target.productId,
            merchantId,
            isActive: true,
          },
        });

      if (!product) {
        throw new Error(
          "Campaign product not found"
        );
      }
    }
  }

  if (
    input.name !== undefined &&
    !input.name.trim()
  ) {
    throw new Error(
      "Campaign name cannot be empty"
    );
  }

  const campaign =
    await prisma.campaign.update({
      where: {
        id: campaignId,
      },

      data: {
        name:
          input.name !== undefined
            ? input.name.trim()
            : undefined,

        description:
          input.description !== undefined
            ? input.description.trim() || null
            : undefined,

        target:
          input.target !== undefined
            ? (input.target as Prisma.InputJsonValue)
            : undefined,

        expectedRevenue:
          input.expectedRevenue !== undefined
            ? input.expectedRevenue
            : undefined,

        status:
          input.status !== undefined
            ? input.status
            : undefined,
      },
    });

  return campaign;
}

/*
 * --------------------------------------------------
 * DELETE CAMPAIGN
 * --------------------------------------------------
 */

export async function deleteCampaign(
  merchantId: string,
  campaignId: string
) {
  if (!merchantId) {
    throw new Error("merchantId is required");
  }

  if (!campaignId) {
    throw new Error("campaignId is required");
  }

  const existing =
    await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        merchantId,
      },
    });

  if (!existing) {
    throw new Error("Campaign not found");
  }

  await prisma.campaign.delete({
    where: {
      id: campaignId,
    },
  });

  return {
    success: true,
  };
}

/*
 * --------------------------------------------------
 * ACTIVE CAMPAIGNS FOR AI AGENT
 * --------------------------------------------------
 *
 * Only ACTIVE campaigns should influence
 * customer conversations.
 *
 * The agent receives:
 * - campaign information
 * - target information
 * - targeted product information
 */

export async function getActiveCampaignsForAgent(
  merchantId: string
) {
  const campaigns =
    await prisma.campaign.findMany({
      where: {
        merchantId,
        status: "ACTIVE",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  const result = [];

  for (const campaign of campaigns) {
    const target = campaign.target;

    let product = null;
    let products: any[] = [];

    if (
      target &&
      typeof target === "object" &&
      !Array.isArray(target)
    ) {
      const targetData = target as {
        type?: unknown;
        productId?: unknown;
        days?: unknown;
        priority?: unknown;
        instruction?: unknown;
      };

      /*
       * --------------------------------------------------
       * SPECIFIC PRODUCT CAMPAIGN
       * --------------------------------------------------
       */

      if (
        targetData.type === "PRODUCT" &&
        typeof targetData.productId === "string"
      ) {
        product =
          await prisma.product.findFirst({
            where: {
              id: targetData.productId,
              merchantId,
              isActive: true,
              inventory: {
                gt: 0,
              },
            },
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              category: true,
              inventory: true,
              attributes: true,
            },
          });
      }

      /*
       * --------------------------------------------------
       * SLOW MOVING PRODUCTS
       * --------------------------------------------------
       *
       * Default window: 30 days.
       *
       * A product is considered slow-moving when it has
       * sold 2 or fewer units during that period.
       */

      if (targetData.type === "SLOW_MOVING") {
        const days =
          typeof targetData.days === "number" &&
          targetData.days > 0
            ? targetData.days
            : 30;

        const since = new Date();

        since.setDate(
          since.getDate() - days
        );

        const merchantProducts =
          await prisma.product.findMany({
            where: {
              merchantId,
              isActive: true,
              inventory: {
                gt: 0,
              },
            },
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              category: true,
              inventory: true,
              attributes: true,
            },
          });

        const sales =
          await prisma.orderItem.findMany({
            where: {
              product: {
                merchantId,
              },
              order: {
                status: {
                  in: [
                    "PROCESSING",
                    "PAID",
                  ],
                },
                createdAt: {
                  gte: since,
                },
              },
            },
            select: {
              productId: true,
              quantity: true,
            },
          });

        const salesByProduct =
          new Map<string, number>();

        for (const sale of sales) {
          salesByProduct.set(
            sale.productId,
            (salesByProduct.get(
              sale.productId
            ) ?? 0) + sale.quantity
          );
        }

        products =
          merchantProducts
            .map((item) => ({
              ...item,
              unitsSold:
                salesByProduct.get(
                  item.id
                ) ?? 0,
            }))
            .filter(
              (item) =>
                item.unitsSold <= 2
            )
            .sort(
              (a, b) =>
                a.unitsSold -
                b.unitsSold
            )
            .slice(0, 10);
      }
    }

    result.push({
      id: campaign.id,
      name: campaign.name,
      description:
        campaign.description,

      target:
        campaign.target,

      expectedRevenue:
        campaign.expectedRevenue,

      product,

      products,
    });
  }

  return result;
}