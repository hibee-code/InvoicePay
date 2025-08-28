import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { Business } from '../business/entities/business.entity';
import { WithdrawalRequest } from '../wallet/entities/withdrawal-request.entity';
import axios from 'axios';
import { KycStatus } from 'src/business/enum/kyc-status.enum';

@Injectable()
export class AdminService {
  // Approve withdrawal and trigger transfer API
  async approveWithdrawal(id: string, adminId: string) {
    const withdrawal = await this.withdrawalRepository.findOne({ where: { id } });
    if (!withdrawal || withdrawal.status !== 'pending') throw new Error('Invalid withdrawal request');
    withdrawal.status = 'approved';
    await this.withdrawalRepository.save(withdrawal);
    // Call external transfer API (e.g., Interswitch)
    const transferUrl = process.env.INTERSWITCH_TRANSFER_URL;
    const clientId = process.env.INTERSWITCH_CLIENT_ID;
    const clientSecret = process.env.INTERSWITCH_CLIENT_SECRET;
    if (!transferUrl || !clientId || !clientSecret) throw new Error('Missing transfer API credentials');
    const payload = {
      amount: withdrawal.amount,
      bankDetails: withdrawal.bankDetails,
      businessId: withdrawal.businessId,
      ref: withdrawal.id,
    };
    const response = await axios.post(transferUrl, payload, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });
    // Log approval
    await this.auditRepository.save(this.auditRepository.create({
      userId: adminId,
      action: 'approve_withdrawal',
      details: { withdrawalId: id, transferResponse: response.data },
    }));
    return { success: true, transfer: response.data };
  }

  // Reject withdrawal
  async rejectWithdrawal(id: string, adminId: string, reason?: string) {
    const withdrawal = await this.withdrawalRepository.findOne({ where: { id } });
    if (!withdrawal || withdrawal.status !== 'pending') throw new Error('Invalid withdrawal request');
    withdrawal.status = 'rejected';
    await this.withdrawalRepository.save(withdrawal);
    await this.auditRepository.save(this.auditRepository.create({
      userId: adminId,
      action: 'reject_withdrawal',
      details: { withdrawalId: id, reason },
    }));
    return { success: true };
  }
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(WithdrawalRequest)
    private readonly withdrawalRepository: Repository<WithdrawalRequest>,
  ) {}

  // System logs (audit)
  async getSystemLogs() {
    return this.auditRepository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  // All businesses
  async getAllBusinesses() {
    return this.businessRepository.find({ relations: ['owner', 'wallet', 'invoices', 'virtualAccounts'] });
  }

  // Suspend business
  async suspendBusiness(id: string) {
    const business = await this.businessRepository.findOne({ where: { id } });
    if (!business) throw new Error('Business not found');
    business.kycStatus = KycStatus.SUSPENDED;
    await this.businessRepository.save(business);
    await this.auditRepository.save(this.auditRepository.create({
      userId: business.userId,
      action: 'suspend_business',
      details: { businessId: id },
    }));
    return { success: true };
  }

  // Reactivate business
  async reactivateBusiness(id: string) {
    const business = await this.businessRepository.findOne({ where: { id } });
    if (!business) throw new Error('Business not found');
    business.kycStatus = KycStatus.ACTIVE;
    await this.businessRepository.save(business);
    await this.auditRepository.save(this.auditRepository.create({
      userId: business.userId,
      action: 'reactivate_business',
      details: { businessId: id },
    }));
    return { success: true };
  }

  // Monitor withdrawal requests
  async getWithdrawalRequests(status?: string) {
    const where = status ? { status } : {};
    return this.withdrawalRepository.find({ where, order: { createdAt: 'DESC' }, take: 100 });
  }
}
