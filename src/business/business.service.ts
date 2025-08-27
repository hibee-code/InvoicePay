import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from './entities/business.entity';
import { OnboardBusinessDto } from './dto/onboard-business.dto';
import { KycStatus } from './enum/kyc-status.enum';
import * as crypto from 'crypto';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

async onboardBusiness(onboardingDto: OnboardBusinessDto, userId: string) {
  // Placeholder for KYC/AML checks
  // TODO: Integrate with KYC provider or add business rules
  // Encrypt sensitive fields (e.g., rcNumber)
  const encrypt = (text: string) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.KYC_ENCRYPT_KEY || 'defaultkeydefaultkeydefaultkey12'), Buffer.alloc(16, 0));
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  };

  const exists = await this.businessRepository.findOne({
    where: { rcNumber: onboardingDto.rcNumber },
  });
  if (exists) {
    throw new Error('Business with this RC number already exists');
  }

  const business = this.businessRepository.create({
    ...onboardingDto,
    rcNumber: encrypt(onboardingDto.rcNumber),
    kycStatus: KycStatus.PENDING,
    userId,
  });

  await this.businessRepository.save(business);
  return business;
}

  async getBusinessProfile(id: string) {
    return this.businessRepository.findOne({ where: { id } });
  }
}
