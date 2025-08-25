import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateVirtualAccountDto } from './dto/create-virtual-account.dto';
import { PaymentWebhookDto } from './dto/webhook.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('virtual-account')
  async createVirtualAccount(@Body() dto: CreateVirtualAccountDto) {
    return this.paymentService.createVirtualAccount(dto);
  }

  @Post('webhook')
  async handleWebhook(@Body() dto: PaymentWebhookDto) {
    return this.paymentService.handleWebhook(dto);
  }
}
