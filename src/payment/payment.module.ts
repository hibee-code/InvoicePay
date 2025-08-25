import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VirtualAccount } from './entities/virtual-account.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([VirtualAccount]), HttpModule],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
