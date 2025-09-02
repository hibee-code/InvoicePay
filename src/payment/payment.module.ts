import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VirtualAccount } from './entities/virtual-account.entity';
import { PaymentService } from './payment.service';
import { WalletModule } from '../wallet/wallet.module';
import { PaymentController } from './payment.controller';
import { HttpModule } from '@nestjs/axios';
import { Invoice } from '../invoice/entities/invoice.entity';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    TypeOrmModule.forFeature([VirtualAccount, Invoice]),
    WalletModule,
    HttpModule,
    ConfigModule,
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}

