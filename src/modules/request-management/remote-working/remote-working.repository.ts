import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { EntityManager } from 'typeorm';
import { RemoteWorking } from './remote-working.entity';

@Injectable()
export class RemoteWorkingRepository extends TypeORMRepository<RemoteWorking> {
  constructor(manager: EntityManager) {
    super(RemoteWorking, manager);
  }
}
