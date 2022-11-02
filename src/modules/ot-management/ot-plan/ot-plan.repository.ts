import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { EntityManager, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { OtPolicyFlowApproval } from '../ot-policy-flow-approval/ot-policy-flow-approval.entity';
import { OtPolicyFlow } from '../ot-policy-flow/ot-policy-flow.entity';
import { OtPolicy } from '../ot-policy/ot-policy.entity';
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

  async getOtPlanInfo(otPlanId: string, departmentCode: string) {
    const query = this.createQueryBuilder('otPlan')
      .leftJoinAndMapOne(
        'otPlan.otPolicy',
        OtPolicy,
        'otPolicy',
        'otPlan.otPolicyCode = otPolicy.code',
      )
      .leftJoinAndMapOne(
        'otPolicy.flow',
        OtPolicyFlow,
        'flow',
        'otPolicy.code = flow.otPolicyCode',
      )
      .leftJoinAndMapMany(
        'flow.approvals',
        OtPolicyFlowApproval,
        'approval',
        'flow.id = approval.otPolicyFlowId',
      )
      .where({ id: otPlanId })
      .andWhere(
        'otPolicy.isActive = true AND (flow.department = :departmentCode OR flow.isGlobalFlow = true)',
        {
          departmentCode,
        },
      );

    return await query.getOne();
  }
}
