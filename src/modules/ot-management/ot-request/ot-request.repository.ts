import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { User } from 'src/modules/user-management/user/user.entity';
import { EntityManager } from 'typeorm';
import { OtPolicy } from '../ot-policy/ot-policy.entity';
import { OtRequestApprover } from '../ot-request-approver/ot-request-approver.entity';
import { OtRequestDate } from '../ot-request-date/ot-request-date.entity';
import { FilterOtRequestsDto } from './dto';
import { OtRequest } from './ot-request.entity';

@Injectable()
export class OtRequestRepository extends TypeORMRepository<OtRequest> {
  constructor(manager: EntityManager) {
    super(OtRequest, manager);
  }

  async getAll(filterOtRequestsDto: FilterOtRequestsDto, conditions?: any) {
    const { otPolicyCode, status, page, limit } = filterOtRequestsDto;

    const query = this.createQueryBuilder('otRequest')
      .leftJoinAndMapOne(
        'otRequest.sender',
        User,
        'sender',
        'otRequest.userCode = sender.code',
      )
      .leftJoinAndMapOne(
        'otRequest.otPolicy',
        OtPolicy,
        'otPolicy',
        'otRequest.otPolicyCode = otPolicy.code',
      )
      .leftJoinAndMapMany(
        'otRequest.approvers',
        OtRequestApprover,
        'approver',
        'otRequest.id = approver.otRequestId',
      )
      .select([
        'otRequest.id',
        'otRequest.createdAt',
        'otRequest.updatedAt',
        'otRequest.status',
        'otRequest.reason',
        'otRequest.expireTime',
        'sender.id',
        'sender.code',
        'sender.name',
        'otPolicy.code',
        'otPolicy.name',
      ]);
    if (otPolicyCode) {
      query.andWhere({ otPolicyCode });
    }

    if (status) {
      query.andWhere({ status });
    }

    if (conditions) {
      query.andWhere(conditions);
    }

    return await this.customPaginate({ page, limit }, query);
  }

  async getRequest(id: string, conditions?: any) {
    const query = this.createQueryBuilder('otRequest').leftJoinAndMapMany(
      'otRequest.dates',
      OtRequestDate,
      'date',
      'otRequest.id = date.otRequestId',
    );

    if (conditions) {
      query.andWhere(conditions);
    }

    return await query.getOne();
  }
}
