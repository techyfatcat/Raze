import { Router } from "express";

import {
  getMerchantCustomers,
  getCustomer,
} from "../services/customer.service.js";

const router = Router();

/*
 * --------------------------------------------------
 * GET MERCHANT CUSTOMERS
 * --------------------------------------------------
 */

router.get(
  "/:merchantId/customers",
  async (req, res) => {
    try {
      const { merchantId } = req.params;

      if (!merchantId) {
        return res.status(400).json({
          success: false,
          message: "merchantId is required",
        });
      }

      const customers =
        await getMerchantCustomers(
          merchantId
        );

      return res.json({
        success: true,
        count: customers.length,
        customers,
      });
    } catch (error) {
      console.error(
        "Get customers error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch customers",
      });
    }
  }
);

/*
 * --------------------------------------------------
 * GET SINGLE CUSTOMER
 * --------------------------------------------------
 */

router.get(
  "/:merchantId/customers/:customerId",
  async (req, res) => {
    try {
      const {
        merchantId,
        customerId,
      } = req.params;

      if (!merchantId || !customerId) {
        return res.status(400).json({
          success: false,
          message:
            "merchantId and customerId are required",
        });
      }

      const customer =
        await getCustomer(
          merchantId,
          customerId
        );

      return res.json({
        success: true,
        customer,
      });
    } catch (error) {
      console.error(
        "Get customer error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch customer",
      });
    }
  }
);

export default router;