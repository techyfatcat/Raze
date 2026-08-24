export interface RazeConfig {

  merchantId:string;

  apiUrl?:string;

  position?:
    | "bottom-right"
    | "bottom-left";

  theme?:
    | "light"
    | "dark"
    | "system";


  onAddToCart?:(
    product:Product
  )=>void;


  onCheckout?:(
    items:CartItem[]
  )=>void;

}





export interface Product {

  id:string;

  name:string;

  description?:string | null;

  price:number;

  currency?:string | null;

  category?:string | null;

  inventory?:number;

  attributes?:
    Record<string,unknown>
    | null;

}





export interface CartItem {

  productId:string;

  quantity:number;

}





export type RazeMessage = {


  role:
    | "user"
    | "assistant";


  content:string;


  products?:Product[];


  action?:
    | "SHOW_PRODUCTS"
    | "ADD_TO_CART"
    | "CHECKOUT"
    | "NONE";


  metadata?:{

    productId?:string;

  };


};





export interface PaymentRequest {

  orderId:string;

  actionId:string;

  amount:number;

  currency:string;

  reason:string;

}

export type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
};

export interface PaymentResponse {

  success:boolean;

  provider:string;

  providerOrderId:string;

  orderId:string;

  amount:number;

  currency:string;

  key?:string | null;

}