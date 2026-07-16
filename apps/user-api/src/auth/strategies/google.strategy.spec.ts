import { Test, TestingModule } from '@nestjs/testing';
import { GoogleStrategy } from './google.strategy';
import { AuthService } from '../auth.service';

describe('GoogleStrategy', () => {
  let strategy: GoogleStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    process.env.GOOGLE_CLIENT_ID = 'mock-client-id';
    process.env.GOOGLE_CLIENT_SECRET = 'mock-client-secret';

    const mockAuthService = {
      validateGoogleUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleStrategy,
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    strategy = module.get<GoogleStrategy>(GoogleStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  describe('validate', () => {
    it('should extract email, name, googleId from profile and call validateGoogleUser', async () => {
      const profile = {
        id: 'google-id-123',
        name: {
          givenName: 'John',
          familyName: 'Doe',
        },
        emails: [{ value: 'john.doe@example.com' }],
      };

      const mockDbUser = { id: 1, email: 'john.doe@example.com' };
      jest
        .spyOn(authService, 'validateGoogleUser')
        .mockResolvedValue(mockDbUser);

      const doneCallback = jest.fn();

      await strategy.validate(
        'access_token',
        'refresh_token',
        profile,
        doneCallback,
      );

      expect(authService.validateGoogleUser).toHaveBeenCalledWith({
        email: 'john.doe@example.com',
        name: 'John Doe',
        googleId: 'google-id-123',
      });
      expect(doneCallback).toHaveBeenCalledWith(null, mockDbUser);
    });

    it('should handle missing familyName in profile gracefully', async () => {
      const profile = {
        id: 'google-id-456',
        name: {
          givenName: 'Jane',
        },
        emails: [{ value: 'jane@example.com' }],
      };

      const mockDbUser = { id: 2, email: 'jane@example.com' };
      jest
        .spyOn(authService, 'validateGoogleUser')
        .mockResolvedValue(mockDbUser);

      const doneCallback = jest.fn();

      await strategy.validate(
        'access_token',
        'refresh_token',
        profile,
        doneCallback,
      );

      expect(authService.validateGoogleUser).toHaveBeenCalledWith({
        email: 'jane@example.com',
        name: 'Jane ', // Since familyName is missing, it falls back to empty string
        googleId: 'google-id-456',
      });
      expect(doneCallback).toHaveBeenCalledWith(null, mockDbUser);
    });
  });
});
