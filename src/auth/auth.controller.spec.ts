import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
            // ...mock other methods
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call login', async () => {
    await controller.login({ email: 'test@example.com', password: 'pass' });
    expect(service.login).toHaveBeenCalled();
  });

  it('should call register', async () => {
    await controller.register({ email: 'test@example.com', password: 'pass', phone: '1234567890' });
    expect(service.register).toHaveBeenCalled();
  });

  // Add more controller tests here
});
