import { Controller, Get, Param } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get(':businessId')
  async getWallet(@Param('businessId') businessId: string) {
    return this.walletService.getWallet(businessId);
  }

  @Get('transactions/:walletId')
  async getTransactions(@Param('walletId') walletId: string) {
    return this.walletService.getTransactions(walletId);
  }
}
