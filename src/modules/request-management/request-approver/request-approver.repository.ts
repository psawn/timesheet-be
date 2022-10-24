import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { EntityManager } from 'typeorm';
import { RequestApprover } from './request-approver.entity';

@Injectable()
export class PolicyApproverRepository extends TypeORMRepository<RequestApprover> {
  constructor(manager: EntityManager) {
    super(RequestApprover, manager);
  }
}
