import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { EntityManager } from 'typeorm';
import { OtPolicyFlowApproval } from './ot-policy-flow-approval.entity';

@Injectable()
export class OtPolicyFlowApprovalRepository extends TypeORMRepository<OtPolicyFlowApproval> {
  constructor(manager: EntityManager) {
    super(OtPolicyFlowApproval, manager);
  }
}
