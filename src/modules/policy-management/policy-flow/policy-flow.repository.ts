import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { EntityManager } from 'typeorm';
import { PolicyFlow } from './policy-flow.entity';

@Injectable()
export class PolicyFlowRepository extends TypeORMRepository<PolicyFlow> {
  constructor(manager: EntityManager) {
    super(PolicyFlow, manager);
  }
}
