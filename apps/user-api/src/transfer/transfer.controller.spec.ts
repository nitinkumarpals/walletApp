import { Test, TestingModule } from '@nestjs/testing';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';
import { AuthGuard } from '@nestjs/passport';

describe('TransferController', () => {
  let controller: TransferController;
  let service: TransferService;

  beforeEach(async () => {
    const mockTransferService = {
      p2pTransfer: jest.fn().mockResolvedValue({ message: 'Success' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferController],
      providers: [
        {
          provide: TransferService,
          useValue: mockTransferService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TransferController>(TransferController);
    service = module.get<TransferService>(TransferService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('p2pTransfer', () => {
    it('should call p2pTransfer on service', async () => {
      const mockReq = { user: { id: 1 } };
      const body = { email: '2222222222', amount: 500 };

      const result = await controller.p2pTransfer(mockReq, body);

      expect(service.p2pTransfer).toHaveBeenCalledWith(1, '2222222222', 500);
      expect(result).toEqual({ message: 'Success' });
    });
  });
});
