
"use server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../app/api/auth/[...nextauth]/options";
export async function getTransactions() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      sentTransfers: {
        include: { toUser: true, fromUser: true },
        orderBy: { timestamp: "desc" },
      },
      receivedTransfers: {
        include: { fromUser: true, toUser: true },
        orderBy: { timestamp: "desc" },
      },
      onRampTransactions: {
        orderBy: { startTime: "desc" },
      },
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  const p2pTransfers = [...user.sentTransfers, ...user.receivedTransfers].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
  return {
    p2pTransfers: p2pTransfers,
    onRampTransactions: user.onRampTransactions,
  };
}
