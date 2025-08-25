import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  async create(@Body() dto: CreateInvoiceDto) {
    return this.invoiceService.createInvoice(dto);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.invoiceService.getInvoiceById(id);
  }

  @Get('business/:businessId')
  async listForBusiness(@Param('businessId') businessId: string) {
    return this.invoiceService.listInvoicesForBusiness(businessId);
  }

  @Post(':id/send')
  async send(@Param('id') id: string) {
    return this.invoiceService.sendInvoice(id);
  }

  @Get(':id/pdf')
  async getPdf(@Param('id') id: string) {
    return this.invoiceService.getInvoicePdf(id);
  }
}
