import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
  }

  async sendEmail(to: string, subject: string, text: string) {
    const msg = {
      to,
      from: {
        email: process.env.FROM_EMAIL || 'noreply@invoicepay.com',
        name: process.env.FROM_NAME || 'InvoicePay',
      },
      subject,
      text,
    };
    try {
      await sgMail.send(msg);
      return true;
    } catch (err) {
      console.error('SendGrid error:', err);
      return false;
    }
  }
} 