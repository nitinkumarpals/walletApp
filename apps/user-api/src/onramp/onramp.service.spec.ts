import { Test, TestingModule } from '@nestjs/testing';
import { OnrampService, OnRampStatusEnum } from './onramp.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Mock Razorpay
jest.mock('razorpay', () => {
  return jest.fn().mockImplementation(() => ({
    orders: {
      create: jest.fn().mockResolvedValue({ id: 'order_mock', amount: 1000 }),
    },
  }));
});

dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

describe('OnrampService', () => {
  let service: OnrampService;
  let prisma: PrismaService;
  let testUser: any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnrampService, PrismaService],
    }).compile();

    service = module.get<OnrampService>(OnrampService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // Clean DB
    await prisma.onRampTransaction.deleteMany();
    await prisma.p2pTransfer.deleteMany();
    await prisma.balance.deleteMany();
    await prisma.user.deleteMany();

    // Create test user
    testUser = await prisma.user.create({
      data: {
        email: 'onramp@example.com',
        name: 'Onramp Test',
        number: '7778889999',
        password: 'hash',
        balance: {
          create: { amount: 0, locked: 0 },
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('createRazorpayOrder', () => {
    it('should create razorpay order', async () => {
      const result = await service.createRazorpayOrder(1000);
      expect(result.success).toBe(true);
      expect(result.order).toBeDefined();
    });

    it('should return success: false if order is null', async () => {
      const Razorpay = require('razorpay');
      Razorpay.mockImplementationOnce(() => ({
        orders: { create: jest.fn().mockResolvedValue(null) },
      }));

      const result = await service.createRazorpayOrder(1000);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Order not created');
    });

    it('should return success: false if razorpay throws an error', async () => {
      const Razorpay = require('razorpay');
      Razorpay.mockImplementationOnce(() => ({
        orders: {
          create: jest
            .fn()
            .mockRejectedValue(new Error('Razorpay network error')),
        },
      }));

      const result = await service.createRazorpayOrder(1000);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Razorpay network error');
    });
  });

  describe('createOnrampTransaction', () => {
    it('should throw BadRequestException if amount <= 0', async () => {
      await expect(
        service.createOnrampTransaction(
          testUser.id,
          0,
          OnRampStatusEnum.Processing,
          'HDFC',
          'tkn',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create onramp transaction in DB', async () => {
      const result = await service.createOnrampTransaction(
        testUser.id,
        5000,
        OnRampStatusEnum.Processing,
        'HDFC',
        'token_123',
      );
      expect(result.success).toBe(true);
      expect(result.result).toBeDefined();

      const tx = await prisma.onRampTransaction.findUnique({
        where: { token: 'token_123' },
      });
      expect(tx).toBeDefined();
      expect(tx?.amount).toBe(5000);
      expect(tx?.status).toBe('Processing');
    });

    it('should throw BadRequestException if amount is negative', async () => {
      await expect(
        service.createOnrampTransaction(
          testUser.id,
          -100,
          OnRampStatusEnum.Processing,
          'HDFC',
          'tkn',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return success: false if prisma throws an error', async () => {
      // Intentionally passing an invalid userId to cause a foreign key constraint failure
      const result = await service.createOnrampTransaction(
        99999, // user does not exist
        5000,
        OnRampStatusEnum.Processing,
        'HDFC',
        'token_456',
      );
      expect(result.success).toBe(false);
      expect(result.message).toContain('Failed to create onramp transaction:');
    });
  });

  describe('getOnrampHistory', () => {
    it('should correctly group by provider and sum amounts', async () => {
      await prisma.onRampTransaction.createMany({
        data: [
          {
            userId: testUser.id,
            amount: 1000,
            status: 'Success',
            startTime: new Date(),
            provider: 'HDFC',
            token: 't1',
          },
          {
            userId: testUser.id,
            amount: 2000,
            status: 'Success',
            startTime: new Date(),
            provider: 'HDFC',
            token: 't2',
          },
          {
            userId: testUser.id,
            amount: 500,
            status: 'Failure',
            startTime: new Date(),
            provider: 'HDFC',
            token: 't3',
          },
          {
            userId: testUser.id,
            amount: 5000,
            status: 'Success',
            startTime: new Date(),
            provider: 'Visa',
            token: 't4',
          },
        ],
      });

      const history = await service.getOnrampHistory(testUser.id);
      expect(history).toHaveLength(2);

      const hdfc = history.find((h) => h.provider === 'HDFC');
      expect(hdfc?.count).toBe(3);
      expect(hdfc?.successCount).toBe(2);
      expect(hdfc?.totalAmount).toBe(3000);

      const visa = history.find((h) => h.provider === 'Visa');
      expect(visa?.count).toBe(1);
      expect(visa?.totalAmount).toBe(5000);
    });

    it('should return empty array if no transactions exist', async () => {
      const history = await service.getOnrampHistory(testUser.id);
      expect(history).toEqual([]);
    });

    it('should correctly set lastUsed to the most recent transaction date', async () => {
      const olderDate = new Date('2023-01-01');
      const newerDate = new Date('2023-01-02');

      await prisma.onRampTransaction.createMany({
        data: [
          {
            userId: testUser.id,
            amount: 1000,
            status: 'Success',
            startTime: olderDate,
            provider: 'Axis',
            token: 'a1',
          },
          {
            userId: testUser.id,
            amount: 2000,
            status: 'Success',
            startTime: newerDate,
            provider: 'Axis',
            token: 'a2',
          },
        ],
      });

      const history = await service.getOnrampHistory(testUser.id);
      expect(history).toHaveLength(1);
      expect(history[0].lastUsed.toISOString()).toBe(newerDate.toISOString());
    });
  });
});
