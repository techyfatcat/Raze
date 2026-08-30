import { Router } from "express";

import {
  getMerchantDashboard,
} from "../services/dashboard.service.js";

const router = Router();

router.get(
  "/:merchantId",
  async (req, res) => {
    try {
      const {
        merchantId,
      } = req.params;

      const dashboard =
        await getMerchantDashboard(
          merchantId
        );

      return res.json({
        success: true,
        dashboard,
      });
    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch dashboard",
      });
    }
  }
);

export default router;