import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {}

async log(userId: string, action: string, details?: any) {
  const log = this.auditRepository.create({
    user: { id: userId } as User,
    action,
    details,
  });
  return this.auditRepository.save(log);
  }
}
