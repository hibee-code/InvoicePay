import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpService {
  generateOtp(length = 6): string {
    return Math.random().toString().slice(2, 2 + length);
  }

  async sendOtp(phone: string, otp: string) {
    // TODO: Integrate with SMS provider
    console.log(`Sending OTP ${otp} to phone ${phone}`);
    return true;
  }
} 