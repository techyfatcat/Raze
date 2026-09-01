export type AgentMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AgentCartItem = {
  productId: string;
  quantity: number;
};

export type AgentContext = {
  merchantId: string;
  messages: AgentMessage[];
  cart: AgentCartItem[];
};

export type AgentToolResult = {
  success: boolean;
  data?: unknown;
  message?: string;
};