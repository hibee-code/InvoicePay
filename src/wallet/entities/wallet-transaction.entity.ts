import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { TransactionType } from '../enum/type.enum';
import { TransactionStatus } from '../enum/status.enum';
import { Wallet } from './wallet.entity';

@Entity()
export class WalletTransaction {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'bigint' })
  walletId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number; 

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'varchar', length: 100, unique: true })
  ref: string;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  //relationship

  @ManyToOne(() => Wallet, wallet => wallet.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'walletId' })
  wallet: Wallet;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
