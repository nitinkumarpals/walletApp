import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransferService {
  constructor(private prisma: PrismaService) {}

  async p2pTransfer(fromUserId: number, toEmail: string, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const toUser = await this.prisma.user.findFirst({
      where: { email: toEmail },
    });

    if (!toUser) {
      return { message: 'Error: User not found' };
    }

    if (toUser.id === Number(fromUserId)) {
      return { message: 'Error: Cannot send money to yourself' };
    }

    try {
      await this.prisma.$transaction(async (tx: any) => {
        // Lock sender's balance row to prevent concurrent updates
        await tx.$executeRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(fromUserId)} FOR UPDATE`;
        const fromBalance = await tx.balance.findFirst({
          where: { userId: Number(fromUserId) },
        });

        if (!fromBalance || fromBalance.amount < amount) {
          throw new Error('Insufficient balance');
        }

        await tx.balance.update({
          where: { userId: Number(fromUserId) },
          data: { amount: { decrement: amount } },
        });

        await tx.balance.update({
          where: { userId: toUser.id },
          data: { amount: { increment: amount } },
        });

        await tx.p2pTransfer.create({
          data: {
            fromUserId: Number(fromUserId),
            toUserId: toUser.id,
            amount,
            timestamp: new Date(),
          },
        });
      });

      return { message: 'Transfer successful' };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { message: `Error: ${error.message}` };
      }
      return { message: `Unexpected error: ${JSON.stringify(error)}` };
    }
  }
}
