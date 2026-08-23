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
        context.messages,

      merchantId:
        context.merchantId,

    });


  return {
    message: response,
  };

}