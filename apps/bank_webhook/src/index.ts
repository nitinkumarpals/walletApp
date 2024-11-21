import { Hono } from "hono";
import { webHookSchema } from "@repo/schemas/hdfcWebHookSchema";
import { getPrisma } from "@repo/db/accelerate";
// Function to compute HMAC SHA-256
async function hmacSha256(key: any, data: any) {
  if (!key || key.length === 0) {
    throw new Error("HMAC key must not be empty");
  }
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const dataToSign = encoder.encode(data);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, dataToSign);
  return Array.from(new Uint8Array(signature))
    .map((b) => ("00" + b.toString(16)).slice(-2))
    .join("");
}
// Function to verify the HMAC SHA-256 signature
type Bindings = {
  DATABASE_URL: string;
  RAZORPAY_KEY_SECRET: string;
};
const app = new Hono<{
  Bindings: Bindings;
  Variables: {
    userId: string;
  };
}>();
//check if this request actually come from hdfc bank, use a webhook secret here
app.post("/webhook", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const secret = c.env.RAZORPAY_KEY_SECRET;

  try {
    const body = await c.req.json();
    const result = webHookSchema.safeParse(body);
    if (!result.success) {
      return c.json({ error: "Invalid data" }, 400);
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user_identifier,
      amount,
    } = result.data;
    
    const data = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = await hmacSha256(secret, data);
    if (generated_signature !== razorpay_signature) {
      return c.json({ error: "Transaction is not legit" }, 400);
    }
    // transactions-> either both of the db call happen or none of them
    await prisma.$transaction([
      prisma.balance.update({
        where: {
          userId: Number(user_identifier),
        },
        data: {
          amount: {
            increment: Number(amount),
          },
        },
      }),
      prisma.onRampTransaction.update({
        where: {
          token: razorpay_signature,
        },
        data: {
          status: "Success",
        },
      }),
    ]);
    return c.json(
      {
        message: "Captured",
        paymentInformation: {
          token: razorpay_signature,
          userId: user_identifier,
          amount,
        },
      },
      200
    );
    //if status 200 is not sent to bank than bank will refund the money to user
  } catch (error) {
    console.error("Error processing webhook:", error);
    return c.json({ error: (error as Error).message }, 500);
  }
});

export default app;
