export interface RazeConfig {
  merchantId: string;
  apiUrl?: string;
  position?: "bottom-right" | "bottom-left";
  theme?: "light" | "dark" | "system";
}

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  currency?: string | null;
  category?: string | null;
  inventory?: number;
  attributes?: Record<string, unknown> | null;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface RazeMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface PaymentRequest {
  orderId: string;
  actionId: string;
  amount: number;
  currency: string;
  reason: string;
}