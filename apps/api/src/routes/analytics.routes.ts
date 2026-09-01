import { Router } from "express";

import {
  getMerchantAnalytics,
} from "../services/analytics.service.js";

const router = Router();

/*
 * --------------------------------------------------
 * GET MERCHANT ANALYTICS
 * --------------------------------------------------
 */

router.get(
  "/:merchantId/analytics",
  async (req, res) => {
    try {
      const {
        merchantId,
      } = req.params;

      if (!merchantId) {
        return res.status(400).json({
          success: false,
          message:
            "merchantId is required",
        });
      }

      const analytics =
        await getMerchantAnalytics(
          merchantId
        );

      return res.json({
        success: true,
        analytics,
      });
    } catch (error) {
      console.error(
        "Analytics error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch analytics",
      });
    }
  }
);

export default router;