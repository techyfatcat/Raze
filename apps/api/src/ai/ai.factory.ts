import {
  GeminiProvider,
} from "./gemini.provider.js";


export function getAIProvider(){

  return new GeminiProvider();

}