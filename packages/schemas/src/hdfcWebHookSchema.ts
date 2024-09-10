import { z } from 'zod';
export const hdfcWebHookSchema = z.object({
    token: z.string(),
    user_identifier: z.string(),
    amount: z.number(),
})