import { Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VirtualAccount } from './entities/virtual-account.entity';
import { CreateVirtualAccountDto } from './dto/create-virtual-account.dto';
import { PaymentWebhookDto } from './dto/webhook.dto';
import { ConfigService } from '@nestjs/config';
import { Invoice } from '../invoice/entities/invoice.entity';
import { WalletService } from '../wallet/wallet.service';
import { InvoiceStatus } from '../invoice/enum/invoice-enum.enum';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs'; 

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(VirtualAccount)
    private readonly virtualAccountRepository: Repository<VirtualAccount>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    private readonly walletService: WalletService,
  ) {}
async createVirtualAccount(VirtualAccountDto: CreateVirtualAccountDto) {
  const url = this.configService.get<string>('INTERSWITCH_VBA_URL');
  const clientId = this.configService.get<string>('INTERSWITCH_CLIENT_ID');
  const clientSecret = this.configService.get<string>('INTERSWITCH_CLIENT_SECRET');

  if (!url || !clientId || !clientSecret) {
    throw new Error('Interswitch configuration missing in environment variables');
  }

  const payload = {
    businessId: VirtualAccountDto.businessId,
    bankName: VirtualAccountDto.bankName,
  };

  const response = await firstValueFrom(
    this.httpService.post(url, payload, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    }),
  );

  const { accountNumber, providerRef } = response.data;

  const virtualAccount = this.virtualAccountRepository.create({
    ...VirtualAccountDto,
    accountNumber,
    providerRef,
  });

  await this.virtualAccountRepository.save(virtualAccount);

  return virtualAccount;
  }

  async handleWebhook(dto: PaymentWebhookDto, headers?: any) {
    // Validate webhook signature/secret
    const expectedSecret = this.configService.get<string>('INTERSWITCH_WEBHOOK_SECRET');
    const receivedSecret = headers?.['x-webhook-secret'] || headers?.['X-Webhook-Secret'];
    if (!receivedSecret || receivedSecret !== expectedSecret) {
      throw new Error('Invalid webhook secret');
    }
    // Find invoice
    const invoice = await this.invoiceRepository.findOne({ where: { id: dto.invoiceId } });
    if (!invoice) throw new Error('Invoice not found');
    // Map status to InvoiceStatus enum
    let mappedStatus: InvoiceStatus;
    switch (dto.status.toLowerCase()) {
      case 'paid':
        mappedStatus = InvoiceStatus.PAID;
        break;
      case 'sent':
        mappedStatus = InvoiceStatus.SENT;
        break;
      case 'overdue':
        mappedStatus = InvoiceStatus.OVERDUE;
        break;
      case 'cancelled':
        mappedStatus = InvoiceStatus.CANCELLED;
        break;
      default:
        mappedStatus = InvoiceStatus.DRAFT;
    }
    invoice.status = mappedStatus;
    await this.invoiceRepository.save(invoice);
    // Credit wallet if payment successful
    if (mappedStatus === InvoiceStatus.PAID) {
      await this.walletService.creditWallet(invoice.businessId, dto.amount, dto.providerRef || 'webhook');
    }
    return { success: true };
  }
}
