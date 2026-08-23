export interface AIProvider {

  generateResponse(input:{
  system:string;

  messages:{
    role:string;
    content:string;
  }[];

  merchantId:string;

}):Promise<string>;

}