import prisma from '@repo/db/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/options';
import TransferUI from './TransferUI';
export async function getBalance() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    throw new Error('User not authenticated or session missing.');
  }
  const balance = await prisma.balance.findFirst({
    where: {
      userId: Number(session?.user?.id),
    },
  });
  return {
    amount: balance?.amount || 0,
    locked: balance?.locked || 0,
  };
}

export default async function () {
  // const balance = await getBalance();
  return (
    <TransferUI />
  );
}
