import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { EntityManager, ILike } from 'typeorm';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { User } from '../user-management/user/user.entity';
import { Department } from './department.entity';
import { CreateDepartmentDto, FilterDepartmentsDto } from './dto';

@Injectable()
export class DepartmentRepository extends TypeORMRepository<Department> {
  constructor(manager: EntityManager) {
    super(Department, manager);
  }
  // can use both custom function and typeorm function with constructor

  async getAll(roleCondition: any, filterDepartmentsDto: FilterDepartmentsDto) {
    // const { page, limit, ...filterArr } = filterDepartmentsDto;
    const { page, limit, code, name } = filterDepartmentsDto;
    const query = Department.createQueryBuilder('department')
      .leftJoinAndMapOne(
        'department.manager',
        User,
        'manager',
        'department.manager_code = manager.code',
      )
      .leftJoinAndMapOne(
        'department.createdBy',
        User,
        'createdBy',
        'department.createdBy = createdBy.code',
      )
      .leftJoinAndMapOne(
        'department.updatedBy',
        User,
        'updatedBy',
        'department.updatedBy = updatedBy.code',
      )
      .select([
        'department.id',
        'department.code',
        'department.name',
        'department.createdAt',
        'department.updatedAt',
        'manager.id',
        'manager.code',
        'manager.name',
        'createdBy.id',
        'createdBy.code',
        'createdBy.name',
        'updatedBy.id',
        'updatedBy.code',
        'updatedBy.name',
      ]);

    if (roleCondition) {
      query.andWhere(roleCondition.condtions, roleCondition.params);
    }

    if (code) {
      query.andWhere({ code: ILike(`%${code}%`) });
    }

    if (name) {
      query.andWhere({ name: ILike(`%${name}%`) });
    }

    // for (const property in filterArr) {
    //   query.andWhere(`department.${property} ILIKE '%${filterArr[property]}%'`);
    // }

    return this.paginate({ page, limit }, query);
  }

  async createDepartment(
    user: AuthUserDto,
    createDepartmentDto: CreateDepartmentDto,
  ) {
    const department = Department.create({
      ...createDepartmentDto,
      createdBy: user.code,
    });

    return await department.save();
  }

  async findOneByConditions(conditions: any) {
    return await Department.findOne(conditions);
  }

  async findByConditions(conditions: any) {
    return await Department.find(conditions);
  }
}
