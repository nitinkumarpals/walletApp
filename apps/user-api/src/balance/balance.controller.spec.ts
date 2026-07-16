import { Test, TestingModule } from '@nestjs/testing';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { AuthGuard } from '@nestjs/passport';

describe('BalanceController', () => {
  let controller: BalanceController;
  let service: BalanceService;

  beforeEach(async () => {
    const mockBalanceService = {
      getBalance: jest.fn().mockResolvedValue({ amount: 100, locked: 20 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BalanceController],
      providers: [
        {
          provide: BalanceService,
          useValue: mockBalanceService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<BalanceController>(BalanceController);
    service = module.get<BalanceService>(BalanceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getBalance on service', async () => {
    const mockReq = { user: { id: 1 } };
    const result = await controller.getBalance(mockReq);
    expect(service.getBalance).toHaveBeenCalledWith(1);
    expect(result).toEqual({ amount: 100, locked: 20 });
  });
});
