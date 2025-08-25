import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from './entities/business.entity';
import { OnboardBusinessDto } from './dto/onboard-business.dto';
import { KycStatus } from './enum/kyc-status.enum';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

async onboardBusiness(onboardingDto: OnboardBusinessDto, userId: string) {
  const exists = await this.businessRepository.findOne({
    where: { rcNumber: onboardingDto.rcNumber },
  });
  if (exists) {
    throw new Error('Business with this RC number already exists');
  }

  const business = this.businessRepository.create({
    ...onboardingDto,
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
