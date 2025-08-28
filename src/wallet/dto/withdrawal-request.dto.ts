import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class WithdrawalRequestDto {
  @IsNotEmpty()
  @IsString()
  businessId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  bankDetails: string;
}
