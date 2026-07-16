import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async getTransactions(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        sentTransfers: {
          include: { toUser: true, fromUser: true },
          orderBy: { timestamp: 'desc' },
        },
        receivedTransfers: {
          include: { fromUser: true, toUser: true },
          orderBy: { timestamp: 'desc' },
        },
        onRampTransactions: {
          orderBy: { startTime: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const p2pTransfers = [
      ...user.sentTransfers,
      ...user.receivedTransfers,
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return {
      p2pTransfers: p2pTransfers,
      onRampTransactions: user.onRampTransactions,
    };
  }

  async getP2pCount(userId: number) {
    return this.prisma.p2pTransfer.count({
      where: {
        OR: [{ fromUserId: userId }, { toUserId: userId }],
      },
    });
  }

  async getP2pRecipients(userId: number) {
    const sentTransfers = await this.prisma.p2pTransfer.findMany({
      where: { fromUserId: userId },
      include: { toUser: true },
      orderBy: { timestamp: 'desc' },
    });

    const uniqueRecipients = new Map();
    for (const t of sentTransfers) {
      if (!uniqueRecipients.has(t.toUserId) && t.toUser) {
        uniqueRecipients.set(t.toUserId, {
          name: t.toUser.name || t.toUser.email.split('@')[0],
          email: t.toUser.email,
          initials: t.toUser.name
            ? t.toUser.name.substring(0, 2).toUpperCase()
            : t.toUser.email.substring(0, 2).toUpperCase(),
        });
      }
      if (uniqueRecipients.size >= 4) break;
    }

    return Array.from(uniqueRecipients.values());
  }

  async getAnalytics(userId: number) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        sentTransfers: {
          where: { timestamp: { gte: thirtyDaysAgo } },
        },
        receivedTransfers: {
          where: { timestamp: { gte: thirtyDaysAgo } },
        },
        onRampTransactions: {
          where: {
            startTime: { gte: thirtyDaysAgo },
            status: 'Success' as any,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const dailyData: Record<string, { inflow: number; outflow: number }> = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      dailyData[dateString] = { inflow: 0, outflow: 0 };
    }

    user.sentTransfers.forEach((t) => {
      const dateString = t.timestamp.toISOString().split('T')[0];
      if (dailyData[dateString])
        dailyData[dateString].outflow += t.amount / 100;
    });

    user.receivedTransfers.forEach((t) => {
      const dateString = t.timestamp.toISOString().split('T')[0];
      if (dailyData[dateString]) dailyData[dateString].inflow += t.amount / 100;
    });

    user.onRampTransactions.forEach((t) => {
      const dateString = t.startTime.toISOString().split('T')[0];
      if (dailyData[dateString]) dailyData[dateString].inflow += t.amount / 100;
    });

    const result = Object.entries(dailyData)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const totalIn = result.reduce((acc, r) => acc + r.inflow, 0);
    const totalOut = result.reduce((acc, r) => acc + r.outflow, 0);

    return {
      dailyTotals: result,
      totalIn,
      totalOut,
      net: totalIn - totalOut,
    };
  }
}
