import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { EntityManager } from 'typeorm';
import { HolidayBenfit } from './holiday-benefit.entity';

@Injectable()
export class HolidayBenefitRepository extends TypeORMRepository<HolidayBenfit> {
  constructor(manager: EntityManager) {
    super(HolidayBenfit, manager);
  }
}
