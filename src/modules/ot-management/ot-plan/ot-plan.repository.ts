import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { EntityManager, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { FilterOtPlanDto } from './dto';
import { OtPlan } from './ot-plan.entity';

@Injectable()
export class OtPlanRepository extends TypeORMRepository<OtPlan> {
  constructor(manager: EntityManager) {
    super(OtPlan, manager);
  }

  async getAll(conditions: any, filterOtPolicyDto: FilterOtPlanDto) {
    const { page, limit, projectCode, startDate, endDate, status } =
      filterOtPolicyDto;
    const query = this.createQueryBuilder('otPlan');

    if (conditions) {
      query.andWhere(conditions);
    }

    if (projectCode) {
      query.andWhere({ projectCode });
    }

    if (startDate) {
      query.andWhere({ startDate: LessThanOrEqual(startDate) });
    }

    if (endDate) {
      query.andWhere({ endDate: MoreThanOrEqual(endDate) });
    }

    if (status) {
      query.andWhere({ status });
    }

    return this.customPaginate({ page, limit }, query);
  }
}
