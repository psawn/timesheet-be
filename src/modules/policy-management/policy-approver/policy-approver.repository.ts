import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { EntityManager } from 'typeorm';
import { PolicyApproves } from './policy-approver.entity';

@Injectable()
export class PolicyApproverRepository extends TypeORMRepository<PolicyApproves> {
  constructor(manager: EntityManager) {
    super(PolicyApproves, manager);
  }

  async addApprover(data: any[], policyCode: string) {
    await this.delete({ policyCode });
    const approvers = this.create(data);
    await this.insert(approvers);
  }
}
