import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletTransaction } from './entities/wallet-transaction.entity';
import { TransactionStatus } from './enum/status.enum';
import { TransactionType } from './enum/type.enum';
import { AuditService } from 'src/audit/audit.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(WalletTransaction)
    private readonly transactionRepository: Repository<WalletTransaction>,
    private readonly dataSource: DataSource,
    private readonly auditService: AuditService,
  ) {}

  async getWallet(businessId: string) {
    return this.walletRepository.findOne({ where: { businessId } });
  }

  async getTransactions(walletId: string) {
    return this.transactionRepository.find({ where: { walletId } });
  }

  async creditWallet(businessId: string, amount: number, ref: string, userId?: string) {
    return await this.dataSource.transaction(async manager => {
      let wallet = await manager.findOne(Wallet, { where: { businessId } });
      if (!wallet) {
        wallet = manager.create(Wallet, { businessId, balance: 0 });
      }
      wallet.balance += amount;
      await manager.save(wallet);
      const transaction = manager.create(WalletTransaction, {
        walletId: wallet.id,
        amount,
        type: TransactionType.CREDIT,
        status: TransactionStatus.SUCCESS,
        ref,
      });
      await manager.save(transaction);
      if (userId) {
        await this.auditService.log(userId, 'credit_wallet', { businessId, amount, ref });
      }
      return wallet;
    });
  }

  async debitWallet(businessId: string, amount: number, ref: string, userId?: string) {
    return await this.dataSource.transaction(async manager => {
      const wallet = await manager.findOne(Wallet, { where: { businessId } });
      if (!wallet || wallet.balance < amount) throw new Error('Insufficient balance');
      wallet.balance -= amount;
      await manager.save(wallet);
      const transaction = manager.create(WalletTransaction, {
        walletId: wallet.id,
        amount,
        type: TransactionType.DEBIT,
        status: TransactionStatus.SUCCESS,
        ref,
      });
      await manager.save(transaction);
      if (userId) {
        await this.auditService.log(userId, 'debit_wallet', { businessId, amount, ref });
      }
      return wallet;
    });
  }
}
