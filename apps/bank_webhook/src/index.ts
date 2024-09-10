import { Hono } from 'hono'
import { hdfcWebHookSchema } from '@repo/schemas/hdfcWebHookSchema'
const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/hdfcWebhook', async (c) => {
  try {
    const { token, user_identifier, amount } = await c.req.json()
    const { success } = hdfcWebHookSchema.safeParse({ token, user_identifier, amount });
    if (!success) {
      return c.json({ error: 'Invalid data' }, 400)
    }
    const paymentInformation = {
      token,
      userId: user_identifier,
      amount
    }
        // Update balance in db, add txn
    return c.json({ message: 'Success', paymentInformation })

  } catch (error) {
    return c.json({ error: (error as Error).message }, 500)
  }
})

export default app
