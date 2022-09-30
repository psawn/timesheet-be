import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { EntityManager } from 'typeorm';
import { Timecheck } from './timecheck.entity';

@Injectable()
export class TimecheckRepository extends TypeORMRepository<Timecheck> {
  constructor(manager: EntityManager) {
    super(Timecheck, manager);
  }
}
