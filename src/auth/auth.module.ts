import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthController } from './auth.controller';
import { EmailService } from '../email/email.service';

import { OtpModule } from '../otp/otp.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,   // used by registerAsync example below
    JwtModule.registerAsync({     // recommended: register using config service
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'supersecret',
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN', '1h') },
      }),
    }),
    OtpModule,
  ],
  providers: [
    AuthService,
    EmailService,
    JwtStrategy,
    JwtAuthGuard,
    // NOTE: OtpService should come from OtpModule. Do not provide OtpService here if OtpModule already provides & exports it.
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}