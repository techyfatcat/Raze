import type {
  AIProvider,
} from "./ai-provider.js";

import {
  GeminiProvider,
} from "./gemini.provider.js";


export function getAIProvider(): AIProvider {

  const provider =
    process.env.AI_PROVIDER ?? "gemini";


  switch (provider) {

    case "gemini":

      return new GeminiProvider();


    default:

      throw new Error(
        `Unsupported AI provider: ${provider}`
      );

  }

}