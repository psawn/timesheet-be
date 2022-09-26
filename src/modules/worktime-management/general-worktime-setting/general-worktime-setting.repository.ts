import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { User } from 'src/modules/user-management/user/user.entity';
import { EntityManager, ILike } from 'typeorm';
import { FilterGenWorktimeStgDto } from './dto';
import { GeneralWorktimeSetting } from './general-worktime-setting.entity';

@Injectable()
export class GenWorktimeStgRepository extends TypeORMRepository<GeneralWorktimeSetting> {
  constructor(manager: EntityManager) {
    super(GeneralWorktimeSetting, manager);
  }

  async getAll(
    filterGenWorktimeStgDto: FilterGenWorktimeStgDto,
    conditions?: any,
  ) {
    const { page, limit, code, name } = filterGenWorktimeStgDto;
    const query = this.createQueryBuilder('worktimeStg')
      .leftJoinAndMapOne(
        'worktimeStg.createdBy',
        User,
        'createdBy',
        'worktimeStg.createdBy = createdBy.code',
      )
      .leftJoinAndMapOne(
        'worktimeStg.updatedBy',
        User,
        'updatedBy',
        'worktimeStg.updatedBy = updatedBy.code',
      )
      .select([
        'worktimeStg.id',
        'worktimeStg.code',
        'worktimeStg.name',
        'worktimeStg.isActive',
        'worktimeStg.isDefault',
        'worktimeStg.createdAt',
        'worktimeStg.updatedAt',
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

    if (conditions) {
      query.andWhere(conditions);
    }

    return this.paginate({ page, limit }, query);
  }
}
