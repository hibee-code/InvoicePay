import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly secret: string;
  private readonly expiresIn: string | number;

  constructor(private readonly configService: ConfigService) {
    this.secret = this.configService.get<string>('JWT_SECRET', 'changeme');
    const expiresInConfig = this.configService.get<string>('JWT_EXPIRES_IN');
    // If expiresInConfig is a number string, use as number, else as string, fallback to '24h'
    this.expiresIn = expiresInConfig && !isNaN(Number(expiresInConfig))
      ? Number(expiresInConfig)
      : expiresInConfig || '24h';
  }

  sign(payload: any) {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verify(token: string) {
    return jwt.verify(token, this.secret);
  }
} 