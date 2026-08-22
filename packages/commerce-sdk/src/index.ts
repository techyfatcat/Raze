import type { RazeConfig } from "./types";
import { RazeClient } from "./client";

export { RazeClient };

export type {
  RazeConfig,
  Product,
  CartItem,
  RazeMessage,
  PaymentRequest,
} from "./types";

let client: RazeClient | null = null;

export function init(config: RazeConfig) {
  if (!config.merchantId) {
    throw new Error(
      "Raze.init requires a merchantId"
    );
  }

  client = new RazeClient(config);

  return client;
}

export function getClient() {
  if (!client) {
    throw new Error(
      "Raze has not been initialized. Call Raze.init() first."
    );
  }

  return client;
}

export const Raze = {
  init,
  getClient,
};