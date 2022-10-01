import { Injectable } from '@nestjs/common';
import { get } from 'lodash';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { hashPassword } from 'src/helpers/encrypt.helper';
import { FilterTimecheckDto } from 'src/modules/timecheck/dto';
import { Timecheck } from 'src/modules/timecheck/timecheck.entity';
import { GeneralWorktimeSetting } from 'src/modules/worktime-management/general-worktime-setting/general-worktime-setting.entity';
import { GeneralWorktime } from 'src/modules/worktime-management/general-worktime/general-worktime.entity';
import { EntityManager } from 'typeorm';
import { UserRole } from '../user-role/user-role.entity';
import { FilterUsersDto } from './dto';
import { User } from './user.entity';

@Injectable()
export class UserRepository extends TypeORMRepository<User> {
  constructor(manager: EntityManager) {
    super(User, manager);
  }

  async getAll(filterUsersDto: FilterUsersDto) {
    const { page, limit, email } = filterUsersDto;
    const query = User.createQueryBuilder('user');

    query.select([
      'user.id',
      'user.email',
      'user.phone',
      'user.created_at',
      'user.updated_at',
      'user.deleted_at',
    ]);

    if (email) {
      query.andWhere('user.email = :email', { email });
    }

    return this.paginate({ page, limit }, query);
  }

  async signUp(signUpDto: any) {
    signUpDto.password = await hashPassword(signUpDto.password);
    return await User.save(signUpDto);
  }

  async findOneByConditions(conditions: any): Promise<User> {
    return await User.findOne(conditions);
  }

  async update(data: any) {
    return await User.save(data);
  }

  async findOneWithRoles(conditions: any): Promise<User> {
    const query = User.createQueryBuilder('user')
      .leftJoinAndMapMany(
        'user.roles',
        UserRole,
        'roles',
        'user.code = roles.userCode',
      )
      .select([
        'user.id',
        'user.code',
        'user.department',
        'user.managerCode',
        'user.name',
        'roles.id',
        'roles.roleCode',
      ])
      .where(conditions);

    const user = await query.getOne();

    user['roles'] = user['roles'].map((item) => {
      return get(item, 'roleCode');
    });

    return user;
  }

  async getTimechecks(
    filterTimecheckDto: FilterTimecheckDto,
    conditions?: any,
  ) {
    const { page, limit, startDate, endDate } = filterTimecheckDto;
    const offset = (page - 1) * limit;

    const query = this.createQueryBuilder('user')
      .leftJoinAndMapMany(
        'user.timechecks',
        Timecheck,
        'timecheck',
        'user.code = timecheck.userCode AND timecheck.checkDate >= :startDate AND timecheck.checkDate <= :endDate',
        {
          startDate,
          endDate,
        },
      )
      .select([
        'user.id',
        'user.code',
        'user.name',
        'timecheck.id',
        'timecheck.checkDate',
        'timecheck.checkInTime',
        'timecheck.checkOutTime',
        'timecheck.timezone',
      ])
      .where({ isActive: true })
      .take(limit)
      .skip(offset)
      .orderBy('timecheck.checkDate', 'ASC');

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

  async getUserWorktime(userCode: string, checkDate: Date) {
    const query = this.createQueryBuilder('user')
      .leftJoinAndMapOne(
        'user.worktimeStg',
        GeneralWorktimeSetting,
        'worktimeStg',
        'user.worktimeCode = worktimeStg.code',
      )
      .leftJoinAndMapOne(
        'worktimeStg.worktime',
        GeneralWorktime,
        'worktime',
        'worktimeStg.code = worktime.worktimeCode AND worktime.dayOfWeek = :dayOfWeek',
        {
          dayOfWeek: checkDate.getUTCDay(),
        },
      )
      .where({ code: userCode });

    return await query.getOne();
  }
}
