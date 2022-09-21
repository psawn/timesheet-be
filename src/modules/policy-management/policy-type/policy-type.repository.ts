import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { EntityManager } from 'typeorm';
import { PolicyType } from './policy-type.entity';

@Injectable()
export class PolicyTypeRepository extends TypeORMRepository<PolicyType> {
  constructor(manager: EntityManager) {
    super(PolicyType, manager);
  }
}
