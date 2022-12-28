import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { User } from 'src/modules/user-management/user/user.entity';
import { EntityManager, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { PenaltyType } from '../penalty-type/penalty-type.entity';
import { FilterPenaltiesDto } from './dto';
import { Penalty } from './penalty.entity';

@Injectable()
export class PenaltyRepository extends TypeORMRepository<Penalty> {
  constructor(manager: EntityManager) {
    super(Penalty, manager);
  }

  async getAll(roleCondition: any, filterPenaltiesDto: FilterPenaltiesDto) {
    const {
      page,
      limit,
      userCode,
      startDate,
      endDate,
      penaltyType,
      penaltyGroup,
    } = filterPenaltiesDto;

    const query = this.createQueryBuilder('penalty')
      .leftJoinAndMapOne(
        'penalty.user',
        User,
        'user',
        'penalty.userCode = user.code',
      )
      .leftJoinAndMapOne(
        'penalty.penaltyType',
        PenaltyType,
        'penaltyType',
        'penalty.penaltyTypeCode = penaltyType.code',
      )
      .select([
        'penalty.id',
        'penalty.date',
        'user.code',
        'user.name',
        'penaltyType.code',
        'penaltyType.unit',
        'penaltyType.reason',
        'penaltyType.type',
        'penaltyType.group',
      ]);

    if (roleCondition) {
      query.andWhere(roleCondition.condtions, roleCondition.params);
    }

    if (userCode) {
      query.andWhere('penalty.userCode = :userCode', { userCode });
    }

    if (startDate) {
      query.andWhere({
        date: MoreThanOrEqual(startDate),
      });
    }

    if (endDate) {
      query.andWhere({
        date: LessThanOrEqual(endDate),
      });
    }

    if (penaltyType) {
      query.andWhere('penaltyType.type = :penaltyType', { penaltyType });
    }

    if (penaltyGroup) {
      query.andWhere({ penaltyTypeGroup: penaltyGroup });
    }

    return await this.customPaginate({ page, limit }, query);
  }
}
