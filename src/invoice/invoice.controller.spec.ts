
import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';

describe('InvoiceController', () => {
  let controller: InvoiceController;
  let service: InvoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        {
          provide: InvoiceService,
          useValue: {
            createInvoice: jest.fn(),
            getInvoiceById: jest.fn(),
            listInvoicesForBusiness: jest.fn(),
            sendInvoice: jest.fn(),
            getInvoicePdf: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<InvoiceController>(InvoiceController);
    service = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create', async () => {
    await controller.create({ /* DTO */ } as any);
    expect(service.createInvoice).toHaveBeenCalled();
  });

  it('should call getById', async () => {
    await controller.getById('invoiceId');
    expect(service.getInvoiceById).toHaveBeenCalledWith('invoiceId');
  });

  it('should call listForBusiness', async () => {
    await controller.listForBusiness('businessId');
    expect(service.listInvoicesForBusiness).toHaveBeenCalledWith('businessId');
  });

  it('should call send', async () => {
    await controller.send('invoiceId');
    expect(service.sendInvoice).toHaveBeenCalledWith('invoiceId');
  });

  it('should call getPdf', async () => {
    await controller.getPdf('invoiceId');
    expect(service.getInvoicePdf).toHaveBeenCalledWith('invoiceId');
  });
});
