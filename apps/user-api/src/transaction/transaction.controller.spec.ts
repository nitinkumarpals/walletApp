import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { AuthGuard } from '@nestjs/passport';

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

  beforeEach(async () => {
    const mockTransactionService = {
      getTransactions: jest.fn(),
      getAnalytics: jest.fn(),
      getP2pCount: jest.fn(),
      getP2pRecipients: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTransactions', () => {
    it('should call getTransactions on service', async () => {
      const mockReq = { user: { id: 1 } };
      await controller.getTransactions(mockReq);
      expect(service.getTransactions).toHaveBeenCalledWith(1);
    });
  });

  describe('getAnalytics', () => {
    it('should call getAnalytics on service', async () => {
      const mockReq = { user: { id: 1 } };
      await controller.getAnalytics(mockReq);
      expect(service.getAnalytics).toHaveBeenCalledWith(1);
    });
  });

  describe('getP2pCount', () => {
    it('should call getP2pCount on service', async () => {
      const mockReq = { user: { id: 1 } };
      await controller.getP2pCount(mockReq);
      expect(service.getP2pCount).toHaveBeenCalledWith(1);
    });
  });

  describe('getP2pRecipients', () => {
    it('should call getP2pRecipients on service', async () => {
      const mockReq = { user: { id: 1 } };
      await controller.getP2pRecipients(mockReq);
      expect(service.getP2pRecipients).toHaveBeenCalledWith(1);
    });
  });
});
