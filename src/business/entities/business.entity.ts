import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { KycStatus } from '../enum/kyc-status.enum';

@Entity()
export class Business {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({  type: 'varchar', unique: true })
  businessName: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  rcNumber: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  vbaAccountNumber: string;

  @Column({ type: 'enum', enum: KycStatus, default: KycStatus.PENDING })
  kycStatus: KycStatus;

  /// Foreign key

  @Column({ type: 'bigint' })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
