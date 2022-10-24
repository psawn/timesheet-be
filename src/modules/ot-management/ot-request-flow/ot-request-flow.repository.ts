import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { EntityManager } from 'typeorm';
import { OtRequestFlow } from './ot-request-flow.entity';

@Injectable()
export class OtRequestFlowRepository extends TypeORMRepository<OtRequestFlow> {
  constructor(manager: EntityManager) {
    super(OtRequestFlow, manager);
  }
}
