import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtService {
  private readonly secret: jwt.Secret;
  private readonly expiresIn: string | number;

  constructor(private readonly configService: ConfigService) {
    this.secret = this.configService.get<string>('SECRET', 'changeme');
    this.expiresIn = this.configService.get<string>('EXPIRES_IN') || '24h';
  }

  sign(payload: any): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    } as jwt.SignOptions); // explicitly cast the options
  }

  verify(token: string): any {
    return jwt.verify(token, this.secret);
  }
}
