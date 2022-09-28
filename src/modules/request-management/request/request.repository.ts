import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { Policy } from 'src/modules/policy-management/policy/policy.entity';
import { User } from 'src/modules/user-management/user/user.entity';
import { EntityManager } from 'typeorm';
import { TimeRequestDate } from '../request-date/request-date.entity';
import { FilterRequestsDto } from './dto';
import { TimeRequest } from './request.entity';

@Injectable()
export class RequestRepository extends TypeORMRepository<TimeRequest> {
  constructor(manager: EntityManager) {
    super(TimeRequest, manager);
  }

  async getAll(filterRequestsDto: FilterRequestsDto, conditions?: any) {
    const { page, limit, policyCode, status } = filterRequestsDto;
    const offset = (page - 1) * limit;

    const query = this.createQueryBuilder('request')
      .leftJoinAndMapMany(
        'request.date',
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
      .leftJoinAndMapOne(
        'request.approver',
        User,
        'approver',
        'request.approverCode = approver.code',
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
        'date.startTime',
        'date.endTime',
        'sender.id',
        'sender.code',
        'sender.name',
        'approver.id',
        'approver.code',
        'approver.name',
        'policy.code',
        'policy.name',
      ])
      .take(limit)
      .skip(offset);

    if (policyCode) {
      query.andWhere({ policyCode });
    }

    if (status) {
      query.andWhere({ status });
    }

    if (conditions) {
      query.andWhere(conditions);
    }

    const [items, totalItems] = await query.getManyAndCount();
    return {
      items,
      pagination: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: +limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: +page,
      },
    };
  }

  async get(id: string, conditions?: any) {
    const query = this.createQueryBuilder('request')
      .leftJoinAndMapMany(
        'request.date',
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
      .leftJoinAndMapOne(
        'request.approver',
        User,
        'approver',
        'request.approverCode = approver.code',
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
        'date.startTime',
        'date.endTime',
        'sender.id',
        'sender.code',
        'sender.name',
        'approver.id',
        'approver.code',
        'approver.name',
        'policy.code',
        'policy.name',
      ])
      .where({ id });

    if (conditions) {
      query.andWhere(conditions);
    }

    return query.getOne();
  }
}
