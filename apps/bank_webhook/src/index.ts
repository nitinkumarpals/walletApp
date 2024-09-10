import { Hono } from 'hono';
import { hdfcWebHookSchema } from '@repo/schemas/hdfcWebHookSchema';
import { getPrisma } from '@repo/db/accelerate';
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
  }
  Variables: {
    userId: string
  }
}>()
//check if this request actually come from hdfc bank, use a webhook secret here
app.post('/hdfcWebhook', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const { token, user_identifier, amount } = await c.req.json()
    const { success } = hdfcWebHookSchema.safeParse({ token, user_identifier, amount });
    if (!success) {
      return c.json({ error: 'Invalid data' }, 400)
    }
    // transactions-> either both of the db call happen or none of them
    prisma.balance.update({
      where: {
        userId: user_identifier
      },
      data: {
        amount: {
          increment: amount
        }
      }
    })

    prisma.onRampTransaction.update({
      where: {
        token
      },
      data: {
        status: 'Success',
      }
    })
    return c.json({ status: 200, message: 'Captured', paymentInformation: { token: token, useId: user_identifier, amount: amount } });
    //if status 200 is not sent to bank than bank will refund the money to user 

  } catch (error) {
    return c.json({ error: (error as Error).message }, 500)
  }
})

export default app
