import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  describe('validate', () => {
    it('should extract id, email, number from payload', async () => {
      const payload = { sub: 1, email: 'test@example.com', number: '123' };
      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        number: '123',
      });
    });
  });

  describe('cookie extractor', () => {
    it('should extract token from Authentication cookie', () => {
      // Access the protected extractor function through the options object passed to super()
      const extractor = (strategy as any)._jwtFromRequest;
      const req = { cookies: { Authentication: 'test-token' } } as any;
      const token = extractor(req);

      expect(token).toBe('test-token');
    });

    it('should return null if Authentication cookie is missing', () => {
      const extractor = (strategy as any)._jwtFromRequest;
      const req = { cookies: {} } as any;
      const token = extractor(req);

      expect(token).toBeNull();
    });

    it('should return null if cookies are missing on request', () => {
      const extractor = (strategy as any)._jwtFromRequest;
      const req = {} as any;
      const token = extractor(req);

      expect(token).toBeNull();
    });
  });
});
