import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import prisma from '@repo/db/client';

export async function GET() {
  // 1. Get the session
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const balance = await prisma.balance.findFirst({
    where: {
      userId: Number(session?.user?.id),
    },
  });

  // 3. Return as JSON
  return NextResponse.json({
    amount: balance?.amount || 0,
    locked: balance?.locked || 0,
  });
}
