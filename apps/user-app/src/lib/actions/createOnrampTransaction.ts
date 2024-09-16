"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../app/api/auth/[...nextauth]/options";
import prisma from "@repo/db/client";

const createOnrampTransaction = async (amount: number, provider: string) => {
  try {
    const session = await getServerSession(authOptions);
    const token = Math.random().toString();
    if (!session || !session.user || !session.user.id) {
      throw new Error("User not found");
    }
    const userId = session?.user.id;
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
