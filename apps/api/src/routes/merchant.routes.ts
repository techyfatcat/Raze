import { Router } from "express";
import {
  createMerchant,
  getMerchantById,
} from "../services/merchant.service.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, slug, description, currency } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "name and slug are required",
      });
    }

    const merchant = await createMerchant({
      name,
      slug,
      description,
      currency,
    });

    return res.status(201).json({
      success: true,
      merchant,
    });
  } catch (error) {
    console.error("Create merchant error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create merchant",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const merchant = await getMerchantById(req.params.id);

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: "Merchant not found",
      });
    }

    return res.json({
      success: true,
      merchant,
    });
  } catch (error) {
    console.error("Get merchant error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch merchant",
    });
  }
});

export default router;