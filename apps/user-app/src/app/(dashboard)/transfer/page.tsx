import prisma from '@repo/db/client';
import AddMoney from '../../../components/AddMoneyCard';
import { BalanceCard } from '../../../components/BalanceCard';
import OnRampTransactions from '../../../components/OnRampTransaction';
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
    // <div className="container mx-auto py-10">
    //   <h1 className="text-4xl font-bold mb-8 text-[#6a51a6]">Transfer</h1>
    //   <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
    //     <div>
    //       <AddMoney />
    //     </div>
    //     <div>
    //       <BalanceCard amount={balance.amount} locked={balance.locked} />
    //       <div className="pt-4">
    //         <OnRampTransactions />
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
