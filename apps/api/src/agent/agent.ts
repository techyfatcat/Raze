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
){

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


  try {

    return JSON.parse(response);

  } catch {

    return {

      message:
        response,

      action:
        "NONE",

    };

  }

}

export async function askRaze(
  message: string
) {

  const response =
    await fetch(
      "http://localhost:5000/api/agent/chat",
      {
        method:"POST",

        headers:{
          "Content-Type":
            "application/json",
        },

        body:JSON.stringify({

          merchantId:
            process.env
              .NEXT_PUBLIC_MERCHANT_ID,

          messages:[
            {
              role:"user",
              content:message,
            },
          ],

        }),

      }
    );


  return response.json();

}