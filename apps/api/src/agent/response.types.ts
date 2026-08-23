export type AgentResponse = {
  message: string;

  products?: {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    category?: string | null;
  }[];

  action?:
    | "SHOW_PRODUCTS"
    | "ADD_TO_CART"
    | "CHECKOUT"
    | "NONE";
};