import { Router } from "express";
import { createOrder } from "../services/order.service.js";

const router = Router();

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

export default router;