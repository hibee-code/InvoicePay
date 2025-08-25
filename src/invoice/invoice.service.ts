import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceStatus } from './enum/invoice-enum.enum';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  async createInvoice(invoiceDto: CreateInvoiceDto) {
    const invoice = this.invoiceRepository.create({
      ...invoiceDto,
      dueDate: new Date(invoiceDto.dueDate),
      status: InvoiceStatus.DRAFT,
    });
    await this.invoiceRepository.save(invoice);
    return invoice;
  }

  async getInvoiceById(id: string) {
    return this.invoiceRepository.findOne({ where: { id } });
  }

  async listInvoicesForBusiness(businessId: string) {
    return this.invoiceRepository.find({ where: { businessId } });
  }

  async sendInvoice(id: string) {
    // TODO: Integrate with email service
    const invoice = await this.getInvoiceById(id);
    if (!invoice) throw new Error('Invoice not found');
    invoice.status = InvoiceStatus.SENT;
    await this.invoiceRepository.save(invoice);
    // Simulate sending email
    return { success: true, message: 'Invoice sent', invoice };
  }

  async getInvoicePdf(id: string) {
    // TODO: Integrate with PDF generation
    const invoice = await this.getInvoiceById(id);
    if (!invoice) throw new Error('Invoice not found');
    // Simulate PDF URL
    invoice.pdfUrl = `https://example.com/invoice/${id}.pdf`;
    await this.invoiceRepository.save(invoice);
    return { pdfUrl: invoice.pdfUrl };
  }
}
