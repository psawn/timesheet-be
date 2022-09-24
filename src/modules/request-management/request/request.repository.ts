import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { EntityManager } from 'typeorm';
import { TimeRequest } from './request.entity';

@Injectable()
export class RequestRepository extends TypeORMRepository<TimeRequest> {
  constructor(manager: EntityManager) {
    super(TimeRequest, manager);
  }
}
