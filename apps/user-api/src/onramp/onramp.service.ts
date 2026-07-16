import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Razorpay from 'razorpay';

export enum OnRampStatusEnum {
  Success = 'Success',
  Failure = 'Failure',
  Processing = 'Processing',
}

@Injectable()
export class OnrampService {
  constructor(private prisma: PrismaService) {}

  async createRazorpayOrder(amount: number) {
    try {
      const token = (Math.random() * 1000).toString();
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const order = await razorpay.orders.create({
        amount: amount,
        currency: 'INR',
        receipt: token,
      });

      if (!order) {
        throw new Error('Order not created');
      }

      return {
        success: true,
        order: order,
        message: 'Order created successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }

  async createOnrampTransaction(
    userId: number,
    amount: number,
    status: OnRampStatusEnum,
    provider: string,
    token: string,
  ) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    try {
      // Prisma expects the enum OnRampStatus (Success, Failure, Processing)
      const result = await this.prisma.onRampTransaction.create({
        data: {
          userId,
          amount,
          status: status as any, // Cast to any to match Prisma enum
          startTime: new Date(),
          provider,
          token,
        },
      });

      return {
        success: true,
        message: 'Onramp transaction added successfully',
        result,
      };
    } catch (error: unknown) {
      console.error('Error creating onramp transaction: ', error);
      return {
        success: false,
        message: `Failed to create onramp transaction: ${(error as Error).message}`,
      };
    }
  }

  async getOnrampHistory(userId: number) {
    const transactions = await this.prisma.onRampTransaction.findMany({
      where: { userId },
      orderBy: { startTime: 'desc' },
      select: { provider: true, status: true, amount: true, startTime: true },
    });

    // Group by provider
    const providerMap = new Map<
      string,
      {
        count: number;
        totalAmount: number;
        lastUsed: Date;
        successCount: number;
      }
    >();
    for (const t of transactions) {
      const existing = providerMap.get(t.provider) || {
        count: 0,
        totalAmount: 0,
        lastUsed: t.startTime,
        successCount: 0,
      };
      existing.count++;
      if (t.status === 'Success') {
        existing.totalAmount += t.amount;
        existing.successCount++;
      }
      if (t.startTime > existing.lastUsed) existing.lastUsed = t.startTime;
      providerMap.set(t.provider, existing);
    }

    return Array.from(providerMap.entries()).map(([provider, data]) => ({
      provider,
      count: data.count,
      successCount: data.successCount,
      totalAmount: data.totalAmount,
      lastUsed: data.lastUsed,
    }));
  }
}
