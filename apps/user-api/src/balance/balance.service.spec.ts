import { Test, TestingModule } from '@nestjs/testing';
import { BalanceService } from './balance.service';
import { PrismaService } from '../prisma/prisma.service';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

describe('BalanceService', () => {
  let service: BalanceService;
  let prisma: PrismaService;
  let testUser: any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BalanceService, PrismaService],
    }).compile();

    service = module.get<BalanceService>(BalanceService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // Clean DB
    await prisma.p2pTransfer.deleteMany();
    await prisma.onRampTransaction.deleteMany();
    await prisma.balance.deleteMany();
    await prisma.user.deleteMany();

    // Create test user
    testUser = await prisma.user.create({
      data: {
        email: 'balance_test@example.com',
        name: 'Balance Test',
        number: '4445556666',
        password: 'hash',
        balance: {
          create: { amount: 150000, locked: 20000 },
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return null if balance not found', async () => {
    const result = await service.getBalance(9999);
    expect(result).toEqual({ amount: 0, locked: 0 });
  });

  it('should return balance and locked amounts for user', async () => {
    const result = await service.getBalance(testUser.id);
    expect(result).toBeDefined();
    expect(result.amount).toBe(150000);
    expect(result.locked).toBe(20000);
  });

  it('should return {amount: 0, locked: 0} if user balance is explicitly 0', async () => {
    // Empty the balance
    await prisma.balance.update({
      where: { userId: testUser.id },
      data: { amount: 0, locked: 0 },
    });

    const result = await service.getBalance(testUser.id);
    expect(result.amount).toBe(0);
    expect(result.locked).toBe(0);
  });
});
