import { Router } from "express";

import { runAgent } from "../agent/agent.js";

import type {
  AgentContext,
} from "../agent/types.js";


const router =
  Router();


router.post(
  "/chat",
  async (req, res) => {

    try {

      const {
        merchantId,
        messages,
        cart = [],
      } = req.body;



      if (
        typeof merchantId !== "string" ||
        !merchantId.trim()
      ) {

        return res.status(400).json({

          success: false,

          message:
            "merchantId is required",

        });

      }


      if (!Array.isArray(messages)) {

        return res.status(400).json({

          success: false,

          message:
            "messages must be an array",

        });

      }


      /*
       * ----------------------------------------
       * NORMALIZE MESSAGES
       * ----------------------------------------
       */

      const normalizedMessages =
        messages
          .filter(
            (
              message: any
            ) =>
              message &&
              (
                message.role === "user" ||
                message.role === "assistant"
              ) &&
              typeof message.content === "string"
          )
          .map(
            (
              message: any
            ) => ({

              role:
                message.role,

              content:
                message.content.trim(),

            })
          )
          .filter(
            (
              message
            ) =>
              message.content.length > 0
          );



      const normalizedCart =
        Array.isArray(cart)

          ? cart
              .filter(
                (
                  item: any
                ) =>
                  item &&
                  typeof item.productId === "string" &&
                  item.productId.trim() &&
                  Number.isInteger(
                    item.quantity
                  ) &&
                  item.quantity > 0
              )
              .map(
                (
                  item: any
                ) => ({

                  productId:
                    item.productId,

                  quantity:
                    item.quantity,

                })
              )

          : [];


      const context: AgentContext = {

        merchantId:
          merchantId.trim(),

        messages:
          normalizedMessages,

        cart:
          normalizedCart,

      };

      const result =
        await runAgent(
          context
        );


      return res.json({

        success: true,

        ...result,

      });

    }

    catch (error) {

      console.error(
        "AGENT ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Agent failed",

      });

    }

  }
);


export default router;