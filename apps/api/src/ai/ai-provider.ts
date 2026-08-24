export interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AIRequest {
  system: string;
  messages: AIMessage[];
  merchantId: string;
}

export interface AIProvider {
  generateResponse(
    input: AIRequest
  ): Promise<string>;
}
export interface AIMessage {

  role:
    "user"
    | "assistant";

  content:
    string;

}


export interface AIRequest {

  system:
    string;

  messages:
    AIMessage[];

  merchantId:
    string;

  cart: {

    productId:
      string;

    quantity:
      number;

  }[];

}


export interface AIProvider {

  generateResponse(
    input:
      AIRequest
  ):
    Promise<string>;

}