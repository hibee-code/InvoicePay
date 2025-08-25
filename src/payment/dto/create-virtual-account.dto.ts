import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVirtualAccountDto {
  @IsNotEmpty()
  @IsString()
  businessId: string;

  @IsNotEmpty()
  @IsString()
  bankName: string;
}
