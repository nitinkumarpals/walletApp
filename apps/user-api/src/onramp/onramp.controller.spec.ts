import { Test, TestingModule } from '@nestjs/testing';
import { OnrampController } from './onramp.controller';
import { OnrampService, OnRampStatusEnum } from './onramp.service';
import { AuthGuard } from '@nestjs/passport';

describe('OnrampController', () => {
  let controller: OnrampController;
  let service: OnrampService;

  beforeEach(async () => {
    const mockOnrampService = {
      createRazorpayOrder: jest
        .fn()
        .mockResolvedValue({ success: true, order: { id: 'order_123' } }),
      createOnrampTransaction: jest
        .fn()
        .mockResolvedValue({ success: true, message: 'added' }),
      getOnrampHistory: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnrampController],
      providers: [
        {
          provide: OnrampService,
          useValue: mockOnrampService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<OnrampController>(OnrampController);
    service = module.get<OnrampService>(OnrampService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOnrampTransaction', () => {
    it('should call service methods to create order and transaction', async () => {
      const mockReq = { user: { id: 1 } };
      const body = {
        amount: 5000,
        provider: 'HDFC',
        status: OnRampStatusEnum.Processing,
        token: 'order_123',
      };

      const result = await controller.createOnrampTransaction(mockReq, body);

      expect(service.createOnrampTransaction).toHaveBeenCalledWith(
        1,
        5000,
        'Processing',
        'HDFC',
        'order_123',
      );
      expect(result).toEqual({ message: 'added', success: true });
    });
  });

  describe('getOnrampHistory', () => {
    it('should call getOnrampHistory on service', async () => {
      const mockReq = { user: { id: 1 } };
      const result = await controller.getOnrampHistory(mockReq);
      expect(service.getOnrampHistory).toHaveBeenCalledWith(1);
      expect(result).toEqual([]);
    });
  });
});
