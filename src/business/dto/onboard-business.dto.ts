import { IsNotEmpty, IsString } from 'class-validator';

export class OnboardBusinessDto {
  @IsNotEmpty()
  @IsString()
  businessName: string;

  @IsNotEmpty()
  @IsString()
  rcNumber: string;
}
