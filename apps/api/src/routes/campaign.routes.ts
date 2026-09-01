import { Router } from "express";

import {
  createCampaign,
  getMerchantCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
} from "../services/campaign.service.js";

const router = Router();

/*
 * --------------------------------------------------
 * GET ALL CAMPAIGNS
 * --------------------------------------------------
 *
 * GET /api/merchants/:merchantId/campaigns
 */

router.get(
  "/merchants/:merchantId/campaigns",
  async (req, res) => {
    try {
      const { merchantId } = req.params;

      if (!merchantId) {
        return res.status(400).json({
          success: false,
          message: "merchantId is required",
        });
      }

      const campaigns =
        await getMerchantCampaigns(merchantId);

      return res.json({
        success: true,
        campaigns,
      });
    } catch (error) {
      console.error(
        "Get campaigns error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load campaigns",
      });
    }
  }
);

/*
 * --------------------------------------------------
 * GET SINGLE CAMPAIGN
 * --------------------------------------------------
 *
 * GET /api/merchants/:merchantId/campaigns/:campaignId
 */

router.get(
  "/merchants/:merchantId/campaigns/:campaignId",
  async (req, res) => {
    try {
      const {
        merchantId,
        campaignId,
      } = req.params;

      if (!merchantId || !campaignId) {
        return res.status(400).json({
          success: false,
          message:
            "merchantId and campaignId are required",
        });
      }

      const campaign =
        await getCampaign(
          merchantId,
          campaignId
        );

      return res.json({
        success: true,
        campaign,
      });
    } catch (error) {
      console.error(
        "Get campaign error:",
        error
      );

      return res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Campaign not found",
      });
    }
  }
);

/*
 * --------------------------------------------------
 * CREATE CAMPAIGN
 * --------------------------------------------------
 *
 * POST /api/merchants/:merchantId/campaigns
 */

router.post(
  "/merchants/:merchantId/campaigns",
  async (req, res) => {
    try {
      const { merchantId } = req.params;

      const {
        name,
        description,
        target,
        expectedRevenue,
      } = req.body;

      if (!merchantId) {
        return res.status(400).json({
          success: false,
          message: "merchantId is required",
        });
      }

      if (!name || typeof name !== "string") {
        return res.status(400).json({
          success: false,
          message: "Campaign name is required",
        });
      }

      if (
        !target ||
        typeof target !== "object"
      ) {
        return res.status(400).json({
          success: false,
          message: "Campaign target is required",
        });
      }

      const campaign =
        await createCampaign({
          merchantId,
          name,
          description,
          target,
          expectedRevenue,
        });

      return res.status(201).json({
        success: true,
        campaign,
      });
    } catch (error) {
      console.error(
        "Create campaign error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create campaign",
      });
    }
  }
);

/*
 * --------------------------------------------------
 * UPDATE CAMPAIGN
 * --------------------------------------------------
 *
 * PATCH /api/merchants/:merchantId/campaigns/:campaignId
 */

router.patch(
  "/merchants/:merchantId/campaigns/:campaignId",
  async (req, res) => {
    try {
      const {
        merchantId,
        campaignId,
      } = req.params;

      if (!merchantId || !campaignId) {
        return res.status(400).json({
          success: false,
          message:
            "merchantId and campaignId are required",
        });
      }

      const {
        name,
        description,
        target,
        expectedRevenue,
        status,
      } = req.body;

      const campaign =
        await updateCampaign(
          merchantId,
          campaignId,
          {
            name,
            description,
            target,
            expectedRevenue,
            status,
          }
        );

      return res.json({
        success: true,
        campaign,
      });
    } catch (error) {
      console.error(
        "Update campaign error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update campaign",
      });
    }
  }
);

/*
 * --------------------------------------------------
 * DELETE CAMPAIGN
 * --------------------------------------------------
 *
 * DELETE /api/merchants/:merchantId/campaigns/:campaignId
 */

router.delete(
  "/merchants/:merchantId/campaigns/:campaignId",
  async (req, res) => {
    try {
      const {
        merchantId,
        campaignId,
      } = req.params;

      if (!merchantId || !campaignId) {
        return res.status(400).json({
          success: false,
          message:
            "merchantId and campaignId are required",
        });
      }

      await deleteCampaign(
        merchantId,
        campaignId
      );

      return res.json({
        success: true,
        message: "Campaign deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete campaign error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete campaign",
      });
    }
  }
);

export default router;