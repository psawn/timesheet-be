import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { EntityManager } from 'typeorm';
import { LeaveBenefit } from './leave-benefit.entity';

@Injectable()
export class LeaveBenefitRepository extends TypeORMRepository<LeaveBenefit> {
  constructor(manager: EntityManager) {
    super(LeaveBenefit, manager);
  }
}
