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
    const body = await c.req.json()
    const result = hdfcWebHookSchema.safeParse(body);
    if (!result.success) {
      return c.json({ error: 'Invalid data' }, 400)
    }
    const { token, user_identifier, amount } = result.data;
    // transactions-> either both of the db call happen or none of them
    await prisma.$transaction([
      prisma.balance.update({
        where: {
          userId: Number(user_identifier)
        },
        data: {
          amount: {
            increment: Number(amount) 
          }
        }
      }),
      prisma.onRampTransaction.update({
        where: {
          token
        },
        data: {
          status: 'Success',
        }
      })
    ]);
    return c.json({ message: 'Captured', paymentInformation: { token, userId: user_identifier, amount } }, 200);
    //if status 200 is not sent to bank than bank will refund the money to user 

  } catch (error) {
    console.error('Error processing webhook:', error);
    return c.json({ error: (error as Error).message }, 500)
  }
})

export default app
