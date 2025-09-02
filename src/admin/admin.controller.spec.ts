import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            approveWithdrawal: jest.fn(),
            rejectWithdrawal: jest.fn(),
            // ...mock other methods
          },
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call approveWithdrawal', async () => {
    await controller.approveWithdrawal('withdrawalId', 'adminId');
    expect(service.approveWithdrawal).toHaveBeenCalledWith('withdrawalId', 'adminId');
  });

  it('should call rejectWithdrawal', async () => {
    await controller.rejectWithdrawal('withdrawalId', 'adminId', 'reason');
    expect(service.rejectWithdrawal).toHaveBeenCalledWith('withdrawalId', 'adminId', 'reason');
  });
});
