import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { User } from 'src/modules/user-management/user/user.entity';
import { EntityManager } from 'typeorm';
import { FilterOtPolicyDto } from './dto';
import { OtPolicy } from './ot-policy.entity';

@Injectable()
export class OtPolicyRepository extends TypeORMRepository<OtPolicy> {
  constructor(manager: EntityManager) {
    super(OtPolicy, manager);
  }

  async getAll(filterOtPolicyDto: FilterOtPolicyDto) {
    const { page, limit } = filterOtPolicyDto;

    const query = this.createQueryBuilder('otPolicy').leftJoinAndMapOne(
      'otPolicy.createdBy',
      User,
      'createdBy',
      'otPolicy.createdBy = createdBy.code',
    );

    return this.customPaginate({ page, limit }, query);
  }
}
