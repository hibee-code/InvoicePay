import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^[0-9]{10,15}$/, {
    message: 'Phone number must be between 10 and 15 digits',
  })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}