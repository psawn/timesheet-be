import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { User } from 'src/modules/user-management/user/user.entity';
import { EntityManager, ILike } from 'typeorm';
import { PolicyApproves } from '../policy-approver/policy-approver.entity';
import { CreatePolicyDto, FilterPoliciesDto, UpdatePolicyDto } from './dto';
import { Policy } from './policy.entity';

@Injectable()
export class PolicyRepository extends TypeORMRepository<Policy> {
  constructor(manager: EntityManager) {
    super(Policy, manager);
  }

  async getAll(filterPoliciesDto: FilterPoliciesDto) {
    const { page, limit, code, name, group, isActive } = filterPoliciesDto;
    const query = this.createQueryBuilder('policy')
      .leftJoinAndMapOne(
        'policy.createdBy',
        User,
        'createdBy',
        'policy.createdBy = createdBy.code',
      )
      .leftJoinAndMapOne(
        'policy.updatedBy',
        User,
        'updatedBy',
        'policy.updatedBy = updatedBy.code',
      )
      .select([
        'policy.id',
        'policy.name',
        'policy.code',
        'policy.maxDaysProcess',
        'policy.useAnnualLeave',
        'policy.workDay',
        'createdBy.id',
        'createdBy.code',
        'createdBy.name',
        'updatedBy.id',
        'updatedBy.code',
        'updatedBy.name',
      ]);

    if (code) {
      query.andWhere({ code: ILike(`%${code}%`) });
    }

    if (name) {
      query.andWhere({ name: ILike(`%${name}%`) });
    }

    if (group) {
      query.andWhere({ group });
    }

    if (isActive) {
      query.andWhere({ isActive });
    }

    return this.paginate({ page, limit }, query);
  }

  async get(code: string) {
    const query = this.createQueryBuilder('policy')
      .leftJoinAndMapMany(
        'policy.approver',
        PolicyApproves,
        'approver',
        'policy.code = approver.policyCode',
      )
      .where({ code });

    return query.getOne();
  }

  async createPolicy(user: AuthUserDto, createPolicyDto: CreatePolicyDto) {
    const policy = this.create({
      ...createPolicyDto,
      createdBy: user.code,
    });

    return await policy.save();
  }

  async updatePolicy(
    user: AuthUserDto,
    code: string,
    updatePolicyDto: UpdatePolicyDto,
  ) {
    await this.update({ code }, { ...updatePolicyDto, updatedBy: user.code });
  }
}
