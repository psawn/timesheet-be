import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { User } from 'src/modules/user-management/user/user.entity';
import { EntityManager } from 'typeorm';
import {
  CreatePenaltyTypeDto,
  FilterPenaltyTypeDto,
  UpdatePenaltyTypeDto,
} from './dto';
import { PenaltyType } from './penalty-type.entity';

@Injectable()
export class PenaltyTypeRepository extends TypeORMRepository<PenaltyType> {
  constructor(manager: EntityManager) {
    super(PenaltyType, manager);
  }

  async findAll(filterPenaltyTypeDto: FilterPenaltyTypeDto) {
    const { page, limit, type, isActive } = filterPenaltyTypeDto;

    const query = this.createQueryBuilder('penaltyType')
      .leftJoinAndMapOne(
        'penaltyType.createdBy',
        User,
        'createdBy',
        'penaltyType.createdBy = createdBy.code',
      )
      .leftJoinAndMapOne(
        'penaltyType.updatedBy',
        User,
        'updatedBy',
        'penaltyType.updatedBy = updatedBy.code',
      )
      .select([
        'penaltyType.id',
        'penaltyType.createdAt',
        'penaltyType.updatedAt',
        'penaltyType.code',
        'penaltyType.unit',
        'penaltyType.reason',
        'penaltyType.type',
        'penaltyType.isDefault',
        'penaltyType.isActive',
        'createdBy.code',
        'createdBy.name',
        'updatedBy.code',
        'updatedBy.name',
      ]);

    if (type) {
      query.andWhere('penaltyType.type = :type', { type });
    }

    if (isActive) {
      query.andWhere('penaltyType.isActive = :isActive', { isActive });
    }

    return this.customPaginate({ page, limit }, query);
  }

  async createPenaltyType(
    user: AuthUserDto,
    createPenaltyTypeDto: CreatePenaltyTypeDto,
  ) {
    const penaltyType = this.create({
      ...createPenaltyTypeDto,
      createdBy: user.code,
    });

    return await penaltyType.save();
  }

  async updatePenaltyType(
    user: AuthUserDto,
    code: string,
    updatePenaltyTypeDto: UpdatePenaltyTypeDto,
  ) {
    return await this.update(
      { code },
      { ...updatePenaltyTypeDto, updatedBy: user.code },
    );
  }
}
