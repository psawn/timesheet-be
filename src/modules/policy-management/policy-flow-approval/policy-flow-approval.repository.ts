import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { EntityManager } from 'typeorm';
import { PolicyFlowApproval } from './policy-flow-approval.entity';

@Injectable()
export class PolicyApproverRepository extends TypeORMRepository<PolicyFlowApproval> {
  constructor(manager: EntityManager) {
    super(PolicyFlowApproval, manager);
  }
}
