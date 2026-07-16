import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      signUp: jest.fn().mockResolvedValue({ access_token: 'token' }),
      login: jest.fn().mockResolvedValue({ access_token: 'token' }),
    };

    const mockConfigService = {
      get: jest.fn().mockReturnValue('localhost'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should call signUp on service and set cookie with correct options', async () => {
      const dto = { email: 'test@example.com', password: 'pw', name: 'name' };
      const res = {
        cookie: jest.fn(),
        json: jest.fn(),
      } as any;

      process.env.NODE_ENV = 'development';

      const result = await controller.signUp(dto, res);

      expect(service.signUp).toHaveBeenCalledWith(dto);
      expect(res.cookie).toHaveBeenCalledWith('Authentication', 'token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });
      expect(result).toEqual(
        expect.objectContaining({ message: 'Signed up successfully' }),
      );
    });

    it('should set secure: true on cookie in production', async () => {
      process.env.NODE_ENV = 'production';
      const res = { cookie: jest.fn() } as any;
      await controller.signUp({}, res);
      expect(res.cookie).toHaveBeenCalledWith(
        'Authentication',
        'token',
        expect.objectContaining({ secure: true }),
      );
      process.env.NODE_ENV = 'test'; // restore
    });
  });

  describe('login', () => {
    it('should call login on service and set cookie', async () => {
      const mockReq = { user: { id: 1 } };
      const res = {
        cookie: jest.fn(),
        json: jest.fn(),
      } as any;

      const result = await controller.login(mockReq, res);

      expect(service.login).toHaveBeenCalledWith(mockReq.user);
      expect(res.cookie).toHaveBeenCalledWith(
        'Authentication',
        'token',
        expect.any(Object),
      );
      expect(result).toEqual(
        expect.objectContaining({ message: 'Logged in successfully' }),
      );
    });
  });

  describe('googleAuth', () => {
    it('should be a no-op method (guard handles redirect)', async () => {
      const result = await controller.googleAuth({});
      expect(result).toBeUndefined();
    });
  });

  describe('googleAuthRedirect', () => {
    it('should set cookie and redirect to frontend dashboard', async () => {
      const mockReq = { user: { id: 1 } };
      const res = {
        cookie: jest.fn(),
        redirect: jest.fn(),
      } as any;

      await controller.googleAuthRedirect(mockReq, res);

      expect(service.login).toHaveBeenCalledWith(mockReq.user);
      expect(res.cookie).toHaveBeenCalledWith(
        'Authentication',
        'token',
        expect.any(Object),
      );
      expect(res.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/dashboard',
      );
    });
  });

  describe('logout', () => {
    it('should clear cookie', async () => {
      const res = {
        clearCookie: jest.fn(),
        json: jest.fn(),
      } as any;

      const result = await controller.logout(res);

      expect(res.clearCookie).toHaveBeenCalledWith('Authentication');
      expect(result).toEqual({
        success: true,
        message: 'Logged out successfully',
      });
    });
  });
});
