export const dynamic = 'force-dynamic';
import { cookies } from "next/headers";
import { getServerSession } from "@/src/lib/getServerSession";
import TransferUI from './TransferUI';
export async function getBalance() {
  const session = await getServerSession();
  if (!session || !session.user?.id) {
    throw new Error('User not authenticated or session missing.');
  }
  const token = cookies().get('Authentication')?.value;
  try {
    const res = await fetch("http://localhost:3001/balance", {
      headers: {
        Cookie: `Authentication=${token}`
      }
    });
    if (!res.ok) {
      return { amount: 0, locked: 0 };
    }
    const balance = await res.json();
    return {
      amount: balance?.amount || 0,
      locked: balance?.locked || 0,
    };
  } catch (error) {
    return { amount: 0, locked: 0 };
  }
}

export default async function () {
  // const balance = await getBalance();
  return (
    <TransferUI />
  );
}
