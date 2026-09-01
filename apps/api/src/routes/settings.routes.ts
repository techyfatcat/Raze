import { Router } from "express";

import {
  getMerchantSettings,
  updateMerchantSettings,
} from "../services/settings.service.js";

const router = Router();

/*
 * --------------------------------------------------
 * GET SETTINGS
 * --------------------------------------------------
 */

router.get(
  "/:merchantId/settings",
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

      const settings =
        await getMerchantSettings(
          merchantId
        );

      return res.json({
        success: true,
        settings,
      });
    } catch (error) {
      console.error(
        "Get settings error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch settings",
      });
    }
  }
);

/*
 * --------------------------------------------------
 * UPDATE SETTINGS
 * --------------------------------------------------
 */

router.patch(
  "/:merchantId/settings",
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

      const {
        name,
        slug,
        description,
        currency,
      } = req.body;

      if (
        name !== undefined &&
        typeof name !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "name must be a string",
        });
      }

      if (
        slug !== undefined &&
        typeof slug !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "slug must be a string",
        });
      }

      if (
        description !== undefined &&
        description !== null &&
        typeof description !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "description must be a string or null",
        });
      }

      if (
        currency !== undefined &&
        typeof currency !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "currency must be a string",
        });
      }

      const settings =
        await updateMerchantSettings(
          merchantId,
          {
            name,
            slug,
            description,
            currency,
          }
        );

      return res.json({
        success: true,
        settings,
      });
    } catch (error) {
      console.error(
        "Update settings error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update settings",
      });
    }
  }
);

export default router;