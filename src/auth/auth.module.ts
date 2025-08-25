import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailService } from '../email.service';
import { OtpService } from '../otp.service';
import { JwtService } from '../jwt.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule],
  providers: [AuthService, EmailService, OtpService, JwtService, ConfigService, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}