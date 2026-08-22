import { Router } from "express";
import {
  createProduct,
  getMerchantProducts,
} from "../services/product.service.js";

const router = Router();

router.post("/:merchantId/products", async (req, res) => {
  try {
    const merchantId = req.params.merchantId;

    const {
      name,
      description,
      price,
      category,
      inventory,
      attributes,
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "name and price are required",
      });
    }

    const product = await createProduct({
      merchantId,
      name,
      description,
      price,
      category,
      inventory,
      attributes,
    });

    return res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
});

router.get("/:merchantId/products", async (req, res) => {
  try {
    const products = await getMerchantProducts(req.params.merchantId);

    return res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
});

export default router;