import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { EntityManager } from 'typeorm';
import { OtRequestApprover } from './ot-request-approver.entity';

@Injectable()
export class OtRequestApproverRepository extends TypeORMRepository<OtRequestApprover> {
  constructor(manager: EntityManager) {
    super(OtRequestApprover, manager);
  }
}
