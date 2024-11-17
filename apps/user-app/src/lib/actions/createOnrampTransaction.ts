"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../app/api/auth/[...nextauth]/options";
import prisma from "@repo/db/client";
import Razorpay from "razorpay";
import { error } from "console";
const createOnrampTransaction = async (amount: number, provider: string) => {
  try {
    const session = await getServerSession(authOptions);
    const token = (Math.random() * 1000).toString();
    if (!session || !session.user || !session.user.id) {
      throw new Error("User not found");
    }
    const userId = session?.user.id;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });
    const order = await razorpay.orders.create({
      amount: amount,
      currency: "INR",
      receipt: token,
    });
    if (!order) {
      console.log(error);
      throw new Error("Order not created");
    }

    await prisma.onRampTransaction.create({
      data: {
        userId: Number(userId),
        amount,
        status: "Processing",
        startTime: new Date(),
        provider,
        token,
      },
    });
    return {
      success: true,
      message: "Onramp transaction added successfully",
      data: order,
    };
  } catch (error: unknown) {
    console.error("Error creating onramp transaction: ", error);
    return {
      success: false,
      message: `Failed to create onramp transaction: ${(error as Error).message}`,
    };
  }
};

export default createOnrampTransaction;
