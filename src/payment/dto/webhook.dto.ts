import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class PaymentWebhookDto {
  @IsNotEmpty()
  @IsString()
  invoiceId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsString()
  providerRef?: string;
}
