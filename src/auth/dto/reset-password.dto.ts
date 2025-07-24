export class ResetPasswordDto {
  email?: string;
  phone?: string;
  otp: string;
  newPassword: string;
} 