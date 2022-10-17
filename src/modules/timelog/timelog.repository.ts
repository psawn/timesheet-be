import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { EntityManager } from 'typeorm';
import { Timecheck } from '../timecheck/timecheck.entity';
import { Timelog } from './timelog.entity';

@Injectable()
export class TimelogRepository extends TypeORMRepository<Timelog> {
  constructor(manager: EntityManager) {
    super(Timecheck, manager);
  }
}
