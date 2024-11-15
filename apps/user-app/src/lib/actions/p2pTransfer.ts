"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../app/api/auth/[...nextauth]/options";
import prisma from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
  try {
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;

    if (!from) {
      return {
        message: "Error: Not authenticated",
      };
    }

    const toUser = await prisma.user.findFirst({
      where: {
        email: to,
      },
    });

    if (!toUser) {
      return {
        message: "Error: User not found",
      };
    }

    // Execute transaction in a single database connection
    await prisma.$transaction(async (tx: any) => {
      // Lock sender's balance row to prevent concurrent updates
      await tx.$executeRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;
      const fromBalance = await tx.balance.findFirst({
        where: { userId: Number(from) },
      });

      if (!fromBalance || fromBalance.amount < amount) {
        throw new Error("Insufficient balance");
      }

      await tx.balance.update({
        where: { userId: Number(from) },
        data: { amount: { decrement: amount } },
      });

      await tx.balance.update({
        where: { userId: toUser.id },
        data: { amount: { increment: amount } },
      });

      await tx.p2pTransfer.create({
        data: {
          fromUserId: Number(from),
          toUserId: toUser.id,
          amount,
          timestamp: new Date(),
        },
      })
    });

    return {
      message: "Transfer successful",
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        message: `Error: ${error.message}`,
      };
    }
    return {
      message: `Unexpected error: ${JSON.stringify(error)}`,
    };
  }
}
