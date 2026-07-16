import { Test, TestingModule } from '@nestjs/testing';
import { TransferService } from './transfer.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

describe('TransferService', () => {
  let service: TransferService;
  let prisma: PrismaService;
  let sender: any;
  let receiver: any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransferService, PrismaService],
    }).compile();

    service = module.get<TransferService>(TransferService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prisma.p2pTransfer.deleteMany();
    await prisma.onRampTransaction.deleteMany();
    await prisma.balance.deleteMany();
    await prisma.user.deleteMany();

    sender = await prisma.user.create({
      data: {
        email: 'sender@example.com',
        name: 'Sender',
        number: '1000000001',
        password: 'hash',
        balance: { create: { amount: 10000, locked: 0 } },
      },
    });

    receiver = await prisma.user.create({
      data: {
        email: 'receiver@example.com',
        name: 'Receiver',
        number: '1000000002',
        password: 'hash',
        balance: { create: { amount: 5000, locked: 0 } },
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('p2pTransfer', () => {
    it('should return error if sender is receiver', async () => {
      const result = await service.p2pTransfer(sender.id, sender.email, 5000);
      expect(result.message).toBe('Error: Cannot send money to yourself');
    });

    it('should throw BadRequestException if amount is negative', async () => {
      await expect(
        service.p2pTransfer(sender.id, receiver.email, -5000),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return error if recipient not found', async () => {
      const result = await service.p2pTransfer(
        sender.id,
        'notfound@example.com',
        5000,
      );
      expect(result.message).toBe('Error: User not found');
    });

    it('should return error if insufficient balance', async () => {
      const result = await service.p2pTransfer(
        sender.id,
        receiver.email,
        50000,
      );
      expect(result.message).toBe('Error: Insufficient balance');
    });

    it('should successfully transfer funds and create p2p record', async () => {
      const result = await service.p2pTransfer(sender.id, receiver.email, 2000);
      expect(result.message).toBe('Transfer successful');

      const senderBalance = await prisma.balance.findUnique({
        where: { userId: sender.id },
      });
      const receiverBalance = await prisma.balance.findUnique({
        where: { userId: receiver.id },
      });

      expect(senderBalance?.amount).toBe(8000); // 10000 - 2000
      expect(receiverBalance?.amount).toBe(7000); // 5000 + 2000

      const transfer = await prisma.p2pTransfer.findFirst({
        where: { fromUserId: sender.id, toUserId: receiver.id },
      });
      expect(transfer).toBeDefined();
      expect(transfer?.amount).toBe(2000);
    });

    it('should throw BadRequestException if amount is exactly 0', async () => {
      await expect(
        service.p2pTransfer(sender.id, receiver.email, 0),
      ).rejects.toThrow(BadRequestException);
    });

    it('should succeed if sender has exactly enough balance (boundary test)', async () => {
      // Need to reset sender balance because beforeEach didn't run since the last test if we aren't careful,
      // but beforeEach *does* run before every test. sender starts with 10000.
      const result = await service.p2pTransfer(
        sender.id,
        receiver.email,
        10000,
      );
      expect(result.message).toBe('Transfer successful');

      const senderBalance = await prisma.balance.findUnique({
        where: { userId: sender.id },
      });
      expect(senderBalance?.amount).toBe(0);
    });

    it('should return error if sender has 0 balance', async () => {
      await prisma.balance.update({
        where: { userId: sender.id },
        data: { amount: 0 },
      });
      const result = await service.p2pTransfer(sender.id, receiver.email, 1000);
      expect(result.message).toBe('Error: Insufficient balance');
    });

    it('should handle non-Error exceptions gracefully', async () => {
      jest
        .spyOn(prisma, '$transaction')
        .mockRejectedValueOnce('Some string error');
      const result = await service.p2pTransfer(sender.id, receiver.email, 1000);
      expect(result.message).toContain('Unexpected error: "Some string error"');
    });

    it('should prevent race conditions on concurrent transfers', async () => {
      // Setup sender with 1000 balance
      await prisma.balance.update({
        where: { userId: sender.id },
        data: { amount: 1000 },
      });

      // Fire two transfers of 1000 at the exact same time
      const results = await Promise.all([
        service.p2pTransfer(sender.id, receiver.email, 1000),
        service.p2pTransfer(sender.id, receiver.email, 1000),
      ]);

      // One should succeed, one should fail
      const successCount = results.filter(
        (r) => r.message === 'Transfer successful',
      ).length;
      const failCount = results.filter(
        (r) => r.message === 'Error: Insufficient balance',
      ).length;

      expect(successCount).toBe(1);
      expect(failCount).toBe(1);

      const senderBalance = await prisma.balance.findUnique({
        where: { userId: sender.id },
      });
      expect(senderBalance?.amount).toBe(0);
    });
  });
});
