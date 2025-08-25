import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceStatus } from './enum/invoice-enum.enum';
import { EmailService } from '../email/email.service';
import { PdfService } from './pdf.service';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    private readonly emailService: EmailService,
    private readonly pdfService: PdfService,
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
    const invoice = await this.getInvoiceById(id);
    if (!invoice) throw new Error('Invoice not found');
    invoice.status = InvoiceStatus.SENT;
    await this.invoiceRepository.save(invoice);
    // Generate PDF
    const pdfBuffer = await this.pdfService.generateInvoicePdf(invoice);
    // Send email with PDF attachment
    await this.emailService.sendEmail(
      invoice.recipientEmail,
      'Your Invoice',
      `Please find your invoice attached.`,
      pdfBuffer
    );
    return { success: true, message: 'Invoice sent', invoice };
  }

  async getInvoicePdf(id: string) {
    const invoice = await this.getInvoiceById(id);
    if (!invoice) throw new Error('Invoice not found');
    const pdfBuffer = await this.pdfService.generateInvoicePdf(invoice);
    return pdfBuffer;
  }
}
