import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.test before everything
dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

describe('TransactionService', () => {
  let service: TransactionService;
  let prisma: PrismaService;
  let testUser1: any;
  let testUser2: any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionService, PrismaService],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // Clean DB
    await prisma.p2pTransfer.deleteMany();
    await prisma.onRampTransaction.deleteMany();
    await prisma.balance.deleteMany();
    await prisma.user.deleteMany();

    // Create test users
    testUser1 = await prisma.user.create({
      data: {
        email: 'test1@example.com',
        name: 'Test One',
        number: '1111111111',
        password: 'hash',
        balance: {
          create: { amount: 100000, locked: 0 },
        },
      },
    });

    testUser2 = await prisma.user.create({
      data: {
        email: 'test2@example.com',
        name: 'Test Two',
        number: '2222222222',
        password: 'hash',
        balance: {
          create: { amount: 50000, locked: 0 },
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('getTransactions', () => {
    it('should throw NotFoundException if user not found', async () => {
      await expect(service.getTransactions(9999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return combined sorted p2p and onramp transactions', async () => {
      // Add onramp
      await prisma.onRampTransaction.create({
        data: {
          status: 'Success',
          token: 'token1',
          provider: 'HDFC',
          amount: 50000,
          startTime: new Date('2023-01-01'),
          userId: testUser1.id,
        },
      });

      // Add P2P sent
      await prisma.p2pTransfer.create({
        data: {
          amount: 10000,
          timestamp: new Date('2023-01-02'),
          fromUserId: testUser1.id,
          toUserId: testUser2.id,
        },
      });

      // Add P2P received
      await prisma.p2pTransfer.create({
        data: {
          amount: 5000,
          timestamp: new Date('2023-01-03'),
          fromUserId: testUser2.id,
          toUserId: testUser1.id,
        },
      });

      const result = await service.getTransactions(testUser1.id);

      expect(result.onRampTransactions).toHaveLength(1);
      expect(result.p2pTransfers).toHaveLength(2);

      // Sorted by descending timestamp
      expect(result.p2pTransfers[0].amount).toBe(5000); // 2023-01-03 is more recent
      expect(result.p2pTransfers[1].amount).toBe(10000);
    });

    it('should return empty arrays if user has no transactions', async () => {
      const result = await service.getTransactions(testUser1.id);
      expect(result.p2pTransfers).toHaveLength(0);
      expect(result.onRampTransactions).toHaveLength(0);
    });
  });

  describe('getP2pCount', () => {
    it('should count transfers where user is sender or receiver', async () => {
      await prisma.p2pTransfer.createMany({
        data: [
          {
            amount: 10,
            timestamp: new Date(),
            fromUserId: testUser1.id,
            toUserId: testUser2.id,
          },
          {
            amount: 20,
            timestamp: new Date(),
            fromUserId: testUser2.id,
            toUserId: testUser1.id,
          },
        ],
      });

      const count = await service.getP2pCount(testUser1.id);
      expect(count).toBe(2);
    });

    it('should return 0 if user has no transfers', async () => {
      const count = await service.getP2pCount(testUser1.id);
      expect(count).toBe(0);
    });
  });

  describe('getP2pRecipients', () => {
    it('should return unique recipients (max 4)', async () => {
      // Create another user
      const testUser3 = await prisma.user.create({
        data: {
          email: 'test3@example.com',
          number: '333',
          password: 'h',
          name: 'Test 3',
        },
      });

      // Transfer to User 2 multiple times
      await prisma.p2pTransfer.create({
        data: {
          amount: 10,
          timestamp: new Date('2023-01-01'),
          fromUserId: testUser1.id,
          toUserId: testUser2.id,
        },
      });
      await prisma.p2pTransfer.create({
        data: {
          amount: 10,
          timestamp: new Date('2023-01-02'),
          fromUserId: testUser1.id,
          toUserId: testUser2.id,
        },
      });

      // Transfer to User 3 once
      await prisma.p2pTransfer.create({
        data: {
          amount: 10,
          timestamp: new Date('2023-01-03'),
          fromUserId: testUser1.id,
          toUserId: testUser3.id,
        },
      });

      const recipients = await service.getP2pRecipients(testUser1.id);

      // Should have 2 unique recipients
      expect(recipients).toHaveLength(2);
      // Most recent first (User 3 was last)
      expect(recipients[0].email).toBe(testUser3.email);
      expect(recipients[1].email).toBe(testUser2.email);
    });

    it('should handle recipient with no name and use email string for name/initials', async () => {
      // User with empty string name
      const noNameUser = await prisma.user.create({
        data: {
          email: 'noname@example.com',
          number: '555',
          password: 'h',
          name: '',
        },
      });
      await prisma.p2pTransfer.create({
        data: {
          amount: 10,
          timestamp: new Date(),
          fromUserId: testUser1.id,
          toUserId: noNameUser.id,
        },
      });

      const recipients = await service.getP2pRecipients(testUser1.id);
      expect(recipients).toHaveLength(1);
      expect(recipients[0].name).toBe('noname'); // email.split('@')[0]
      expect(recipients[0].initials).toBe('NO'); // email.substring(0, 2).toUpperCase()
    });

    it('should return empty array if no sent transfers', async () => {
      const recipients = await service.getP2pRecipients(testUser1.id);
      expect(recipients).toEqual([]);
    });
  });

  describe('getAnalytics', () => {
    it('should throw NotFoundException for unknown user', async () => {
      await expect(service.getAnalytics(9999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should correctly aggregate inflows and outflows for the last 30 days', async () => {
      const today = new Date();

      // Inflow: OnRamp
      await prisma.onRampTransaction.create({
        data: {
          status: 'Success',
          token: 'token2',
          provider: 'Visa',
          amount: 50000,
          startTime: today,
          userId: testUser1.id,
        },
      });

      // Inflow: P2P Receive
      await prisma.p2pTransfer.create({
        data: {
          amount: 20000,
          timestamp: today,
          fromUserId: testUser2.id,
          toUserId: testUser1.id,
        },
      });

      // Outflow: P2P Send
      await prisma.p2pTransfer.create({
        data: {
          amount: 30000,
          timestamp: today,
          fromUserId: testUser1.id,
          toUserId: testUser2.id,
        },
      });

      const result = await service.getAnalytics(testUser1.id);

      // Amount is divided by 100 in logic
      expect(result.totalIn).toBe((50000 + 20000) / 100);
      expect(result.totalOut).toBe(30000 / 100);
      expect(result.net).toBe(result.totalIn - result.totalOut);

      expect(result.dailyTotals).toHaveLength(30);
    });

    it('should return zeros for totalIn, totalOut, and net if user has no activity', async () => {
      const result = await service.getAnalytics(testUser1.id);
      expect(result.totalIn).toBe(0);
      expect(result.totalOut).toBe(0);
      expect(result.net).toBe(0);
      expect(result.dailyTotals).toHaveLength(30);
      result.dailyTotals.forEach((day) => {
        expect(day.inflow).toBe(0);
        expect(day.outflow).toBe(0);
      });
    });

    it('should not count transfers older than 30 days', async () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 31);

      await prisma.p2pTransfer.create({
        data: {
          amount: 10000,
          timestamp: oldDate,
          fromUserId: testUser1.id,
          toUserId: testUser2.id,
        },
      });

      const result = await service.getAnalytics(testUser1.id);
      expect(result.totalOut).toBe(0);
    });

    it('should not count failed or processing OnRamp transactions', async () => {
      const today = new Date();
      await prisma.onRampTransaction.create({
        data: {
          status: 'Failure',
          token: 'failToken',
          provider: 'Visa',
          amount: 50000,
          startTime: today,
          userId: testUser1.id,
        },
      });
      await prisma.onRampTransaction.create({
        data: {
          status: 'Processing',
          token: 'procToken',
          provider: 'Visa',
          amount: 50000,
          startTime: today,
          userId: testUser1.id,
        },
      });

      const result = await service.getAnalytics(testUser1.id);
      expect(result.totalIn).toBe(0);
    });
  });
});
