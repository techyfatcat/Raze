export type AgentMessage = {
  role: "user" | "assistant";
  content: string;
};


export type AgentContext = {
  merchantId: string;
  messages: AgentMessage[];
};


export type AgentToolResult = {
  success: boolean;
  data?: unknown;
  message?: string;
};