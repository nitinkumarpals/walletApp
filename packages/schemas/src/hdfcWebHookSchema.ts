import { z } from "zod";
export const webHookSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  user_identifier: z.string(),
  amount: z.string(),
});
