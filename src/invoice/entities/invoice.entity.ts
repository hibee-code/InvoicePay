import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { InvoiceStatus } from '../enum/invoice-enum.enum';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'bigint' })
  businessId: string;

 @Column({ type: 'decimal', transformer: {
  to: (value: number) => value,
  from: (value: string) => parseFloat(value),
}})
amount: number;

 @Column({ type: 'timestamptz', nullable: false })
  dueDate: Date;

 @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.DRAFT })
  status: InvoiceStatus;

 @Column({ type: 'varchar', nullable: true })
  recipientEmail: string;

 @Column({ type: 'varchar', length: 255, nullable: true })
  pdfUrl?: string;

 @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

 @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
