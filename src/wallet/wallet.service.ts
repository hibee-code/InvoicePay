import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletTransaction } from './entities/wallet-transaction.entity';
import { TransactionStatus } from './enum/status.enum';
import { TransactionType } from './enum/type.enum';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(WalletTransaction)
    private readonly transactionRepository: Repository<WalletTransaction>,
  ) {}

  async getWallet(businessId: string) {
    return this.walletRepository.findOne({ where: { businessId } });
  }

  async getTransactions(walletId: string) {
    return this.transactionRepository.find({ where: { walletId } });
  }

  async creditWallet(businessId: string, amount: number, ref: string) {
    let wallet = await this.getWallet(businessId);
    if (!wallet) {
      wallet = this.walletRepository.create({ businessId, balance: 0 });
    }
    wallet.balance += amount;
    await this.walletRepository.save(wallet);
    const transaction = this.transactionRepository.create({
      walletId: wallet.id,
      amount,
      type: TransactionType.CREDIT,
      status: TransactionStatus.SUCCESS,
      ref,
    });
    await this.transactionRepository.save(transaction);
    return wallet;
  }

  async debitWallet(businessId: string, amount: number, ref: string) {
    const wallet = await this.getWallet(businessId);
    if (!wallet || wallet.balance < amount) throw new Error('Insufficient balance');
    wallet.balance -= amount;
    await this.walletRepository.save(wallet);
    const transaction = this.transactionRepository.create({
      walletId: wallet.id,
      amount,
      type: TransactionType.CREDIT,
      status: TransactionStatus.SUCCESS,
      ref,
    });
    await this.transactionRepository.save(transaction);
    return wallet;
  }
}
