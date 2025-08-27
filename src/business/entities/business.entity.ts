import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { KycStatus } from '../enum/kyc-status.enum';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { VirtualAccount } from 'src/payment/entities/virtual-account.entity';
import { User } from 'src/user/entities/user.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';

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

  // relationship

  @OneToMany(() => Invoice, invoice => invoice.business)
invoices: Invoice[];

@OneToMany(() => VirtualAccount, va => va.business)
virtualAccounts: VirtualAccount[];

@OneToOne(() => Wallet, wallet => wallet.business)
wallet: Wallet;

@ManyToOne(() => User, user => user.businesses)
owner: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
