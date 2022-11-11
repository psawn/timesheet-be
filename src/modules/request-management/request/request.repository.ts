import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { Policy } from 'src/modules/policy-management/policy/policy.entity';
import { User } from 'src/modules/user-management/user/user.entity';
import { EntityManager } from 'typeorm';
import { RequestApprover } from '../request-approver/request-approver.entity';
import { TimeRequestDate } from '../request-date/request-date.entity';
import { FilterRequestsDto } from './dto';
import { TimeRequest } from './request.entity';

@Injectable()
export class RequestRepository extends TypeORMRepository<TimeRequest> {
  constructor(manager: EntityManager) {
    super(TimeRequest, manager);
  }

  getDefaultquery() {
    return this.createQueryBuilder('request')
      .leftJoinAndMapMany(
        'request.dates',
        TimeRequestDate,
        'date',
        'request.id = date.requestId',
      )
      .leftJoinAndMapOne(
        'request.sender',
        User,
        'sender',
        'request.userCode = sender.code',
      )
      .leftJoinAndMapMany(
        'request.approvers',
        RequestApprover,
        'approver',
        'request.id = approver.requestId',
      )
      .leftJoinAndMapOne(
        'approver.approverInfo',
        User,
        'approverInfo',
        'approver.userCode = approverInfo.code',
      )
      .leftJoinAndMapOne(
        'request.policy',
        Policy,
        'policy',
        'request.policyCode = policy.code',
      )
      .select([
        'request.id',
        'request.createdAt',
        'request.updatedAt',
        'request.status',
        'request.reason',
        'request.expireTime',
        'request.policyType',
        'date.id',
        'date.startDate',
        'date.endDate',
        'sender.id',
        'sender.code',
        'sender.name',
        'policy.code',
        'policy.name',
        'approver.id',
        'approver.status',
        'approverInfo.id',
        'approverInfo.code',
        'approverInfo.name',
      ]);
  }

  async getAll(filterRequestsDto: FilterRequestsDto, conditions?: any) {
    const { page, limit, policyCode, status } = filterRequestsDto;

    const query = this.getDefaultquery();

    if (policyCode) {
      query.andWhere({ policyCode });
    }

    if (status) {
      query.andWhere({ status });
    }

    if (conditions) {
      query.andWhere(conditions);
    }

    return this.customPaginate({ page, limit }, query);
  }

  async get(id: string, conditions?: any) {
    const query = this.getDefaultquery().where({ id });

    if (conditions) {
      query.andWhere(conditions);
    }

    return query.getOne();
  }
}
