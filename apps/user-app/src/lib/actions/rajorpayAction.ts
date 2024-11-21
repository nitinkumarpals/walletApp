"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../app/api/auth/[...nextauth]/options";
import Razorpay from "razorpay";
import { error } from "console";
export const razorpayAction = async (amount: number) => {
  try {
    const session = await getServerSession(authOptions);
    const token = (Math.random() * 1000).toString();
    if (!session || !session.user || !session.user.id) {
      throw new Error("User not found");
    }
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
    return {
      success: true,
      order:order,
      message: "Order created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};
