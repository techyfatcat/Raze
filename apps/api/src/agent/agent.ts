import {
  getAIProvider,
} from "../ai/ai.factory.js";

import {
  RAZE_AGENT_SYSTEM_PROMPT,
} from "./prompts/system.js";

import type {
  AgentContext,
} from "./types.js";


export async function runAgent(
  context: AgentContext
) {

  const ai =
    getAIProvider();


  const response =
  await ai.generateResponse({

    system:
      RAZE_AGENT_SYSTEM_PROMPT,

    messages:
      context.messages.map(
        message => ({

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


  try {

    return JSON.parse(
      response
    );

  }
  catch {

    return {

      message:
        response ||
        "I can help you find products and guide you through checkout. What are you looking for?",

      action:
        "NONE",

    };

  }

}