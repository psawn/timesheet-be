import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { EntityManager } from 'typeorm';
import { UserLeaveBenefit } from './user-leave-benefit.entity';

@Injectable()
export class UserLeaveBenefitRepository extends TypeORMRepository<UserLeaveBenefit> {
  constructor(manager: EntityManager) {
    super(UserLeaveBenefit, manager);
  }
}
