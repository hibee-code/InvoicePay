import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/database/db.config';
import { BusinessModule } from './business/business.module';
import { InvoiceModule } from './invoice/invoice.module';
import { EmailModule } from './email/email.module';
import { JwtModule } from './jwt/jwt.module';
import { OtpModule } from './otp/otp.module';
import { PaymentModule } from './payment/payment.module';
import { WalletModule } from './wallet/wallet.module';
import { AuditModule } from './audit/audit.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { RateLimitGuard } from './common/rate-limit/rate-limit.guard';
import { PrometheusMetrics } from './common/monitoring/prometheus-metrics';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 👈 makes ConfigService available everywhere
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UserModule,
    BusinessModule,
    InvoiceModule,
    EmailModule,
    JwtModule,
    OtpModule,
    PaymentModule,
    WalletModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrometheusMetrics,
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_GUARD, useClass: RateLimitGuard },
  ],
})
export class AppModule {}

