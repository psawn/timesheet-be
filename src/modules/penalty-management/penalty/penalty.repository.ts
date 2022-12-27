import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { EntityManager } from 'typeorm';
import { Penalty } from './penalty.entity';

@Injectable()
export class PenaltyRepository extends TypeORMRepository<Penalty> {
  constructor(manager: EntityManager) {
    super(Penalty, manager);
  }
}
