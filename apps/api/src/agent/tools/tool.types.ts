export type AgentTool = {
  name: string;
  description: string;
  execute: (
    args: Record<string, unknown>
  ) => Promise<unknown>;
};