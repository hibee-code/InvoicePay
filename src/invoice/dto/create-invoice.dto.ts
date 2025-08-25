import { IsNotEmpty, IsString, IsNumber, IsDateString, IsEmail } from 'class-validator';

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsString()
  businessId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsDateString()
  dueDate: string;

  @IsEmail()
  recipientEmail: string;
}
