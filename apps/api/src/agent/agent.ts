import {
  getAIProvider,
} from "../ai/ai.factory.js";

import {
  RAZE_AGENT_SYSTEM_PROMPT,
} from "./prompts/system.js";

import type {
  AgentContext,
} from "./types.js";

import {
  getActiveCampaignsForAgent,
} from "../services/campaign.service.js";


export async function runAgent(
  context: AgentContext
) {
  const ai =
    getAIProvider();


  /*
   * --------------------------------------------------
   * ACTIVE CAMPAIGNS
   * --------------------------------------------------
   *
   * Only ACTIVE campaigns are exposed to the agent.
   *
   * Campaigns can either:
   *
   * 1. Target a specific product
   * 2. Target slow-moving products
   *
   * The agent receives the relevant product information
   * and decides whether it makes sense to recommend it.
   */

  const campaigns =
    await getActiveCampaignsForAgent(
      context.merchantId
    );


  /*
   * --------------------------------------------------
   * BUILD CAMPAIGN CONTEXT
   * --------------------------------------------------
   *
   * Merchant campaigns are appended to the base
   * Raze system prompt.
   *
   * The AI is instructed to use campaigns intelligently
   * rather than blindly promoting products.
   */

  const campaignContext =
    campaigns.length > 0
      ? `

ACTIVE MERCHANT CAMPAIGNS

The merchant has currently enabled the following
campaigns.

You should naturally use these campaigns during
customer conversations when relevant.

Do NOT aggressively promote products.

Recommendations must still make sense for the
customer's request and conversation.

If a campaign targets a specific product, you may
recommend that product when it is relevant.

If a campaign targets slow-moving products, prefer
those products when they are a reasonable match for
the customer's needs.

Active campaigns:

${campaigns
  .map((campaign) => {

    /*
     * --------------------------------------------------
     * SPECIFIC PRODUCT CAMPAIGN
     * --------------------------------------------------
     */

    const productText =
      campaign.product
        ? `
Product:
- ID: ${campaign.product.id}
- Name: ${campaign.product.name}
- Description: ${
            campaign.product.description ??
            "No description"
          }
- Price: ${campaign.product.price}
- Category: ${
            campaign.product.category ??
            "Uncategorized"
          }
- Inventory: ${campaign.product.inventory}
`
        : campaign.products?.length
          ? `

SLOW-MOVING PRODUCTS

The following products match this campaign's
slow-moving criteria.

${campaign.products
  .map(
    (product: any) => `
- ID: ${product.id}
- Name: ${product.name}
- Description: ${
        product.description ??
        "No description"
      }
- Price: ${product.price}
- Category: ${
        product.category ??
        "Uncategorized"
      }
- Inventory: ${product.inventory}
- Units sold in campaign period: ${
        product.unitsSold
      }
`
  )
  .join("\n")}
`
          : "";

    return `
Campaign ID: ${campaign.id}

Campaign Name:
${campaign.name}

Description:
${
      campaign.description ??
      "No description"
    }

Target:
${JSON.stringify(
      campaign.target
    )}

Expected Revenue:
${
      campaign.expectedRevenue ??
      "Not specified"
    }

${productText}
`;
  })
  .join("\n")}

CAMPAIGN RULES

1. Campaigns are merchant instructions, not
   mandatory sales pitches.

2. Recommend a campaign product only when it is
   relevant to what the customer wants.

3. Never falsely claim that a product is discounted,
   on sale, limited, or specially priced unless the
   campaign explicitly provides that information.

4. Never recommend an inactive or unavailable
   product.

5. If multiple campaigns are relevant, choose the
   most useful recommendation rather than mentioning
   every campaign.

6. The customer's intent always comes first.

7. The merchant may create campaigns specifically
   to increase visibility of products that are not
   selling well. In such cases, naturally surface
   those products when they fit the customer's needs.

8. For slow-moving campaigns, use the provided
   "Units sold in campaign period" information as
   internal context. Never tell the customer that a
   product is slow-moving unless explicitly instructed
   by the merchant.

9. Do not recommend every product from a campaign.
   Select only products that genuinely fit the
   customer's request.

10. If no campaign product is relevant, ignore the
    campaign and continue helping the customer normally.
`
      : `

ACTIVE MERCHANT CAMPAIGNS

There are currently no active campaigns.

Do not invent or imply that any campaign exists.
`;


  /*
   * --------------------------------------------------
   * FINAL SYSTEM PROMPT
   * --------------------------------------------------
   */

  const systemPrompt =
    `${RAZE_AGENT_SYSTEM_PROMPT}

${campaignContext}`;


  /*
   * --------------------------------------------------
   * AI RESPONSE
   * --------------------------------------------------
   */

  const response =
    await ai.generateResponse({

      system:
        systemPrompt,

      messages:
        context.messages.map(
          (message) => ({

            role:
              message.role === "assistant"
                ? "assistant"
                : "user",

            content:
              message.content,

          })
        ),

      merchantId:
        context.merchantId,

      cart:
        context.cart,

    });


  /*
   * --------------------------------------------------
   * PARSE RESPONSE
   * --------------------------------------------------
   *
   * The AI should normally return JSON.
   *
   * If the provider returns plain text instead,
   * gracefully fall back to a normal response.
   */

  try {

    return JSON.parse(
      response
    );

  } catch {

    return {

      message:
        response ||
        "I can help you find products and guide you through checkout. What are you looking for?",

      action:
        "NONE",

    };

  }
}