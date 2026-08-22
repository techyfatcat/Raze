import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/:merchantId/catalog", async (req, res) => {
  try {
    const merchant = await prisma.merchant.findUnique({
      where: {
        id: req.params.merchantId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        currency: true,
        products: {
          where: {
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
        },
      },
    });

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: "Merchant not found",
      });
    }

    return res.json({
      schemaVersion: "1.0",
      merchant: {
        id: merchant.id,
        name: merchant.name,
        description: merchant.description,
        currency: merchant.currency,
      },
      products: merchant.products,
    });
  } catch (error) {
    console.error("Catalog error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch catalog",
    });
  }
});

export default router;