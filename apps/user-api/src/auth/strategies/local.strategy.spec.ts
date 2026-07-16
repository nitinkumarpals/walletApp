import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      validateUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  describe('validate', () => {
    it('should return user object if credentials are valid', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);

      const result = await strategy.validate('test@example.com', 'password');
      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password',
      );
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      await expect(
        strategy.validate('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'wrongpassword',
      );
    });
  });
});
