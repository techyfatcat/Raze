import { Router } from "express";
import {
  createPaymentOrder,
  verifyPayment,
} from "../services/payment.service.js";
import { MockPaymentProvider } from "../payments/mock-payment.provider.js";

const router = Router();

router.post("/create", async (req, res) => {
  try {
    const {
      orderId,
      agentActionId,
    } = req.body;

    if (!orderId || !agentActionId) {
      return res.status(400).json({
        success: false,
        message:
          "orderId and agentActionId are required",
      });
    }

    const result = await createPaymentOrder(
      orderId,
      agentActionId
    );

    return res.json({
      success: true,
      provider:
        process.env.PAYMENT_PROVIDER ?? "mock",
      providerOrderId: result.providerOrderId,
      orderId: result.order.id,
      amount: result.order.amount,
      currency: result.order.currency,
    });
  } catch (error) {
    console.error(
      "Create payment order error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create payment",
    });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const {
      orderId,
      providerOrderId,
      paymentId,
      signature,
    } = req.body;

    if (
      !orderId ||
      !providerOrderId ||
      !paymentId ||
      !signature
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing payment verification fields",
      });
    }

    const result = await verifyPayment(
      orderId,
      providerOrderId,
      paymentId,
      signature
    );

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(
      "Payment verification error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Payment verification failed",
    });
  }
});

router.post("/mock/complete", async (req, res) => {
  try {
    if (process.env.NODE_ENV === "production") {
      return res.status(404).json({
        success: false,
      });
    }

    const { providerOrderId } = req.body;

    if (!providerOrderId) {
      return res.status(400).json({
        success: false,
        message: "providerOrderId is required",
      });
    }

    const provider = new MockPaymentProvider();

    const result =
      provider.generateTestPayment(
        providerOrderId
      );

    return res.json({
      success: true,
      provider: "mock",
      providerOrderId,
      paymentId: result.paymentId,
      signature: result.signature,
    });
  } catch (error) {
    console.error(
      "Mock payment error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to simulate payment",
    });
  }
});

export default router;