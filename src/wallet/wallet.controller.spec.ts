
import { Test, TestingModule } from '@nestjs/testing';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

describe('WalletController', () => {
  let controller: WalletController;
  let service: WalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [
        {
          provide: WalletService,
          useValue: {
            getWallet: jest.fn(),
            getTransactions: jest.fn(),
            // ...mock other methods
          },
        },
      ],
    }).compile();

    controller = module.get<WalletController>(WalletController);
    service = module.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getWallet', async () => {
    await controller.getWallet('businessId');
    expect(service.getWallet).toHaveBeenCalledWith('businessId');
  });

  it('should call getTransactions', async () => {
    await controller.getTransactions('walletId');
    expect(service.getTransactions).toHaveBeenCalledWith('walletId');
  });
});
