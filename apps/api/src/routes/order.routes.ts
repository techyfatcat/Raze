import { Router } from "express";

import {
  createOrder,
  getMerchantOrders,
} from "../services/order.service.js";

const router = Router();

/*
 * --------------------------------------------------
 * CREATE ORDER
 * --------------------------------------------------
 */

router.post("/", async (req, res) => {
  try {
    const {
      merchantId,
      customerId,
      items,
    } = req.body;

    if (!merchantId) {
      return res.status(400).json({
        success: false,
        message: "merchantId is required",
      });
    }

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "items must be an array",
      });
    }

    const order = await createOrder({
      merchantId,
      customerId,
      items,
    });

    return res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "Create order error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create order",
    });
  }
});

/*
 * --------------------------------------------------
 * GET MERCHANT ORDERS
 * --------------------------------------------------
 */

router.get("/:merchantId", async (req, res) => {
  try {
    const {
      merchantId,
    } = req.params;

    const result =
      await getMerchantOrders(
        merchantId
      );

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(
      "Get orders error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch orders",
    });
  }
});

export default router;