import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { EntityManager } from 'typeorm';
import { OtRequest } from './ot-request.entity';

@Injectable()
export class OtRequestRepository extends TypeORMRepository<OtRequest> {
  constructor(manager: EntityManager) {
    super(OtRequest, manager);
  }
}
