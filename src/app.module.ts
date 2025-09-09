import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
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
import { OtpModule } from './otp/otp.module';
import { PaymentModule } from './payment/payment.module';
import { WalletModule } from './wallet/wallet.module';
import { AuditModule } from './audit/audit.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { RateLimitGuard } from './common/rate-limit/rate-limit.guard';
import { LoggingMiddleware } from './common/middleware/logging.middleware';
import { PrometheusModule, makeCounterProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    CacheModule.register({ isGlobal: true }),

    // ✅ Prometheus setup
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true, // Node.js process metrics (CPU, memory, GC, etc.)
      },
    }),

    // ✅ App modules
    AuthModule,
    UserModule,
    BusinessModule,
    InvoiceModule,
    EmailModule,
    OtpModule,
    PaymentModule,
    WalletModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    // ✅ Prometheus custom metrics
    makeCounterProvider({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status'],
    }),
    makeHistogramProvider({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status'],
      buckets: [0.1, 0.5, 1, 2, 5],
    }),

    // ✅ Global providers
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_GUARD, useClass: RateLimitGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL }); // apply to all routes
  }
}
