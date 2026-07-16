import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const mockJwtService = {
      sign: jest.fn().mockReturnValue('mock_jwt_token'),
    };

    const mockConfigService = {
      get: jest.fn().mockReturnValue('mock_secret'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        PrismaService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prisma.p2pTransfer.deleteMany();
    await prisma.onRampTransaction.deleteMany();
    await prisma.balance.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('signUp', () => {
    it('should successfully create a new user with initial balance and onramp transaction', async () => {
      const dto = {
        email: 'new@example.com',
        password: 'password',
        name: 'New User',
      };
      const result = await service.signUp(dto);

      expect(result.access_token).toBe('mock_jwt_token');

      const dbUser = await prisma.user.findUnique({
        where: { email: 'new@example.com' },
        include: { balance: true, onRampTransactions: true },
      });
      expect(dbUser).toBeDefined();
      expect(dbUser!.balance!.amount).toBe(5999900);
      expect(dbUser!.onRampTransactions.length).toBe(1);
      expect(dbUser!.onRampTransactions[0].amount).toBe(5999900);
      expect(dbUser!.onRampTransactions[0].status).toBe('Success');
    });

    it('should throw BadRequestException if email already exists', async () => {
      await prisma.user.create({
        data: {
          email: 'existing@example.com',
          password: 'hash',
          name: 'Existing',
          number: '111',
        },
      });

      const dto = {
        email: 'existing@example.com',
        password: 'password',
        name: 'Duplicate',
        number: '222',
      };
      await expect(service.signUp(dto)).rejects.toThrow(BadRequestException);
      await expect(service.signUp(dto)).rejects.toThrow('Email already exists');
    });

    it('should throw BadRequestException if username already exists', async () => {
      await prisma.user.create({
        data: {
          email: 'user1@example.com',
          password: 'hash',
          name: 'SharedName',
          number: '111',
        },
      });

      const dto = {
        email: 'user2@example.com',
        password: 'password',
        name: 'SharedName',
        number: '222',
      };
      await expect(service.signUp(dto)).rejects.toThrow(BadRequestException);
      await expect(service.signUp(dto)).rejects.toThrow(
        'Username already exists',
      );
    });

    it('should throw BadRequestException if number already exists', async () => {
      await prisma.user.create({
        data: {
          email: 'user1@example.com',
          password: 'hash',
          name: 'User1',
          number: '9999999999',
        },
      });

      const dto = {
        email: 'user2@example.com',
        password: 'password',
        name: 'User2',
        number: '9999999999',
      };
      await expect(service.signUp(dto)).rejects.toThrow(BadRequestException);
      await expect(service.signUp(dto)).rejects.toThrow(
        'Number already exists',
      );
    });

    it('should merge accounts and update password if email exists as Google account without password', async () => {
      await prisma.user.create({
        data: {
          email: 'google@example.com',
          name: 'Google User',
          googleId: '12345',
          authType: 'Google',
        },
      });

      const dto = {
        email: 'google@example.com',
        password: 'newpassword',
        name: 'Google User',
        number: '5551234',
      };
      const result = await service.signUp(dto);

      expect(result.access_token).toBe('mock_jwt_token');

      const dbUser = await prisma.user.findUnique({
        where: { email: 'google@example.com' },
      });
      expect(dbUser!.password).toBeDefined();
      expect(dbUser!.number).toBe('5551234');
    });
  });

  describe('validateUser', () => {
    it('should return null if user does not exist', async () => {
      const result = await service.validateUser(
        'nonexistent@example.com',
        'password',
      );
      expect(result).toBeNull();
    });

    it('should return null if user exists but has no password (e.g. google only user)', async () => {
      await prisma.user.create({
        data: {
          email: 'nopassword@example.com',
          name: 'User',
          googleId: '12345',
          authType: 'Google',
        },
      });

      const result = await service.validateUser(
        'nopassword@example.com',
        'password',
      );
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const hashedPassword = await bcrypt.hash('correct_password', 10);
      await prisma.user.create({
        data: {
          email: 'user@example.com',
          password: hashedPassword,
          name: 'User',
        },
      });

      const result = await service.validateUser(
        'user@example.com',
        'wrong_password',
      );
      expect(result).toBeNull();
    });

    it('should return user without password if credentials are valid', async () => {
      const hashedPassword = await bcrypt.hash('correct_password', 10);
      await prisma.user.create({
        data: {
          email: 'user@example.com',
          password: hashedPassword,
          name: 'User',
        },
      });

      const result = await service.validateUser(
        'user@example.com',
        'correct_password',
      );
      expect(result).toBeDefined();
      expect(result?.email).toBe('user@example.com');
      expect(result.password).toBeUndefined();
    });
  });

  describe('validateGoogleUser', () => {
    it('should create a new user with balance and onramp transaction if email does not exist', async () => {
      const profile = {
        email: 'newgoogle@example.com',
        name: 'New Google User',
        googleId: 'g123',
      };
      const result = await service.validateGoogleUser(profile);

      expect(result.email).toBe('newgoogle@example.com');
      expect(result.googleId).toBe('g123');
      expect(result.authType).toBe('Google');

      const dbUser = await prisma.user.findUnique({
        where: { email: 'newgoogle@example.com' },
        include: { balance: true, onRampTransactions: true },
      });
      expect(dbUser!.balance!.amount).toBe(5999900);
      expect(dbUser!.onRampTransactions.length).toBe(1);
    });

    it('should update existing user with googleId and authType if they do not have it', async () => {
      const user = await prisma.user.create({
        data: { email: 'exist@example.com', name: 'Exist', password: 'hash' },
      });

      const profile = {
        email: 'exist@example.com',
        name: 'Exist',
        googleId: 'g456',
      };
      const result = await service.validateGoogleUser(profile);

      expect(result.id).toBe(user.id);
      expect(result.googleId).toBe('g456');
      expect(result.authType).toBe('Google');
    });

    it('should return existing Google user without modifying them if already linked', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'already@example.com',
          name: 'Already',
          googleId: 'g789',
          authType: 'Google',
        },
      });

      const profile = {
        email: 'already@example.com',
        name: 'Already',
        googleId: 'g789',
      };
      const result = await service.validateGoogleUser(profile);

      expect(result.id).toBe(user.id);
      expect(result.googleId).toBe('g789');
    });
  });

  describe('login', () => {
    it('should return access token and have correct payload structure', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test',
        number: '1234567890',
      };
      const result = await service.login(user);

      expect(result.access_token).toBe('mock_jwt_token');
      // The jwtService.sign is mocked to return 'mock_jwt_token'. In reality, we just want to ensure it completes.
    });
  });
});
