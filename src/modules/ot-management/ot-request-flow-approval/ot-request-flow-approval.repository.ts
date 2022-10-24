import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { EntityManager } from 'typeorm';
import { OtRequestFlowApproval } from './ot-request-flow-approval.entity';

@Injectable()
export class OtRequestFlowApprovalRepository extends TypeORMRepository<OtRequestFlowApproval> {
  constructor(manager: EntityManager) {
    super(OtRequestFlowApproval, manager);
  }
}
