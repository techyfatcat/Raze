import { Raze } from "@raze/commerce-sdk";

export const raze = Raze.init({
  merchantId:
    process.env.NEXT_PUBLIC_RAZE_MERCHANT_ID!,
  apiUrl:
    process.env.NEXT_PUBLIC_RAZE_API_URL,
});