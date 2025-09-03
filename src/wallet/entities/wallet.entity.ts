import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { WalletTransaction } from './wallet-transaction.entity';
import { Business } from '../../business/entities/business.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'bigint' })
  businessId: string;

  @Column({ type: 'float', default: 0 })
  balance: number;
  
  //relationship
  @OneToMany(() => WalletTransaction, (transaction) => transaction.wallet, {
  cascade: true,
  })
  transactions: WalletTransaction[];

  @OneToOne(() => Business, business => business.wallet)
  business: Business;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
