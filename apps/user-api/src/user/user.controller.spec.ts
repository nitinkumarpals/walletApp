import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { AuthGuard } from '@nestjs/passport';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user from request', () => {
      const mockReq = { user: { id: 1, email: 'test@example.com' } };
      const result = controller.getProfile(mockReq);
      expect(result).toEqual({ user: mockReq.user });
    });
  });
});
