import { Router } from "express";
import {
  createPaymentAction,
  approvePaymentAction,
} from "../services/agent-action.service.js";

const router = Router();

router.post("/payment-request", async (req, res) => {
  try {
    const {
      merchantId,
      orderId,
      reason,
    } = req.body;

    if (!merchantId || !orderId) {
      return res.status(400).json({
        success: false,
        message:
          "merchantId and orderId are required",
      });
    }

    const action = await createPaymentAction({
      merchantId,
      orderId,
      reason:
        reason ??
        "AI agent requested payment approval",
    });

    return res.status(201).json({
      success: true,
      action,
    });
  } catch (error) {
    console.error(
      "Payment action error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create payment request",
    });
  }
});

router.post(
  "/:actionId/approve",
  async (req, res) => {
    try {
      const { actionId } = req.params;

      const action =
        await approvePaymentAction(actionId);

      return res.json({
        success: true,
        action,
      });
    } catch (error) {
      console.error(
        "Approve payment action error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to approve payment",
      });
    }
  }
);

export default router;