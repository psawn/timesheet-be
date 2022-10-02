import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { EntityManager, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { HolidayBenfit } from './holiday-benefit.entity';

@Injectable()
export class HolidayBenefitRepository extends TypeORMRepository<HolidayBenfit> {
  constructor(manager: EntityManager) {
    super(HolidayBenfit, manager);
  }

  async getHolidays(startDate: Date, endDate: Date) {
    return await this.find({
      where: {
        startDate: MoreThanOrEqual(startDate),
        endDate: LessThanOrEqual(endDate),
      },
      select: ['startDate', 'endDate'],
    });
  }
}
