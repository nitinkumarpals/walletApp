import { z } from "zod";
export const sendFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
});
