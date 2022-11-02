import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { EntityManager } from 'typeorm';
import { OtPolicyFlow } from './ot-policy-flow.entity';

@Injectable()
export class OtPolicyFlowRepository extends TypeORMRepository<OtPolicyFlow> {
  constructor(manager: EntityManager) {
    super(OtPolicyFlow, manager);
  }
}
