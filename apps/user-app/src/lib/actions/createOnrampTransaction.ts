"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../app/api/auth/[...nextauth]/options";
import prisma from "@repo/db/client";

/* eslint-disable */
enum OnRampStatus {
  Success,
  Failure,
  Processing,
}
/* eslint-enable */
const createOnrampTransaction = async (
  amount: number,
  status: OnRampStatus,
  provider: string,
  token: string
) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      throw new Error("User not found");
    }
    const userId = session?.user.id;

    const result = await prisma.onRampTransaction.create({
      data: {
        userId: Number(userId),
        amount,
        status: status as any,
        startTime: new Date(),
        provider,
        token,
      },
    });
    return {
      success: true,
      message: "Onramp transaction added successfully",
      result,
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
