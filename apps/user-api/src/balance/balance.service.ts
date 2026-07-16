import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BalanceService {
  constructor(private prisma: PrismaService) {}

  async getBalance(userId: number) {
    const balance = await this.prisma.balance.findFirst({
      where: {
        userId,
      },
    });

    return {
      amount: balance?.amount || 0,
      locked: balance?.locked || 0,
    };
  }
}
