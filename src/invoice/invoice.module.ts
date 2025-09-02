import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { EmailModule } from 'src/email/email.module';
import { PdfService } from './pdf.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice]),
    EmailModule,
  ],
  providers: [InvoiceService, PdfService],
  controllers: [InvoiceController],
  exports: [InvoiceService],
})
export class InvoiceModule {}




